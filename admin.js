const SUPABASE_URL = "https://ptpdexboeaummnywwgyv.supabase.co";
const SUPABASE_KEY = "sb_publishable_JrsJrxQ86TCBZWRc9g7HTg_bsLXaYJ8";
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const dashboardMessage = document.getElementById("dashboard-message");

const calendarGrid = document.getElementById("calendar-grid");
const calendarMonth = document.getElementById("calendar-month");

const breakdownDialog = document.getElementById("breakdown-dialog");
const breakdownContent = document.getElementById("breakdown-content");

let bookings = [];
let bookingsLoaded = false;

let displayedMonth = new Date();
displayedMonth.setDate(1);

function dateString(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function money(value) {
  if (value === null || value === undefined || value === "") {
    return "Not recorded";
  }

  const number = Number(value);
  if (!Number.isFinite(number)) return "Not recorded";

  return number.toLocaleString("en-SA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + " SAR";
}

function activeBooking(booking) {
  return [
    "confirmed",
    "checked_in",
    "checked-in",
    "checked in"
  ].includes(String(booking.status || "").toLowerCase());
}

function overlaps(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function sumField(field) {
  let total = 0;
  let recorded = 0;

  const active = bookings.filter(activeBooking);

  for (const booking of active) {
    const value = booking[field];

    if (value !== null && value !== undefined && value !== "") {
      const number = Number(value);

      if (Number.isFinite(number)) {
        total += number;
        recorded++;
      }
    }
  }

  return {
    total,
    recorded,
    complete: recorded === active.length
  };
}

function displayTotal(field) {
  const result = sumField(field);

  if (result.recorded === 0) return "Not recorded";

  return money(result.total) +
    (result.complete ? "" : " *");
}

async function loadBookings() {
  dashboardMessage.textContent = "Loading bookings…";
  bookingsLoaded = false;

  try {
    const all = [];
    const pageSize = 500;

    for (let offset = 0; ; offset += pageSize) {
      const { data, error } = await supabaseClient
        .from("Bookings")
        .select(
          "id,guest_name,platform,check_in,check_out,status," +
          "amount,original_price,discount_amount," +
          "accommodation_total,guest_total,occupancy_tax," +
          "platform_commission,other_fees"
        )
        .order("check_in", { ascending: true })
        .range(offset, offset + pageSize - 1);

      if (error) throw error;

      all.push(...data);

      if (data.length < pageSize) break;
    }

    bookings = all;
    bookingsLoaded = true;
    dashboardMessage.textContent = "";

  renderStatistics();
    renderCalendar();
    renderTable();

  } catch (error) {
    console.error("Loading error:", error);

    bookings = [];
    bookingsLoaded = false;

    dashboardMessage.textContent =
      "Could not load bookings. Check your Supabase connection and permissions.";

    document.getElementById("bookings-table-body").replaceChildren();
    calendarGrid.replaceChildren();

    [
      "total-bookings", "upcoming-bookings",
      "guest-payments", "host-payouts",
      "original-prices", "discounts",
      "accommodation-revenue", "occupancy-taxes",
      "platform-fees", "other-fees"
    ].forEach(id => setText(id, "—"));
  }
}

function renderStatistics() {
  const today = dateString(new Date());

  const active = bookings.filter(activeBooking);

  setText("total-bookings", String(bookings.length));

  setText(
    "upcoming-bookings",
    String(active.filter(b => b.check_in >= today).length)
  );

  setText("guest-payments", displayTotal("guest_total"));
  setText("host-payouts", displayTotal("amount"));
}

function renderFinancialOverview() {
  setText("original-prices", displayTotal("original_price"));
  setText("discounts", displayTotal("discount_amount"));
  setText(
    "accommodation-revenue",
    displayTotal("accommodation_total")
  );
  setText("occupancy-taxes", displayTotal("occupancy_tax"));
  setText("platform-fees", displayTotal("platform_commission"));
  setText("other-fees", displayTotal("other_fees"));
}

function renderTable() {
  const body = document.getElementById("bookings-table-body");
  body.replaceChildren();

  if (!bookings.length) {
    const row = body.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 7;
    cell.textContent = "No bookings recorded.";
    return;
  }

  bookings.forEach((booking, index) => {
    const row = body.insertRow();

    [
      booking.guest_name,
      booking.platform,
      booking.check_in,
      booking.check_out,
      booking.status,
      money(booking.amount)
    ].forEach(value => {
      const cell = row.insertCell();
      cell.textContent = String(value ?? "—");
    });

    const actionCell = row.insertCell();
    const button = document.createElement("button");

    button.className = "details-btn";
    button.textContent = "View breakdown";
    button.type = "button";

    button.addEventListener("click", () => {
      showBreakdown(index);
    });

    actionCell.appendChild(button);
  });
}

function addBreakdownRow(label, value, options = {}) {
  const row = document.createElement("div");
  row.className = "breakdown-row";

  if (options.highlight) row.classList.add("highlight");

  const name = document.createElement("span");
  name.textContent = label;

  const amount = document.createElement("span");

  if (value === null || value === undefined) {
    amount.textContent = "Not recorded";
  } else {
    const formatted = money(value);
    amount.textContent = options.negative
      ? "−" + formatted
      : formatted;
  }

  row.append(name, amount);
  breakdownContent.appendChild(row);
}


function showBreakdown(index) {
  const booking = bookings[index];
  if (!booking) return;

  setText(
    "breakdown-guest",
    `${booking.guest_name || "Guest"} · ${booking.platform || "Booking"}`
  );

  breakdownContent.replaceChildren();

  // HOST EARNINGS
  const hostHeading = document.createElement("h3");
  hostHeading.textContent = "Host payout";
  breakdownContent.appendChild(hostHeading);

  addBreakdownRow(
    "Room fee",
    booking.original_price
  );

  addBreakdownRow(
    "Nightly rate adjustment",
    booking.discount_amount,
    { negative: true }
  );

  addBreakdownRow(
    "Host service fee (including VAT where applicable)",
    booking.platform_commission,
    { negative: true }
  );

  addBreakdownRow(
    "Other fees",
    booking.other_fees,
    { negative: true }
  );

  addBreakdownRow(
    "Total (SAR) — Host payout",
    booking.amount,
    { highlight: true }
  );

  // GUEST PAYMENT
  const guestHeading = document.createElement("h3");
  guestHeading.textContent = "Guest paid";
  breakdownContent.appendChild(guestHeading);

  addBreakdownRow(
    "Room fee after adjustments",
    booking.accommodation_total
  );

  // Guest service fee is not stored separately yet.
  addBreakdownRow(
    "Guest service fee",
    null
  );

  addBreakdownRow(
    "Taxes",
    booking.occupancy_tax
  );

  addBreakdownRow(
    "Total (SAR) — Guest paid",
    booking.guest_total,
    { highlight: true }
  );

  breakdownDialog.showModal();
}


document.getElementById("close-breakdown")
  .addEventListener("click", () => breakdownDialog.close());

document.getElementById("close-breakdown-bottom")
  .addEventListener("click", () => breakdownDialog.close());

function renderCalendar() {
  calendarGrid.replaceChildren();

  calendarMonth.textContent = displayedMonth.toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );

  if (!bookingsLoaded) return;

  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();

  const offset = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < offset; i++) {
    const blank = document.createElement("div");
    blank.className = "calendar-day outside";
    calendarGrid.appendChild(blank);
  }

  for (let day = 1; day <= days; day++) {
    const date = dateString(new Date(year, month, day));

    const occupied = bookings.some(b =>
      activeBooking(b) &&
      b.check_in <= date &&
      date < b.check_out
    );

    const cell = document.createElement("div");
    cell.className = "calendar-day";

    if (occupied) cell.classList.add("booked");
    if (date === dateString(new Date())) {
      cell.classList.add("today");
    }

    const number = document.createElement("span");
    number.className = "day-number";
    number.textContent = String(day);

    const note = document.createElement("span");
    note.className = "day-note";
    note.textContent = occupied ? "Booked" : "—";

    cell.append(number, note);
    calendarGrid.appendChild(cell);
  }
}

document.getElementById("prev-month")
  .addEventListener("click", () => {
    displayedMonth.setMonth(displayedMonth.getMonth() - 1);
    renderCalendar();
  });

document.getElementById("next-month")
  .addEventListener("click", () => {
    displayedMonth.setMonth(displayedMonth.getMonth() + 1);
    renderCalendar();
  });

document.getElementById("availability-form")
  .addEventListener("submit", event => {
    event.preventDefault();

    const result = document.getElementById("availability-result");
    result.className = "availability-result";

    if (!bookingsLoaded) {
      result.textContent = "Bookings have not loaded.";
      result.classList.add("warning");
      return;
    }

    const start = document.getElementById("check-in-date").value;
    const end = document.getElementById("check-out-date").value;

    if (!start || !end || start >= end) {
      result.textContent = "Check-out must be after check-in.";
      result.classList.add("warning");
      return;
    }

    const conflict = bookings.some(b =>
      activeBooking(b) &&
      overlaps(start, end, b.check_in, b.check_out)
    );

    result.textContent = conflict
      ? "These dates overlap an existing reservation."
      : "No conflicting booking recorded. Check all platforms before confirming.";

    result.classList.add(conflict ? "warning" : "success");
  });

document.getElementById("check-in-date")
  .addEventListener("change", event => {
    document.getElementById("check-out-date").min =
      event.target.value;
  });

document.getElementById("refresh-bookings-btn")
  .addEventListener("click", loadBookings);

function showDashboard() {
  loginSection.hidden = true;
  dashboardSection.hidden = false;
  loadBookings();
}

function showLogin() {
  loginSection.hidden = false;
  dashboardSection.hidden = true;
  bookings = [];
  bookingsLoaded = false;
}

loginForm.addEventListener("submit", async event => {
  event.preventDefault();
  loginError.textContent = "";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    loginError.textContent = "Incorrect email or password.";
    return;
  }

  showDashboard();
});

document.getElementById("logout-btn")
  .addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    showLogin();
  });

async function checkSession() {
  if (SUPABASE_KEY === "PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE") {
    loginError.textContent =
      "Add your Supabase publishable key in admin.js first.";
    return;
  }

  const { data, error } = await supabaseClient.auth.getUser();

  if (!error && data.user) {
    showDashboard();
  } else {
    showLogin();
  }
}


const translations = {
  en: {
    dashboard: "Dashboard",
    subtitle: "Manage your bookings and apartment finances.",
    totalBookings: "Total bookings",
    upcomingBookings: "Upcoming bookings",
    guestPayments: "Guest payments",
    hostPayouts: "Host payouts",
    calendar: "Booking calendar",
    calendarDesc: "Confirmed reservations from Supabase.",
    availability: "Check availability",
    availabilityDesc: "Check dates against recorded reservations.",
    bookings: "Bookings",
    bookingsDesc: "Click View breakdown to see financial details.",
    refresh: "↻ Refresh bookings",
    logout: "Log out",
    language: "العربية"
  },
  ar: {
    dashboard: "لوحة التحكم",
    subtitle: "إدارة الحجوزات والحسابات المالية للشقة.",
    totalBookings: "إجمالي الحجوزات",
    upcomingBookings: "الحجوزات القادمة",
    guestPayments: "مدفوعات الضيوف",
    hostPayouts: "مستحقات المضيف",
    calendar: "تقويم الحجوزات",
    calendarDesc: "الحجوزات المؤكدة المسجلة في النظام.",
    availability: "التحقق من التوفر",
    availabilityDesc: "التحقق من توفر التواريخ المطلوبة.",
    bookings: "الحجوزات",
    bookingsDesc: "اضغطي على عرض التفاصيل لمعرفة تفاصيل المبالغ.",
    refresh: "↻ تحديث الحجوزات",
    logout: "تسجيل الخروج",
    language: "English"
  }
};

let currentLanguage = localStorage.getItem("osAdminLanguage") || "en";

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem("osAdminLanguage", lang);

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  document.getElementById("language-toggle").textContent =
    translations[lang].language;

  document.getElementById("logout-btn").textContent =
    translations[lang].logout;
}

document.getElementById("language-toggle")
  .addEventListener("click", () => {
    setLanguage(currentLanguage === "en" ? "ar" : "en");
  });

setLanguage(currentLanguage);

checkSession();