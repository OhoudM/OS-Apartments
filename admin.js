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

let currentLanguage =
  localStorage.getItem("osAdminLanguage") === "ar" ? "ar" : "en";

const translations = {
  en: {
    adminLogin: "Admin Login",
    loginSubtitle: "Sign in to manage your apartment.",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    logout: "Log out",
    dashboard: "Dashboard",
    subtitle: "Manage your bookings and apartment finances.",
    totalBookings: "Total bookings",
    upcomingBookings: "Upcoming bookings",
    guestPayments: "Guest payments",
    hostPayouts: "Host payouts",
    calendar: "Booking calendar",
    calendarDesc: "Confirmed reservations from Supabase.",
    booked: "Booked",
    available: "No booking recorded",
    availability: "Check availability",
    availabilityDesc: "Check dates against recorded reservations.",
    checkIn: "Check-in",
    checkOut: "Check-out",
    checkDates: "Check dates",
    availabilityNote:
      "Check other booking platforms before confirming availability.",
    bookings: "Bookings",
    bookingsDesc: "Click View breakdown to see financial details.",
    refresh: "↻ Refresh bookings",
    guest: "Guest",
    platform: "Platform",
    status: "Status",
    payout: "Host payout",
    details: "Details",
    viewBreakdown: "View breakdown",
    noBookings: "No bookings recorded.",
    breakdown: "Reservation breakdown",
    close: "Close",
    hostPayout: "Host payout",
    guestPaid: "Guest paid",
    roomFee: "Room fee",
    adjustment: "Nightly rate adjustment",
    hostFee: "Host service fee (including VAT where applicable)",
    otherFees: "Other fees",
    totalHost: "Total (SAR) — Host payout",
    roomAfter: "Room fee after adjustments",
    guestFee: "Guest service fee",
    taxes: "Taxes",
    totalGuest: "Total (SAR) — Guest paid",
    notRecorded: "Not recorded",
    loading: "Loading bookings…",
    loadError:
      "Could not load bookings. Check your Supabase connection and permissions.",
    notLoaded: "Bookings have not loaded.",
    invalidDates: "Check-out must be after check-in.",
    conflict: "These dates overlap an existing reservation.",
    noConflict:
      "No conflicting booking recorded. Check all platforms before confirming.",
    incorrectLogin: "Incorrect email or password.",
    missingKey: "Add your Supabase publishable key in admin.js first.",
    language: "العربية",
    guestFallback: "Guest",
    bookingFallback: "Booking",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  },

  ar: {
    adminLogin: "تسجيل دخول الإدارة",
    loginSubtitle: "سجّل الدخول لإدارة الشقة.",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    signIn: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    dashboard: "لوحة التحكم",
    subtitle: "إدارة الحجوزات والحسابات المالية للشقة.",
    totalBookings: "إجمالي الحجوزات",
    upcomingBookings: "الحجوزات القادمة",
    guestPayments: "مدفوعات الضيوف",
    hostPayouts: "مستحقات المضيف",
    calendar: "تقويم الحجوزات",
    calendarDesc: "الحجوزات المؤكدة المسجلة في النظام.",
    booked: "محجوز",
    available: "لا يوجد حجز مسجل",
    availability: "التحقق من التوفر",
    availabilityDesc: "التحقق من توفر التواريخ المطلوبة.",
    checkIn: "تاريخ الدخول",
    checkOut: "تاريخ الخروج",
    checkDates: "التحقق من التواريخ",
    availabilityNote:
      "تحقق من منصات الحجز الأخرى قبل تأكيد التوفر.",
    bookings: "الحجوزات",
    bookingsDesc: "اضغط على عرض التفاصيل لمعرفة تفاصيل المبالغ.",
    refresh: "↻ تحديث الحجوزات",
    guest: "الضيف",
    platform: "المنصة",
    status: "الحالة",
    payout: "مستحقات المضيف",
    details: "التفاصيل",
    viewBreakdown: "عرض التفاصيل",
    noBookings: "لا توجد حجوزات مسجلة.",
    breakdown: "التفاصيل المالية للحجز",
    close: "إغلاق",
    hostPayout: "مستحقات المضيف",
    guestPaid: "ما دفعه الضيف",
    roomFee: "رسوم الإقامة",
    adjustment: "تعديل سعر الليلة",
    hostFee: "رسوم خدمة المضيف (شاملة الضريبة عند تطبيقها)",
    otherFees: "رسوم أخرى",
    totalHost: "الإجمالي (ر.س) — مستحقات المضيف",
    roomAfter: "رسوم الإقامة بعد التعديلات",
    guestFee: "رسوم خدمة الضيف",
    taxes: "الضرائب",
    totalGuest: "الإجمالي (ر.س) — ما دفعه الضيف",
    notRecorded: "غير مسجل",
    loading: "جارٍ تحميل الحجوزات…",
    loadError: "تعذر تحميل الحجوزات. تحقق من اتصال Supabase والصلاحيات.",
    notLoaded: "لم يتم تحميل الحجوزات.",
    invalidDates: "يجب أن يكون تاريخ الخروج بعد تاريخ الدخول.",
    conflict: "هذه التواريخ تتداخل مع حجز موجود.",
    noConflict:
      "لا يوجد حجز متعارض مسجل. تحقق من جميع المنصات قبل التأكيد.",
    incorrectLogin: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    missingKey: "أضف مفتاح Supabase العام في ملف admin.js أولاً.",
    language: "English",
    guestFallback: "ضيف",
    bookingFallback: "حجز",
    weekdays: [
      "الأحد", "الاثنين", "الثلاثاء",
      "الأربعاء", "الخميس", "الجمعة", "السبت"
    ]
  }
};

function t(key) {
  return translations[currentLanguage][key];
}

function dateString(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function money(value) {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    !Number.isFinite(Number(value))
  ) {
    return t("notRecorded");
  }

  return Number(value).toLocaleString("en-SA", {
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
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function setSelectorText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function sumField(field) {
  let total = 0;
  let recorded = 0;

  const active = bookings.filter(activeBooking);

  for (const booking of active) {
    const value = booking[field];

    if (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      Number.isFinite(Number(value))
    ) {
      total += Number(value);
      recorded++;
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

  if (result.recorded === 0) return t("notRecorded");

  return money(result.total) + (result.complete ? "" : " *");
}

async function loadBookings() {
  dashboardMessage.textContent = t("loading");
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

    dashboardMessage.textContent = t("loadError");

    document.getElementById("bookings-table-body").replaceChildren();
    calendarGrid.replaceChildren();

    [
      "total-bookings",
      "upcoming-bookings",
      "guest-payments",
      "host-payouts"
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

function translateStatus(status) {
  if (currentLanguage !== "ar") return status || "—";

  const labels = {
    confirmed: "مؤكد",
    checked_in: "تم تسجيل الدخول",
    "checked-in": "تم تسجيل الدخول",
    "checked in": "تم تسجيل الدخول",
    cancelled: "ملغي",
    canceled: "ملغي",
    pending: "قيد الانتظار",
    completed: "مكتمل",
    checked_out: "تم تسجيل الخروج"
  };

  return labels[String(status || "").toLowerCase()] || status || "—";
}

function renderTable() {
  const body = document.getElementById("bookings-table-body");
  body.replaceChildren();

  if (!bookings.length) {
    const cell = body.insertRow().insertCell();
    cell.colSpan = 7;
    cell.textContent = t("noBookings");
    return;
  }

  bookings.forEach((booking, index) => {
    const row = body.insertRow();

    [
      booking.guest_name,
      booking.platform,
      booking.check_in,
      booking.check_out,
      translateStatus(booking.status),
      money(booking.amount)
    ].forEach(value => {
      const cell = row.insertCell();
      cell.textContent = String(value ?? "—");
    });

    const button = document.createElement("button");
    button.className = "details-btn";
    button.textContent = t("viewBreakdown");
    button.type = "button";

    button.addEventListener("click", () => showBreakdown(index));

    row.insertCell().appendChild(button);
  });
}

function addBreakdownRow(label, value, options = {}) {
  const row = document.createElement("div");
  row.className = "breakdown-row";

  if (options.highlight) {
    row.classList.add("highlight");
  }

  const name = document.createElement("span");
  name.textContent = label;

  const amount = document.createElement("span");

  amount.textContent =
    value === null || value === undefined || value === ""
      ? t("notRecorded")
      : (options.negative && Number(value) !== 0 ? "−" : "") + money(value);

  row.append(name, amount);
  breakdownContent.appendChild(row);
}

function showBreakdown(index) {
  const booking = bookings[index];
  if (!booking) return;

  setText(
    "breakdown-guest",
    `${booking.guest_name || t("guestFallback")} · ${booking.platform || t("bookingFallback")}`
  );

  breakdownContent.replaceChildren();

  // HOST PAYOUT
  const hostHeading = document.createElement("h3");
  hostHeading.textContent = t("hostPayout");
  breakdownContent.appendChild(hostHeading);

  addBreakdownRow(t("roomFee"), booking.original_price);

  addBreakdownRow(
    t("adjustment"),
    booking.discount_amount,
    { negative: true }
  );

  addBreakdownRow(
    t("hostFee"),
    booking.platform_commission,
    { negative: true }
  );

  addBreakdownRow(
    t("otherFees"),
    booking.other_fees,
    { negative: true }
  );

  addBreakdownRow(
    t("totalHost"),
    booking.amount,
    { highlight: true }
  );

  // GUEST PAYMENT
  const guestHeading = document.createElement("h3");
  guestHeading.textContent = t("guestPaid");
  breakdownContent.appendChild(guestHeading);

  addBreakdownRow(
    t("roomAfter"),
    booking.accommodation_total
  );

  // Guest service fee is not stored separately yet.
  addBreakdownRow(t("guestFee"), null);

  addBreakdownRow(
    t("taxes"),
    booking.occupancy_tax
  );

  addBreakdownRow(
    t("totalGuest"),
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
    currentLanguage === "ar" ? "ar-SA-u-ca-gregory" : "en-US",
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
    note.textContent = occupied ? t("booked") : "—";

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
      result.textContent = t("notLoaded");
      result.classList.add("warning");
      return;
    }

    const start = document.getElementById("check-in-date").value;
    const end = document.getElementById("check-out-date").value;

    if (!start || !end || start >= end) {
      result.textContent = t("invalidDates");
      result.classList.add("warning");
      return;
    }

    const conflict = bookings.some(b =>
      activeBooking(b) &&
      overlaps(start, end, b.check_in, b.check_out)
    );

    result.textContent = conflict ? t("conflict") : t("noConflict");
    result.classList.add(conflict ? "warning" : "success");
  });

document.getElementById("check-in-date")
  .addEventListener("change", event => {
    document.getElementById("check-out-date").min = event.target.value;
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
    loginError.textContent = t("incorrectLogin");
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
    loginError.textContent = t("missingKey");
    return;
  }

  const { data, error } = await supabaseClient.auth.getUser();

  if (!error && data.user) {
    showDashboard();
  } else {
    showLogin();
  }
}

function setLanguage(lang) {
  currentLanguage = lang === "ar" ? "ar" : "en";

  localStorage.setItem("osAdminLanguage", currentLanguage);

  document.documentElement.lang = currentLanguage;
  document.documentElement.dir =
    currentLanguage === "ar" ? "rtl" : "ltr";

  const languageToggle = document.getElementById("language-toggle");

  if (languageToggle) {
    languageToggle.textContent = t("language");
  }

  setText("logout-btn", t("logout"));

  // LOGIN
  setSelectorText(".login-card h1", t("adminLogin"));
  setSelectorText(".login-card .admin-subtitle", t("loginSubtitle"));
  setSelectorText('label[for="email"]', t("email"));
  setSelectorText('label[for="password"]', t("password"));
  setSelectorText('#login-form button[type="submit"]', t("signIn"));

  // DASHBOARD HEADER
  setSelectorText(".admin-header h1", t("dashboard"));
  setSelectorText(".admin-header .admin-subtitle", t("subtitle"));

  // STATISTICS
  const statLabels = document.querySelectorAll(".stat-card span");

  [
    t("totalBookings"),
    t("upcomingBookings"),
    t("guestPayments"),
    t("hostPayouts")
  ].forEach((label, i) => {
    if (statLabels[i]) statLabels[i].textContent = label;
  });

  // SECTION HEADINGS
  const headings = document.querySelectorAll(".panel .section-header h2");
  const descriptions = document.querySelectorAll(
    ".panel .section-header p"
  );

  [
    t("calendar"),
    t("availability"),
    t("bookings")
  ].forEach((value, i) => {
    if (headings[i]) headings[i].textContent = value;
  });

  [
    t("calendarDesc"),
    t("availabilityDesc"),
    t("bookingsDesc")
  ].forEach((value, i) => {
    if (descriptions[i]) descriptions[i].textContent = value;
  });

  setText("refresh-bookings-btn", t("refresh"));

  // AVAILABILITY FORM
  setSelectorText('label[for="check-in-date"]', t("checkIn"));
  setSelectorText('label[for="check-out-date"]', t("checkOut"));
  setSelectorText("#availability-form button", t("checkDates"));
  setSelectorText(".fine-print", t("availabilityNote"));

  // BOOKING TABLE
  const tableHeaders = document.querySelectorAll("thead th");

  [
    t("guest"),
    t("platform"),
    t("checkIn"),
    t("checkOut"),
    t("status"),
    t("payout"),
    t("details")
  ].forEach((value, i) => {
    if (tableHeaders[i]) tableHeaders[i].textContent = value;
  });

  // BREAKDOWN POPUP
  setSelectorText(".dialog-header h2", t("breakdown"));
  setText("close-breakdown-bottom", t("close"));

  document.getElementById("close-breakdown")
    .setAttribute("aria-label", t("close"));

  // CALENDAR LEGEND
  const legend = document.querySelectorAll(".calendar-legend span");

  if (legend[0]) {
    const dot = legend[0].querySelector("i");
    legend[0].replaceChildren();
    if (dot) legend[0].appendChild(dot);
    legend[0].append(" " + t("booked"));
  }

  if (legend[1]) {
    const dot = legend[1].querySelector("i");
    legend[1].replaceChildren();
    if (dot) legend[1].appendChild(dot);
    legend[1].append(" " + t("available"));
  }

  // WEEKDAYS
  const weekdays = document.querySelectorAll(".calendar-weekdays span");

  t("weekdays").forEach((day, i) => {
    if (weekdays[i]) weekdays[i].textContent = day;
  });

  // REFRESH TRANSLATED CONTENT
  const availabilityResult =
    document.getElementById("availability-result");

  if (availabilityResult && availabilityResult.textContent.trim()) {
    availabilityResult.textContent = "";
  }

  if (bookingsLoaded) {
    renderStatistics();
    renderTable();
  }

  renderCalendar();
}

// LANGUAGE BUTTON
const languageToggle = document.getElementById("language-toggle");

if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    setLanguage(currentLanguage === "en" ? "ar" : "en");
  });
}

// INITIALIZE
setLanguage(currentLanguage);
checkSession();
