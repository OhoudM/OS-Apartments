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
    quickDesc: "Common tasks for your family",
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
    management: "لوحة إدارة الشقة",
    login: "تسجيل الدخول",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    logout: "تسجيل الخروج",
    addBooking: "+ إضافة حجز",
    language: "English",

    overview: "نظرة عامة",
    bookingsTab: "الحجوزات والتقويم",
    finances: "المالية",
    reports: "التقارير والتحليلات",

    overviewDesc: "ملخص حالة الشقة",
    bookingsDesc: "إدارة الحجوزات وإقامات الضيوف",
    financesDesc: "متابعة المدفوعات ومصاريف الشقة",
    reportsDesc: "متابعة أداء الشقة",

    totalBookings: "إجمالي الحجوزات",
    upcomingBookings: "الحجوزات القادمة",
    guestTotals: "إجمالي مبالغ حجوزات الضيوف",
    hostEarnings: "الأرباح التقديرية للمضيف",
    viewDetails: "عرض التفاصيل ←",

    today: "ملخص اليوم",
    todayDesc: "الوصول والمغادرة والضيوف الحاليون",
    arriving: "الوصول اليوم",
    departing: "المغادرة اليوم",
    staying: "المقيمون حالياً",
    noToday: "لا توجد عمليات وصول أو مغادرة اليوم.",
    arrival: "وصول",
    departure: "مغادرة",
    currentGuest: "مقيم حالياً",

    quickActions: "إجراءات سريعة",
    quickDesc: "المهام الشائعة للعائلة",
    viewBookings: "عرض الحجوزات",
    viewFinances: "عرض المالية",

    calendar: "تقويم الحجوزات",
    calendarDesc: "معرفة الضيوف المقيمين في كل يوم",
    confirmed: "مؤكد",
    cancelled: "ملغي",
    pending: "قيد الانتظار",
    available: "متاح",
    checkedIn: "تم تسجيل الدخول",

    allBookings: "جميع الحجوزات",
    allBookingsDesc: "عرض الحجوزات وتفاصيل المدفوعات",
    refresh: "تحديث",
    guest: "الضيف",
    platform: "المنصة",
    checkIn: "تاريخ الدخول",
    checkOut: "تاريخ الخروج",
    status: "الحالة",
    earnings: "أرباح المضيف",
    details: "التفاصيل",
    breakdown: "عرض التفاصيل",
    noBookings: "لا توجد حجوزات.",

    estimatedEarnings: "الأرباح التقديرية",
    paymentsReceived: "المدفوعات المستلمة",
    paymentsRemaining: "المدفوعات المتبقية",
    recordedExpenses: "المصاريف المسجلة",

    remainingTitle: "المدفوعات المتبقية",
    remainingDesc: "المبالغ المستحقة من الضيوف",
    total: "الإجمالي",
    received: "المستلم",
    remaining: "المتبقي",
    action: "الإجراء",
    recordPayment: "تسجيل دفعة",
    noRemaining: "لا توجد مدفوعات متبقية مسجلة.",

    expenses: "مصاريف الشقة",
    expensesDesc: "التنظيف والصيانة والفواتير والمستلزمات",
    addExpense: "+ إضافة مصروف",
    expensesSetup: "سيتم تفعيل تسجيل المصاريف بعد الإعداد.",

    monthlyPerformance: "الأداء الشهري",
    monthlyDesc: "الأرباح والمصاريف والربح التقديري",
    monthlyEarnings: "الأرباح الشهرية",
    monthlyExpenses: "المصاريف الشهرية",
    estimatedProfit: "الربح التقديري",
    occupancy: "نسبة الإشغال",
    earningsChart: "الأرباح حسب الشهر",
    earningsChartDesc: "مقارنة الأداء الشهري للشقة",
    platformChart: "الحجوزات حسب المنصة",
    platformChartDesc: "معرفة مصادر الحجوزات",

    notConfigured: "لم يتم الإعداد بعد",
    expensesUnavailable:
      "يجب إعداد قاعدة بيانات المصاريف لحساب الربح.",
    noChartData: "لا توجد بيانات حجوزات مؤكدة لعرضها.",

    saveBooking: "حفظ الحجز",
    savePayment: "حفظ الدفعة",
    close: "إغلاق",
    notes: "ملاحظات",
    guestName: "اسم الضيف",
    confirmationCode: "رقم تأكيد الحجز",
    bookingAmount: "إجمالي مبلغ الحجز (ريال)",
    commission: "عمولة المنصة (ريال)",
    amountReceived: "المبلغ المستلم (ريال)",
    paymentAmount: "مبلغ الدفعة (ريال)",
    remainingBalance: "المبلغ المتبقي",
    bookingDetails: "تفاصيل الحجز",
    paymentDetails: "تفاصيل الدفع",

    originalPrice: "سعر الحجز الأصلي",
    discount: "الخصم",
    accommodation: "إجمالي الإقامة",
    occupancyTax: "ضريبة الإشغال",
    otherFees: "رسوم أخرى",
    guestTotal: "إجمالي مبلغ الضيف",
    platformCommission: "عمولة المنصة",
    hostTotal: "الأرباح التقديرية للمضيف",
    receivedSoFar: "المبلغ المستلم",
    balanceDue: "المبلغ المتبقي",
    refund: "مبلغ الاسترداد",
    refundStatus: "حالة الاسترداد",
    financialStatus: "حالة الدفع",
    code: "رقم تأكيد الحجز",
    dates: "تواريخ الإقامة",

    byPlatform: "الأرباح التقديرية حسب المنصة",
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
      "تتداخل هذه التواريخ مع حجز مؤكد موجود.",
    duplicateCode:
      "رقم التأكيد هذا مسجل مسبقاً لنفس المنصة.",
    invalidDates:
      "يجب أن يكون تاريخ الخروج بعد تاريخ الدخول.",
    invalidAmounts:
      "يرجى مراجعة المبالغ المدخلة.",
    paymentTooLarge:
      "مبلغ الدفعة أكبر من الرصيد المتبقي.",
    missingPayment:
      "لا يوجد رصيد متبقٍ مسجل لهذا الحجز.",
    stalePayment:
      "تم تحديث هذا الحجز من مكان آخر. حدّث الصفحة وحاول مجدداً.",
    refreshNeeded:
      "انتظر حتى يكتمل تحميل الحجوزات قبل إضافة حجز.",
    sessionExpired:
      "انتهت جلسة تسجيل الدخول. يرجى تسجيل الدخول مجدداً.",

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

function t(key) {
  return translations[currentLanguage]?.[key] || key;
}

function setText(id, value) {
  const element = $(id);
  if (element) element.textContent = value;
}

function formatSAR(amount) {
  const value = Number(amount) || 0;

  return new Intl.NumberFormat(
    currentLanguage === "ar" ? "ar-SA" : "en-SA",
    {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  ).format(value);
}

function formatDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(
    currentLanguage === "ar" ? "ar-SA" : "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  ).format(date);
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[char];
  });
}


/* =====================================================
   PART 3 — DASHBOARD HELPERS
   ===================================================== */

function showMessage(message, isError = false) {
  const element = $("dashboard-message");

  if (!element) return;

  element.textContent = message;
  element.style.color = isError ? "#b42318" : "#456b43";
}

function normalizeDate(value) {
  if (!value) return "";

  if (typeof value === "string") {
    const match = value.match(/^\d{4}-\d{2}-\d{2}/);
    if (match) return match[0];
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function todayISO() {
  return normalizeDate(new Date());
}

function numberValue(value) {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function firstValue(object, keys, fallback = null) {
  for (const key of keys) {
    const value = object?.[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return fallback;
}

function getGuestName(booking) {
  return firstValue(
    booking,
    ["guest_name", "Guest Name", "guest", "name"],
    "—"
  );
}

function getPlatform(booking) {
  return firstValue(
    booking,
    ["platform", "Platform", "booking_platform"],
    "Direct"
  );
}

function getCheckIn(booking) {
  return normalizeDate(
    firstValue(booking, [
      "check_in",
      "check_in_date",
      "Check-in",
      "checkin"
    ])
  );
}

function getCheckOut(booking) {
  return normalizeDate(
    firstValue(booking, [
      "check_out",
      "check_out_date",
      "Check-out",
      "checkout"
    ])
  );
}

function getBookingStatus(booking) {
  const status = String(
    firstValue(
      booking,
      ["status", "booking_status", "Status"],
      "confirmed"
    )
  ).toLowerCase().trim();

  if (
    status.includes("cancel") ||
    status.includes("ملغ")
  ) {
    return "cancelled";
  }

  if (
    status.includes("pending") ||
    status.includes("wait")
  ) {
    return "pending";
  }

  if (
    status.includes("check") &&
    status.includes("in")
  ) {
    return "checkedIn";
  }

  return "confirmed";
}

function isActiveBooking(booking) {
  return getBookingStatus(booking) !== "cancelled";
}

function getBookingTotal(booking) {
  return numberValue(
    firstValue(booking, [
      "total_booking_amount",
      "total_amount",
      "guest_total",
      "booking_total",
      "total_price",
      "Total"
    ])
  );
}

function getCommission(booking) {
  return numberValue(
    firstValue(booking, [
      "platform_commission",
      "commission",
      "service_fee",
      "host_service_fee"
    ])
  );
}

function getHostEarnings(booking) {
  const explicit = firstValue(booking, [
    "host_earnings",
    "host_payout",
    "estimated_host_earnings",
    "payout"
  ]);

  if (explicit !== null) return numberValue(explicit);

  return Math.max(
    0,
    getBookingTotal(booking) - getCommission(booking)
  );
}

function getAmountReceived(booking) {
  return numberValue(
    firstValue(booking, [
      "amount_received",
      "payment_received",
      "paid_amount",
      "received_amount"
    ])
  );
}

function getRemainingBalance(booking) {
  const explicit = firstValue(booking, [
    "remaining_balance",
    "remaining_amount",
    "balance_due"
  ]);

  if (explicit !== null) {
    return Math.max(0, numberValue(explicit));
  }

  return Math.max(
    0,
    getBookingTotal(booking) - getAmountReceived(booking)
  );
}

function getConfirmationCode(booking) {
  return firstValue(
    booking,
    [
      "confirmation_code",
      "booking_reference",
      "reservation_code",
      "booking_id"
    ],
    "—"
  );
}

function getBookingId(booking) {
  return firstValue(booking, [
    "id",
    "booking_id",
    "ID"
  ]);
}

function getBookingById(id) {
  return bookings.find(
    booking => String(getBookingId(booking)) === String(id)
  );
}

/* =====================================================
   LANGUAGE SWITCHING
   ===================================================== */

function setLanguage(language) {
  currentLanguage = language === "ar" ? "ar" : "en";

  localStorage.setItem(
    "osAdminLanguage",
    currentLanguage
  );

  document.documentElement.lang = currentLanguage;
  document.documentElement.dir =
    currentLanguage === "ar" ? "rtl" : "ltr";

  document.body.classList.toggle(
    "arabic-mode",
    currentLanguage === "ar"
  );

  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.dataset.i18n;

    if (translations[currentLanguage]?.[key]) {
      element.textContent = t(key);
    }
  });

  setText("language-toggle", t("language"));
  setText("auth-language-toggle", t("language"));

  setText("remaining-title", t("remainingTitle"));
  setText("remaining-description", t("remainingDesc"));
  setText("remaining-guest-heading", t("guest"));
  setText("remaining-total-heading", t("total"));
  setText("remaining-paid-heading", t("received"));
  setText("remaining-due-heading", t("remaining"));
  setText("remaining-action-heading", t("action"));

  setText("expenses-message", t("expensesSetup"));

  const weekdays = document.querySelectorAll(
    ".calendar-weekdays span"
  );

  const dayKeys = [
    "sun", "mon", "tue", "wed", "thu", "fri", "sat"
  ];

  weekdays.forEach((element, index) => {
    element.textContent = t(dayKeys[index]);
  });

  // This helper is added in Part 7.
  if (typeof translateAuthAndExtras === "function") {
    translateAuthAndExtras();
  }

  if (typeof renderEverything === "function") {
    renderEverything();
  }
}

$("language-toggle")?.addEventListener("click", () => {
  setLanguage(
    currentLanguage === "ar" ? "en" : "ar"
  );
});

/* =====================================================
   DASHBOARD NAVIGATION
   ===================================================== */

function switchTab(tabName) {
  const allowedTabs = [
    "overview",
    "bookings",
    "finances",
    "reports"
  ];

  currentTab = allowedTabs.includes(tabName)
    ? tabName
    : "overview";

  document.querySelectorAll(".tab-btn").forEach(button => {
    const selected = button.dataset.tab === currentTab;

    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", String(selected));
  });

  document.querySelectorAll(".tab-content").forEach(section => {
    const selected = section.id === `tab-${currentTab}`;

    section.classList.toggle("active", selected);
    section.hidden = !selected;
  });

  if (currentTab === "bookings") {
    if (typeof renderCalendar === "function") {
      renderCalendar();
    }

    if (typeof renderBookingsTable === "function") {
      renderBookingsTable();
    }
  }

  if (currentTab === "finances") {
    if (typeof renderFinances === "function") {
      renderFinances();
    }
  }

  if (currentTab === "reports") {
    if (typeof renderReports === "function") {
      renderReports();
    }
  }
}

document.querySelectorAll(".tab-btn").forEach(button => {
  button.addEventListener("click", () => {
    switchTab(button.dataset.tab);
  });
});

$("quick-view-bookings")?.addEventListener("click", () => {
  switchTab("bookings");
});

$("quick-view-finances")?.addEventListener("click", () => {
  switchTab("finances");
});

/* =====================================================
   DIALOG HELPERS
   ===================================================== */

function openDialog(dialogId) {
  const dialog = $(dialogId);

  if (!dialog) return;

  if (typeof dialog.showModal === "function") {
    if (!dialog.open) dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function closeDialog(dialogId) {
  const dialog = $(dialogId);

  if (!dialog) return;

  if (typeof dialog.close === "function" && dialog.open) {
    dialog.close();
  } else {
    dialog.removeAttribute("open");
  }
}

$("close-add-booking")?.addEventListener("click", () => {
  closeDialog("add-booking-dialog");
});

$("close-payment-dialog")?.addEventListener("click", () => {
  closeDialog("record-payment-dialog");
});

$("close-breakdown")?.addEventListener("click", () => {
  closeDialog("breakdown-dialog");
});

$("close-breakdown-bottom")?.addEventListener("click", () => {
  closeDialog("breakdown-dialog");
});

$("close-earnings-dialog")?.addEventListener("click", () => {
  closeDialog("earnings-dialog");
});

$("close-expense-dialog")?.addEventListener("click", () => {
  closeDialog("add-expense-dialog");
});

document.querySelectorAll("dialog").forEach(dialog => {
  dialog.addEventListener("click", event => {
    if (event.target === dialog) {
      closeDialog(dialog.id);
    }
  });
});


/* =====================================================
   PART 4 — BOOKINGS, OVERVIEW & CALENDAR
   ===================================================== */

/* =====================================================
   LOAD BOOKINGS FROM SUPABASE
   ===================================================== */

async function loadBookings() {
  const { data: sessionData } =
    await supabaseClient.auth.getSession();

  if (!sessionData.session) {
    showMessage(t("sessionExpired"), true);
    return;
  }

  showMessage(t("loading"));

  const { data, error } = await supabaseClient
    .from("Bookings")
    .select("*");

  if (error) {
    console.error("Booking load error:", error);
    showMessage(t("loadError") + error.message, true);
    return;
  }

  bookings = Array.isArray(data) ? data : [];
  bookingsLoaded = true;

  showMessage("");

  renderEverything();
}

/* =====================================================
   RENDER DASHBOARD
   ===================================================== */

function renderEverything() {
  renderOverview();
  renderCalendar();
  renderBookingsTable();
  renderFinances();
  renderReports();
}

/* =====================================================
   OVERVIEW STATISTICS
   ===================================================== */

function renderOverview() {
  const activeBookings = bookings.filter(isActiveBooking);

  const today = todayISO();

  const upcomingBookings = activeBookings.filter(booking => {
    const checkIn = getCheckIn(booking);
    return checkIn && checkIn > today;
  });

  const guestTotals = activeBookings.reduce(
    (sum, booking) => sum + getBookingTotal(booking),
    0
  );

  const hostEarnings = activeBookings.reduce(
    (sum, booking) => sum + getHostEarnings(booking),
    0
  );

  setText("total-bookings", bookings.length);
  setText("upcoming-bookings", upcomingBookings.length);

  setText("guest-payments", formatSAR(guestTotals));
  setText("host-payouts", formatSAR(hostEarnings));

  renderTodayOverview();
}

/* =====================================================
   TODAY'S ARRIVALS AND DEPARTURES
   ===================================================== */

function renderTodayOverview() {
  const today = todayISO();

  const activeBookings = bookings.filter(isActiveBooking);

  const arriving = activeBookings.filter(
    booking => getCheckIn(booking) === today
  );

  const departing = activeBookings.filter(
    booking => getCheckOut(booking) === today
  );

  const staying = activeBookings.filter(booking => {
    const checkIn = getCheckIn(booking);
    const checkOut = getCheckOut(booking);

    return checkIn <= today && today < checkOut;
  });

  setText("today-arrivals", arriving.length);
  setText("today-departures", departing.length);
  setText("today-staying", staying.length);

  const container = $("today-guest-list");

  if (!container) return;

  const events = [
    ...arriving.map(booking => ({
      booking,
      type: t("arrival")
    })),
    ...departing.map(booking => ({
      booking,
      type: t("departure")
    })),
    ...staying
      .filter(
        booking =>
          !arriving.includes(booking) &&
          !departing.includes(booking)
      )
      .map(booking => ({
        booking,
        type: t("currentGuest")
      }))
  ];

  if (!events.length) {
    container.innerHTML = `
      <p class="empty-state">${escapeHTML(t("noToday"))}</p>
    `;
    return;
  }

  container.innerHTML = events.map(({ booking, type }) => `
    <div class="today-guest-row">
      <div>
        <strong>${escapeHTML(getGuestName(booking))}</strong>
        <small>${escapeHTML(getPlatform(booking))}</small>
      </div>
      <span>${escapeHTML(type)}</span>
    </div>
  `).join("");
}

/* =====================================================
   CALENDAR CONTROLS
   ===================================================== */

$("prev-month")?.addEventListener("click", () => {
  displayedMonth.setMonth(displayedMonth.getMonth() - 1);
  renderCalendar();
});

$("next-month")?.addEventListener("click", () => {
  displayedMonth.setMonth(displayedMonth.getMonth() + 1);
  renderCalendar();
});

/* =====================================================
   CALENDAR DATE HELPERS
   ===================================================== */

function dateToISO(year, month, day) {
  return [
    year,
    String(month + 1).padStart(2, "0"),
    String(day).padStart(2, "0")
  ].join("-");
}

function bookingCoversDate(booking, dateString) {
  if (!isActiveBooking(booking)) return false;

  const checkIn = getCheckIn(booking);
  const checkOut = getCheckOut(booking);

  if (!checkIn || !checkOut) return false;

  // Check-out day is not occupied by the departing guest.
  return checkIn <= dateString && dateString < checkOut;
}

function getBookingsForDate(dateString) {
  return bookings.filter(booking =>
    bookingCoversDate(booking, dateString)
  );
}

/* =====================================================
   RENDER CALENDAR
   ===================================================== */

function renderCalendar() {
  const grid = $("calendar-grid");
  const monthTitle = $("calendar-month");

  if (!grid || !monthTitle) return;

  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();

  const locale = currentLanguage === "ar"
    ? "ar-SA"
    : "en-US";

  monthTitle.textContent = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric"
  }).format(displayedMonth);

  const firstDay = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const daysInPreviousMonth = new Date(
    year,
    month,
    0
  ).getDate();

  const cells = [];

  // Empty-looking days from the previous month
  for (let index = firstDay - 1; index >= 0; index--) {
    const day = daysInPreviousMonth - index;

    cells.push(`
      <div class="calendar-day other-month">
        <span class="calendar-date">${day}</span>
      </div>
    `);
  }

  const today = todayISO();

  // Current month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = dateToISO(year, month, day);

    const dayBookings = getBookingsForDate(dateString);

    const isToday = dateString === today;

    const hasBookings = dayBookings.length > 0;

    const classes = [
      "calendar-day",
      isToday ? "today" : "",
      hasBookings ? "booked" : "available"
    ].filter(Boolean).join(" ");

    const guestNames = dayBookings.map(booking =>
      escapeHTML(getGuestName(booking))
    );

    const guestMarkup = guestNames.length
      ? `
        <div class="calendar-booking-list">
          ${guestNames.map(name => `
            <span class="calendar-booking">${name}</span>
          `).join("")}
        </div>
      `
      : "";

    cells.push(`
      <div
        class="${classes}"
        data-date="${dateString}"
        title="${escapeHTML(
          dayBookings.map(getGuestName).join(", ")
        )}"
      >
        <span class="calendar-date">${day}</span>
        ${guestMarkup}
      </div>
    `);
  }

  // Fill the last row
  const remainingCells = (7 - (cells.length % 7)) % 7;

  for (let day = 1; day <= remainingCells; day++) {
    cells.push(`
      <div class="calendar-day other-month">
        <span class="calendar-date">${day}</span>
      </div>
    `);
  }

  grid.innerHTML = cells.join("");
}

/* =====================================================
   BOOKINGS TABLE
   ===================================================== */

function renderBookingsTable() {
  const tableBody = $("bookings-table-body");

  if (!tableBody) return;

  const sortedBookings = [...bookings].sort((a, b) => {
    return getCheckIn(b).localeCompare(getCheckIn(a));
  });

  if (!sortedBookings.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          ${escapeHTML(t("noBookings"))}
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = sortedBookings.map(booking => {
    const status = getBookingStatus(booking);

    const statusLabel = t(status);

    const bookingId = getBookingId(booking);

    return `
      <tr>
        <td>
          <strong>${escapeHTML(getGuestName(booking))}</strong>
        </td>

        <td>${escapeHTML(getPlatform(booking))}</td>

        <td>${escapeHTML(formatDate(getCheckIn(booking)))}</td>

        <td>${escapeHTML(formatDate(getCheckOut(booking)))}</td>

        <td>
          <span class="status-badge status-${escapeHTML(status)}">
            ${escapeHTML(statusLabel)}
          </span>
        </td>

        <td>${escapeHTML(formatSAR(getHostEarnings(booking)))}</td>

        <td>
          <button
            type="button"
            class="view-booking-details"
            data-booking-id="${escapeHTML(bookingId)}"
          >
            ${escapeHTML(t("breakdown"))}
          </button>
        </td>
      </tr>
    `;
  }).join("");

  tableBody.querySelectorAll(
    ".view-booking-details"
  ).forEach(button => {
    button.addEventListener("click", () => {
      const booking = getBookingById(
        button.dataset.bookingId
      );

      if (booking) {
        openBookingBreakdown(booking);
      }
    });
  });
}

/* =====================================================
   BOOKING DETAILS
   ===================================================== */

function openBookingBreakdown(booking) {
  const guest = getGuestName(booking);

  setText("breakdown-guest", guest);

  const details = [
    [t("guest"), guest],
    [t("platform"), getPlatform(booking)],
    [t("code"), getConfirmationCode(booking)],
    [t("checkIn"), formatDate(getCheckIn(booking))],
    [t("checkOut"), formatDate(getCheckOut(booking))],
    [t("status"), t(getBookingStatus(booking))],
    [t("guestTotal"), formatSAR(getBookingTotal(booking))],
    [t("platformCommission"), formatSAR(getCommission(booking))],
    [t("hostTotal"), formatSAR(getHostEarnings(booking))],
    [t("receivedSoFar"), formatSAR(getAmountReceived(booking))],
    [t("balanceDue"), formatSAR(getRemainingBalance(booking))]
  ];

  const container = $("breakdown-content");

  if (!container) return;

  container.innerHTML = `
    <div class="booking-breakdown">
      ${details.map(([label, value]) => `
        <div class="breakdown-row">
          <span>${escapeHTML(label)}</span>
          <strong>${escapeHTML(value)}</strong>
        </div>
      `).join("")}
    </div>
  `;

  openDialog("breakdown-dialog");
}

/* =====================================================
   EARNINGS BREAKDOWN
   ===================================================== */

function openEarningsBreakdown() {
  const container = $("earnings-breakdown-content");

  if (!container) return;

  const totals = {};

  bookings
    .filter(isActiveBooking)
    .forEach(booking => {
      const platform = getPlatform(booking);

      if (!totals[platform]) {
        totals[platform] = {
          count: 0,
          amount: 0
        };
      }

      totals[platform].count++;
      totals[platform].amount += getHostEarnings(booking);
    });

  const entries = Object.entries(totals);

  if (!entries.length) {
    container.innerHTML = `
      <p>${escapeHTML(t("noBookings"))}</p>
    `;
  } else {
    container.innerHTML = `
      <div class="booking-breakdown">
        ${entries.map(([platform, data]) => `
          <div class="breakdown-row">
            <span>
              ${escapeHTML(platform)}
              (${data.count})
            </span>
            <strong>${escapeHTML(formatSAR(data.amount))}</strong>
          </div>
        `).join("")}
      </div>
    `;
  }

  openDialog("earnings-dialog");
}

$("earnings-card")?.addEventListener(
  "click",
  openEarningsBreakdown
);

$("earnings-card")?.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openEarningsBreakdown();
  }
});


/* =====================================================
   PART 5 — BOOKINGS, PAYMENTS & FINANCES
   ===================================================== */

/* =====================================================
   ADD BOOKING FORM
   ===================================================== */

function openAddBooking() {
  if (!bookingsLoaded) {
    showMessage(t("refreshNeeded"), true);
    return;
  }

  setText("manual-booking-message", "");

  const form = $("add-booking-form");
  if (form) form.reset();

  updateManualBalancePreview();
  openDialog("add-booking-dialog");
}

$("open-add-booking")?.addEventListener(
  "click",
  openAddBooking
);

$("quick-add-booking")?.addEventListener(
  "click",
  openAddBooking
);

function updateManualBalancePreview() {
  const total = numberValue($("manual-total")?.value);
  const commission = numberValue(
    $("manual-commission")?.value
  );
  const received = numberValue(
    $("manual-received")?.value
  );

  const earnings = Math.max(0, total - commission);
  const remaining = Math.max(0, total - received);

  const preview = $("manual-balance-preview");

  if (!preview) return;

  preview.textContent =
    `${t("hostTotal")}: ${formatSAR(earnings)} | ` +
    `${t("balanceDue")}: ${formatSAR(remaining)}`;
}

[
  "manual-total",
  "manual-commission",
  "manual-received"
].forEach(id => {
  $(id)?.addEventListener(
    "input",
    updateManualBalancePreview
  );
});

/* =====================================================
   BOOKING VALIDATION
   ===================================================== */

function datesOverlap(
  firstCheckIn,
  firstCheckOut,
  secondCheckIn,
  secondCheckOut
) {
  return (
    firstCheckIn < secondCheckOut &&
    secondCheckIn < firstCheckOut
  );
}

function hasBookingConflict(checkIn, checkOut) {
  return bookings.some(booking => {
    if (!isActiveBooking(booking)) return false;

    const existingCheckIn = getCheckIn(booking);
    const existingCheckOut = getCheckOut(booking);

    if (!existingCheckIn || !existingCheckOut) {
      return false;
    }

    return datesOverlap(
      checkIn,
      checkOut,
      existingCheckIn,
      existingCheckOut
    );
  });
}

function hasDuplicateConfirmation(platform, code) {
  if (!code) return false;

  return bookings.some(booking => {
    return (
      String(getPlatform(booking)).toLowerCase() ===
        String(platform).toLowerCase() &&
      String(getConfirmationCode(booking)).toLowerCase() ===
        String(code).toLowerCase()
    );
  });
}

/* =====================================================
   SAVE NEW BOOKING
   ===================================================== */

$("add-booking-form")?.addEventListener(
  "submit",
  async event => {
    event.preventDefault();

    if (savingManualBooking) return;

    const guestName = $("manual-guest").value.trim();
    const platform = $("manual-platform").value;
    const code = $("manual-code").value.trim();

    const checkIn = $("manual-check-in").value;
    const checkOut = $("manual-check-out").value;

    const total = numberValue(
      $("manual-total").value
    );

    const commission = numberValue(
      $("manual-commission").value
    );

    const received = numberValue(
      $("manual-received").value
    );

    const notes = $("manual-notes").value.trim();

    const message = $("manual-booking-message");
    message.textContent = "";

    if (!guestName || !checkIn || !checkOut) {
      message.textContent = t("invalidAmounts");
      return;
    }

    if (checkOut <= checkIn) {
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
      commission > total ||
      received > total
    ) {
      message.textContent = t("invalidAmounts");
      return;
    }

    if (hasBookingConflict(checkIn, checkOut)) {
      message.textContent = t("bookingConflict");
      return;
    }

    if (hasDuplicateConfirmation(platform, code)) {
      message.textContent = t("duplicateCode");
      return;
    }

    const button = $("save-manual-booking");
    savingManualBooking = true;
    button.disabled = true;
    button.textContent = t("saving");

    try {
      /*
       * IMPORTANT:
       * These column names must match your Supabase
       * public."Bookings" table.
       *
       * If your database uses different names,
       * this INSERT will need to be adjusted.
       */

      const newBooking = {
        guest_name: guestName,
        platform: platform,
        confirmation_code: code || null,
        check_in: checkIn,
        check_out: checkOut,
        status: "confirmed",
        total_booking_amount: total,
        platform_commission: commission,
        host_earnings: total - commission,
        amount_received: received,
        remaining_balance: total - received,
        notes: notes || null
      };

      const { error } = await supabaseClient
        .from("Bookings")
        .insert([newBooking]);

      if (error) throw error;

      closeDialog("add-booking-dialog");

      showMessage(t("bookingSaved"));

      await loadBookings();

    } catch (error) {
      console.error("Save booking error:", error);

      message.textContent =
        t("saveError") + error.message;

    } finally {
      savingManualBooking = false;
      button.disabled = false;
      button.textContent = t("saveBooking");
    }
  }
);

/* =====================================================
   REMAINING PAYMENTS
   ===================================================== */

function getOutstandingBookings() {
  return bookings.filter(booking => {
    return (
      isActiveBooking(booking) &&
      getRemainingBalance(booking) > 0.009
    );
  });
}

function renderRemainingPayments() {
  const tableBody = $("remaining-payments-body");

  if (!tableBody) return;

  const outstanding = getOutstandingBookings();

  const totalRemaining = outstanding.reduce(
    (sum, booking) =>
      sum + getRemainingBalance(booking),
    0
  );

  setText(
    "remaining-total",
    formatSAR(totalRemaining)
  );

  if (!outstanding.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          ${escapeHTML(t("noRemaining"))}
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = outstanding.map(booking => {
    const bookingId = getBookingId(booking);

    return `
      <tr>
        <td>${escapeHTML(getGuestName(booking))}</td>
        <td>${escapeHTML(formatSAR(getBookingTotal(booking)))}</td>
        <td>${escapeHTML(formatSAR(getAmountReceived(booking)))}</td>
        <td>${escapeHTML(formatSAR(getRemainingBalance(booking)))}</td>
        <td>
          <button
            type="button"
            class="record-booking-payment"
            data-booking-id="${escapeHTML(bookingId)}"
          >
            ${escapeHTML(t("recordPayment"))}
          </button>
        </td>
      </tr>
    `;
  }).join("");

  tableBody.querySelectorAll(
    ".record-booking-payment"
  ).forEach(button => {
    button.addEventListener("click", () => {
      const booking = getBookingById(
        button.dataset.bookingId
      );

      if (booking) openRecordPayment(booking);
    });
  });
}

/* =====================================================
   RECORD PAYMENT DIALOG
   ===================================================== */

function openRecordPayment(booking) {
  selectedPaymentBooking = booking;

  setText(
    "payment-guest",
    getGuestName(booking)
  );

  setText(
    "payment-balance",
    formatSAR(getRemainingBalance(booking))
  );

  setText("payment-message", "");

  const form = $("record-payment-form");
  if (form) form.reset();

  const input = $("new-payment-amount");

  if (input) {
    input.max = getRemainingBalance(booking).toFixed(2);
  }

  openDialog("record-payment-dialog");
}

/* =====================================================
   SAVE PAYMENT
   ===================================================== */

$("record-payment-form")?.addEventListener(
  "submit",
  async event => {
    event.preventDefault();

    if (savingPayment || !selectedPaymentBooking) {
      return;
    }

    const amount = Number(
      $("new-payment-amount").value
    );

    const message = $("payment-message");
    message.textContent = "";

    if (!Number.isFinite(amount) || amount <= 0) {
      message.textContent = t("invalidAmounts");
      return;
    }

    const bookingId = getBookingId(
      selectedPaymentBooking
    );

    if (bookingId === null || bookingId === undefined) {
      message.textContent = t("missingPayment");
      return;
    }

    const button = $("save-payment");

    savingPayment = true;
    button.disabled = true;
    button.textContent = t("saving");

    try {
      // Refresh the booking to avoid relying on stale totals.
      const { data: latest, error: fetchError } =
        await supabaseClient
          .from("Bookings")
          .select("*")
          .eq("id", bookingId)
          .single();

      if (fetchError) throw fetchError;

      const remaining = getRemainingBalance(latest);

      if (amount > remaining + 0.001) {
        throw new Error(t("paymentTooLarge"));
      }

      const received =
        getAmountReceived(latest) + amount;

      const newRemaining = Math.max(
        0,
        remaining - amount
      );

      const { error: updateError } =
        await supabaseClient
          .from("Bookings")
          .update({
            amount_received: received,
            remaining_balance: newRemaining
          })
          .eq("id", bookingId);

      if (updateError) throw updateError;

      closeDialog("record-payment-dialog");

      selectedPaymentBooking = null;

      showMessage(t("paymentSaved"));

      await loadBookings();

    } catch (error) {
      console.error("Record payment error:", error);

      message.textContent =
        t("saveError") + error.message;

    } finally {
      savingPayment = false;
      button.disabled = false;
      button.textContent = t("savePayment");
    }
  }
);

/* =====================================================
   FINANCIAL SUMMARY
   ===================================================== */

function calculateFinancialSummary() {
  const active = bookings.filter(isActiveBooking);

  const earnings = active.reduce(
    (sum, booking) =>
      sum + getHostEarnings(booking),
    0
  );

  const received = active.reduce(
    (sum, booking) =>
      sum + getAmountReceived(booking),
    0
  );

  const remaining = active.reduce(
    (sum, booking) =>
      sum + getRemainingBalance(booking),
    0
  );

  return {
    earnings,
    received,
    remaining,
    expenses: null
  };
}

/* =====================================================
   RENDER FINANCES
   ===================================================== */

function renderFinances() {
  const summary = calculateFinancialSummary();

  setText(
    "finance-earnings",
    formatSAR(summary.earnings)
  );

  setText(
    "finance-received",
    formatSAR(summary.received)
  );

  setText(
    "finance-remaining",
    formatSAR(summary.remaining)
  );

  setText(
    "finance-expenses",
    summary.expenses === null
      ? t("notConfigured")
      : formatSAR(summary.expenses)
  );

  renderRemainingPayments();
  renderExpenses();
}

/* =====================================================
   EXPENSES PLACEHOLDER
   ===================================================== */

function renderExpenses() {
  const tableBody = $("expenses-table-body");

  if (tableBody) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-state">
          ${escapeHTML(t("expensesSetup"))}
        </td>
      </tr>
    `;
  }

  setText(
    "expenses-message",
    t("expensesSetup")
  );

  const addExpenseButton = $("open-add-expense");

  if (addExpenseButton) {
    addExpenseButton.disabled = true;
  }
}


/* =====================================================
   PART 6 — REPORTS & ANALYTICS
   ===================================================== */

/* =====================================================
   REPORT DATE HELPERS
   ===================================================== */

function getMonthKey(dateString) {
  const date = normalizeDate(dateString);
  return date ? date.slice(0, 7) : "";
}

function getMonthStart(monthKey) {
  return `${monthKey}-01`;
}

function getNextMonthStart(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);

  if (!year || !month) return "";

  return dateToISO(year, month, 1);
}

function getDaysInMonth(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);

  if (!year || !month) return 0;

  return new Date(year, month, 0).getDate();
}

function getDateDifference(startDate, endDate) {
  if (!startDate || !endDate) return 0;

  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return 0;
  }

  return Math.max(
    0,
    Math.round((end - start) / 86400000)
  );
}

/* =====================================================
   MONTH LABELS
   ===================================================== */

function formatMonthLabel(monthKey) {
  if (!monthKey) return "";

  const [year, month] = monthKey.split("-").map(Number);

  const date = new Date(year, month - 1, 1);

  return new Intl.DateTimeFormat(
    currentLanguage === "ar" ? "ar-SA" : "en-US",
    {
      month: "long",
      year: "numeric"
    }
  ).format(date);
}

/* =====================================================
   REPORT MONTH SELECTOR
   ===================================================== */

function getAvailableReportMonths() {
  const months = new Set();

  const now = new Date();

  months.add(
    `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`
  );

  bookings.forEach(booking => {
    if (!isActiveBooking(booking)) return;

    const checkIn = getCheckIn(booking);
    const checkOut = getCheckOut(booking);

    if (!checkIn || !checkOut || checkOut <= checkIn) {
      return;
    }

    const cursor = new Date(`${checkIn}T12:00:00`);
    const finalDate = new Date(`${checkOut}T12:00:00`);

    let safety = 0;

    while (cursor < finalDate && safety < 120) {
      months.add(
        `${cursor.getFullYear()}-${String(
          cursor.getMonth() + 1
        ).padStart(2, "0")}`
      );

      cursor.setMonth(cursor.getMonth() + 1, 1);
      safety++;
    }
  });

  return [...months].sort().reverse();
}

function populateReportMonths() {
  const select = $("report-month");

  if (!select) return;

  const months = getAvailableReportMonths();

  if (
    !selectedReportMonth ||
    !months.includes(selectedReportMonth)
  ) {
    selectedReportMonth = months[0] || "";
  }

  select.innerHTML = months.map(month => `
    <option value="${escapeHTML(month)}">
      ${escapeHTML(formatMonthLabel(month))}
    </option>
  `).join("");

  select.value = selectedReportMonth;
}

$("report-month")?.addEventListener("change", event => {
  selectedReportMonth = event.target.value;
  renderReports();
});

/* =====================================================
   MONTHLY OCCUPANCY
   ===================================================== */

function calculateMonthlyOccupancy(monthKey) {
  if (!monthKey) return 0;

  const monthStart = getMonthStart(monthKey);
  const nextMonthStart = getNextMonthStart(monthKey);

  const daysInMonth = getDaysInMonth(monthKey);

  if (!daysInMonth) return 0;

  const occupiedDays = new Set();

  bookings
    .filter(isActiveBooking)
    .forEach(booking => {
      const checkIn = getCheckIn(booking);
      const checkOut = getCheckOut(booking);

      if (!checkIn || !checkOut) return;

      const overlapStart =
        checkIn > monthStart ? checkIn : monthStart;

      const overlapEnd =
        checkOut < nextMonthStart
          ? checkOut
          : nextMonthStart;

      if (overlapEnd <= overlapStart) return;

      const startDate = new Date(
        `${overlapStart}T12:00:00`
      );

      const endDate = new Date(
        `${overlapEnd}T12:00:00`
      );

      for (
        let cursor = new Date(startDate);
        cursor < endDate;
        cursor.setDate(cursor.getDate() + 1)
      ) {
        occupiedDays.add(normalizeDate(cursor));
      }
    });

  return Math.min(
    100,
    (occupiedDays.size / daysInMonth) * 100
  );
}

/* =====================================================
   MONTHLY EARNINGS
   ===================================================== */

function calculateMonthlyEarnings(monthKey) {
  if (!monthKey) return 0;

  const monthStart = getMonthStart(monthKey);
  const nextMonthStart = getNextMonthStart(monthKey);

  return bookings
    .filter(isActiveBooking)
    .reduce((sum, booking) => {
      const checkIn = getCheckIn(booking);
      const checkOut = getCheckOut(booking);

      if (!checkIn || !checkOut || checkOut <= checkIn) {
        return sum;
      }

      const stayNights = getDateDifference(
        checkIn,
        checkOut
      );

      if (!stayNights) return sum;

      const overlapStart =
        checkIn > monthStart ? checkIn : monthStart;

      const overlapEnd =
        checkOut < nextMonthStart
          ? checkOut
          : nextMonthStart;

      if (overlapEnd <= overlapStart) return sum;

      const monthNights = getDateDifference(
        overlapStart,
        overlapEnd
      );

      const nightlyShare =
        getHostEarnings(booking) / stayNights;

      return sum + nightlyShare * monthNights;
    }, 0);
}

/* =====================================================
   MONTHLY SUMMARY
   ===================================================== */

function calculateMonthlyReport(monthKey) {
  const earnings = calculateMonthlyEarnings(monthKey);

  const occupancy = calculateMonthlyOccupancy(monthKey);

  // Expense records are not configured yet.
  const expenses = null;
  const profit = null;

  return {
    earnings,
    expenses,
    profit,
    occupancy
  };
}

/* =====================================================
   RENDER REPORTS
   ===================================================== */

function renderReports() {
  populateReportMonths();

  const report = calculateMonthlyReport(
    selectedReportMonth
  );

  setText(
    "monthly-earnings",
    formatSAR(report.earnings)
  );

  setText(
    "monthly-expenses",
    report.expenses === null
      ? t("notConfigured")
      : formatSAR(report.expenses)
  );

  setText(
    "monthly-profit",
    report.profit === null
      ? t("notConfigured")
      : formatSAR(report.profit)
  );

  setText(
    "monthly-occupancy",
    `${report.occupancy.toFixed(1)}%`
  );

  renderMonthlyEarningsChart();
  renderPlatformChart();
}

/* =====================================================
   MONTHLY EARNINGS CHART
   ===================================================== */

function renderMonthlyEarningsChart() {
  const container = $("monthly-earnings-chart");

  if (!container) return;

  const months = getAvailableReportMonths()
    .sort()
    .slice(-12);

  if (!months.length) {
    container.innerHTML = `
      <p class="empty-state">
        ${escapeHTML(t("noChartData"))}
      </p>
    `;
    return;
  }

  const data = months.map(month => ({
    month,
    earnings: calculateMonthlyEarnings(month)
  }));

  const maxEarnings = Math.max(
    1,
    ...data.map(item => item.earnings)
  );

  container.innerHTML = `
    <div class="report-bar-chart">
      ${data.map(item => {
        const height = Math.max(
          2,
          (item.earnings / maxEarnings) * 100
        );

        return `
          <div class="report-bar-item">
            <div class="report-bar-value">
              ${escapeHTML(formatSAR(item.earnings))}
            </div>

            <div class="report-bar-track">
              <div
                class="report-bar-fill"
                style="height:${height.toFixed(1)}%"
              ></div>
            </div>

            <small>
              ${escapeHTML(formatMonthLabel(item.month))}
            </small>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

/* =====================================================
   BOOKINGS BY PLATFORM
   ===================================================== */

function calculatePlatformBookings() {
  const platforms = {};

  bookings
    .filter(isActiveBooking)
    .forEach(booking => {
      const platform = getPlatform(booking);

      if (!platforms[platform]) {
        platforms[platform] = {
          bookings: 0,
          earnings: 0
        };
      }

      platforms[platform].bookings++;
      platforms[platform].earnings +=
        getHostEarnings(booking);
    });

  return Object.entries(platforms)
    .map(([platform, data]) => ({
      platform,
      bookings: data.bookings,
      earnings: data.earnings
    }))
    .sort((a, b) => b.bookings - a.bookings);
}

/* =====================================================
   PLATFORM CHART
   ===================================================== */

function renderPlatformChart() {
  const container = $("platform-chart");

  if (!container) return;

  const data = calculatePlatformBookings();

  if (!data.length) {
    container.innerHTML = `
      <p class="empty-state">
        ${escapeHTML(t("noChartData"))}
      </p>
    `;
    return;
  }

  const totalBookings = data.reduce(
    (sum, item) => sum + item.bookings,
    0
  );

  container.innerHTML = `
    <div class="platform-report">
      ${data.map(item => {
        const percentage = totalBookings
          ? (item.bookings / totalBookings) * 100
          : 0;

        return `
          <div class="platform-report-row">
            <div class="platform-report-heading">
              <strong>${escapeHTML(item.platform)}</strong>

              <span>
                ${item.bookings}
                (${percentage.toFixed(1)}%)
              </span>
            </div>

            <div class="platform-progress-track">
              <div
                class="platform-progress-fill"
                style="width:${percentage.toFixed(1)}%"
              ></div>
            </div>

            <small>
              ${escapeHTML(formatSAR(item.earnings))}
            </small>
          </div>
        `;
      }).join("")}
    </div>
  `;
}


/* =====================================================
   PART 7 — FAMILY AUTHENTICATION & ARABIC SUPPORT
   ===================================================== */

const AUTH_REDIRECT =
  "https://ohoudm.github.io/OS-Apartments/admin.html";

let recoveryMode = false;
let authCheckId = 0;

const authTranslations = {
  en: {
    familyPortal: "Family Management Portal",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    forgot: "Forgot Password?",
    create: "Create Account",
    confirm: "Confirm Password",
    back: "Back to Sign In",
    resetTitle: "Reset Password",
    resetHelp: "Enter your email address to receive a password reset link.",
    sendReset: "Send Reset Link",
    newPasswordTitle: "Choose New Password",
    newPassword: "New Password",
    confirmNew: "Confirm New Password",
    saveNew: "Save New Password",
    pendingTitle: "Waiting for Approval",
    pendingDescription:
      "Your account is registered. A family administrator must approve your access before you can view bookings.",
    checkApproval: "Check Approval",
    signOut: "Logout",
    signupSent:
      "Check your email to verify your account. After verification, wait for family approval.",
    pendingInfo: "Your account is waiting for family approval.",
    resetSent:
      "If the email is registered, a password reset link will be sent. Check your inbox and spam folder.",
    passwordMismatch: "Passwords do not match.",
    passwordShort: "Use at least 8 characters.",
    passwordSaved:
      "Password updated successfully. You can now sign in.",
    authError: "Authentication error: ",
    signupError: "Could not create account: ",
    approvalError:
      "Could not check your approval status. Please try again.",
    showPassword: "Show password",
    hidePassword: "Hide password",
    language: "العربية"
  },

  ar: {
    familyPortal: "بوابة إدارة العائلة",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    signIn: "تسجيل الدخول",
    forgot: "نسيت كلمة المرور؟",
    create: "إنشاء حساب",
    confirm: "تأكيد كلمة المرور",
    back: "العودة لتسجيل الدخول",
    resetTitle: "إعادة تعيين كلمة المرور",
    resetHelp:
      "أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور.",
    sendReset: "إرسال رابط الاستعادة",
    newPasswordTitle: "اختيار كلمة مرور جديدة",
    newPassword: "كلمة المرور الجديدة",
    confirmNew: "تأكيد كلمة المرور الجديدة",
    saveNew: "حفظ كلمة المرور الجديدة",
    pendingTitle: "بانتظار الموافقة",
    pendingDescription:
      "تم تسجيل حسابك. يجب أن يوافق مسؤول العائلة على وصولك قبل الاطلاع على الحجوزات.",
    checkApproval: "التحقق من الموافقة",
    signOut: "تسجيل الخروج",
    signupSent:
      "تحقق من بريدك الإلكتروني لتأكيد الحساب، ثم انتظر موافقة مسؤول العائلة.",
    pendingInfo: "حسابك بانتظار موافقة مسؤول العائلة.",
    resetSent:
      "إذا كان البريد مسجلاً، سيصلك رابط استعادة كلمة المرور. تحقق من البريد الوارد وغير المرغوب فيه.",
    passwordMismatch: "كلمتا المرور غير متطابقتين.",
    passwordShort: "استخدم ٨ أحرف على الأقل.",
    passwordSaved:
      "تم تحديث كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.",
    authError: "خطأ في تسجيل الدخول: ",
    signupError: "تعذر إنشاء الحساب: ",
    approvalError:
      "تعذر التحقق من حالة الموافقة. حاول مرة أخرى.",
    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
    language: "English"
  }
};

function at(key) {
  return authTranslations[currentLanguage]?.[key] || key;
}

/* =====================================================
   TRANSLATE ACCOUNT SCREENS
   ===================================================== */

function translateAuthAndExtras() {
  const text = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };

  const labels = {
    "#portal-subtitle": "familyPortal",
    "#login-form label[for='email']": "email",
    "#login-form label[for='password']": "password",
    "#signup-form label[for='signup-email']": "email",
    "#signup-form label[for='signup-password']": "password",
    "#signup-form label[for='signup-confirm']": "confirm",
    "#forgot-form label[for='forgot-email']": "email",
    "#reset-form label[for='reset-password']": "newPassword",
    "#reset-form label[for='reset-confirm']": "confirmNew",
    "#show-forgot-password": "forgot",
    "#show-create-account": "create",
    "#back-to-login-from-signup": "back",
    "#back-to-login-from-forgot": "back",
    "#signup-form h2": "create",
    "#forgot-form h2": "resetTitle",
    "#forgot-form > p": "resetHelp",
    "#reset-form h2": "newPasswordTitle",
    "#pending-approval h2": "pendingTitle",
    "#pending-approval > p[data-i18n='pendingDescription']":
      "pendingDescription",
    "#check-approval": "checkApproval",
    "#pending-logout": "signOut",
    "#auth-language-toggle": "language"
  };

  for (const [selector, key] of Object.entries(labels)) {
    text(selector, at(key));
  }

  const submitButtons = {
    "login-form": "signIn",
    "signup-form": "create",
    "forgot-form": "sendReset",
    "reset-form": "saveNew"
  };

  for (const [formId, key] of Object.entries(submitButtons)) {
    const button = document.querySelector(
      `#${formId} button[type="submit"]`
    );

    if (button) button.textContent = at(key);
  }

  document.querySelectorAll(".password-toggle").forEach(button => {
    const input = $(button.dataset.target);
    const visible = input?.type === "text";

    button.setAttribute(
      "aria-label",
      at(visible ? "hidePassword" : "showPassword")
    );
  });
}

/* =====================================================
   ACCOUNT SCREEN NAVIGATION
   ===================================================== */

function showAuthView(view) {
  const views = [
    "login-form",
    "signup-form",
    "forgot-form",
    "reset-form",
    "pending-approval"
  ];

  views.forEach(id => {
    const element = $(id);
    if (element) element.hidden = id !== view;
  });

  $("login-section").hidden = false;
  $("dashboard-section").hidden = true;
}

function showLogin() {
  ++authCheckId;
  bookings = [];
  bookingsLoaded = false;
  selectedPaymentBooking = null;
  showAuthView("login-form");
}

/* =====================================================
   FAMILY APPROVAL
   ===================================================== */

async function isApprovedFamilyMember(user) {
  if (!user) return false;

  const { data, error } = await supabaseClient
    .from("family_members")
    .select("approved")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;

  return data?.approved === true;
}

async function showDashboard() {
  const attempt = ++authCheckId;

  const { data, error } = await supabaseClient.auth.getUser();

  if (error || !data.user) {
    showLogin();
    return;
  }

  if (recoveryMode) {
    showAuthView("reset-form");
    return;
  }

  try {
    const approved = await isApprovedFamilyMember(data.user);

    if (attempt !== authCheckId) return;

    if (!approved) {
      showAuthView("pending-approval");
      setText("approval-message", at("pendingInfo"));
      return;
    }

    $("login-section").hidden = true;
    $("dashboard-section").hidden = false;

    switchTab(currentTab);

    await loadBookings();

  } catch (error) {
    if (attempt !== authCheckId) return;

    showAuthView("pending-approval");
    setText("approval-message", at("approvalError"));

    console.error("Family approval check:", error);
  }
}

/* =====================================================
   NAVIGATION BUTTONS
   ===================================================== */

$("show-create-account")?.addEventListener("click", () => {
  showAuthView("signup-form");
});

$("show-forgot-password")?.addEventListener("click", () => {
  $("forgot-email").value = $("email").value.trim();
  showAuthView("forgot-form");
});

$("back-to-login-from-signup")?.addEventListener(
  "click",
  showLogin
);

$("back-to-login-from-forgot")?.addEventListener(
  "click",
  showLogin
);

$("auth-language-toggle")?.addEventListener("click", () => {
  setLanguage(currentLanguage === "ar" ? "en" : "ar");
});

/* =====================================================
   SIGN IN
   ===================================================== */

$("login-form")?.addEventListener("submit", async event => {
  event.preventDefault();

  const message = $("login-error");
  message.textContent = "";

  const button = event.currentTarget.querySelector(
    'button[type="submit"]'
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

  } catch (error) {
    message.textContent =
      at("authError") + error.message;
  } finally {
    button.disabled = false;
  }
});

/* =====================================================
   CREATE ACCOUNT
   ===================================================== */

$("signup-form")?.addEventListener("submit", async event => {
  event.preventDefault();

  const message = $("signup-message");
  message.textContent = "";

  const email = $("signup-email").value.trim();
  const password = $("signup-password").value;
  const confirmation = $("signup-confirm").value;

  if (password.length < 8) {
    message.textContent = at("passwordShort");
    return;
  }

  if (password !== confirmation) {
    message.textContent = at("passwordMismatch");
    return;
  }

  const button = event.currentTarget.querySelector(
    'button[type="submit"]'
  );

  button.disabled = true;

  try {
    const { data, error } =
      await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: AUTH_REDIRECT
        }
      });

    if (error) throw error;

    message.textContent = at("signupSent");

    // Newly created accounts must wait for approval.
    if (data.session) {
      await supabaseClient.auth.signOut();
    }

  } catch (error) {
    message.textContent =
      at("signupError") + error.message;
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
    'button[type="submit"]'
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

    message.textContent = at("resetSent");

  } catch (error) {
    message.textContent =
      at("authError") + error.message;
  } finally {
    button.disabled = false;
  }
});

/* =====================================================
   SET NEW PASSWORD
   ===================================================== */

$("reset-form")?.addEventListener("submit", async event => {
  event.preventDefault();

  const message = $("reset-message");
  message.textContent = "";

  const password = $("reset-password").value;
  const confirmation = $("reset-confirm").value;

  if (password.length < 8) {
    message.textContent = at("passwordShort");
    return;
  }

  if (password !== confirmation) {
    message.textContent = at("passwordMismatch");
    return;
  }

  const button = event.currentTarget.querySelector(
    'button[type="submit"]'
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
    setText("login-error", at("passwordSaved"));

  } catch (error) {
    message.textContent =
      at("authError") + error.message;
  } finally {
    button.disabled = false;
  }
});

/* =====================================================
   CHECK APPROVAL & LOGOUT
   ===================================================== */

$("check-approval")?.addEventListener(
  "click",
  showDashboard
);

async function signOutFamily() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    showMessage(error.message, true);
    setText("approval-message", error.message);
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
   PASSWORD VISIBILITY
   ===================================================== */

document.querySelectorAll(".password-toggle").forEach(button => {
  button.addEventListener("click", () => {
    const input = $(button.dataset.target);

    if (!input) return;

    const visible = input.type === "text";

    input.type = visible ? "password" : "text";

    button.textContent = visible ? "👁" : "🙈";

    button.setAttribute(
      "aria-label",
      at(visible ? "showPassword" : "hidePassword")
    );

    button.setAttribute(
      "aria-pressed",
      String(!visible)
    );
  });
});

/* =====================================================
   PASSWORD RECOVERY EVENT
   ===================================================== */

supabaseClient.auth.onAuthStateChange(event => {
  if (event === "PASSWORD_RECOVERY") {
    recoveryMode = true;
    showAuthView("reset-form");
  }
});

/* =====================================================
   INITIAL SESSION CHECK
   ===================================================== */

async function checkSession() {
  const recoveryLink =
    location.hash.includes("type=recovery") ||
    new URLSearchParams(location.search)
      .get("type") === "recovery";

  if (recoveryLink) {
    recoveryMode = true;
  }

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

/* =====================================================
   INITIALIZE DASHBOARD
   ===================================================== */

setLanguage(currentLanguage);
checkSession();

/* =====================================================
   END OF ADMIN.JS
   ===================================================== */
