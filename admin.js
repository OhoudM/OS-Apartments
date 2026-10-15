const SUPABASE_URL = "https://ptpdexboeaummnywwgyv.supabase.co";
const SUPABASE_KEY = "sb_publishable_JrsJrxQ86TCBZWRc9g7HTg_bsLXaYJ8";
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const $ = (id) => document.getElementById(id);

let bookings = [];
let bookingsLoaded = false;
let selectedPaymentBooking = null;
let savingManualBooking = false;
let savingPayment = false;
let currentTab = "overview";
let currentLanguage =
  localStorage.getItem("osAdminLanguage") === "ar"
    ? "ar"
    : "en";

let displayedMonth = new Date();
displayedMonth.setDate(1);

let selectedReportMonth = "";

const translations = {
  en: {
    management: "Management Dashboard",
    login: "Sign In",
    email: "Email",
    password: "Password",
    logout: "Logout",
    addBooking: "+ Add Booking",
    language: "العربية",

    overview: "Overview",
    bookingsTab: "Bookings & Calendar",
    finances: "Finances",
    reports: "Reports & Analytics",

    overviewDesc: "Your apartment at a glance",
    bookingsDesc: "Manage reservations and guest stays",
    financesDesc: "Track payments and apartment expenses",
    reportsDesc: "Understand how your apartment is performing",

    totalBookings: "Total Bookings",
    upcomingBookings: "Upcoming Bookings",
    guestTotals: "Guest Booking Totals",
    hostEarnings: "Estimated Host Earnings",
    viewDetails: "View details →",

    today: "Today's Overview",
    todayDesc: "Arrivals, departures and current guests",
    arriving: "Arriving Today",
    departing: "Departing Today",
    staying: "Currently Staying",
    noToday: "No arrivals or departures today.",
    arrival: "Arrival",
    departure: "Departure",
    currentGuest: "Currently staying",

    quickActions: "Quick Actions",
    viewBookings: "View Bookings",
    viewFinances: "View Finances",

    calendar: "Booking Calendar",
    calendarDesc: "See who is staying each day",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    pending: "Pending",
    available: "Available",
    checkedIn: "Checked in",

    allBookings: "All Bookings",
    allBookingsDesc: "View reservations and payment details",
    refresh: "Refresh",
    guest: "Guest",
    platform: "Platform",
    checkIn: "Check-in",
    checkOut: "Check-out",
    status: "Status",
    earnings: "Host Earnings",
    details: "Details",
    breakdown: "View details",
    noBookings: "No bookings found.",

    estimatedEarnings: "Estimated Earnings",
    paymentsReceived: "Payments Received",
    paymentsRemaining: "Payments Remaining",
    recordedExpenses: "Recorded Expenses",

    remainingTitle: "Remaining Payments",
    remainingDesc:
      "Guest balances that still need to be collected",
    total: "Total",
    received: "Received",
    remaining: "Remaining",
    action: "Action",
    recordPayment: "Record Payment",
    noRemaining: "No outstanding tracked payments.",

    expenses: "Apartment Expenses",
    expensesDesc:
      "Cleaning, maintenance, utilities and supplies",
    addExpense: "+ Add Expense",
    expensesSetup:
      "Expense tracking will be available after setup.",

    monthlyPerformance: "Monthly Performance",
    monthlyDesc:
      "Estimated earnings, expenses and profit",
    monthlyEarnings: "Monthly Earnings",
    monthlyExpenses: "Monthly Expenses",
    estimatedProfit: "Estimated Profit",
    occupancy: "Occupancy Rate",
    earningsChart: "Earnings by Month",
    earningsChartDesc:
      "Compare your apartment's monthly performance",
    platformChart: "Bookings by Platform",
    platformChartDesc:
      "See where your reservations come from",

    notConfigured: "Not set up yet",
    expensesUnavailable:
      "Add the expenses database to calculate profit.",
    noChartData: "No confirmed booking data to display.",

    saveBooking: "Save Booking",
    savePayment: "Save Payment",
    close: "Close",
    notes: "Notes",
    guestName: "Guest Name",
    confirmationCode: "Confirmation Code",
    bookingAmount: "Total Booking Amount (SAR)",
    commission: "Platform Commission (SAR)",
    amountReceived: "Amount Received (SAR)",
    paymentAmount: "Payment Amount (SAR)",
    remainingBalance: "Remaining Balance",
    bookingDetails: "Booking Details",
    paymentDetails: "Payment Details",

    originalPrice: "Original booking price",
    discount: "Discount",
    accommodation: "Accommodation total",
    occupancyTax: "Occupancy tax",
    otherFees: "Other fees",
    guestTotal: "Guest booking total",
    platformCommission: "Platform commission",
    hostTotal: "Estimated host earnings",
    receivedSoFar: "Amount received",
    balanceDue: "Balance due",
    refund: "Refund amount",
    refundStatus: "Refund status",
    financialStatus: "Payment status",
    code: "Confirmation code",
    dates: "Stay dates",

    byPlatform: "Estimated earnings by platform",
    activeReservations: "Active reservations",
    cancelledReservations: "Cancelled reservations",
    notRecorded: "Not recorded",

    loading: "Loading bookings...",
    loadError: "Could not load bookings: ",
    loginError: "Could not sign in: ",
    saveError: "Could not save: ",
    saving: "Saving...",
    bookingSaved: "Booking saved successfully.",
    paymentSaved: "Payment recorded successfully.",
    bookingConflict:
      "These dates overlap an existing confirmed booking.",
    duplicateCode:
      "This confirmation code already exists for that platform.",
    invalidDates:
      "Check-out must be after check-in.",
    invalidAmounts:
      "Please check the amounts entered.",
    paymentTooLarge:
      "Payment exceeds the remaining balance.",
    missingPayment:
      "This booking does not have a tracked remaining balance.",
    stalePayment:
      "This booking was updated elsewhere. Refresh and try again.",
    refreshNeeded:
      "Bookings must finish loading before you can add a reservation.",
    sessionExpired:
      "Your session has expired. Please sign in again.",

    jan: "January",
    feb: "February",
    mar: "March",
    apr: "April",
    may: "May",
    jun: "June",
    jul: "July",
    aug: "August",
    sep: "September",
    oct: "October",
    nov: "November",
    dec: "December",

    sun: "Sun",
    mon: "Mon",
    tue: "Tue",
    wed: "Wed",
    thu: "Thu",
    fri: "Fri",
    sat: "Sat"
  },

  
  ar: {
    management: "لوحة إدارة الشقق",
    login: "تسجيل الدخول",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    logout: "تسجيل الخروج",
    addBooking: "+ إضافة حجز",
    language: "English",

    overview: "الرئيسية",
    bookingsTab: "الحجوزات والتقويم",
    finances: "المالية",
    reports: "التقارير والتحليلات",

    overviewDesc: "نظرة عامة على الشقة",
    bookingsDesc: "إدارة الحجوزات وإقامات الضيوف",
    financesDesc: "متابعة المدفوعات ومصاريف الشقة",
    reportsDesc: "متابعة أداء الشقة",

    totalBookings: "إجمالي الحجوزات",
    upcomingBookings: "الحجوزات القادمة",
    guestTotals: "إجمالي قيمة الحجوزات",
    hostEarnings: "الأرباح المتوقعة",
    viewDetails: "عرض التفاصيل ←",

    today: "ملخص اليوم",
    todayDesc: "الوصول والمغادرة والضيوف الحاليون",
    arriving: "الوصول اليوم",
    departing: "المغادرة اليوم",
    staying: "المقيمون حاليًا",
    noToday: "لا يوجد وصول أو مغادرة اليوم.",
    arrival: "وصول",
    departure: "مغادرة",
    currentGuest: "مقيم حاليًا",

    quickActions: "إجراءات سريعة",
    quickDesc: "المهام اليومية للعائلة",
    viewBookings: "عرض الحجوزات",
    viewFinances: "عرض المالية",

    calendar: "تقويم الحجوزات",
    calendarDesc: "معرفة الضيوف المقيمين يوميًا",
    confirmed: "مؤكد",
    cancelled: "ملغي",
    pending: "قيد الانتظار",
    available: "متاح",
    checkedIn: "تم تسجيل الدخول",

    allBookings: "جميع الحجوزات",
    allBookingsDesc: "تفاصيل الحجوزات والمدفوعات",
    refresh: "تحديث",
    guest: "الضيف",
    platform: "المنصة",
    checkIn: "تاريخ الوصول",
    checkOut: "تاريخ المغادرة",
    status: "الحالة",
    earnings: "أرباح المضيف",
    details: "التفاصيل",
    breakdown: "عرض التفاصيل",
    noBookings: "لا توجد حجوزات.",

    estimatedEarnings: "الأرباح المتوقعة",
    paymentsReceived: "المدفوعات المستلمة",
    paymentsRemaining: "المدفوعات المتبقية",
    recordedExpenses: "المصاريف المسجلة",

    remainingTitle: "المدفوعات المتبقية",
    remainingDesc:
      "المبالغ المتبقية المطلوب تحصيلها من الضيوف",
    total: "الإجمالي",
    received: "المستلم",
    remaining: "المتبقي",
    action: "الإجراء",
    recordPayment: "تسجيل دفعة",
    noRemaining: "لا توجد دفعات متبقية مسجلة.",

    expenses: "مصاريف الشقة",
    expensesDesc: "النظافة والصيانة والفواتير والمستلزمات",
    addExpense: "+ إضافة مصروف",
    expensesSetup:
      "سيتم تفعيل تسجيل المصاريف بعد الإعداد.",

    monthlyPerformance: "الأداء الشهري",
    monthlyDesc: "الأرباح والمصاريف والربح المتوقع",
    monthlyEarnings: "أرباح الشهر",
    monthlyExpenses: "مصاريف الشهر",
    estimatedProfit: "الربح المتوقع",
    occupancy: "نسبة الإشغال",
    earningsChart: "الأرباح حسب الشهر",
    earningsChartDesc: "مقارنة الأرباح الشهرية",
    platformChart: "الحجوزات حسب المنصة",
    platformChartDesc: "مصادر الحجوزات",

    notConfigured: "لم يتم الإعداد",
    expensesUnavailable:
      "يجب إضافة قاعدة بيانات المصاريف لحساب الربح.",
    noChartData: "لا توجد بيانات حجوزات مؤكدة.",

    saveBooking: "حفظ الحجز",
    savePayment: "حفظ الدفعة",
    close: "إغلاق",
    notes: "ملاحظات",
    guestName: "اسم الضيف",
    confirmationCode: "رقم تأكيد الحجز",
    bookingAmount: "إجمالي الحجز (ريال)",
    commission: "عمولة المنصة (ريال)",
    amountReceived: "المبلغ المستلم (ريال)",
    paymentAmount: "مبلغ الدفعة (ريال)",
    remainingBalance: "المبلغ المتبقي",
    bookingDetails: "تفاصيل الحجز",
    paymentDetails: "تفاصيل الدفع",

    originalPrice: "السعر الأصلي",
    discount: "الخصم",
    accommodation: "قيمة الإقامة",
    occupancyTax: "ضريبة الإشغال",
    otherFees: "رسوم أخرى",
    guestTotal: "إجمالي حجز الضيف",
    platformCommission: "عمولة المنصة",
    hostTotal: "أرباح المضيف المتوقعة",
    receivedSoFar: "المبلغ المستلم",
    balanceDue: "المبلغ المتبقي",
    refund: "المبلغ المسترد",
    refundStatus: "حالة الاسترداد",
    financialStatus: "حالة الدفع",
    code: "رقم الحجز",
    dates: "تواريخ الإقامة",

    byPlatform: "الأرباح المتوقعة حسب المنصة",
    activeReservations: "الحجوزات النشطة",
    cancelledReservations: "الحجوزات الملغاة",
    notRecorded: "غير مسجل",

    loading: "جاري تحميل الحجوزات...",
    loadError: "تعذر تحميل الحجوزات: ",
    loginError: "تعذر تسجيل الدخول: ",
    saveError: "تعذر الحفظ: ",
    saving: "جاري الحفظ...",
    bookingSaved: "تم حفظ الحجز بنجاح.",
    paymentSaved: "تم تسجيل الدفعة بنجاح.",
    bookingConflict:
      "هذه التواريخ تتعارض مع حجز مؤكد آخر.",
    duplicateCode:
      "رقم الحجز موجود مسبقًا لهذه المنصة.",
    invalidDates:
      "يجب أن يكون تاريخ المغادرة بعد الوصول.",
    invalidAmounts:
      "يرجى التأكد من المبالغ المدخلة.",
    paymentTooLarge:
      "مبلغ الدفعة أكبر من المبلغ المتبقي.",
    missingPayment:
      "لا يوجد مبلغ متبقٍ مسجل لهذا الحجز.",
    stalePayment:
      "تم تحديث الحجز من جهاز آخر. يرجى التحديث.",
    refreshNeeded:
      "انتظر اكتمال تحميل الحجوزات قبل إضافة حجز.",
    sessionExpired:
      "انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.",

    jan: "يناير",
    feb: "فبراير",
    mar: "مارس",
    apr: "أبريل",
    may: "مايو",
    jun: "يونيو",
    jul: "يوليو",
    aug: "أغسطس",
    sep: "سبتمبر",
    oct: "أكتوبر",
    nov: "نوفمبر",
    dec: "ديسمبر",

    sun: "الأحد",
    mon: "الاثنين",
    tue: "الثلاثاء",
    wed: "الأربعاء",
    thu: "الخميس",
    fri: "الجمعة",
    sat: "السبت"
  }
};


/* =====================================================
   PART 3 — ORIGINAL DASHBOARD HELPERS
   ===================================================== */

function t(key) {
  return translations[currentLanguage][key] || key;
}

function setText(id, value) {
  const element = $(id);
  if (element) element.textContent = value;
}

function setButtonText(id, value) {
  setText(id, value);
}

function money(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return t("notRecorded");
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return t("notRecorded");
  }

  
return (
  number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + " SAR"
);

}

function cents(value) {
  return Math.round(Number(value) * 100);
}

function dateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatDate(value) {
  const date = parseDate(value);
  if (!date) return "—";

  return date.toLocaleDateString(
    currentLanguage === "ar" ? "ar-SA" : "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );
}

function monthName(monthIndex) {
  const keys = [
    "jan", "feb", "mar", "apr",
    "may", "jun", "jul", "aug",
    "sep", "oct", "nov", "dec"
  ];

  return t(keys[monthIndex]);
}

function firstName(name) {
  return String(name || t("guest"))
    .trim()
    .split(/\s+/)[0];
}

function normalizedStatus(booking) {
  return String(booking.status || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function activeBooking(booking) {
  return ["confirmed", "checked_in"].includes(
    normalizedStatus(booking)
  );
}

function cancelledBooking(booking) {
  return ["cancelled", "canceled"].includes(
    normalizedStatus(booking)
  );
}

function translateStatus(status) {
  const normalized = String(status || "")
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (normalized === "confirmed") return t("confirmed");
  if (normalized === "checked_in") return t("checkedIn");

  if (["cancelled", "canceled"].includes(normalized)) {
    return t("cancelled");
  }

  if (normalized === "pending") return t("pending");

  return status || "—";
}

function statusClass(status) {
  const normalized = String(status || "")
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (["confirmed", "checked_in"].includes(normalized)) {
    return "status-confirmed";
  }

  if (["cancelled", "canceled"].includes(normalized)) {
    return "status-cancelled";
  }

  return "status-pending";
}

function overlaps(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

function safeNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const result = Number(value);
  return Number.isFinite(result) ? result : null;
}

function activeBookings() {
  return bookings.filter(activeBooking);
}

/* =====================================================
   FINANCIAL CALCULATIONS
   ===================================================== */

function sumField(field) {
  const records = activeBookings();
  let total = 0;
  let recorded = 0;

  for (const booking of records) {
    const amount = safeNumber(booking[field]);

    if (amount !== null) {
      total += amount;
      recorded++;
    }
  }

  return {
    total: Math.round(total * 100) / 100,
    recorded,
    complete: recorded === records.length
  };
}

function displayTotal(field) {
  const result = sumField(field);

  if (!result.complete) {
    return result.recorded
      ? `${money(result.total)} *`
      : "—";
  }

  return money(result.total);
}

/*
 * IMPORTANT:
 * Your original database uses original_guest_payment
 * for the recorded guest payment.
 */
function amountReceived(booking) {
  return safeNumber(booking.original_guest_payment);
}

/*
 * Calculate outstanding payments only when
 * the booking has tracked payment information.
 */
function outstandingBalance(booking) {
  if (!activeBooking(booking)) return null;

  const total = safeNumber(booking.guest_total);
  const received = amountReceived(booking);

  if (total === null || received === null) {
    return null;
  }

  const financialStatus = String(
    booking.financial_status || ""
  )
    .trim()
    .toLowerCase();

  const trackedStatuses = [
    "partially_paid",
    "pending",
    "unpaid",
    "paid"
  ];

  if (!trackedStatuses.includes(financialStatus)) {
    return null;
  }

  return Math.max(
    0,
    cents(total) - cents(received)
  ) / 100;
}

/* =====================================================
   ELEMENT AND MESSAGE HELPERS
   ===================================================== */

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) element.className = className;

  if (text !== undefined && text !== null) {
    element.textContent = String(text);
  }

  return element;
}

function showMessage(message, isError = false) {
  const element = $("dashboard-message");
  if (!element) return;

  element.textContent = message;
  element.style.color = isError
    ? "var(--danger)"
    : "var(--success)";
}

/* =====================================================
   NAVIGATION
   ===================================================== */

   
/* =====================================================
   NAVIGATION
   ===================================================== */

function switchTab(tab) {
  const validTabs = [
    "overview",
    "bookings",
    "finances",
    "reports"
  ];

  if (!validTabs.includes(tab)) return;

  currentTab = tab;

  document.querySelectorAll(".tab-btn").forEach((button) => {
    const active = button.dataset.tab === tab;

    button.classList.toggle("active", active);
    button.setAttribute(
      "aria-selected",
      active ? "true" : "false"
    );
  });

  document.querySelectorAll(".tab-content").forEach((section) => {
    const active = section.id === `tab-${tab}`;

    section.hidden = !active;
    section.classList.toggle("active", active);
  });
}

document.querySelectorAll(".tab-btn").forEach((button) => {
  button.addEventListener("click", () => {
    switchTab(button.dataset.tab);
  });
});

$("quick-view-bookings")?.addEventListener(
  "click",
  () => switchTab("bookings")
);

$("quick-view-finances")?.addEventListener(
  "click",
  () => switchTab("finances")
);

/* =====================================================
   SUPABASE — LOAD BOOKINGS
   ===================================================== */

async function loadBookings() {
  bookingsLoaded = false;
  showMessage(t("loading"));

  const allBookings = [];
  const pageSize = 500;
  let offset = 0;

  try {
    while (true) {
      const { data, error } = await supabaseClient
        .from("Bookings")
        .select(
          [
            "id",
            "guest_name",
            "platform",
            "check_in",
            "check_out",
            "status",
            "amount",
            "original_price",
            "discount_amount",
            "accommodation_total",
            "guest_total",
            "occupancy_tax",
            "platform_commission",
            "other_fees",
            "original_guest_payment",
            "refund_amount",
            "refund_status",
            "financial_status",
            "confirmation_code",
            "notes"
          ].join(",")
        )
        .order("check_in", { ascending: true })
        .range(offset, offset + pageSize - 1);

      if (error) throw error;

      allBookings.push(...(data || []));

      if (!data || data.length < pageSize) break;

      offset += pageSize;
    }

    bookings = allBookings;
    bookingsLoaded = true;

    renderEverything();
    showMessage("");
  } catch (error) {
    bookings = [];
    bookingsLoaded = false;

    renderEverything();
    showMessage(t("loadError") + error.message, true);
  }
}


/* =========================================
   LOAD EXPENSES FROM SUPABASE
   ========================================= */

let expenses = [];

async function loadExpenses() {
  const { data, error } = await supabaseClient
    .from("Expenses")
    .select("*")
    .order("expense_date", { ascending: false });

  if (error) {
    console.error("Could not load expenses:", error);
    showMessage("Could not load expenses: " + error.message, true);
    return;
  }

  expenses = data || [];
  renderExpenses();
}

function renderExpenses() {
  const tbody = $("expenses-table-body");
  if (!tbody) return;

  tbody.replaceChildren();

  let total = 0;

  expenses.forEach(expense => {
    const amount = Number(expense.amount) || 0;
    total += amount;

    const row = document.createElement("tr");

    const values = [
      expense.expense_date,
      expense.category,
      expense.description || "—",
      money(amount)
    ];

    values.forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });

  if (!expenses.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 4;
    cell.textContent =
      currentLanguage === "ar"
        ? "لا توجد مصاريف مسجلة"
        : "No expenses recorded";

    row.appendChild(cell);
    tbody.appendChild(row);
  }

  // Update the expenses summary card.
  const totalElement = $("finance-expenses");

  if (totalElement) {
    totalElement.textContent = money(total);
  }
}

function renderEverything() {
  renderStatistics();
  renderToday();
  renderCalendar();
  renderTable();
  renderRemainingPayments();
  renderFinanceSummary();
  renderReports();
}

/* =====================================================
   DASHBOARD STATISTICS
   ===================================================== */

function renderStatistics() {
  setText("total-bookings", bookings.length);

  const today = dateString(new Date());

  const upcoming = activeBookings().filter(
    (booking) => booking.check_in >= today
  ).length;

  setText("upcoming-bookings", upcoming);
  setText("guest-payments", displayTotal("guest_total"));
  setText("host-payouts", displayTotal("amount"));
}

/* =====================================================
   TODAY'S OVERVIEW
   ===================================================== */

function renderToday() {
  const today = dateString(new Date());
  const records = activeBookings();

  const arriving = records.filter(
    (booking) => booking.check_in === today
  );

  const departing = records.filter(
    (booking) => booking.check_out === today
  );

  const staying = records.filter(
    (booking) =>
      booking.check_in <= today &&
      booking.check_out > today
  );

  setText("today-arrivals", arriving.length);
  setText("today-departures", departing.length);
  setText("today-staying", staying.length);

  const container = $("today-guest-list");
  if (!container) return;

  container.replaceChildren();

  const items = [
    ...arriving.map((booking) => ({
      booking,
      label: t("arrival")
    })),
    ...departing.map((booking) => ({
      booking,
      label: t("departure")
    })),
    ...staying
      .filter(
        (booking) => booking.check_in !== today
      )
      .map((booking) => ({
        booking,
        label: t("currentGuest")
      }))
  ];

  if (!items.length) {
    container.append(
      createElement("p", "", t("noToday"))
    );
    return;
  }

  items.forEach(({ booking, label }) => {
    const row = createElement(
      "div",
      "today-guest-item"
    );

    const name = createElement(
      "strong",
      "",
      booking.guest_name || "—"
    );

    const info = createElement(
      "span",
      "",
      `${label} • ${booking.platform || "—"}`
    );

    row.append(name, info);
    container.append(row);
  });
}

/* =====================================================
   BOOKING CALENDAR
   ===================================================== */

function renderCalendar() {
  const grid = $("calendar-grid");
  if (!grid) return;

  grid.replaceChildren();

  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();

  setText(
    "calendar-month",
    `${monthName(month)} ${year}`
  );

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  for (let i = 0; i < firstWeekday; i++) {
    const empty = createElement(
      "div",
      "calendar-day empty"
    );

    empty.setAttribute("aria-hidden", "true");
    grid.append(empty);
  }

  const today = dateString(new Date());

  for (let day = 1; day <= daysInMonth; day++) {
    const date = dateString(
      new Date(year, month, day)
    );

    const matching = activeBookings().filter(
      (booking) =>
        booking.check_in <= date &&
        booking.check_out > date
    );

    const cell = createElement(
      "div",
      "calendar-day"
    );

    if (matching.length) {
      cell.classList.add("booked");
    }

    if (date === today) {
      cell.classList.add("today");
    }

    cell.append(
      createElement(
        "span",
        "calendar-day-number",
        day
      )
    );

    matching.forEach((booking) => {
      const button = createElement(
        "button",
        "calendar-guest",
        firstName(booking.guest_name)
      );

      button.type = "button";
      button.title = booking.guest_name || "";

      button.setAttribute(
        "aria-label",
        `${booking.guest_name}, ${formatDate(booking.check_in)} – ${formatDate(booking.check_out)}`
      );

      button.addEventListener("click", () => {
        const index = bookings.indexOf(booking);
        showBreakdown(index);
      });

      cell.append(button);
    });

    grid.append(cell);
  }
}

$("prev-month")?.addEventListener("click", () => {
  displayedMonth.setMonth(
    displayedMonth.getMonth() - 1
  );

  renderCalendar();
});

$("next-month")?.addEventListener("click", () => {
  displayedMonth.setMonth(
    displayedMonth.getMonth() + 1
  );

  renderCalendar();
});


/* =====================================================
   BOOKINGS TABLE
   ===================================================== */

function renderTable() {
  const tbody = $("bookings-table-body");
  if (!tbody) return;

  tbody.replaceChildren();

  if (!bookings.length) {
    const row = createElement("tr");
    const cell = createElement(
      "td",
      "",
      t("noBookings")
    );

    cell.colSpan = 7;
    row.append(cell);
    tbody.append(row);
    return;
  }

  const sorted = [...bookings].sort(
    (a, b) =>
      String(b.check_in || "").localeCompare(
        String(a.check_in || "")
      )
  );

  sorted.forEach((booking) => {
    const row = createElement("tr");

    const fields = [
      booking.guest_name || "—",
      booking.platform || "—",
      formatDate(booking.check_in),
      formatDate(booking.check_out)
    ];

    fields.forEach((value) => {
      row.append(createElement("td", "", value));
    });

    const statusCell = createElement("td");

    const badge = createElement(
      "span",
      `status-badge ${statusClass(booking.status)}`,
      translateStatus(booking.status)
    );

    statusCell.append(badge);
    row.append(statusCell);

    row.append(
      createElement(
        "td",
        "",
        money(booking.amount)
      )
    );

    const actionCell = createElement("td");

    const button = createElement(
      "button",
      "",
      t("breakdown")
    );

    button.type = "button";
    button.addEventListener("click", () => {
      showBreakdown(bookings.indexOf(booking));
    });

    actionCell.append(button);
    row.append(actionCell);
    tbody.append(row);
  });
}

/* =====================================================
   BOOKING DETAILS DIALOG
   ===================================================== */

function addBreakdownHeading(label) {
  const heading = createElement(
    "h3",
    "breakdown-heading",
    label
  );

  $("breakdown-content").append(heading);
}

function addBreakdownRow(
  label,
  value,
  options = {}
) {
  const row = createElement(
    "div",
    options.total
      ? "breakdown-row breakdown-total"
      : "breakdown-row"
  );

  const left = createElement("span", "", label);
  const right = createElement(
    "strong",
    "",
    money(value)
  );

  row.append(left, right);
  $("breakdown-content").append(row);
}

function addBreakdownTextRow(label, value) {
  const row = createElement(
    "div",
    "breakdown-row"
  );

  row.append(
    createElement("span", "", label),
    createElement(
      "strong",
      "",
      value === null ||
      value === undefined ||
      value === ""
        ? "—"
        : value
    )
  );

  $("breakdown-content").append(row);
}

function showBreakdown(index) {
  const booking = bookings[index];
  if (!booking) return;

  const content = $("breakdown-content");
  const dialog = $("breakdown-dialog");

  if (!content || !dialog) return;

  content.replaceChildren();

  setText(
    "breakdown-guest",
    booking.guest_name || t("bookingDetails")
  );

  addBreakdownTextRow(
    t("platform"),
    booking.platform
  );

  addBreakdownTextRow(
    t("code"),
    booking.confirmation_code
  );

  addBreakdownTextRow(
    t("dates"),
    `${formatDate(booking.check_in)} – ${formatDate(booking.check_out)}`
  );

  addBreakdownTextRow(
    t("status"),
    translateStatus(booking.status)
  );

  if (cancelledBooking(booking)) {
    addBreakdownHeading(t("paymentDetails"));

    addBreakdownRow(
      t("originalPrice"),
      booking.original_price
    );

    addBreakdownRow(
      t("receivedSoFar"),
      booking.original_guest_payment
    );

    addBreakdownRow(
      t("refund"),
      booking.refund_amount
    );

    addBreakdownTextRow(
      t("refundStatus"),
      booking.refund_status
    );
  } else {
    addBreakdownHeading(t("bookingDetails"));

    addBreakdownRow(
      t("originalPrice"),
      booking.original_price
    );

    addBreakdownRow(
      t("discount"),
      booking.discount_amount
    );

    addBreakdownRow(
      t("accommodation"),
      booking.accommodation_total
    );

    addBreakdownRow(
      t("occupancyTax"),
      booking.occupancy_tax
    );

    addBreakdownRow(
      t("otherFees"),
      booking.other_fees
    );

    addBreakdownRow(
      t("guestTotal"),
      booking.guest_total
    );

    addBreakdownHeading(t("hostEarnings"));

    addBreakdownRow(
      t("platformCommission"),
      booking.platform_commission
    );

    addBreakdownRow(
      t("hostTotal"),
      booking.amount,
      { total: true }
    );

    const balance = outstandingBalance(booking);

    if (balance !== null) {
      addBreakdownHeading(t("paymentDetails"));

      addBreakdownRow(
        t("receivedSoFar"),
        booking.original_guest_payment
      );

      addBreakdownRow(
        t("balanceDue"),
        balance,
        { total: true }
      );
    }
  }

  if (booking.notes) {
    addBreakdownHeading(t("notes"));

    content.append(
      createElement("p", "", booking.notes)
    );
  }

  dialog.showModal();
}

$("close-breakdown")?.addEventListener(
  "click",
  () => $("breakdown-dialog").close()
);

$("close-breakdown-bottom")?.addEventListener(
  "click",
  () => $("breakdown-dialog").close()
);

/* =====================================================
   FINANCE SUMMARY
   ===================================================== */

function renderFinanceSummary() {
  setText(
    "finance-earnings",
    displayTotal("amount")
  );

  const tracked = activeBookings().filter(
    (booking) =>
      outstandingBalance(booking) !== null
  );

  const received = tracked.reduce(
    (sum, booking) =>
      sum + (amountReceived(booking) || 0),
    0
  );

  const remaining = tracked.reduce(
    (sum, booking) =>
      sum + outstandingBalance(booking),
    0
  );

  const untrackedCount =
    activeBookings().length - tracked.length;

  setText(
    "finance-received",
    tracked.length
      ? `${money(received)}${untrackedCount ? " *" : ""}`
      : "—"
  );

  setText(
    "finance-remaining",
    tracked.length
      ? `${money(remaining)}${untrackedCount ? " *" : ""}`
      : "—"
  );

  // No expenses table is connected yet.
  setText(
    "finance-expenses",
    t("notConfigured")
  );
}


/* =====================================================
   REMAINING PAYMENTS
   ===================================================== */

function renderRemainingPayments() {
  const tbody = $("remaining-payments-body");
  if (!tbody) return;

  tbody.replaceChildren();

  const unpaid = activeBookings().filter(
    (booking) => outstandingBalance(booking) > 0
  );

  const totalRemaining = unpaid.reduce(
    (sum, booking) =>
      sum + outstandingBalance(booking),
    0
  );

  setText(
    "remaining-total",
    money(totalRemaining)
  );

  if (!unpaid.length) {
    const row = createElement("tr");
    const cell = createElement(
      "td",
      "",
      t("noRemaining")
    );

    cell.colSpan = 5;
    row.append(cell);
    tbody.append(row);
    return;
  }

  unpaid.forEach((booking) => {
    const row = createElement("tr");

    [
      booking.guest_name || "—",
      money(booking.guest_total),
      money(booking.original_guest_payment),
      money(outstandingBalance(booking))
    ].forEach((value) => {
      row.append(createElement("td", "", value));
    });

    const cell = createElement("td");

    const button = createElement(
      "button",
      "",
      t("recordPayment")
    );

    button.type = "button";

    button.addEventListener("click", () => {
      openPaymentDialog(booking);
    });

    cell.append(button);
    row.append(cell);
    tbody.append(row);
  });
}

/* =====================================================
   EARNINGS DETAILS
   ===================================================== */

function showEarningsDetails() {
  const dialog = $("earnings-dialog");
  const content = $("earnings-breakdown-content");

  if (!dialog || !content) return;

  content.replaceChildren();

  const records = activeBookings();
  const groups = new Map();

  records.forEach((booking) => {
    const platform = booking.platform || "Other";

    if (!groups.has(platform)) {
      groups.set(platform, {
        total: 0,
        count: 0,
        missing: 0
      });
    }

    const group = groups.get(platform);
    const amount = safeNumber(booking.amount);

    group.count++;

    if (amount === null) {
      group.missing++;
    } else {
      group.total += amount;
    }
  });

  const addLine = (label, value) => {
    const row = createElement(
      "div",
      "breakdown-row"
    );

    row.append(
      createElement("span", "", label),
      createElement("strong", "", value)
    );

    content.append(row);
  };

  [...groups.entries()].forEach(
    ([platform, group]) => {
      addLine(
        `${platform} (${group.count})`,
        `${money(group.total)}${group.missing ? " *" : ""}`
      );
    }
  );

  addLine(
    t("hostTotal"),
    displayTotal("amount")
  );

  dialog.showModal();
}

$("earnings-card")?.addEventListener(
  "click",
  showEarningsDetails
);

$("earnings-card")?.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      showEarningsDetails();
    }
  }
);

$("close-earnings-dialog")?.addEventListener(
  "click",
  () => $("earnings-dialog").close()
);


/* =====================================================
   MONTHLY REPORTS
   ===================================================== */

// Earnings are allocated across the nights of a stay.
// Example: a stay crossing October and November
// contributes to both months.
//
// This is estimated earned revenue, NOT cash received.
// Actual monthly cash flow needs payment timestamps.

function bookingNights(booking) {
  const start = parseDate(booking.check_in);
  const end = parseDate(booking.check_out);

  if (!start || !end || end <= start) return 0;

  return Math.round(
    (Date.UTC(
      end.getFullYear(),
      end.getMonth(),
      end.getDate()
    ) -
      Date.UTC(
        start.getFullYear(),
        start.getMonth(),
        start.getDate()
      )) /
      86400000
  );
}

function monthlyEarningsMap() {
  const totals = new Map();

  activeBookings().forEach((booking) => {
    const earnings = safeNumber(booking.amount);
    const nights = bookingNights(booking);

    if (earnings === null || nights <= 0) return;

    const start = parseDate(booking.check_in);
    const perNight = earnings / nights;

    for (let day = 0; day < nights; day++) {
      const night = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate() + day
      );

      const key = `${night.getFullYear()}-${String(
        night.getMonth() + 1
      ).padStart(2, "0")}`;

      totals.set(
        key,
        (totals.get(key) || 0) + perNight
      );
    }
  });

  return totals;
}

function monthlyOccupancy(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);

  if (!year || !month) return null;

  const days = new Date(year, month, 0).getDate();
  let occupied = 0;

  for (let day = 1; day <= days; day++) {
    const date = dateString(
      new Date(year, month - 1, day)
    );

    if (
      activeBookings().some(
        (booking) =>
          booking.check_in <= date &&
          booking.check_out > date
      )
    ) {
      occupied++;
    }
  }

  return Math.round((occupied / days) * 100);
}

function reportMonthOptions() {
  const select = $("report-month");
  if (!select) return;

  const map = monthlyEarningsMap();
  const now = new Date();

  const currentKey = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  const months = new Set([
    ...map.keys(),
    currentKey
  ]);

  const sorted = [...months].sort().reverse();

  if (
    !selectedReportMonth ||
    !months.has(selectedReportMonth)
  ) {
    selectedReportMonth = currentKey;
  }

  select.replaceChildren();

  sorted.forEach((key) => {
    const [year, month] = key.split("-").map(Number);

    const option = createElement(
      "option",
      "",
      `${monthName(month - 1)} ${year}`
    );

    option.value = key;
    select.append(option);
  });

  select.value = selectedReportMonth;
}

function renderReports() {
  reportMonthOptions();

  const earnings = monthlyEarningsMap();

  const monthly =
    earnings.get(selectedReportMonth) || 0;

  setText(
    "monthly-earnings",
    money(monthly)
  );

  // No expense data exists yet, so profit is unknown.
  setText(
    "monthly-expenses",
    t("notConfigured")
  );

  setText(
    "monthly-profit",
    "—"
  );

  const occupancy = monthlyOccupancy(
    selectedReportMonth
  );

  setText(
    "monthly-occupancy",
    occupancy === null ? "—" : `${occupancy}%`
  );

  renderEarningsChart(earnings);
  renderPlatformChart();
}

$("report-month")?.addEventListener(
  "change",
  (event) => {
    selectedReportMonth = event.target.value;
    renderReports();
  }
);

/* =====================================================
   SIMPLE CHARTS — NO EXTRA LIBRARY NEEDED
   ===================================================== */

function renderEarningsChart(earningsMap) {
  const container = $("monthly-earnings-chart");
  if (!container) return;

  container.dir = "ltr";

  container.replaceChildren();

  const entries = [...earningsMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12);

  if (!entries.length) {
    container.append(
      createElement("p", "", t("noChartData"))
    );
    return;
  }

  const max = Math.max(
    ...entries.map(([, amount]) => amount),
    1
  );

  const chart = createElement("div");
  chart.style.display = "flex";
  chart.style.alignItems = "flex-end";
  chart.style.justifyContent = "space-around";
  chart.style.gap = "12px";
  chart.style.minHeight = "240px";
  chart.style.overflowX = "auto";

  entries.forEach(([key, amount]) => {
    const [year, month] = key.split("-").map(Number);

    const group = createElement("div");
    group.style.flex = "1 0 52px";
    group.style.minWidth = "52px";
    group.style.textAlign = "center";

    const amountLabel = createElement(
      "div",
      "",
      Math.round(amount).toLocaleString("en-US")
    );

    amountLabel.style.fontSize = "11px";
    amountLabel.style.marginBottom = "8px";
    amountLabel.style.fontWeight = "600";

    const bar = createElement(
      "div",
      "chart-bar"
    );

    bar.style.height = `${Math.max(
      3,
      (amount / max) * 160
    )}px`;

    bar.style.width = "70%";
    bar.style.margin = "0 auto";
    bar.title = money(amount);

    const label = createElement(
      "div",
      "chart-label",
   `${new Date(year, month - 1, 1).toLocaleString("en-US", {
  month: "short"
})} ${String(year).slice(-2)}`
    );

    label.style.marginTop = "8px";

    group.append(amountLabel, bar, label);
    chart.append(group);
  });

  container.append(chart);
}

function renderPlatformChart() {
  const container = $("platform-chart");
  if (!container) return;

  container.replaceChildren();

  const counts = new Map();

  activeBookings().forEach((booking) => {
    const platform = booking.platform || "Other";

    counts.set(
      platform,
      (counts.get(platform) || 0) + 1
    );
  });

  if (!counts.size) {
    container.append(
      createElement("p", "", t("noChartData"))
    );
    return;
  }

  const total = [...counts.values()].reduce(
    (sum, count) => sum + count,
    0
  );

  const colors = [
    "#4b5130",
    "#b69a65",
    "#7c8a64",
    "#9c8063",
    "#697d75"
  ];

  [...counts.entries()].forEach(
    ([platform, count], index) => {
      const wrapper = createElement("div");
      wrapper.style.marginBottom = "22px";

      const heading = createElement("div");
      heading.style.display = "flex";
      heading.style.justifyContent = "space-between";
      heading.style.gap = "10px";
      heading.style.marginBottom = "7px";

      heading.append(
        createElement("strong", "", platform),
        createElement(
          "span",
          "",
          `${count} (${Math.round(
            (count / total) * 100
          )}%)`
        )
      );

      const track = createElement("div");
      track.style.height = "13px";
      track.style.background = "#e7e5dc";
      track.style.borderRadius = "999px";
      track.style.overflow = "hidden";

      const fill = createElement("div");
      fill.style.width = `${(count / total) * 100}%`;
      fill.style.height = "100%";
      fill.style.background =
        colors[index % colors.length];

      track.append(fill);
      wrapper.append(heading, track);
      container.append(wrapper);
    }
  );
}


/* =====================================================
   ADD MANUAL BOOKING
   ===================================================== */

function openBookingDialog() {
  if (!bookingsLoaded) {
    showMessage(t("refreshNeeded"), true);
    return;
  }

  const form = $("add-booking-form");
  form.reset();

  setText("manual-booking-message", "");
  setText("manual-balance-preview", "");

  $("manual-commission").value = "0";
  $("manual-received").value = "0";

  updateBalancePreview();
  $("add-booking-dialog").showModal();
}

$("open-add-booking")?.addEventListener(
  "click",
  openBookingDialog
);

$("quick-add-booking")?.addEventListener(
  "click",
  openBookingDialog
);

$("close-add-booking")?.addEventListener(
  "click",
  () => $("add-booking-dialog").close()
);

function updateBalancePreview() {
  const total = safeNumber($("manual-total").value);
  const received = safeNumber(
    $("manual-received").value
  );

  if (total === null || received === null) {
    setText("manual-balance-preview", "");
    return;
  }

  const remaining = Math.max(
    0,
    cents(total) - cents(received)
  ) / 100;

  setText(
    "manual-balance-preview",
    `${t("remainingBalance")}: ${money(remaining)}`
  );
}

["manual-total", "manual-received"].forEach((id) => {
  $(id)?.addEventListener(
    "input",
    updateBalancePreview
  );
});

$("add-booking-form")?.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();

    if (savingManualBooking) return;

    const guest = $("manual-guest").value.trim();
    const platform = $("manual-platform").value;
    const code = $("manual-code").value.trim();
    const checkIn = $("manual-check-in").value;
    const checkOut = $("manual-check-out").value;

    const total = Number($("manual-total").value);
    const commission = Number(
      $("manual-commission").value
    );
    const received = Number(
      $("manual-received").value
    );

    const notes = $("manual-notes").value.trim();
    const message = $("manual-booking-message");

    message.textContent = "";

    if (!bookingsLoaded) {
      message.textContent = t("refreshNeeded");
      return;
    }

    if (
      !guest ||
      !parseDate(checkIn) ||
      !parseDate(checkOut) ||
      checkOut <= checkIn
    ) {
      message.textContent = t("invalidDates");
      return;
    }

    if (
      !Number.isFinite(total) ||
      !Number.isFinite(commission) ||
      !Number.isFinite(received) ||
      total < 0 ||
      commission < 0 ||
      received < 0 ||
      cents(commission) > cents(total) ||
      cents(received) > cents(total)
    ) {
      message.textContent = t("invalidAmounts");
      return;
    }

    const conflict = activeBookings().some(
      (booking) =>
        overlaps(
          checkIn,
          checkOut,
          booking.check_in,
          booking.check_out
        )
    );

    if (conflict) {
      message.textContent = t("bookingConflict");
      return;
    }

    if (code) {
      const duplicate = bookings.some(
        (booking) =>
          String(booking.platform || "")
            .toLowerCase() === platform.toLowerCase() &&
          String(booking.confirmation_code || "")
            .toLowerCase() === code.toLowerCase()
      );

      if (duplicate) {
        message.textContent = t("duplicateCode");
        return;
      }
    }

    const booking = {
      guest_name: guest,
      platform,
      confirmation_code: code || null,
      check_in: checkIn,
      check_out: checkOut,
      status: "confirmed",

      original_price: total,
      discount_amount: 0,
      accommodation_total: total,
      guest_total: total,

      original_guest_payment: received,
      platform_commission: commission,
      occupancy_tax: 0,
      other_fees: 0,

      amount:
        (cents(total) - cents(commission)) / 100,

      financial_status:
        cents(received) >= cents(total)
          ? "paid"
          : cents(received) === 0
            ? "unpaid"
            : "partially_paid",

      notes: notes || null
    };

    savingManualBooking = true;

    const saveButton = $("save-manual-booking");
    saveButton.disabled = true;
    saveButton.textContent = t("saving");

    try {
      const { data: authData, error: authError } =
        await supabaseClient.auth.getUser();

      if (authError || !authData.user) {
        throw new Error(t("sessionExpired"));
      }

      const { error } = await supabaseClient
        .from("Bookings")
        .insert(booking);

      if (error) throw error;

      $("add-booking-dialog").close();

      await loadBookings();

      if (bookingsLoaded) {
        showMessage(t("bookingSaved"));
        switchTab("bookings");
      }
    } catch (error) {
      message.textContent =
        t("saveError") + error.message;
    } finally {
      savingManualBooking = false;
      saveButton.disabled = false;
      saveButton.textContent = t("saveBooking");
    }
  }
);


/* =====================================================
   RECORD ADDITIONAL PAYMENT
   ===================================================== */

function openPaymentDialog(booking) {
  const balance = outstandingBalance(booking);

  if (balance === null || balance <= 0) {
    showMessage(t("missingPayment"), true);
    return;
  }

  selectedPaymentBooking = booking;

  setText(
    "payment-guest",
    booking.guest_name || "—"
  );

  setText(
    "payment-balance",
    money(balance)
  );

  setText("payment-message", "");

  $("record-payment-form").reset();
  $("new-payment-amount").max = balance.toFixed(2);

  $("record-payment-dialog").showModal();
}

$("close-payment-dialog")?.addEventListener(
  "click",
  () => $("record-payment-dialog").close()
);

$("record-payment-form")?.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();

    if (savingPayment || !selectedPaymentBooking) {
      return;
    }

    const booking = selectedPaymentBooking;
    const balance = outstandingBalance(booking);

    const payment = Number(
      $("new-payment-amount").value
    );

    const message = $("payment-message");
    message.textContent = "";

    if (
      balance === null ||
      !Number.isFinite(payment) ||
      cents(payment) <= 0
    ) {
      message.textContent = t("invalidAmounts");
      return;
    }

    if (cents(payment) > cents(balance)) {
      message.textContent = t("paymentTooLarge");
      return;
    }

    const previous = amountReceived(booking);
    const total = safeNumber(booking.guest_total);

    if (previous === null || total === null) {
      message.textContent = t("missingPayment");
      return;
    }

    const newReceived =
      (cents(previous) + cents(payment)) / 100;

    savingPayment = true;

    const saveButton = $("save-payment");
    saveButton.disabled = true;
    saveButton.textContent = t("saving");

    try {
      const { data: authData, error: authError } =
        await supabaseClient.auth.getUser();

      if (authError || !authData.user) {
        throw new Error(t("sessionExpired"));
      }

      const { data, error } = await supabaseClient
        .from("Bookings")
        .update({
          original_guest_payment: newReceived,
          financial_status:
            cents(newReceived) >= cents(total)
              ? "paid"
              : "partially_paid"
        })
        .eq("id", booking.id)
        .eq("original_guest_payment", previous)
        .select("id");

      if (error) throw error;

      if (!data || data.length !== 1) {
        throw new Error(t("stalePayment"));
      }

      selectedPaymentBooking = null;
      $("record-payment-dialog").close();

      await loadBookings();

      if (bookingsLoaded) {
        showMessage(t("paymentSaved"));
        switchTab("finances");
      }
    } catch (error) {
      message.textContent =
        t("saveError") + error.message;
    } finally {
      savingPayment = false;
      saveButton.disabled = false;
      saveButton.textContent = t("savePayment");
    }
  }
);

/* =====================================================
   EXPENSES — RESERVED FOR NEXT DEVELOPMENT STEP
   ===================================================== */

// Expense saving is intentionally disabled until
// the Supabase Expenses table and security policies
// are created.
//
// Do not store expense records only in localStorage:
// family members need shared, reliable data.


$("open-add-expense")?.addEventListener("click", () => {
  $("expense-message").textContent = "";
  $("add-expense-form").reset();
  $("expense-date").value = dateString(new Date());
  $("add-expense-dialog").showModal();
});


$("add-expense-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const button = $("save-expense");
  const message = $("expense-message");

  const expense = {
    expense_date: $("expense-date").value,
    category: $("expense-category").value,
    description: $("expense-description").value.trim() || null,
    amount: Number($("expense-amount").value)
  };

  if (
    !expense.expense_date ||
    !expense.category ||
    !Number.isFinite(expense.amount) ||
    expense.amount <= 0
  ) {
    message.textContent = "Please enter valid expense details.";
    return;
  }

  button.disabled = true;
  message.textContent = "";

  try {
    const { error } = await supabaseClient
      .from("Expenses")
      .insert(expense);

    if (error) throw error;

   $("add-expense-dialog").close();
await loadExpenses();
showMessage(
  currentLanguage === "ar"
    ? "تم حفظ المصروف بنجاح"
    : "Expense saved successfully!"
);
  } catch (error) {
    message.textContent = error.message;
  } finally {
    button.disabled = false;
  }
});

$("close-expense-dialog")?.addEventListener(
  "click",
  () => $("add-expense-dialog").close()
);

/* =====================================================
   LANGUAGE SWITCHING
   ===================================================== */

   
/* =====================================================
   LANGUAGE HELPERS
   ===================================================== */


function setLabelForInput(inputId, labelText) {
  const input = $(inputId);
  if (!input) return;

  const label = input.closest("label");
  if (!label) return;

  const labelSpan = label.querySelector("span");

  if (labelSpan) {
    labelSpan.textContent = labelText;
    return;
  }

  Array.from(label.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent = "";
    }
  });

  label.insertBefore(
    document.createTextNode(labelText + " "),
    label.firstChild
  );
}

function translateSectionHeader(section, title, desc) {
  if (!section) return;

  const header = section.querySelector(
    ":scope > .section-header"
  );

  if (!header) return;

  const heading = header.querySelector("h2");
  const paragraph = header.querySelector("p");

  if (heading) heading.textContent = t(title);
  if (paragraph) paragraph.textContent = t(desc);
}

function translatePanel(panelId, title, desc) {
  const panel = $(panelId);
  if (!panel) return;

  const header = panel.querySelector(
    ":scope > .section-header"
  );

  if (!header) return;

  const heading = header.querySelector("h2");
  const paragraph = header.querySelector("p");

  if (heading) heading.textContent = t(title);
  if (paragraph) paragraph.textContent = t(desc);
}

function translateTableHeadings(tbodyId, keys) {
  const tbody = $(tbodyId);
  if (!tbody) return;

  const table = tbody.closest("table");
  if (!table) return;

  const headings = table.querySelectorAll("thead th");

  keys.forEach((key, index) => {
    if (headings[index]) {
      headings[index].textContent = t(key);
    }
  });
}

/* =====================================================
   SWITCH LANGUAGE
   ===================================================== */

function setLanguage(language) {
  currentLanguage = language === "ar" ? "ar" : "en";

  localStorage.setItem(
    "osAdminLanguage",
    currentLanguage
  );

 document.documentElement.style.fontVariantNumeric = "lining-nums";
  document.documentElement.dir =
    currentLanguage === "ar" ? "rtl" : "ltr";

  setText("language-toggle", t("language"));

  const loginTitle = document.querySelector(
    ".login-card h1"
  );

  const loginSubtitle = document.querySelector(
    ".login-card > p"
  );

  if (loginTitle) loginTitle.textContent = "OS Apartments";

  if (loginSubtitle) {
    loginSubtitle.textContent = t("management");
  }

  const brandSubtitle = document.querySelector(
    ".brand p"
  );

  if (brandSubtitle) {
    brandSubtitle.textContent = t("management");
  }

  setLabelForInput("email", t("email"));
  setLabelForInput("password", t("password"));

  const loginButton = document.querySelector(
    '#login-form button[type="submit"]'
  );

  if (loginButton) loginButton.textContent = t("login");

  setButtonText("logout-btn", t("logout"));
  setButtonText("open-add-booking", t("addBooking"));
  setButtonText("quick-add-booking", t("addBooking"));
  setButtonText("quick-view-bookings", t("viewBookings"));
  setButtonText("quick-view-finances", t("viewFinances"));
  setButtonText("refresh-bookings-btn", t("refresh"));

  const tabKeys = {
    overview: "overview",
    bookings: "bookingsTab",
    finances: "finances",
    reports: "reports"
  };

  document.querySelectorAll(".tab-btn").forEach(
    (button) => {
      button.textContent = t(
        tabKeys[button.dataset.tab]
      );
    }
  );

  translateSectionHeader(
    $("tab-overview"),
    "overview",
    "overviewDesc"
  );

  translateSectionHeader(
    $("tab-bookings"),
    "bookingsTab",
    "bookingsDesc"
  );

  translateSectionHeader(
    $("tab-finances"),
    "finances",
    "financesDesc"
  );

  translateSectionHeader(
    $("tab-reports"),
    "reports",
    "reportsDesc"
  );

  const overviewCards = document.querySelectorAll(
    "#tab-overview .stats-grid .stat-card"
  );

  [
    "totalBookings",
    "upcomingBookings",
    "guestTotals",
    "hostEarnings"
  ].forEach((key, index) => {
    const span = overviewCards[index]?.querySelector(
      "span"
    );

    if (span) span.textContent = t(key);
  });

  const earningsHint = $("earnings-card")?.querySelector(
    "small"
  );

  if (earningsHint) {
    earningsHint.textContent = t("viewDetails");
  }

  translatePanel(
    "today-panel",
    "today",
    "todayDesc"
  );

  
const quickActionsPanel = $("quick-actions-panel");

if (quickActionsPanel) {
  const description = quickActionsPanel.querySelector(
    ".section-header p"
  );

  if (description) {
    description.remove();
  }

  const heading = quickActionsPanel.querySelector(
    ".section-header h2"
  );

  if (heading) {
    heading.textContent = t("quickActions");
  }
}


  const todayLabels = document.querySelectorAll(
    ".today-card span"
  );

  ["arriving", "departing", "staying"].forEach(
    (key, index) => {
      if (todayLabels[index]) {
        todayLabels[index].textContent = t(key);
      }
    }
  );

  const bookingPanels = document.querySelectorAll(
    "#tab-bookings > .panel"
  );

  [
    ["calendar", "calendarDesc"],
    ["allBookings", "allBookingsDesc"]
  ].forEach(([title, desc], index) => {
    const header = bookingPanels[index]?.querySelector(
      ".section-header"
    );

    if (!header) return;

    const h2 = header.querySelector("h2");
    const p = header.querySelector("p");

    if (h2) h2.textContent = t(title);
    if (p) p.textContent = t(desc);
  });

  const legend = document.querySelectorAll(
    ".calendar-legend span"
  );

  if (legend[0]) {
    legend[0].textContent = t("confirmed");
  }

  if (legend[1]) {
    legend[1].textContent = t("available");
  }

  const weekdays = document.querySelectorAll(
    ".calendar-weekdays span"
  );

  [
    "sun", "mon", "tue", "wed",
    "thu", "fri", "sat"
  ].forEach((key, index) => {
    if (weekdays[index]) {
      weekdays[index].textContent = t(key);
    }
  });

  translateTableHeadings(
    "bookings-table-body",
    [
      "guest",
      "platform",
      "checkIn",
      "checkOut",
      "status",
      "earnings",
      "details"
    ]
  );

  const financeCards = document.querySelectorAll(
    "#tab-finances > .finance-grid .stat-card"
  );

  [
    "estimatedEarnings",
    "paymentsReceived",
    "paymentsRemaining",
    "recordedExpenses"
  ].forEach((key, index) => {
    const span = financeCards[index]?.querySelector(
      "span"
    );

    if (span) span.textContent = t(key);
  });

  setText("remaining-title", t("remainingTitle"));
  setText("remaining-description", t("remainingDesc"));

  [
    ["remaining-guest-heading", "guest"],
    ["remaining-total-heading", "total"],
    ["remaining-paid-heading", "received"],
    ["remaining-due-heading", "remaining"],
    ["remaining-action-heading", "action"]
  ].forEach(([id, key]) => {
    setText(id, t(key));
  });

  translatePanel(
    "expenses-panel",
    "expenses",
    "expensesDesc"
  );

  setText("open-add-expense", t("addExpense"));
  setText("expenses-message", t("expensesSetup"));

  translateTableHeadings(
    "expenses-table-body",
    [
      "dates",
      "expenses",
      "notes",
      "total"
    ]
  );

  const reportPanels = document.querySelectorAll(
    "#tab-reports > .panel"
  );

  [
    ["monthlyPerformance", "monthlyDesc"],
    ["earningsChart", "earningsChartDesc"],
    ["platformChart", "platformChartDesc"]
  ].forEach(([title, desc], index) => {
    const header = reportPanels[index]?.querySelector(
      ".section-header"
    );

    if (!header) return;

    const h2 = header.querySelector("h2");
    const p = header.querySelector("p");

    if (h2) h2.textContent = t(title);
    if (p) p.textContent = t(desc);
  });

  const monthlyCards = document.querySelectorAll(
    "#tab-reports .finance-grid .stat-card"
  );

  [
    "monthlyEarnings",
    "monthlyExpenses",
    "estimatedProfit",
    "occupancy"
  ].forEach((key, index) => {
    const span = monthlyCards[index]?.querySelector(
      "span"
    );

    if (span) span.textContent = t(key);
  });

  const addBookingHeading = document.querySelector(
    "#add-booking-dialog .dialog-header h2"
  );

  if (addBookingHeading) {
    addBookingHeading.textContent = t("addBooking");
  }

  [
    ["manual-guest", "guestName"],
    ["manual-platform", "platform"],
    ["manual-code", "confirmationCode"],
    ["manual-check-in", "checkIn"],
    ["manual-check-out", "checkOut"],
    ["manual-total", "bookingAmount"],
    ["manual-commission", "commission"],
    ["manual-received", "amountReceived"],
    ["manual-notes", "notes"],
    ["new-payment-amount", "paymentAmount"]
  ].forEach(([id, key]) => {
    setLabelForInput(id, t(key));
  });

  setText("save-manual-booking", t("saveBooking"));
  setText("save-payment", t("savePayment"));
  setText("close-breakdown-bottom", t("close"));

  const paymentHeading = document.querySelector(
    "#record-payment-dialog .dialog-header h2"
  );

  if (paymentHeading) {
    paymentHeading.textContent = t("recordPayment");
  }

  const earningsHeading = document.querySelector(
    "#earnings-dialog .dialog-header h2"
  );

  if (earningsHeading) {
    earningsHeading.textContent = t("hostEarnings");
  }

  renderEverything();
}

/* =====================================================
   FAMILY AUTHENTICATION / ACCOUNT RECOVERY
   ===================================================== */

   
const AUTH_REDIRECT = "https://ohoudm.github.io/OS-Apartments/admin.html";

let recoveryMode =
  new URLSearchParams(location.hash.slice(1)).get("type") === "recovery" ||
  new URLSearchParams(location.search).get("type") === "recovery";

let authVersion = 0;

const authWords = {
  en: {
    portal: "Property Management Dashboard",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    create: "Create Account",
    forgot: "Forgot Password?",
    confirm: "Confirm Password",
    back: "Back to Sign In",
    reset: "Reset Password",
    resetHelp: "Enter your email address to receive a password reset link.",
    sendLink: "Send Reset Link",
    choose: "Choose New Password",
    newPassword: "New Password",
    confirmNew: "Confirm New Password",
    saveNew: "Save New Password",
    waiting: "Waiting for Approval",
    waitingHelp: "Your account is registered. A family administrator must approve your access before you can view bookings.",
    check: "Check Approval",
    mismatch: "Passwords do not match.",
    short: "Password must contain at least 8 characters.",
    sent: "Check your email for the confirmation link. Family approval is required before accessing bookings.",
    resetSent: "If the address is registered, a reset link will be sent. Check your inbox and spam folder.",
    saved: "Password updated. Please sign in.",
    pending: "Your account is waiting for family approval.",
    checkFailed: "Could not check your account status. Try again.",
    show: "Show password",
    hide: "Hide password",
    expenseNotice: "Expense tracking will be available after setup.",
    cleaning: "Cleaning",
    maintenance: "Maintenance",
    utilities: "Utilities",
    supplies: "Supplies",
    other: "Other"
  },
  ar: {
    portal: "لوحة إدارة الشقق",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    signIn: "تسجيل الدخول",
    create: "إنشاء حساب",
    forgot: "نسيت كلمة المرور؟",
    confirm: "تأكيد كلمة المرور",
    back: "العودة لتسجيل الدخول",
    reset: "إعادة تعيين كلمة المرور",
    resetHelp: "أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور.",
    sendLink: "إرسال رابط الاستعادة",
    choose: "اختيار كلمة مرور جديدة",
    newPassword: "كلمة المرور الجديدة",
    confirmNew: "تأكيد كلمة المرور الجديدة",
    saveNew: "حفظ كلمة المرور الجديدة",
    waiting: "بانتظار الموافقة",
    waitingHelp: "تم تسجيل حسابك. يجب أن يوافق مسؤول العائلة على وصولك قبل الاطلاع على الحجوزات.",
    check: "التحقق من الموافقة",
    mismatch: "كلمتا المرور غير متطابقتين.",
    short: "يجب أن تتكون كلمة المرور من ٨ أحرف على الأقل.",
    sent: "تحقق من بريدك الإلكتروني لتأكيد الحساب. يجب انتظار موافقة العائلة قبل الوصول للحجوزات.",
    resetSent: "إذا كان البريد مسجلاً، سيصلك رابط الاستعادة. تحقق من البريد الوارد وغير المرغوب فيه.",
    saved: "تم تحديث كلمة المرور. يرجى تسجيل الدخول.",
    pending: "حسابك بانتظار موافقة مسؤول العائلة.",
    checkFailed: "تعذر التحقق من حالة الحساب. حاول مرة أخرى.",
    show: "إظهار كلمة المرور",
    hide: "إخفاء كلمة المرور",
    expenseNotice: "سيتم تفعيل تسجيل المصاريف بعد الإعداد.",
    cleaning: "تنظيف",
    maintenance: "صيانة",
    utilities: "فواتير",
    supplies: "مستلزمات",
    other: "أخرى"
  }
};

const authText = key =>
  authWords[currentLanguage][key] || key;

const extraLabels = {
  en: {
    todayOverview: "Today's Overview",
    arrivingToday: "Arriving Today",
    departingToday: "Departing Today",
    currentlyStaying: "Currently Staying",
    quickActionsDesc: "Common tasks for your family",
    bookingCalendar: "Booking Calendar",
    bookingsTableDesc: "View reservations and payment details",
    apartmentExpenses: "Apartment Expenses",
    monthlyPerformanceDesc: "Estimated earnings, expenses and profit",
    occupancyRate: "Occupancy Rate",
    earningsByMonth: "Earnings by Month",
    earningsByMonthDesc: "Compare your apartment's monthly performance",
    bookingsByPlatform: "Bookings by Platform",
    bookingsByPlatformDesc: "See where your reservations come from",
    addBookingTitle: "Add Booking",
    totalBookingAmount: "Total Booking Amount (SAR)",
    amountSAR: "Amount (SAR)",
    addExpenseTitle: "Add Expense",
    saveExpense: "Save Expense",
    date: "Date",
    category: "Category",
    description: "Description",
    amount: "Amount",
    confirmPassword: "Confirm Password",
    confirmNewPassword: "Confirm New Password",
    resetPassword: "Reset Password",
    forgotDescription: "Enter your email address to receive a password reset link.",
    sendResetLink: "Send Reset Link",
    chooseNewPassword: "Choose New Password",
    saveNewPassword: "Save New Password",
    pendingTitle: "Waiting for Approval",
    pendingDescription: "Your account is registered. A family administrator must approve your access before you can view bookings.",
    checkApproval: "Check Approval",
    backToLogin: "Back to Sign In",
    createAccount: "Create Account",
    forgotPassword: "Forgot Password?",
    newPassword: "New Password",
    monthlyPerformance: "Monthly Performance",
    bookingsByPlatform: "Bookings by Platform",
    addExpense: "+ Add Expense",
    recordPayment: "Record Payment",
    remainingBalance: "Remaining Balance:",
    paymentAmount: "Payment Amount (SAR)",
    guestName: "Guest Name",
    amountReceived: "Amount Received (SAR)",
    platformCommission: "Platform Commission (SAR)"
  },
  ar: {
    todayOverview: "ملخص اليوم",
    arrivingToday: "الوصول اليوم",
    departingToday: "المغادرة اليوم",
    currentlyStaying: "المقيمون حالياً",
    quickActionsDesc: "المهام الشائعة للعائلة",
    bookingCalendar: "تقويم الحجوزات",
    bookingsTableDesc: "عرض الحجوزات وتفاصيل المدفوعات",
    apartmentExpenses: "مصاريف الشقة",
    monthlyPerformanceDesc: "الأرباح والمصاريف والربح التقديري",
    occupancyRate: "نسبة الإشغال",
    earningsByMonth: "الأرباح حسب الشهر",
    earningsByMonthDesc: "مقارنة الأداء الشهري للشقة",
    bookingsByPlatform: "الحجوزات حسب المنصة",
    bookingsByPlatformDesc: "تعرف على مصادر الحجوزات",
    addBookingTitle: "إضافة حجز",
    totalBookingAmount: "إجمالي مبلغ الحجز (ريال)",
    amountSAR: "المبلغ (ريال)",
    addExpenseTitle: "إضافة مصروف",
    saveExpense: "حفظ المصروف",
    date: "التاريخ",
    category: "الفئة",
    description: "الوصف",
    amount: "المبلغ",
    confirmPassword: "تأكيد كلمة المرور",
    confirmNewPassword: "تأكيد كلمة المرور الجديدة",
    resetPassword: "إعادة تعيين كلمة المرور",
    forgotDescription: "أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور.",
    sendResetLink: "إرسال رابط الاستعادة",
    chooseNewPassword: "اختيار كلمة مرور جديدة",
    saveNewPassword: "حفظ كلمة المرور الجديدة",
    pendingTitle: "بانتظار الموافقة",
    pendingDescription: "تم تسجيل حسابك. يجب أن يوافق مسؤول العائلة على وصولك قبل الاطلاع على الحجوزات.",
    checkApproval: "التحقق من الموافقة",
    backToLogin: "العودة لتسجيل الدخول",
    createAccount: "إنشاء حساب",
    forgotPassword: "نسيت كلمة المرور؟",
    newPassword: "كلمة المرور الجديدة",
    monthlyPerformance: "الأداء الشهري",
    addExpense: "+ إضافة مصروف",
    recordPayment: "تسجيل دفعة",
    remainingBalance: "المبلغ المتبقي:",
    paymentAmount: "مبلغ الدفعة (ريال)",
    guestName: "اسم الضيف",
    amountReceived: "المبلغ المستلم (ريال)",
    platformCommission: "عمولة المنصة (ريال)"
  }
};

function translateNewUI() {
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.dataset.i18n;
    const value =
      extraLabels[currentLanguage][key] ||
      authWords[currentLanguage][key] ||
      translations[currentLanguage][key];

    if (value) element.textContent = value;
  });

  setText("portal-subtitle", authText("portal"));
  setText(
    "auth-language-toggle",
    currentLanguage === "ar" ? "English" : "العربية"
  );

  const selectors = {
    '#login-form label[for="email"]': "email",
    '#login-form label[for="password"]': "password",
    '#signup-form label[for="signup-email"]': "email",
    '#signup-form label[for="signup-password"]': "password",
    '#signup-form label[for="signup-confirm"]': "confirm",
    '#forgot-form label[for="forgot-email"]': "email",
    '#reset-form label[for="reset-password"]': "newPassword",
    '#reset-form label[for="reset-confirm"]': "confirmNew",
    "#forgot-form > p": "resetHelp",
    "#pending-approval > p[data-i18n]": "waitingHelp"
  };

  for (const [selector, key] of Object.entries(selectors)) {
    const el = document.querySelector(selector);
    if (el) el.textContent = authText(key);
  }

  const expenseSelect = $("expense-category");
  const expenseKeys = {
    Cleaning: "cleaning",
    Maintenance: "maintenance",
    Utilities: "utilities",
    Supplies: "supplies",
    Other: "other"
  };

  if (expenseSelect) {
    for (const opt of expenseSelect.options) {
      if (expenseKeys[opt.value]) {
        opt.textContent = authText(expenseKeys[opt.value]);
      }
    }
  }

  setText("expenses-message", authText("expenseNotice"));

  document.querySelectorAll(".password-toggle").forEach(button => {
    const input = $(button.dataset.target);

    button.setAttribute(
      "aria-label",
      authText(input?.type === "text" ? "hide" : "show")
    );
  });
}

const originalSetLanguage = setLanguage;

setLanguage = function(language) {
  originalSetLanguage(language);
  translateNewUI();
};

/* =====================================================
   AUTHENTICATION VIEWS
   ===================================================== */

function showAuthView(id) {
  [
    "login-form",
    "signup-form",
    "forgot-form",
    "reset-form",
    "pending-approval"
  ].forEach(name => {
    const el = $(name);
    if (el) el.hidden = name !== id;
  });

  $("login-section").hidden = false;
  $("dashboard-section").hidden = true;
}

function showLogin() {
  authVersion++;
  bookings = [];
  bookingsLoaded = false;
  selectedPaymentBooking = null;

  showAuthView("login-form");
}


async function approvedFamily(user) {
  const { data, error } = await supabaseClient
    .from("family_members")
    .select("approved")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Family approval check failed:", error);
    throw error;
  }

  console.log("Family approval diagnostic:", {
    recordFound: data !== null,
    approved: data?.approved,
    isApproved: data?.approved === true
  });

  return data?.approved === true;
}


async function showDashboard() {
  const request = ++authVersion;

  const { data, error } =
    await supabaseClient.auth.getUser();

  if (request !== authVersion) return;

  if (error || !data.user) {
    showLogin();
    return;
  }

  if (recoveryMode) {
    showAuthView("reset-form");
    return;
  }

  try {
    const approved = await approvedFamily(data.user);

    if (request !== authVersion) return;

    if (!approved) {
      showAuthView("pending-approval");
      setText("approval-message", authText("pending"));
      return;
    }

    $("login-section").hidden = true;
    $("dashboard-section").hidden = false;

   switchTab(currentTab);
await loadBookings();
await loadExpenses();
  } catch (err) {
    if (request !== authVersion) return;

    showAuthView("pending-approval");
    setText("approval-message", authText("checkFailed"));

    console.error("Approval check failed", err);
  }
}

/* =====================================================
   AUTHENTICATION BUTTONS
   ===================================================== */

$("show-create-account")?.addEventListener(
  "click",
  () => showAuthView("signup-form")
);

$("show-forgot-password")?.addEventListener(
  "click",
  () => {
    $("forgot-email").value = $("email").value.trim();
    showAuthView("forgot-form");
  }
);

$("back-to-login-from-signup")?.addEventListener(
  "click",
  showLogin
);

$("back-to-login-from-forgot")?.addEventListener(
  "click",
  showLogin
);

$("auth-language-toggle")?.addEventListener(
  "click",
  () => setLanguage(
    currentLanguage === "ar" ? "en" : "ar"
  )
);

/* =====================================================
   SIGN IN
   ===================================================== */

$("login-form")?.addEventListener(
  "submit",
  async event => {
    event.preventDefault();

    const message = $("login-error");
    message.textContent = "";

    const button = event.currentTarget.querySelector(
      '[type="submit"]'
    );

    button.disabled = true;

    try {
      const { error } =
        await supabaseClient.auth.signInWithPassword({
          email: $("email").value.trim(),
          password: $("password").value
        });

      if (error) throw error;

      await showDashboard();
    } catch (err) {
      message.textContent =
        t("loginError") + err.message;
    } finally {
      button.disabled = false;
    }
  }
);


/* =====================================================
   FAMILY ACCOUNT REGISTRATION
   ===================================================== */

$("signup-form")?.addEventListener("submit", async event => {
  event.preventDefault();

  const message = $("signup-message");
  message.textContent = "";

  const password = $("signup-password").value;

  if (password.length < 8) {
    message.textContent = authText("short");
    return;
  }

  if (password !== $("signup-confirm").value) {
    message.textContent = authText("mismatch");
    return;
  }

  const button = event.currentTarget.querySelector(
    '[type="submit"]'
  );

  button.disabled = true;

  try {
    const { data, error } =
      await supabaseClient.auth.signUp({
        email: $("signup-email").value.trim(),
        password,
        options: {
          emailRedirectTo: AUTH_REDIRECT
        }
      });

    if (error) throw error;

    message.textContent = authText("sent");

    if (data.session) {
      await supabaseClient.auth.signOut();
    }
  } catch (err) {
    message.textContent = err.message;
  } finally {
    button.disabled = false;
  }
});

/* =====================================================
   FORGOT PASSWORD
   ===================================================== */

$("forgot-form")?.addEventListener("submit", async event => {
  event.preventDefault();

  const message = $("forgot-message");
  message.textContent = "";

  const button = event.currentTarget.querySelector(
    '[type="submit"]'
  );

  button.disabled = true;

  try {
    const { error } =
      await supabaseClient.auth.resetPasswordForEmail(
        $("forgot-email").value.trim(),
        {
          redirectTo: AUTH_REDIRECT
        }
      );

    if (error) throw error;

    message.textContent = authText("resetSent");
  } catch (err) {
    message.textContent = err.message;
  } finally {
    button.disabled = false;
  }
});

/* =====================================================
   SAVE NEW PASSWORD
   ===================================================== */

$("reset-form")?.addEventListener("submit", async event => {
  event.preventDefault();

  const message = $("reset-message");
  message.textContent = "";

  const password = $("reset-password").value;

  if (password.length < 8) {
    message.textContent = authText("short");
    return;
  }

  if (password !== $("reset-confirm").value) {
    message.textContent = authText("mismatch");
    return;
  }

  const button = event.currentTarget.querySelector(
    '[type="submit"]'
  );

  button.disabled = true;

  try {
    const { error } =
      await supabaseClient.auth.updateUser({
        password
      });

    if (error) throw error;

    recoveryMode = false;

    await supabaseClient.auth.signOut();

    showLogin();

    setText("login-error", authText("saved"));

    history.replaceState(
      null,
      "",
      location.pathname
    );
  } catch (err) {
    message.textContent = err.message;
  } finally {
    button.disabled = false;
  }
});

/* =====================================================
   CHECK FAMILY APPROVAL
   ===================================================== */

$("check-approval")?.addEventListener(
  "click",
  showDashboard
);

/* =====================================================
   LOG OUT
   ===================================================== */

async function signOutFamily() {
  const { error } =
    await supabaseClient.auth.signOut();

  if (error) {
    setText("approval-message", error.message);
    showMessage(error.message, true);
    return;
  }

  showLogin();
}

$("pending-logout")?.addEventListener(
  "click",
  signOutFamily
);

$("logout-btn")?.addEventListener(
  "click",
  signOutFamily
);

/* =====================================================
   SHOW / HIDE PASSWORD
   ===================================================== */

document.querySelectorAll(".password-toggle").forEach(
  button => {
    button.addEventListener("click", () => {
      const input = $(button.dataset.target);

      if (!input) return;

      const visible = input.type === "text";

      input.type = visible ? "password" : "text";

      button.textContent = visible ? "👁" : "🙈";

      button.setAttribute(
        "aria-label",
        authText(visible ? "show" : "hide")
      );

      button.setAttribute(
        "aria-pressed",
        String(!visible)
      );
    });
  }
);

/* =====================================================
   SUPABASE AUTHENTICATION EVENTS
   ===================================================== */

supabaseClient.auth.onAuthStateChange(event => {
  if (event === "PASSWORD_RECOVERY") {
    recoveryMode = true;
    showAuthView("reset-form");
  }
});

/* =====================================================
   CHECK EXISTING SESSION
   ===================================================== */

async function checkSession() {
  const { data, error } =
    await supabaseClient.auth.getUser();

  if (recoveryMode) {
    showAuthView("reset-form");
    return;
  }

  if (!error && data.user) {
    await showDashboard();
  } else {
    showLogin();
  }
}

/* =====================================================
   REFRESH BOOKINGS
   ===================================================== */

$("refresh-bookings-btn")?.addEventListener(
  "click",
  loadBookings
);


/* Dashboard language button */
$("language-toggle")?.addEventListener("click", () => {
  setLanguage(currentLanguage === "ar" ? "en" : "ar");
});

/* =====================================================
   INITIALIZE DASHBOARD
   ===================================================== */

setLanguage(currentLanguage);
checkSession();


/* =========================================
   OS APARTMENTS — LIGHT / DARK MODE
   ========================================= */

(function () {
  const storageKey = "osApartmentsTheme";

  function applyTheme(theme) {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem(storageKey, theme);

    document.querySelectorAll(".theme-toggle").forEach(button => {
      const isDark = theme === "dark";

      button.textContent = isDark
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";

      button.setAttribute("aria-pressed", String(isDark));
    });
  }

  function createThemeButton(parent) {
    if (!parent) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";

    button.addEventListener("click", () => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme");

      applyTheme(currentTheme === "dark" ? "light" : "dark");
    });

    parent.appendChild(button);
  }

  function initializeTheme() {
    createThemeButton(
      document.querySelector(".admin-header .header-actions")
    );

    createThemeButton(
      document.querySelector("#login-section .login-card")
    );

    applyTheme(
      localStorage.getItem(storageKey) === "dark"
        ? "dark"
        : "light"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeTheme
    );
  } else {
    initializeTheme();
  }
})();
