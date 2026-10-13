const SUPABASE_URL = "https://ptpdexboeaummnywwgyv.supabase.co";
const SUPABASE_KEY = "sb_publishable_JrsJrxQ86TCBZWRc9g7HTg_bsLXaYJ8";
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const $ = id => document.getElementById(id);

const loginSection = $("login-section");
const dashboardSection = $("dashboard-section");
const loginForm = $("login-form");
const loginError = $("login-error");
const dashboardMessage = $("dashboard-message");
const calendarGrid = $("calendar-grid");
const calendarMonth = $("calendar-month");
const breakdownDialog = $("breakdown-dialog");
const breakdownContent = $("breakdown-content");

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
    guestPayments: "Guest paid",
    hostPayouts: "You earn",
    calendar: "Booking calendar",
    calendarDesc: "Confirmed reservations from Supabase.",
    booked: "Booked",
    available: "No booking recorded",
    availability: "Check availability",
    availabilityDesc: "Check dates against recorded reservations.",
    checkIn: "Check-in",
    checkOut: "Check-out",
    checkDates: "Check dates",
    availabilityNote: "Check other booking platforms before confirming availability.",
    bookings: "Bookings",
    bookingsDesc: "Click View breakdown to see financial details.",
    refresh: "↻ Refresh bookings",
    guest: "Guest",
    platform: "Platform",
    status: "Status",
    payout: "You earn",
    details: "Details",
    viewBreakdown: "View breakdown",
    noBookings: "No bookings recorded.",
    breakdown: "Reservation breakdown",
    close: "Close",
    hostPayout: "You earn",
    guestPaid: "Guest paid",
    roomFee: "Room fee",
    adjustment: "Nightly rate adjustment",
    hostFee: "Host service fee (VAT included where applicable)",
    otherFees: "Other fees",
    totalHost: "Total host payout",
    roomAfter: "Room fee after adjustments",
    guestFee: "Guest service fee",
    taxes: "Taxes",
    totalGuest: "Total guest payment",
    originalBookingPrice: "Original booking price",
    originallyPaid: "Originally paid by guest",
    refundAmount: "Refund amount",
    refundStatus: "Refund status",
    refunded: "Refunded",
    refundPending: "Pending",
    cancelledReservation: "Cancelled reservation",
    notRecorded: "Not recorded",
    loading: "Loading bookings...",
    loadError: "Could not load bookings. Check your Supabase connection and permissions.",
    notLoaded: "Bookings have not loaded.",
    invalidDates: "Check-out must be after check-in.",
    conflict: "These dates overlap an existing reservation.",
    noConflict: "No conflicting booking recorded. Check all platforms before confirming.",
    incorrectLogin: "Incorrect email or password.",
    missingKey: "Add your Supabase publishable key in admin.js first.",
    language: "العربية",
    guestFallback: "Guest",
    bookingFallback: "Booking",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    pending: "Pending",
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
    guestPayments: "ما دفعه الضيوف",
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
    availabilityNote: "تحقق من منصات الحجز الأخرى قبل تأكيد التوفر.",
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
    totalHost: "إجمالي مستحقات المضيف",
    roomAfter: "رسوم الإقامة بعد التعديلات",
    guestFee: "رسوم خدمة الضيف",
    taxes: "الضرائب",
    totalGuest: "إجمالي ما دفعه الضيف",
    originalBookingPrice: "سعر الحجز الأصلي",
    originallyPaid: "المبلغ الذي دفعه الضيف سابقاً",
    refundAmount: "مبلغ الاسترداد",
    refundStatus: "حالة الاسترداد",
    refunded: "تم الاسترداد",
    refundPending: "قيد الانتظار",
    cancelledReservation: "حجز ملغي",
    notRecorded: "غير مسجل",
    loading: "جارٍ تحميل الحجوزات...",
    loadError: "تعذر تحميل الحجوزات. تحقق من اتصال Supabase والصلاحيات.",
    notLoaded: "لم يتم تحميل الحجوزات.",
    invalidDates: "يجب أن يكون تاريخ الخروج بعد تاريخ الدخول.",
    conflict: "هذه التواريخ تتداخل مع حجز موجود.",
    noConflict: "لا يوجد حجز متعارض مسجل. تحقق من جميع المنصات قبل التأكيد.",
    incorrectLogin: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    missingKey: "أضف مفتاح Supabase العام في ملف admin.js أولاً.",
    language: "English",
    guestFallback: "ضيف",
    bookingFallback: "حجز",
    confirmed: "مؤكد",
    cancelled: "ملغي",
    pending: "قيد الانتظار",
    weekdays: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
  }
};

function t(key) {
  return translations[currentLanguage][key] || key;
}

function setText(id, value) {
  if ($(id)) $(id).textContent = value;
}

function setSelectorText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
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
  return ["confirmed", "checked_in", "checked-in", "checked in"]
    .includes(String(booking.status || "").trim().toLowerCase());
}

function cancelledBooking(booking) {
  return ["cancelled", "canceled"]
    .includes(String(booking.status || "").trim().toLowerCase());
}

function overlaps(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
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

// LOAD BOOKINGS FROM SUPABASE

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
          "platform_commission,other_fees," +
          "original_guest_payment,refund_amount,refund_status"
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
    console.error("Supabase loading error:", error);

    bookings = [];
    bookingsLoaded = false;
    dashboardMessage.textContent = t("loadError");

    $("bookings-table-body").replaceChildren();
    calendarGrid.replaceChildren();

    ["total-bookings", "upcoming-bookings", "guest-payments", "host-payouts"]
      .forEach(id => setText(id, "—"));
  }
}

// DASHBOARD STATISTICS

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

// BOOKING STATUS

function translateStatus(status) {
  const normalized = String(status || "").trim().toLowerCase();

  if (["cancelled", "canceled"].includes(normalized)) {
    return t("cancelled");
  }

  if (normalized === "confirmed") {
    return t("confirmed");
  }

  if (normalized === "pending") {
    return t("pending");
  }

  return status || "—";
}

// BOOKINGS TABLE

function renderTable() {
  const tbody = $("bookings-table-body");
  tbody.replaceChildren();

  if (!bookings.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 7;
    cell.textContent = t("noBookings");

    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  bookings.forEach((booking, index) => {
    const row = document.createElement("tr");

    const values = [
      booking.guest_name || t("guestFallback"),
      booking.platform || "—",
      booking.check_in || "—",
      booking.check_out || "—",
      translateStatus(booking.status),
      cancelledBooking(booking)
        ? "—"
        : money(booking.amount)
    ];

    values.forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    const detailsCell = document.createElement("td");
    const button = document.createElement("button");

    button.type = "button";
    button.className = "breakdown-btn";
    button.textContent = t("viewBreakdown");

    button.addEventListener("click", () => showBreakdown(index));

    detailsCell.appendChild(button);
    row.appendChild(detailsCell);
    tbody.appendChild(row);
  });
}

// FINANCIAL BREAKDOWN HELPERS

function addBreakdownRow(label, value, options = {}) {
  const row = document.createElement("div");
  row.className = "breakdown-row";

  if (options.highlight) row.classList.add("highlight");

  const name = document.createElement("span");
  name.textContent = label;

  const amount = document.createElement("span");
  const formatted = money(value);

  amount.textContent =
    options.negative && formatted !== t("notRecorded")
      ? "−" + formatted
      : formatted;

  row.append(name, amount);
  breakdownContent.appendChild(row);
}

function addBreakdownTextRow(label, value, options = {}) {
  const row = document.createElement("div");
  row.className = "breakdown-row";

  if (options.highlight) row.classList.add("highlight");

  const name = document.createElement("span");
  name.textContent = label;

  const content = document.createElement("span");
  content.textContent = value;

  row.append(name, content);
  breakdownContent.appendChild(row);
}

function addBreakdownHeading(text) {
  const heading = document.createElement("h3");
  heading.textContent = text;
  heading.style.marginTop = "22px";
  heading.style.marginBottom = "12px";
  breakdownContent.appendChild(heading);
}

// VIEW BREAKDOWN

function showBreakdown(index) {
  const booking = bookings[index];
  if (!booking) return;

  setText(
    "breakdown-guest",
    `${booking.guest_name || t("guestFallback")} · ${booking.platform || t("bookingFallback")}`
  );

  breakdownContent.replaceChildren();

  if (cancelledBooking(booking)) {

    // CANCELLED BOOKING

    addBreakdownHeading(t("cancelledReservation"));

    addBreakdownRow(
      t("originalBookingPrice"),
      booking.original_price
    );

    addBreakdownRow(
      t("originallyPaid"),
      booking.original_guest_payment
    );

    addBreakdownRow(
      t("refundAmount"),
      booking.refund_amount
    );

    const refundStatus = String(
      booking.refund_status || ""
    ).trim().toLowerCase();

    let refundLabel = t("notRecorded");

    if (refundStatus === "refunded") {
      refundLabel = t("refunded");
    } else if (refundStatus === "pending") {
      refundLabel = t("refundPending");
    } else if (booking.refund_status) {
      refundLabel = booking.refund_status;
    }

    addBreakdownTextRow(
      t("refundStatus"),
      refundLabel,
      { highlight: true }
    );

  } else {

    // CONFIRMED BOOKING: HOST PAYOUT

    addBreakdownHeading(t("hostPayout"));

    addBreakdownRow(
      t("roomFee"),
      booking.original_price
    );

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

    // CONFIRMED BOOKING: GUEST PAYMENT

    addBreakdownHeading(t("guestPaid"));

    addBreakdownRow(
      t("roomAfter"),
      booking.accommodation_total
    );

    // A separate guest service fee is not currently stored.
    addBreakdownRow(
      t("guestFee"),
      null
    );

    addBreakdownRow(
      t("taxes"),
      booking.occupancy_tax
    );

    addBreakdownRow(
      t("totalGuest"),
      booking.guest_total,
      { highlight: true }
    );
  }

  breakdownDialog.showModal();
}

// CLOSE BREAKDOWN

$("close-breakdown").addEventListener("click", () => {
  breakdownDialog.close();
});

$("close-breakdown-bottom").addEventListener("click", () => {
  breakdownDialog.close();
});

// BOOKING CALENDAR

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

    const occupied = bookings.some(booking =>
      activeBooking(booking) &&
      booking.check_in <= date &&
      date < booking.check_out
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

$("prev-month").addEventListener("click", () => {
  displayedMonth.setMonth(displayedMonth.getMonth() - 1);
  renderCalendar();
});

$("next-month").addEventListener("click", () => {
  displayedMonth.setMonth(displayedMonth.getMonth() + 1);
  renderCalendar();
});

// AVAILABILITY CHECKER

$("availability-form").addEventListener("submit", event => {
  event.preventDefault();

  const result = $("availability-result");
  result.className = "availability-result";

  if (!bookingsLoaded) {
    result.textContent = t("notLoaded");
    result.classList.add("warning");
    return;
  }

  const start = $("check-in-date").value;
  const end = $("check-out-date").value;

  if (!start || !end || start >= end) {
    result.textContent = t("invalidDates");
    result.classList.add("warning");
    return;
  }

  const conflict = bookings.some(booking =>
    activeBooking(booking) &&
    overlaps(start, end, booking.check_in, booking.check_out)
  );

  result.textContent = conflict ? t("conflict") : t("noConflict");
  result.classList.add(conflict ? "warning" : "success");
});

$("check-in-date").addEventListener("change", event => {
  $("check-out-date").min = event.target.value;
});

$("refresh-bookings-btn").addEventListener("click", loadBookings);

// AUTHENTICATION

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

  const email = $("email").value;
  const password = $("password").value;

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

$("logout-btn").addEventListener("click", async () => {
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

// LANGUAGE SWITCHER

function setLanguage(lang) {
  currentLanguage = lang === "ar" ? "ar" : "en";

  localStorage.setItem("osAdminLanguage", currentLanguage);

  document.documentElement.lang = currentLanguage;
  document.documentElement.dir =
    currentLanguage === "ar" ? "rtl" : "ltr";

  const languageToggle = $("language-toggle");

  if (languageToggle) {
    languageToggle.textContent = t("language");
  }

  // LOGIN

  setSelectorText(".login-card h1", t("adminLogin"));
  setSelectorText(".login-card .admin-subtitle", t("loginSubtitle"));
  setSelectorText('label[for="email"]', t("email"));
  setSelectorText('label[for="password"]', t("password"));
  setSelectorText('#login-form button[type="submit"]', t("signIn"));

  // HEADER

  setText("logout-btn", t("logout"));
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

  const headings = document.querySelectorAll(
    ".panel .section-header h2"
  );

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

  // BOOKINGS TABLE

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

  // BREAKDOWN DIALOG

  setSelectorText(".dialog-header h2", t("breakdown"));
  setText("close-breakdown-bottom", t("close"));

  $("close-breakdown").setAttribute(
    "aria-label",
    t("close")
  );

  // CALENDAR LEGEND

  const legend = document.querySelectorAll(
    ".calendar-legend span"
  );

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

  const weekdays = document.querySelectorAll(
    ".calendar-weekdays span"
  );

  t("weekdays").forEach((day, i) => {
    if (weekdays[i]) weekdays[i].textContent = day;
  });

  // REFRESH TRANSLATED DATA

  const availabilityResult = $("availability-result");

  if (availabilityResult) {
    availabilityResult.textContent = "";
  }

  if (bookingsLoaded) {
    renderStatistics();
    renderTable();
  }

  renderCalendar();
}

const languageToggle = $("language-toggle");

if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    setLanguage(currentLanguage === "en" ? "ar" : "en");
  });
}

// INITIALIZE

setLanguage(currentLanguage);
checkSession();
