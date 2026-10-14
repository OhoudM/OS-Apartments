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

const addBookingDialog = $("add-booking-dialog");
const addBookingForm = $("add-booking-form");
const paymentDialog = $("record-payment-dialog");

let bookings = [];
let bookingsLoaded = false;
let displayedMonth = new Date();
displayedMonth.setDate(1);

let selectedPaymentBooking = null;
let savingManualBooking = false;
let savingPayment = false;

let currentLanguage =
  localStorage.getItem("osAdminLanguage") === "ar"
    ? "ar"
    : "en";

/* ==========================================
   TRANSLATIONS
   ========================================== */

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
    guestPayments: "Guest booking totals",
    hostPayouts: "Estimated host earnings",

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
    payout: "Host earnings",
    details: "Details",
    viewBreakdown: "View breakdown",
    noBookings: "No bookings recorded.",

    breakdown: "Reservation breakdown",
    close: "Close",
    hostPayout: "Host earnings",
    guestPaid: "Guest booking total",
    roomFee: "Room fee",
    adjustment: "Nightly rate adjustment",
    hostFee: "Platform commission / host fee",
    otherFees: "Other fees",
    totalHost: "Estimated host earnings",
    roomAfter: "Room fee after adjustments",
    guestFee: "Guest service fee",
    taxes: "Taxes",
    totalGuest: "Total booking price",

    originalBookingPrice: "Original booking price",
    originallyPaid: "Originally paid by guest",
    refundAmount: "Refund amount",
    refundStatus: "Refund status",
    refunded: "Refunded",
    refundPending: "Pending",
    cancelledReservation: "Cancelled reservation",

    notRecorded: "Not recorded",
    loading: "Loading bookings...",
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
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    pending: "Pending",
    checkedIn: "Checked in",

    addBooking: "+ Add Booking",
    addTitle: "Add booking",
    source: "Booking source",
    code: "Reservation number (optional)",
    total: "Total booking price (SAR)",
    commission: "Platform commission (SAR)",
    received: "Amount already received (SAR)",
    notes: "Notes (optional)",
    saveBooking: "Save booking",

    remaining: "Remaining payments",
    remainingDesc: "Track unpaid balances and record payments.",
    totalShort: "Total",
    receivedShort: "Received",
    due: "Remaining",
    action: "Action",
    record: "Record payment",
    additional: "Additional payment received (SAR)",
    savePayment: "Save payment",
    noRemaining: "No outstanding payments recorded.",

    invalidMoney:
      "Check the amounts. Received cannot exceed the total.",
    invalidCommission:
      "Commission cannot exceed the booking price.",
    duplicate:
      "A booking with this reservation number already exists.",
    overlap:
      "These dates overlap an existing active reservation.",
    saving: "Saving...",
    bookingSaved: "Booking saved successfully.",
    paymentSaved: "Payment recorded successfully.",
    paymentError: "Could not save the payment.",
    bookingError: "Could not save the booking.",
    signInRequired: "Please sign in again.",
    noData: "Bookings must finish loading before you can save.",
    balance: "Remaining balance",
    paymentTooHigh:
      "Payment must be greater than zero and no more than the remaining balance.",
    paymentChanged:
      "The payment record changed. Refresh and try again.",

    weekdays: [
      "Sun", "Mon", "Tue", "Wed",
      "Thu", "Fri", "Sat"
    ]
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
    guestPayments: "إجمالي قيمة حجوزات الضيوف",
    hostPayouts: "صافي مستحقات المضيف التقديري",

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
    guestPaid: "إجمالي قيمة حجز الضيف",
    roomFee: "رسوم الإقامة",
    adjustment: "تعديل سعر الليلة",
    hostFee: "عمولة المنصة أو رسوم المضيف",
    otherFees: "رسوم أخرى",
    totalHost: "صافي مستحقات المضيف التقديري",
    roomAfter: "رسوم الإقامة بعد التعديلات",
    guestFee: "رسوم خدمة الضيف",
    taxes: "الضرائب",
    totalGuest: "إجمالي سعر الحجز",

    originalBookingPrice: "سعر الحجز الأصلي",
    originallyPaid: "المبلغ الذي دفعه الضيف سابقاً",
    refundAmount: "مبلغ الاسترداد",
    refundStatus: "حالة الاسترداد",
    refunded: "تم الاسترداد",
    refundPending: "قيد الانتظار",
    cancelledReservation: "حجز ملغي",

    notRecorded: "غير مسجل",
    loading: "جارٍ تحميل الحجوزات...",
    loadError:
      "تعذر تحميل الحجوزات. تحقق من اتصال Supabase والصلاحيات.",
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
    confirmed: "مؤكد",
    cancelled: "ملغي",
    pending: "قيد الانتظار",
    checkedIn: "تم تسجيل الدخول",

    addBooking: "+ إضافة حجز",
    addTitle: "إضافة حجز",
    source: "مصدر الحجز",
    code: "رقم الحجز (اختياري)",
    total: "إجمالي قيمة الحجز (ريال)",
    commission: "عمولة المنصة (ريال)",
    received: "المبلغ المستلم حتى الآن (ريال)",
    notes: "ملاحظات (اختياري)",
    saveBooking: "حفظ الحجز",

    remaining: "المبالغ المتبقية",
    remainingDesc: "متابعة المبالغ المستحقة وتسجيل الدفعات.",
    totalShort: "الإجمالي",
    receivedShort: "المستلم",
    due: "المتبقي",
    action: "الإجراء",
    record: "تسجيل دفعة",
    additional: "دفعة إضافية مستلمة (ريال)",
    savePayment: "حفظ الدفعة",
    noRemaining: "لا توجد مبالغ مستحقة مسجلة.",

    invalidMoney:
      "تحقق من المبالغ. المستلم لا يمكن أن يتجاوز الإجمالي.",
    invalidCommission:
      "العمولة لا يمكن أن تتجاوز قيمة الحجز.",
    duplicate: "يوجد حجز بنفس رقم الحجز.",
    overlap: "التواريخ تتعارض مع حجز نشط موجود.",
    saving: "جارٍ الحفظ...",
    bookingSaved: "تم حفظ الحجز بنجاح.",
    paymentSaved: "تم تسجيل الدفعة بنجاح.",
    paymentError: "تعذر حفظ الدفعة.",
    bookingError: "تعذر حفظ الحجز.",
    signInRequired: "يرجى تسجيل الدخول مرة أخرى.",
    noData: "انتظر حتى يكتمل تحميل الحجوزات.",
    balance: "المبلغ المتبقي",
    paymentTooHigh:
      "يجب أن تكون الدفعة أكبر من صفر وألا تتجاوز المبلغ المتبقي.",
    paymentChanged:
      "تم تعديل سجل الدفعة. حدّث الصفحة وحاول مرة أخرى.",

    weekdays: [
      "الأحد", "الاثنين", "الثلاثاء", "الأربعاء",
      "الخميس", "الجمعة", "السبت"
    ]
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

/* ==========================================
   HELPERS
   ========================================== */

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

function cents(value) {
  return Math.round(Number(value) * 100);
}

function activeBooking(booking) {
  return [
    "confirmed",
    "checked_in",
    "checked-in",
    "checked in"
  ].includes(
    String(booking.status || "").trim().toLowerCase()
  );
}

function cancelledBooking(booking) {
  return ["cancelled", "canceled"].includes(
    String(booking.status || "").trim().toLowerCase()
  );
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

  if (result.recorded === 0) {
    return t("notRecorded");
  }

  return money(result.total) +
    (result.complete ? "" : " *");
}

/* ==========================================
   LOAD BOOKINGS
   ========================================== */

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
          "original_guest_payment,refund_amount,refund_status," +
          "financial_status,confirmation_code,notes"
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
    renderRemainingPayments();

  } catch (error) {
    console.error("Supabase loading error:", error);

    bookings = [];
    bookingsLoaded = false;
    dashboardMessage.textContent = t("loadError");

    $("bookings-table-body").replaceChildren();
    $("remaining-payments-body").replaceChildren();
    calendarGrid.replaceChildren();

    [
      "total-bookings",
      "upcoming-bookings",
      "guest-payments",
      "host-payouts",
      "remaining-total"
    ].forEach(id => setText(id, "—"));
  }
}

/* ==========================================
   DASHBOARD STATISTICS
   ========================================== */

function renderStatistics() {
  const today = dateString(new Date());
  const active = bookings.filter(activeBooking);

  setText("total-bookings", String(bookings.length));

  setText(
    "upcoming-bookings",
    String(
      active.filter(b => b.check_in >= today).length
    )
  );

  // Booking totals are not necessarily collected payments.
  setText(
    "guest-payments",
    displayTotal("guest_total")
  );

  setText(
    "host-payouts",
    displayTotal("amount")
  );
}

/* ==========================================
   BOOKING STATUS
   ========================================== */

function translateStatus(status) {
  const normalized =
    String(status || "").trim().toLowerCase();

  if (["cancelled", "canceled"].includes(normalized)) {
    return t("cancelled");
  }

  if (normalized === "confirmed") {
    return t("confirmed");
  }

  if (normalized === "pending") {
    return t("pending");
  }

  if (
    ["checked_in", "checked-in", "checked in"]
      .includes(normalized)
  ) {
    return t("checkedIn");
  }

  return status || "—";
}

/* ==========================================
   BOOKINGS TABLE
   ========================================== */

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

    button.addEventListener("click", () => {
      showBreakdown(index);
    });

    detailsCell.appendChild(button);
    row.appendChild(detailsCell);
    tbody.appendChild(row);
  });
}

/* ==========================================
   FINANCIAL BREAKDOWN HELPERS
   ========================================== */

function addBreakdownRow(label, value, options = {}) {
  const row = document.createElement("div");
  row.className = "breakdown-row";

  if (options.highlight) {
    row.classList.add("highlight");
  }

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

  if (options.highlight) {
    row.classList.add("highlight");
  }

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

/* ==========================================
   VIEW RESERVATION BREAKDOWN
   ========================================== */

function showBreakdown(index) {
  const booking = bookings[index];
  if (!booking) return;

  setText(
    "breakdown-guest",
    `${booking.guest_name || t("guestFallback")} · ` +
    `${booking.platform || t("bookingFallback")}`
  );

  breakdownContent.replaceChildren();

  if (cancelledBooking(booking)) {
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

    addBreakdownHeading(t("guestPaid"));

    addBreakdownRow(
      t("roomAfter"),
      booking.accommodation_total
    );

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

    // Payment tracking only for bookings with
    // a recognized payment status.
    const remaining = outstandingBalance(booking);

    if (remaining !== null) {
      addBreakdownHeading(t("remaining"));

      addBreakdownRow(
        t("receivedShort"),
        amountReceived(booking)
      );

      addBreakdownRow(
        t("due"),
        remaining,
        { highlight: true }
      );
    }
  }

  breakdownDialog.showModal();
}

$("close-breakdown").addEventListener("click", () => {
  breakdownDialog.close();
});

$("close-breakdown-bottom").addEventListener("click", () => {
  breakdownDialog.close();
});

/* ==========================================
   BOOKING CALENDAR
   ========================================== */

function renderCalendar() {
  calendarGrid.replaceChildren();

  calendarMonth.textContent =
    displayedMonth.toLocaleDateString(
      currentLanguage === "ar"
        ? "ar-SA-u-ca-gregory"
        : "en-US",
      {
        month: "long",
        year: "numeric"
      }
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
    const date = dateString(
      new Date(year, month, day)
    );

    const occupied = bookings.some(booking =>
      activeBooking(booking) &&
      booking.check_in <= date &&
      date < booking.check_out
    );

    const cell = document.createElement("div");
    cell.className = "calendar-day";

    if (occupied) {
      cell.classList.add("booked");
    }

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
  displayedMonth.setMonth(
    displayedMonth.getMonth() - 1
  );
  renderCalendar();
});

$("next-month").addEventListener("click", () => {
  displayedMonth.setMonth(
    displayedMonth.getMonth() + 1
  );
  renderCalendar();
});

/* ==========================================
   AVAILABILITY CHECKER
   ========================================== */

$("availability-form").addEventListener(
  "submit",
  event => {
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
      overlaps(
        start,
        end,
        booking.check_in,
        booking.check_out
      )
    );

    result.textContent =
      conflict ? t("conflict") : t("noConflict");

    result.classList.add(
      conflict ? "warning" : "success"
    );
  }
);

$("check-in-date").addEventListener(
  "change",
  event => {
    $("check-out-date").min = event.target.value;
  }
);

$("refresh-bookings-btn").addEventListener(
  "click",
  loadBookings
);

/* ==========================================
   REMAINING PAYMENTS
   ========================================== */

function amountReceived(booking) {
  const value = booking.original_guest_payment;

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

function outstandingBalance(booking) {
  if (!activeBooking(booking)) {
    return null;
  }

  const total = Number(booking.guest_total);
  const received = amountReceived(booking);

  if (
    booking.guest_total === null ||
    booking.guest_total === undefined ||
    booking.guest_total === "" ||
    !Number.isFinite(total) ||
    received === null
  ) {
    return null;
  }

  // Avoid assuming platform payments are unpaid.
  // Only calculate balances for bookings whose
  // payment tracking is explicitly recorded.
  const financialStatus = String(
    booking.financial_status || ""
  ).trim().toLowerCase();

  if (![
    "partially_paid",
    "pending",
    "unpaid",
    "paid"
  ].includes(financialStatus)) {
    return null;
  }

  return Math.max(
    0,
    cents(total) - cents(received)
  ) / 100;
}

function renderRemainingPayments() {
  const tbody = $("remaining-payments-body");
  tbody.replaceChildren();

  const outstanding = bookings
    .map(booking => ({
      booking,
      remaining: outstandingBalance(booking)
    }))
    .filter(item =>
      item.remaining !== null &&
      item.remaining > 0
    );

  const totalRemaining = outstanding.reduce(
    (sum, item) => sum + cents(item.remaining),
    0
  ) / 100;

  setText(
    "remaining-total",
    money(totalRemaining)
  );

  if (!outstanding.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 5;
    cell.textContent = t("noRemaining");

    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  outstanding.forEach(({ booking, remaining }) => {
    const row = document.createElement("tr");

    const values = [
      booking.guest_name || t("guestFallback"),
      money(booking.guest_total),
      money(amountReceived(booking)),
      money(remaining)
    ];

    values.forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    const actionCell = document.createElement("td");
    const button = document.createElement("button");

    button.type = "button";
    button.className = "remaining-payment-btn";
    button.textContent = t("record");

    button.addEventListener("click", () => {
      selectedPaymentBooking = booking;

      $("payment-message").textContent = "";
      $("new-payment-amount").value = "";

      updatePaymentDialog();
      paymentDialog.showModal();
    });

    actionCell.appendChild(button);
    row.appendChild(actionCell);
    tbody.appendChild(row);
  });
}

/* ==========================================
   ADD BOOKING
   ========================================== */

$("open-add-booking").addEventListener(
  "click",
  () => {
    if (!bookingsLoaded) {
      dashboardMessage.textContent = t("noData");
      return;
    }

    addBookingForm.reset();

    $("manual-booking-message").textContent = "";
    $("manual-check-out").min = "";

    updateManualBalancePreview();
    addBookingDialog.showModal();
  }
);

$("close-add-booking").addEventListener(
  "click",
  () => {
    addBookingDialog.close();
  }
);

function updateManualBalancePreview() {
  const total = Number(
    $("manual-total").value || 0
  );

  const received = Number(
    $("manual-received").value || 0
  );

  const remaining = Math.max(
    0,
    cents(total) - cents(received)
  ) / 100;

  setText(
    "manual-balance-preview",
    t("balance") + ": " + money(remaining)
  );
}

["manual-total", "manual-received"].forEach(id => {
  $(id).addEventListener(
    "input",
    updateManualBalancePreview
  );
});

$("manual-check-in").addEventListener(
  "change",
  () => {
    $("manual-check-out").min =
      $("manual-check-in").value;
  }
);

addBookingForm.addEventListener(
  "submit",
  async event => {
    event.preventDefault();

    if (savingManualBooking) return;

    const message = $("manual-booking-message");
    message.textContent = "";

    if (!bookingsLoaded) {
      message.textContent = t("noData");
      return;
    }

    const guest = $("manual-guest").value.trim();
    const platform = $("manual-platform").value;
    const code = $("manual-code").value.trim();

    const checkIn = $("manual-check-in").value;
    const checkOut = $("manual-check-out").value;

    const total = Number(
      $("manual-total").value
    );

    const commission = Number(
      $("manual-commission").value
    );

    const received = Number(
      $("manual-received").value
    );

    const notes = $("manual-notes").value.trim();

    if (
      !checkIn ||
      !checkOut ||
      checkIn >= checkOut
    ) {
      message.textContent = t("invalidDates");
      return;
    }

    if (
      !guest ||
      !Number.isFinite(total) ||
      !Number.isFinite(commission) ||
      !Number.isFinite(received) ||
      total < 0 ||
      commission < 0 ||
      received < 0 ||
      cents(received) > cents(total)
    ) {
      message.textContent = t("invalidMoney");
      return;
    }

    if (cents(commission) > cents(total)) {
      message.textContent = t("invalidCommission");
      return;
    }

    const conflict = bookings.some(booking =>
      activeBooking(booking) &&
      overlaps(
        checkIn,
        checkOut,
        booking.check_in,
        booking.check_out
      )
    );

    if (conflict) {
      message.textContent = t("overlap");
      return;
    }

    if (
      code &&
      bookings.some(booking =>
        booking.platform === platform &&
        String(
          booking.confirmation_code || ""
        ) === code
      )
    ) {
      message.textContent = t("duplicate");
      return;
    }

    const totalCents = cents(total);
    const commissionCents = cents(commission);
    const receivedCents = cents(received);

    const financialStatus =
      receivedCents === totalCents
        ? "paid"
        : receivedCents === 0
          ? "unpaid"
          : "partially_paid";

    const newBooking = {
      guest_name: guest,
      platform,
      confirmation_code: code || null,
      check_in: checkIn,
      check_out: checkOut,
      status: "confirmed",

      original_price: totalCents / 100,
      discount_amount: 0,
      accommodation_total: totalCents / 100,
      guest_total: totalCents / 100,

      original_guest_payment:
        receivedCents / 100,

      platform_commission:
        commissionCents / 100,

      occupancy_tax: 0,
      other_fees: 0,

      amount:
        (totalCents - commissionCents) / 100,

      financial_status: financialStatus,
      notes: notes || null
    };

    savingManualBooking = true;

    $("save-manual-booking").disabled = true;
    $("save-manual-booking").textContent =
      t("saving");

    try {
      const {
        data: authData,
        error: authError
      } = await supabaseClient.auth.getUser();

      if (authError || !authData.user) {
        throw new Error(t("signInRequired"));
      }

      const { error } = await supabaseClient
        .from("Bookings")
        .insert(newBooking);

      if (error) throw error;

      addBookingDialog.close();

      await loadBookings();

      dashboardMessage.textContent =
        t("bookingSaved");

    } catch (error) {
      console.error(
        "Manual booking error:",
        error
      );

      message.textContent =
        error.message || t("bookingError");

    } finally {
      savingManualBooking = false;

      $("save-manual-booking").disabled = false;
      $("save-manual-booking").textContent =
        t("saveBooking");
    }
  }
);

/* ==========================================
   RECORD ADDITIONAL PAYMENT
   ========================================== */

function updatePaymentDialog() {
  if (!selectedPaymentBooking) return;

  setText(
    "payment-guest",
    selectedPaymentBooking.guest_name ||
      t("guestFallback")
  );

  const remaining = outstandingBalance(
    selectedPaymentBooking
  );

  setText(
    "payment-balance",
    t("balance") + ": " + money(remaining)
  );

  $("new-payment-amount").max =
    remaining === null
      ? ""
      : String(remaining);
}

$("close-payment-dialog").addEventListener(
  "click",
  () => {
    paymentDialog.close();
  }
);

$("record-payment-form").addEventListener(
  "submit",
  async event => {
    event.preventDefault();

    if (
      savingPayment ||
      !selectedPaymentBooking
    ) {
      return;
    }

    const message = $("payment-message");
    message.textContent = "";

    const booking = selectedPaymentBooking;
    const remaining = outstandingBalance(booking);

    const payment = Number(
      $("new-payment-amount").value
    );

    if (
      remaining === null ||
      !Number.isFinite(payment) ||
      cents(payment) <= 0 ||
      cents(payment) > cents(remaining)
    ) {
      message.textContent =
        t("paymentTooHigh");
      return;
    }

    savingPayment = true;

    $("save-payment").disabled = true;
    $("save-payment").textContent =
      t("saving");

    try {
      const {
        data: authData,
        error: authError
      } = await supabaseClient.auth.getUser();

      if (authError || !authData.user) {
        throw new Error(t("signInRequired"));
      }

      const previous = amountReceived(booking);

      const newReceivedCents =
        cents(previous) + cents(payment);

      const totalCents =
        cents(booking.guest_total);

      const { data, error } = await supabaseClient
        .from("Bookings")
        .update({
          original_guest_payment:
            newReceivedCents / 100,

          financial_status:
            newReceivedCents >= totalCents
              ? "paid"
              : "partially_paid"
        })
        .eq("id", booking.id)
        .eq("original_guest_payment", previous)
        .select("id");

      if (error) throw error;

      if (!data || data.length !== 1) {
        throw new Error(t("paymentChanged"));
      }

      paymentDialog.close();
      selectedPaymentBooking = null;

      await loadBookings();

      dashboardMessage.textContent =
        t("paymentSaved");

    } catch (error) {
      console.error(
        "Payment update error:",
        error
      );

      message.textContent =
        error.message || t("paymentError");

    } finally {
      savingPayment = false;

      $("save-payment").disabled = false;
      $("save-payment").textContent =
        t("savePayment");
    }
  }
);

/* ==========================================
   AUTHENTICATION
   ========================================== */

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

  if (addBookingDialog.open) {
    addBookingDialog.close();
  }

  if (paymentDialog.open) {
    paymentDialog.close();
  }

  if (breakdownDialog.open) {
    breakdownDialog.close();
  }
}

loginForm.addEventListener(
  "submit",
  async event => {
    event.preventDefault();
    loginError.textContent = "";

    const email = $("email").value;
    const password = $("password").value;

    const { error } =
      await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

    if (error) {
      loginError.textContent =
        t("incorrectLogin");
      return;
    }

    showDashboard();
  }
);

$("logout-btn").addEventListener(
  "click",
  async () => {
    await supabaseClient.auth.signOut();
    showLogin();
  }
);

async function checkSession() {
  if (
    SUPABASE_KEY ===
    "PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE"
  ) {
    loginError.textContent = t("missingKey");
    return;
  }

  const { data, error } =
    await supabaseClient.auth.getUser();

  if (!error && data.user) {
    showDashboard();
  } else {
    showLogin();
  }
}

/* ==========================================
   LANGUAGE SWITCHER
   ========================================== */

function setLanguage(lang) {
  currentLanguage =
    lang === "ar" ? "ar" : "en";

  localStorage.setItem(
    "osAdminLanguage",
    currentLanguage
  );

  document.documentElement.lang =
    currentLanguage;

  document.documentElement.dir =
    currentLanguage === "ar"
      ? "rtl"
      : "ltr";

  setText("language-toggle", t("language"));

  // LOGIN
  setSelectorText(
    ".login-card h1",
    t("adminLogin")
  );

  setSelectorText(
    ".login-card .admin-subtitle",
    t("loginSubtitle")
  );

  setSelectorText(
    'label[for="email"]',
    t("email")
  );

  setSelectorText(
    'label[for="password"]',
    t("password")
  );

  setSelectorText(
    '#login-form button[type="submit"]',
    t("signIn")
  );

  // HEADER
  setText("logout-btn", t("logout"));

  setSelectorText(
    ".admin-header h1",
    t("dashboard")
  );

  setSelectorText(
    ".admin-header .admin-subtitle",
    t("subtitle")
  );

  setText("open-add-booking", t("addBooking"));

  // STATISTICS
  const statLabels =
    document.querySelectorAll(".stat-card span");

  [
    t("totalBookings"),
    t("upcomingBookings"),
    t("guestPayments"),
    t("hostPayouts")
  ].forEach((label, i) => {
    if (statLabels[i]) {
      statLabels[i].textContent = label;
    }
  });

  // SECTION HEADINGS
  const headings =
    document.querySelectorAll(
      ".panel .section-header h2"
    );

  const descriptions =
    document.querySelectorAll(
      ".panel .section-header p"
    );

  [
    t("calendar"),
    t("availability"),
    t("bookings"),
    t("remaining")
  ].forEach((value, i) => {
    if (headings[i]) {
      headings[i].textContent = value;
    }
  });

  [
    t("calendarDesc"),
    t("availabilityDesc"),
    t("bookingsDesc"),
    t("remainingDesc")
  ].forEach((value, i) => {
    if (descriptions[i]) {
      descriptions[i].textContent = value;
    }
  });

  setText("refresh-bookings-btn", t("refresh"));

  // AVAILABILITY
  setSelectorText(
    'label[for="check-in-date"]',
    t("checkIn")
  );

  setSelectorText(
    'label[for="check-out-date"]',
    t("checkOut")
  );

  setSelectorText(
    "#availability-form button",
    t("checkDates")
  );

  setSelectorText(
    ".fine-print",
    t("availabilityNote")
  );

  // BOOKINGS TABLE
  const tableHeaders =
    document.querySelectorAll(
      ".panel thead th"
    );

  [
    t("guest"),
    t("platform"),
    t("checkIn"),
    t("checkOut"),
    t("status"),
    t("payout"),
    t("details"),
    t("guest"),
    t("totalShort"),
    t("receivedShort"),
    t("due"),
    t("action")
  ].forEach((value, i) => {
    if (tableHeaders[i]) {
      tableHeaders[i].textContent = value;
    }
  });

  // BREAKDOWN
  setSelectorText(
    "#breakdown-dialog .dialog-header h2",
    t("breakdown")
  );

  setText(
    "close-breakdown-bottom",
    t("close")
  );

  $("close-breakdown").setAttribute(
    "aria-label",
    t("close")
  );

  // MANUAL BOOKING
  const formLabels = {
    "add-booking-title": "addTitle",
    "manual-guest-label": "guest",
    "manual-platform-label": "source",
    "manual-code-label": "code",
    "manual-check-in-label": "checkIn",
    "manual-check-out-label": "checkOut",
    "manual-total-label": "total",
    "manual-commission-label": "commission",
    "manual-received-label": "received",
    "manual-notes-label": "notes",
    "save-manual-booking": "saveBooking",

    "remaining-title": "remaining",
    "remaining-description": "remainingDesc",
    "remaining-guest-heading": "guest",
    "remaining-total-heading": "totalShort",
    "remaining-paid-heading": "receivedShort",
    "remaining-due-heading": "due",
    "remaining-action-heading": "action",

    "record-payment-title": "record",
    "new-payment-label": "additional",
    "save-payment": "savePayment"
  };

  Object.entries(formLabels).forEach(
    ([id, key]) => {
      setText(id, t(key));
    }
  );

  // CALENDAR LEGEND
  const legend =
    document.querySelectorAll(
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
  const weekdays =
    document.querySelectorAll(
      ".calendar-weekdays span"
    );

  t("weekdays").forEach((day, i) => {
    if (weekdays[i]) {
      weekdays[i].textContent = day;
    }
  });

  // REFRESH TRANSLATED DATA
  const availabilityResult =
    $("availability-result");

  if (availabilityResult) {
    availabilityResult.textContent = "";
  }

  if (bookingsLoaded) {
    renderStatistics();
    renderTable();
    renderRemainingPayments();
  }

  if (paymentDialog.open) {
    updatePaymentDialog();
  }

  updateManualBalancePreview();
  renderCalendar();
}

$("language-toggle").addEventListener(
  "click",
  () => {
    setLanguage(
      currentLanguage === "en"
        ? "ar"
        : "en"
    );
  }
);

/* ==========================================
   INITIALIZE
   ========================================== */

setLanguage(currentLanguage);
checkSession();
