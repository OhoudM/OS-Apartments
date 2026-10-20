const SUPABASE_URL = "https://ptpdexboeaummnywwgyv.supabase.co";
const SUPABASE_KEY = "sb_publishable_JrsJrxQ86TCBZWRc9g7HTg_bsLXaYJ8";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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
let selectedFinanceMonth = ""; // Empty means All Time

const translations = {
  en: {
    management: "Management Dashboard",
    portalSubtitle: "Sign in to manage your apartment.",
    forgotPassword: "Forgot Password?",
    createAccount: "Create Account",
    confirmPassword: "Confirm Password",
    backToLogin: "Back to Sign In",
    pendingTitle: "Waiting for Approval",
    pendingDescription: "A family administrator must approve your account before you can view bookings.",
    checkApproval: "Check Approval",
    resetPassword: "Reset Password",
    forgotDescription: "Enter your email to receive a password reset link.",
    sendResetLink: "Send Reset Link",
    chooseNewPassword: "Choose New Password",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    saveNewPassword: "Save New Password",
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
    overviewSummaryTitle: "Booking & Earnings Summary",
    overviewSummaryDesc: "A quick look at bookings and amounts",
    netOverviewEarnings: "Net Booking Earnings (after fees)",
    guestTotals: "Total Booking Value",
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
    sat: "Sat",

    todayOverview: "Today's Overview",
    arrivingToday: "Arriving Today",
    departingToday: "Departing Today",
    currentlyStaying: "Currently Staying",
    quickActionsDesc: "Common tasks for your family",
    bookingCalendar: "Booking Calendar",
    bookingsTableDesc: "View reservations and payment details",
    apartmentExpenses: "Apartment Expenses",
    monthlyPerformanceDesc: "Revenue, operating expenses and net profit",
    operatingRevenue: "Operating Revenue",
    operatingExpenses: "Operating Expenses",
    netProfit: "Net Profit",
    occupancyRate: "Occupancy Rate",
    annualCostCoverage: "Annual Cost Coverage",
    annualCostCoverageDesc: "Track progress toward your annual operating budget",
    annualBudget: "Annual Budget",
    annualRent: "Annual Rent",
    cleaningBudget: "Cleaning Budget",
    emergencyReserve: "Emergency Reserve",
    monthlyBookingDetails: "Monthly Booking Details",
    monthlyBookingDetailsDesc: "Bookings, nights and average apartment pricing",
    bookedNights: "Booked Nights",
    averageNightlyRate: "Average Nightly Rate",
    averageBookingValue: "Average Booking Value",
    earningsByMonth: "Earnings by Month",
    earningsByMonthDesc: "Compare your apartment's monthly performance",
    bookingsByMonth: "Bookings by Month",
    bookingsByMonthDesc: "Compare monthly reservation counts",
    revenueVsExpenses: "Revenue vs. Expenses",
    revenueVsExpensesDesc: "Compare income, costs and profit over time",
    bookingsByPlatform: "Bookings by Platform",
    bookingsByPlatformDesc: "See where your reservations come from",
    addBookingTitle: "Add Booking",
    totalBookingAmount: "Total Booking Amount (SAR)",
    addExpenseTitle: "Add Expense",
    date: "Date",
    category: "Category",
    description: "Description",
    amount: "Amount",
    amountSAR: "Amount (SAR)",
    saveExpense: "Save Expense",
    cancel: "Cancel",
    deleteExpense: "Delete Expense"
  },

  
  ar: {
    management: "لوحة إدارة الشقق",
    portalSubtitle: "سجّل الدخول لإدارة شقتك.",
    forgotPassword: "نسيت كلمة المرور؟",
    createAccount: "إنشاء حساب",
    confirmPassword: "تأكيد كلمة المرور",
    backToLogin: "العودة لتسجيل الدخول",
    pendingTitle: "بانتظار الموافقة",
    pendingDescription: "يجب أن يوافق مسؤول العائلة على الحساب قبل عرض الحجوزات.",
    checkApproval: "التحقق من الموافقة",
    resetPassword: "إعادة تعيين كلمة المرور",
    forgotDescription: "أدخل بريدك الإلكتروني لاستلام رابط الاستعادة.",
    sendResetLink: "إرسال رابط الاستعادة",
    chooseNewPassword: "اختيار كلمة مرور جديدة",
    newPassword: "كلمة المرور الجديدة",
    confirmNewPassword: "تأكيد كلمة المرور الجديدة",
    saveNewPassword: "حفظ كلمة المرور الجديدة",
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
    overviewSummaryTitle: "ملخص الحجوزات والأرباح",
    overviewSummaryDesc: "نظرة سريعة على الحجوزات والمبالغ",
    netOverviewEarnings: "صافي مبلغ الحجوزات بعد خصم الرسوم",
    guestTotals: "إجمالي قيمة الحجوزات",
    hostEarnings: "صافي مبلغ الحجوزات بعد خصم الرسوم",
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
    hostTotal: "صافي مبلغ الحجوزات بعد خصم الرسوم",
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
    sat: "السبت",

    // Updated HTML translations
    todayOverview: "ملخص اليوم",
    arrivingToday: "الوصول اليوم",
    departingToday: "المغادرة اليوم",
    currentlyStaying: "المقيمون حاليًا",
    quickActionsDesc: "المهام اليومية للعائلة",
    bookingCalendar: "تقويم الحجوزات",
    bookingsTableDesc: "تفاصيل الحجوزات والمدفوعات",
    apartmentExpenses: "مصاريف الشقة",
    monthlyPerformanceDesc: "الإيرادات والمصاريف التشغيلية وصافي الربح",
    operatingRevenue: "الإيرادات التشغيلية",
    operatingExpenses: "المصاريف التشغيلية",
    netProfit: "صافي الربح",
    occupancyRate: "نسبة الإشغال",
    annualCostCoverage: "تغطية التكاليف السنوية",
    annualCostCoverageDesc: "متابعة التقدم نحو تغطية الميزانية التشغيلية السنوية",
    annualBudget: "الميزانية السنوية",
    annualRent: "الإيجار السنوي",
    cleaningBudget: "ميزانية النظافة",
    emergencyReserve: "احتياطي الطوارئ",
    monthlyBookingDetails: "تفاصيل الحجوزات الشهرية",
    monthlyBookingDetailsDesc: "الحجوزات والليالي ومتوسط أسعار الإقامة",
    bookedNights: "الليالي المحجوزة",
    averageNightlyRate: "متوسط سعر الليلة",
    averageBookingValue: "متوسط قيمة الحجز",
    earningsByMonth: "الأرباح حسب الشهر",
    earningsByMonthDesc: "مقارنة أداء الشقة شهريًا",
    bookingsByMonth: "الحجوزات حسب الشهر",
    bookingsByMonthDesc: "مقارنة عدد الحجوزات الشهرية",
    revenueVsExpenses: "الإيرادات مقابل المصاريف",
    revenueVsExpensesDesc: "مقارنة الإيرادات والتكاليف والأرباح بمرور الوقت",
    bookingsByPlatform: "الحجوزات حسب المنصة",
    bookingsByPlatformDesc: "معرفة مصادر الحجوزات",
    addBookingTitle: "إضافة حجز",
    totalBookingAmount: "إجمالي مبلغ الحجز (ريال)",
    addExpenseTitle: "إضافة مصروف",
    date: "التاريخ",
    category: "الفئة",
    description: "الوصف",
    amount: "المبلغ",
    amountSAR: "المبلغ (ريال)",
    saveExpense: "حفظ المصروف",
    cancel: "إلغاء",
    deleteExpense: "حذف المصروف"
  }
};


/* =====================================================
   PART 3 — DASHBOARD HELPERS
   ===================================================== */

function t(key) {
  return translations[currentLanguage]?.[key] || key;
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

/* Confirmed Booking.com guest total for reservation 5747026049.
 * Display-only correction; no database writes or sync changes.
 * Other bookings continue to use their recorded guest_total.
 */
function overviewGuestTotal(booking) {
  const recorded = safeNumber(booking.guest_total);
  if (recorded !== null) return recorded;
  if (String(booking.platform || "").toLowerCase() === "booking.com" &&
      String(booking.confirmation_code || "") === "5747026049") {
    return safeNumber(booking.original_price);
  }
  return null;
}

function sumField(field) {
  const records = activeBookings();
  let total = 0;
  let recorded = 0;

  for (const booking of records) {
    const amount = field === "guest_total"
      ? overviewGuestTotal(booking)
      : safeNumber(booking[field]);

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
 * Your database uses original_guest_payment
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
let editingExpenseId = null;
let savingExpenseChange = false;

async function loadExpenses() {
  const { data, error } = await supabaseClient
    .from("Expenses")
    .select("*")
    .order("expense_date", { ascending: false });

  if (error) {
    console.error("Could not load expenses:", error);
    showMessage(error.message, true);
    return;
  }

  expenses = data || [];
  refreshFinanceMonth();
  renderReports();
}


/* Finance-only month selection; does not change Reports or booking data. */
function financeMonthBookings() {
  return activeBookings().filter(booking =>
    !selectedFinanceMonth || String(booking.check_in || "").startsWith(selectedFinanceMonth)
  );
}

function financeMonthExpenses() {
  return expenses.filter(expense =>
    !selectedFinanceMonth || String(expense.expense_date || "").startsWith(selectedFinanceMonth)
  );
}

function updateFinanceMonthOptions() {
  const select = $("finance-month");
  if (!select) return;
  const months = new Set();
  const today = new Date();
  months.add(`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}`);
  activeBookings().forEach(booking => {
    if (/^\d{4}-\d{2}/.test(String(booking.check_in || ""))) months.add(booking.check_in.slice(0,7));
  });
  expenses.forEach(expense => {
    if (/^\d{4}-\d{2}/.test(String(expense.expense_date || ""))) months.add(expense.expense_date.slice(0,7));
  });
  if (selectedFinanceMonth) months.add(selectedFinanceMonth);
  select.replaceChildren();
  const all = document.createElement("option");
  all.value = "";
  all.textContent = currentLanguage === "ar" ? "كل الفترات" : "All Time";
  select.append(all);
  [...months].sort().reverse().forEach(key => {
    const [year, month] = key.split("-").map(Number);
    const option = document.createElement("option");
    option.value = key;
    option.textContent = `${monthName(month-1)} ${year}`;
    select.append(option);
  });
  select.value = selectedFinanceMonth;
}

function refreshFinanceMonth() {
  updateFinanceMonthOptions();
  renderFinanceSummary();
  renderRemainingPayments();
  renderExpenses();
}

$("finance-month")?.addEventListener("change", event => {
  selectedFinanceMonth = event.target.value;
  refreshFinanceMonth();
});

/* =========================================
   DISPLAY EXPENSES
   ========================================= */

function renderExpenses() {
  const tbody = $("expenses-table-body");
  if (!tbody) return;

  tbody.replaceChildren();

  const headerRow = tbody.closest("table")?.querySelector("thead tr");

  if (headerRow && !headerRow.querySelector("[data-expense-actions]")) {
    const th = document.createElement("th");
    th.dataset.expenseActions = "true";
    headerRow.append(th);
  }

  const heading = headerRow?.querySelector("[data-expense-actions]");

  if (heading) {
    heading.textContent = currentLanguage === "ar"
      ? "الإجراءات"
      : "Actions";
  }

  let total = 0;

  financeMonthExpenses().forEach((expense) => {
    const amount = Number(expense.amount) || 0;
    total += amount;

    const row = document.createElement("tr");

    [
      expense.expense_date,
      expense.category,
      expense.description || "—",
      money(amount)
    ].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });

    const actions = document.createElement("td");
    actions.className = "expense-actions";

    // EDIT BUTTON
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "expense-edit-btn";
    editButton.textContent = currentLanguage === "ar"
      ? "تعديل"
      : "Edit";

    editButton.addEventListener("click", () => {
      openEditExpense(expense);
    });

    // DELETE BUTTON
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "expense-delete-btn";
    deleteButton.textContent = currentLanguage === "ar"
      ? "حذف"
      : "Delete";

    deleteButton.addEventListener("click", () => {
      deleteExpense(expense);
    });

    actions.append(editButton, deleteButton);
    row.append(actions);
    tbody.append(row);
  });

  if (!financeMonthExpenses().length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 5;
    cell.textContent = currentLanguage === "ar"
      ? "لا توجد مصاريف مسجلة"
      : "No expenses recorded";

    row.append(cell);
    tbody.append(row);
  }

  setText("finance-expenses", money(total));
}


/* =========================================
   EDIT EXPENSE
   ========================================= */

function openEditExpense(expense) {
  if (expense.id == null) {
    showMessage("Expense ID is missing.", true);
    return;
  }

  editingExpenseId = expense.id;

  $("add-expense-form").reset();
  $("expense-date").value = expense.expense_date || "";
  $("expense-category").value = expense.category || "";
  $("expense-description").value = expense.description || "";
  $("expense-amount").value = expense.amount ?? "";

  setText("expense-message", "");

  setText(
    "save-expense",
    currentLanguage === "ar" ? "حفظ التعديلات" : "Save Changes"
  );

  $("add-expense-dialog").showModal();
}


/* =========================================
   DELETE EXPENSE CONFIRMATION
   ========================================= */

let expensePendingDeletion = null;
let deletingExpense = false;

function deleteExpense(expense) {
  if (expense.id == null) {
    showMessage("Expense ID is missing.", true);
    return;
  }

  expensePendingDeletion = expense;

  const isArabic = currentLanguage === "ar";

  setText(
    "delete-expense-title",
    isArabic ? "حذف المصروف؟" : "Delete Expense?"
  );

  setText(
    "delete-expense-description",
    isArabic
      ? "هل أنت متأكد من حذف هذا المصروف؟ لا يمكن التراجع عن هذا الإجراء."
      : "Are you sure you want to delete this expense? This action cannot be undone."
  );

  setText(
    "delete-expense-details",
    `${expense.description || expense.category} — ${money(expense.amount)}`
  );

  setText("delete-expense-error", "");

  setText(
    "cancel-delete-expense",
    isArabic ? "إلغاء" : "Cancel"
  );

  setText(
    "confirm-delete-expense",
    isArabic ? "حذف المصروف" : "Delete Expense"
  );

  $("delete-expense-dialog").showModal();
}


/* =========================================
   RESET DELETE DIALOG STATE
   ========================================= */

$("delete-expense-dialog")?.addEventListener("close", () => {
  expensePendingDeletion = null;
});


/* =========================================
   CONFIRM DELETE EXPENSE
   ========================================= */

document.addEventListener("click", async (event) => {
  if (!event.target.closest("#confirm-delete-expense")) return;
  if (!expensePendingDeletion || deletingExpense) return;

  deletingExpense = true;

  const button = $("confirm-delete-expense");
  const expenseId = expensePendingDeletion.id;

  button.disabled = true;
  setText("delete-expense-error", "");

  try {
    const { data, error } = await supabaseClient
      .from("Expenses")
      .delete()
      .eq("id", expenseId)
      .select("id");

    if (error) throw error;

    if (!data?.length) {
      throw new Error(
        "Expense was not deleted. Check Supabase permissions."
      );
    }

    $("delete-expense-dialog").close();

    await loadExpenses();

    showMessage(
      currentLanguage === "ar"
        ? "تم حذف المصروف بنجاح"
        : "Expense deleted successfully."
    );
  } catch (error) {
    setText("delete-expense-error", error.message);
  } finally {
    deletingExpense = false;
    button.disabled = false;
  }
});


/* =========================================
   RENDER COMPLETE DASHBOARD
   ========================================= */

function renderEverything() {
  renderStatistics();
  renderToday();
  renderCalendar();
  renderTable();
  updateFinanceMonthOptions();
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
      overviewGuestTotal(booking)
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

  // Payment corrections are available only for manually entered Direct bookings.
  const correctionButton = $("open-payment-correction");
  correctionButton.hidden = String(booking.platform || "").toLowerCase() !== "direct" || cancelledBooking(booking);
  correctionButton.onclick = () => openPaymentCorrection(booking.id);
  setText("payment-correction-message", "");

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
    selectedFinanceMonth
      ? money(monthlyEarningsMap().get(selectedFinanceMonth) || 0)
      : displayTotal("amount")
  );

  const tracked = financeMonthBookings().filter(
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
    financeMonthBookings().length - tracked.length;

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

  const expenseTotal = financeMonthExpenses().reduce(
    (sum, expense) => sum + (Number(expense.amount) || 0),
    0
  );

  setText("finance-expenses", money(expenseTotal));
}


/* =====================================================
   REMAINING PAYMENTS
   ===================================================== */

function renderRemainingPayments() {
  const tbody = $("remaining-payments-body");
  if (!tbody) return;

  tbody.replaceChildren();

  const unpaid = financeMonthBookings().filter(
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

/* Guest booking totals details: same active bookings and guest_total field as Overview. */
function showGuestTotalsDetails() {
  const dialog = $("guest-totals-dialog");
  const content = $("guest-totals-breakdown-content");
  if (!dialog || !content) return;
  content.replaceChildren();

  const groups = new Map();
  activeBookings().forEach((booking) => {
    const platform = booking.platform || "Other";
    if (!groups.has(platform)) groups.set(platform, { total: 0, count: 0, missing: 0 });
    const group = groups.get(platform);
    group.count++;
    const amount = overviewGuestTotal(booking);
    if (amount === null) group.missing++;
    else group.total += amount;
  });

  function addLine(label, value) {
    const row = createElement("div", "breakdown-row");
    row.append(createElement("span", "", label), createElement("strong", "", value));
    content.append(row);
  }

  for (const [platform, group] of groups.entries()) {
    addLine(`${platform} (${group.count})`, `${money(group.total)}${group.missing ? " *" : ""}`);
  }
  addLine(t("guestTotals"), displayTotal("guest_total"));
  dialog.showModal();
}

$("guest-totals-card")?.addEventListener("click", showGuestTotalsDetails);
$("guest-totals-card")?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    showGuestTotalsDetails();
  }
});
$("close-guest-totals-dialog")?.addEventListener("click", () => $("guest-totals-dialog").close());

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
// A stay crossing two months contributes to both.
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

/* =====================================================
   REPORT MONTH SELECTION
   ===================================================== */

function reportMonthOptions() {
  const select = $("report-month");
  if (!select) return;

  const map = monthlyEarningsMap();
  const expenseMap = monthlyExpenseMap();
  const now = new Date();

  const currentKey = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  const months = new Set([
    ...map.keys(),
    ...expenseMap.keys(),
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

/* =====================================================
   MONTHLY EXPENSE CALCULATIONS
   ===================================================== */

function monthlyExpenseMap() {
  const totals = new Map();

  expenses.forEach((expense) => {
    const date = String(expense.expense_date || "");
    const amount = safeNumber(expense.amount);

    if (!parseDate(date) || amount === null) return;

    const key = date.slice(0, 7);
    totals.set(key, (totals.get(key) || 0) + amount);
  });

  return totals;
}

/* =====================================================
   MONTHLY BOOKING DETAILS
   ===================================================== */

function monthlyBookingDetails(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);

  if (!year || !month) {
    return { count: 0, nights: 0, revenue: 0 };
  }

  const monthStart = Date.UTC(year, month - 1, 1);
  const monthEnd = Date.UTC(year, month, 1);

  let count = 0;
  let nights = 0;
  let revenue = 0;

  activeBookings().forEach((booking) => {
    if (booking.check_in?.startsWith(monthKey)) {
      count++;
    }

    const start = parseDate(booking.check_in);
    const end = parseDate(booking.check_out);
    const totalNights = bookingNights(booking);
    const earnings = safeNumber(booking.amount);

    if (!start || !end || totalNights <= 0) return;

    const startUTC = Date.UTC(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );

    const endUTC = Date.UTC(
      end.getFullYear(),
      end.getMonth(),
      end.getDate()
    );

    const overlap = Math.max(
      0,
      Math.min(endUTC, monthEnd) -
      Math.max(startUTC, monthStart)
    );

    const nightsInMonth = overlap / 86400000;

    nights += nightsInMonth;

    if (earnings !== null) {
      revenue += earnings * nightsInMonth / totalNights;
    }
  });

  return { count, nights, revenue };
}

/* =====================================================
   ANNUAL BUDGET COVERAGE
   ===================================================== */

function renderAnnualCoverage(earningsMap) {
  const ANNUAL_BUDGET = 42000;

  const year = Number(selectedReportMonth.slice(0, 4));

  const annualRevenue = [...earningsMap.entries()]
    .filter(([key]) => key.startsWith(`${year}-`))
    .reduce((sum, [, amount]) => sum + amount, 0);

  const covered = Math.min(
    100,
    Math.max(0, annualRevenue / ANNUAL_BUDGET * 100)
  );

  const remaining = Math.max(
    0,
    ANNUAL_BUDGET - annualRevenue
  );

  const surplus = Math.max(
    0,
    annualRevenue - ANNUAL_BUDGET
  );

  const isArabic = currentLanguage === "ar";

  // Signed annual budget balance: negative until annual revenue covers the target.
  const budgetBalance = annualRevenue - ANNUAL_BUDGET;
  const budgetBalanceCard = $("annual-budget-balance-card");
  setText(
    "annual-budget-balance-label",
    isArabic ? "رصيد الميزانية السنوية" : "Annual Budget Balance"
  );
  setText(
    "annual-budget-balance",
    `${budgetBalance < 0 ? "−" : budgetBalance > 0 ? "+" : ""}${money(Math.abs(budgetBalance))}`
  );
  setText(
    "annual-budget-balance-note",
    budgetBalance < 0
      ? (isArabic ? "لم تتم تغطية الميزانية بعد" : "Budget not yet covered")
      : (isArabic ? "تمت تغطية الميزانية" : "Annual budget covered")
  );
  if (budgetBalanceCard) {
    budgetBalanceCard.classList.toggle("budget-below", budgetBalance < 0);
    budgetBalanceCard.classList.toggle("budget-covered", budgetBalance >= 0);
  }

  setText(
    "annual-coverage-status",
    isArabic
      ? `تغطية الميزانية السنوية ${year}: ${covered.toFixed(1)}%`
      : `Annual budget coverage ${year}: ${covered.toFixed(1)}%`
  );

  setText(
    "annual-coverage-details",
    remaining > 0
      ? (isArabic
          ? `المتبقي للوصول للميزانية: ${money(remaining)}`
          : `Remaining to budget target: ${money(remaining)}`)
      : (isArabic
          ? `تجاوز الإيرادات للميزانية: ${money(surplus)}`
          : `Revenue above budget target: ${money(surplus)}`)
  );

  const bar = $("annual-coverage-bar");

  if (bar) {
    bar.style.width = `${covered}%`;
  }

  $("annual-coverage-progress")?.setAttribute(
    "aria-valuenow",
    covered.toFixed(1)
  );
}

/* =====================================================
   RENDER MONTHLY REPORTS
   ===================================================== */

function renderReports() {
  reportMonthOptions();

  const earningsMap = monthlyEarningsMap();
  const expenseMap = monthlyExpenseMap();

  const month = selectedReportMonth;

  const revenue = earningsMap.get(month) || 0;
  const expenseTotal = expenseMap.get(month) || 0;
  const profit = revenue - expenseTotal;

  setText("monthly-earnings", money(revenue));
  setText("monthly-expenses", money(expenseTotal));
  setText("monthly-profit", money(profit));

  const occupancy = monthlyOccupancy(month);

  setText(
    "monthly-occupancy",
    occupancy === null ? "—" : `${occupancy}%`
  );

  const details = monthlyBookingDetails(month);

  setText("report-booking-count", details.count);
  setText("report-booked-nights", details.nights);

  setText(
    "report-average-nightly-rate",
    details.nights > 0
      ? money(details.revenue / details.nights)
      : "—"
  );

  const startingBookings = activeBookings().filter(
    (booking) => booking.check_in?.startsWith(month)
  );

  const bookingValues = startingBookings
    .map((booking) => safeNumber(booking.amount))
    .filter((value) => value !== null);

  setText(
    "report-average-booking-value",
    bookingValues.length
      ? money(
          bookingValues.reduce(
            (sum, value) => sum + value,
            0
          ) / bookingValues.length
        )
      : "—"
  );

  renderAnnualCoverage(earningsMap);
  renderEarningsChart(earningsMap);
  renderPlatformChart();
  renderMonthlyBookingsChart(earningsMap, expenseMap);
  renderMonthlyFinancialChart(earningsMap, expenseMap);
  translateReportLabels();
}

/* =====================================================
   REPORT MONTH CHANGE
   ===================================================== */

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
      `${new Date(year, month - 1, 1).toLocaleString(
        "en-US",
        { month: "short" }
      )} ${String(year).slice(-2)}`
    );

    label.style.marginTop = "8px";

    group.append(amountLabel, bar, label);
    chart.append(group);
  });

  container.append(chart);
}


/* =====================================================
   BOOKINGS BY PLATFORM
   ===================================================== */

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

  [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([platform, count], index) => {
      const row = createElement(
        "div",
        "platform-chart-row"
      );

      row.style.marginBottom = "18px";

      const heading = createElement(
        "div",
        "platform-chart-heading"
      );

      heading.style.display = "flex";
      heading.style.justifyContent = "space-between";
      heading.style.gap = "12px";
      heading.style.marginBottom = "7px";

      heading.append(
        createElement("strong", "", platform),
        createElement(
          "span",
          "",
          `${count} (${Math.round(
            count / total * 100
          )}%)`
        )
      );

      const track = createElement(
        "div",
        "platform-chart-track"
      );

      track.style.height = "12px";
      track.style.borderRadius = "999px";
      track.style.background = "var(--border, #e7e5dc)";
      track.style.overflow = "hidden";

      const bar = createElement(
        "div",
        "platform-chart-fill"
      );

      bar.style.height = "100%";
      bar.style.width = `${count / total * 100}%`;
      bar.style.background =
        colors[index % colors.length];

      track.append(bar);
      row.append(heading, track);
      container.append(row);
    });
}


/* =====================================================
   SHARED REPORT CHART HELPERS
   ===================================================== */

function reportChartMonths(earningsMap, expenseMap) {
  const months = new Set([
    ...earningsMap.keys(),
    ...expenseMap.keys()
  ]);

  activeBookings().forEach((booking) => {
    if (booking.check_in) {
      months.add(booking.check_in.slice(0, 7));
    }
  });

  return [...months].sort().slice(-12);
}

function reportMonthLabel(key) {
  const [year, month] = key.split("-").map(Number);

  return new Date(
    year,
    month - 1,
    1
  ).toLocaleString("en-US", {
    month: "short",
    year: "2-digit"
  });
}


/* =====================================================
   BOOKINGS BY MONTH
   ===================================================== */

function renderMonthlyBookingsChart(
  earningsMap,
  expenseMap
) {
  const container = $("monthly-bookings-chart");
  if (!container) return;

  container.replaceChildren();
  container.dir = "ltr";

  const months = reportChartMonths(
    earningsMap,
    expenseMap
  );

  if (!months.length) {
    container.textContent = t("noChartData");
    return;
  }

  const counts = months.map(
    (month) =>
      activeBookings().filter(
        (booking) =>
          booking.check_in?.startsWith(month)
      ).length
  );

  const max = Math.max(1, ...counts);

  const chart = createElement("div");
  chart.className = "report-bar-chart";

  months.forEach((month, index) => {
    const group = createElement(
      "div",
      "report-bar-group"
    );

    const value = createElement(
      "strong",
      "report-bar-value",
      counts[index]
    );

    const bar = createElement(
      "div",
      "report-bar"
    );

    bar.style.height = `${Math.max(
      3,
      counts[index] / max * 155
    )}px`;

    bar.style.background = "#7c8a64";

    const label = createElement(
      "span",
      "report-bar-month",
      reportMonthLabel(month)
    );

    group.append(value, bar, label);
    chart.append(group);
  });

  container.append(chart);
}


/* =====================================================
   REVENUE VS EXPENSES
   ===================================================== */

function renderMonthlyFinancialChart(
  earningsMap,
  expenseMap
) {
  const container = $("monthly-financial-chart");
  if (!container) return;

  container.replaceChildren();
  container.dir = "ltr";

  const months = reportChartMonths(
    earningsMap,
    expenseMap
  );

  if (!months.length) {
    container.textContent = t("noChartData");
    return;
  }

  const values = months.flatMap((month) => [
    earningsMap.get(month) || 0,
    expenseMap.get(month) || 0
  ]);

  const max = Math.max(1, ...values);

  const legend = createElement(
    "div",
    "report-chart-legend"
  );

  [
    [
      currentLanguage === "ar"
        ? "الإيرادات"
        : "Revenue",
      "#7c8a64"
    ],
    [
      currentLanguage === "ar"
        ? "المصاريف"
        : "Expenses",
      "#b69a65"
    ]
  ].forEach(([name, color]) => {
    const item = createElement(
      "span",
      "",
      `● ${name}`
    );

    item.style.color = color;
    legend.append(item);
  });

  const chart = createElement("div");
  chart.className = "report-bar-chart";

  months.forEach((month) => {
    const revenue = earningsMap.get(month) || 0;
    const expense = expenseMap.get(month) || 0;

    const group = createElement(
      "div",
      "report-bar-group"
    );

    const pair = createElement(
      "div",
      "report-bar-pair"
    );

    [
      [revenue, "#7c8a64"],
      [expense, "#b69a65"]
    ].forEach(([amount, color]) => {
      const bar = createElement(
        "div",
        "report-bar"
      );

      bar.style.height = `${Math.max(
        3,
        amount / max * 155
      )}px`;

      bar.style.background = color;
      bar.title = money(amount);

      pair.append(bar);
    });

    group.append(
      pair,
      createElement(
        "span",
        "report-bar-month",
        reportMonthLabel(month)
      )
    );

    chart.append(group);
  });

  container.append(legend, chart);
}


/* =====================================================
   DIRECT BOOKING PAYMENT CORRECTION ONLY
   Does not change platform sync, dates, booking total or other records.
   ===================================================== */
let paymentCorrectionBookingId = null;
let paymentCorrectionSaving = false;

function paymentCorrectionLabel(en, ar) {
  return document.documentElement.lang === "ar" ? ar : en;
}

function updatePaymentCorrectionPreview() {
  const booking = bookings.find(b => String(b.id) === String(paymentCorrectionBookingId));
  if (!booking) return;
  const received = Number($("payment-correction-received").value);
  const total = safeNumber(booking.guest_total);
  setText("payment-correction-balance", Number.isFinite(received) && received >= 0
    ? `${paymentCorrectionLabel("Remaining balance", "المبلغ المتبقي")}: ${money(Math.max(0, (cents(total) - cents(received)) / 100))}`
    : "");
}

function openPaymentCorrection(id) {
  const booking = bookings.find(b => String(b.id) === String(id));
  if (!booking || String(booking.platform || "").toLowerCase() !== "direct" || cancelledBooking(booking)) return;
  paymentCorrectionBookingId = booking.id;
  setText("payment-correction-heading", paymentCorrectionLabel("Edit direct booking payment", "تعديل دفعة الحجز المباشر"));
  setText("payment-correction-received-label", paymentCorrectionLabel("Amount received (SAR)", "المبلغ المستلم (ريال)"));
  setText("payment-correction-notes-label", paymentCorrectionLabel("Notes", "ملاحظات"));
  setText("cancel-payment-correction", paymentCorrectionLabel("Cancel", "إلغاء"));
  setText("save-payment-correction", paymentCorrectionLabel("Save payment", "حفظ الدفعة"));
  $("payment-correction-received").value = String(safeNumber(booking.original_guest_payment) ?? 0);
  $("payment-correction-notes").value = booking.notes || "";
  setText("payment-correction-error", "");
  updatePaymentCorrectionPreview();
  $("breakdown-dialog").close();
  $("payment-correction-dialog").showModal();
}

$("payment-correction-received")?.addEventListener("input", updatePaymentCorrectionPreview);
["close-payment-correction", "cancel-payment-correction"].forEach(id => {
  $(id)?.addEventListener("click", () => $("payment-correction-dialog").close());
});

$("payment-correction-form")?.addEventListener("submit", async event => {
  event.preventDefault();
  if (paymentCorrectionSaving || !bookingsLoaded) return;
  const booking = bookings.find(b => String(b.id) === String(paymentCorrectionBookingId));
  if (!booking || String(booking.platform || "").toLowerCase() !== "direct" || cancelledBooking(booking)) return;
  const received = Number($("payment-correction-received").value);
  const total = safeNumber(booking.guest_total);
  const errorBox = $("payment-correction-error");
  if (!Number.isFinite(received) || received < 0 || cents(received) > cents(total)) {
    errorBox.textContent = paymentCorrectionLabel("Enter a valid amount between zero and the booking total.", "أدخلي مبلغاً صحيحاً بين الصفر وإجمالي الحجز.");
    return;
  }
  paymentCorrectionSaving = true;
  $("save-payment-correction").disabled = true;
  errorBox.textContent = "";
  try {
    const { data: authData, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !authData?.user) throw new Error(t("sessionExpired"));
    const updated = {
      original_guest_payment: cents(received) / 100,
      financial_status: cents(received) >= cents(total) ? "paid" : cents(received) === 0 ? "unpaid" : "partially_paid",
      notes: $("payment-correction-notes").value.trim() || null
    };
    const { data, error } = await supabaseClient.from("Bookings")
      .update(updated)
      .eq("id", booking.id)
      .eq("platform", booking.platform)
      .select("id");
    if (error) throw error;
    if (!data || data.length !== 1) throw new Error(paymentCorrectionLabel("Update not permitted or booking not found. Check Supabase permissions.", "لم يُسمح بالتعديل أو لم يتم العثور على الحجز. تحققي من صلاحيات Supabase."));
    $("payment-correction-dialog").close();
    await loadBookings();
    if (bookingsLoaded) showMessage(paymentCorrectionLabel("Payment updated successfully.", "تم تحديث الدفعة بنجاح."));
  } catch (error) {
    errorBox.textContent = t("saveError") + error.message;
  } finally {
    paymentCorrectionSaving = false;
    $("save-payment-correction").disabled = false;
  }
});

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
   ADD OR EDIT EXPENSES
   ===================================================== */

$("open-add-expense")?.addEventListener("click", () => {
  editingExpenseId = null;

  $("add-expense-form").reset();
  $("expense-date").value = dateString(new Date());

  setText("expense-message", "");
  setText(
    "save-expense",
    currentLanguage === "ar" ? "حفظ المصروف" : "Save Expense"
  );

  $("add-expense-dialog").showModal();
});

$("add-expense-form")?.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();

    if (savingExpenseChange) return;

    const button = $("save-expense");
    const message = $("expense-message");

    const expense = {
      expense_date: $("expense-date").value,
      category: $("expense-category").value,
      description:
        $("expense-description").value.trim() || null,
      amount: Number($("expense-amount").value)
    };

    if (
      !parseDate(expense.expense_date) ||
      !expense.category ||
      !Number.isFinite(expense.amount) ||
      expense.amount <= 0
    ) {
      message.textContent =
        currentLanguage === "ar"
          ? "يرجى إدخال بيانات مصروف صحيحة."
          : "Please enter valid expense details.";
      return;
    }

    savingExpenseChange = true;
    button.disabled = true;
    message.textContent = "";

    try {
      const { data: authData, error: authError } =
        await supabaseClient.auth.getUser();

      if (authError || !authData.user) {
        throw new Error(t("sessionExpired"));
      }

      if (editingExpenseId !== null) {
        const { data, error } = await supabaseClient
          .from("Expenses")
          .update(expense)
          .eq("id", editingExpenseId)
          .select("id");

        if (error) throw error;

        if (!data?.length) {
          throw new Error(
            "No record updated. Check Supabase permissions."
          );
        }
      } else {
        const { data, error } = await supabaseClient
          .from("Expenses")
          .insert(expense)
          .select("id");

        if (error) throw error;

        if (!data?.length) {
          throw new Error(
            "Expense was not saved. Check Supabase permissions."
          );
        }
      }

      editingExpenseId = null;
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
      savingExpenseChange = false;
      button.disabled = false;
      button.textContent =
        currentLanguage === "ar"
          ? "حفظ المصروف"
          : "Save Expense";
    }
  }
);

$("close-expense-dialog")?.addEventListener(
  "click",
  () => $("add-expense-dialog").close()
);

$("add-expense-dialog")?.addEventListener(
  "close",
  () => {
    editingExpenseId = null;
  }
);

/* =====================================================
   PART 11 — LANGUAGE AND THEME
   ===================================================== */

function setLanguage(language) {
  currentLanguage = language === "ar" ? "ar" : "en";

  localStorage.setItem("osAdminLanguage", currentLanguage);
  setText("portal-subtitle", t("portalSubtitle"));

  document.documentElement.lang = currentLanguage;
  document.documentElement.dir =
    currentLanguage === "ar" ? "rtl" : "ltr";

  document.documentElement.style.fontVariantNumeric =
    "lining-nums";

  // Translate HTML elements using data-i18n attributes.
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    const translation = translations[currentLanguage]?.[key];

    if (!translation) return;

    // Keep the guest name visible in an open booking dialog.
    if (
      element.id === "breakdown-guest" &&
      $("breakdown-dialog")?.open
    ) {
      return;
    }

    element.textContent = translation;
  });

  const buttonLabels = {
    "logout-btn": "logout",
    "open-add-booking": "addBooking",
    "quick-add-booking": "addBooking",
    "quick-view-bookings": "viewBookings",
    "quick-view-finances": "viewFinances",
    "refresh-bookings-btn": "refresh",
    "save-manual-booking": "saveBooking",
    "save-payment": "savePayment",
    "save-expense": "saveExpense"
  };

  for (const [id, key] of Object.entries(buttonLabels)) {
    if ($(id)) setText(id, t(key));
  }

  setText(
    "language-toggle",
    currentLanguage === "ar" ? "English" : "العربية"
  );

  setText(
    "auth-language-toggle",
    currentLanguage === "ar" ? "English" : "العربية"
  );

  const tabKeys = {
    overview: "overview",
    bookings: "bookingsTab",
    finances: "finances",
    reports: "reports"
  };

  document.querySelectorAll(".tab-btn").forEach((button) => {
    const key = tabKeys[button.dataset.tab];

    if (key && translations[currentLanguage]?.[key]) {
      button.textContent = t(key);
    }
  });

  const expenseCategories = {
    Cleaning: "cleaning",
    Maintenance: "maintenance",
    Utilities: "utilities",
    Supplies: "supplies",
    Other: "other"
  };

  const categorySelect = $("expense-category");

  if (categorySelect) {
    for (const option of categorySelect.options) {
      const key = expenseCategories[option.value];

      if (key && translations[currentLanguage]?.[key]) {
        option.textContent = t(key);
      }
    }
  }

  translateReportLabels();
  updateFinanceMonthOptions();
  updateThemeButtons();

  // Refresh language-dependent dashboard content.
  if (typeof bookingsLoaded !== "undefined" && bookingsLoaded) {
    renderEverything();
  }

  if (typeof expenses !== "undefined") {
    renderExpenses();
  }
}


/* =====================================================
   REPORT LABEL TRANSLATIONS
   ===================================================== */

function translateReportLabels() {
  const labels = {
    "report-revenue-label": "operatingRevenue",
    "report-expenses-label": "operatingExpenses",
    "report-profit-label": "netProfit",
    "monthly-occupancy-label": "occupancyRate",
    "cost-coverage-title": "annualCostCoverage",
    "cost-coverage-description": "annualCostCoverageDesc",
    "annual-budget-label": "annualBudget",
    "annual-rent-label": "annualRent",
    "annual-cleaning-label": "cleaningBudget",
    "annual-reserve-label": "emergencyReserve",
    "monthly-booking-details-title": "monthlyBookingDetails",
    "monthly-booking-details-description": "monthlyBookingDetailsDesc",
    "monthly-nights-label": "bookedNights",
    "monthly-nightly-rate-label": "averageNightlyRate",
    "monthly-booking-value-label": "averageBookingValue",
    "booking-trends-title": "bookingsByMonth",
    "booking-trends-description": "bookingsByMonthDesc",
    "financial-trends-title": "revenueVsExpenses",
    "financial-trends-description": "revenueVsExpensesDesc"
  };

  Object.entries(labels).forEach(([id, key]) => {
    const element = $(id);

    if (element && translations[currentLanguage]?.[key]) {
      element.textContent = t(key);
    }
  });

  const reportPanels = [
    ["monthlyPerformance", "monthlyPerformanceDesc"],
    ["annualCostCoverage", "annualCostCoverageDesc"],
    ["monthlyBookingDetails", "monthlyBookingDetailsDesc"],
    ["earningsByMonth", "earningsByMonthDesc"],
    ["bookingsByMonth", "bookingsByMonthDesc"],
    ["revenueVsExpenses", "revenueVsExpensesDesc"],
    ["bookingsByPlatform", "bookingsByPlatformDesc"]
  ];

  document.querySelectorAll("#tab-reports > .panel")
    .forEach((panel, index) => {
      const keys = reportPanels[index];
      if (!keys) return;

      const title = panel.querySelector(".section-header h2");
      const description = panel.querySelector(".section-header p");

      if (title) title.textContent = t(keys[0]);

      if (description) {
        description.textContent = t(keys[1]);
      }
    });

  const monthSelect = $("report-month");

  if (monthSelect) {
    for (const option of monthSelect.options) {
      if (!/^\d{4}-\d{2}$/.test(option.value)) continue;

      const [year, month] = option.value.split("-").map(Number);

      option.textContent = new Intl.DateTimeFormat(
        currentLanguage === "ar" ? "ar-SA" : "en-US",
        {
          month: "long",
          year: "numeric",
          timeZone: "UTC"
        }
      ).format(new Date(Date.UTC(year, month - 1, 1)));
    }
  }
}


/* =====================================================
   LANGUAGE BUTTONS
   ===================================================== */

function toggleLanguage() {
  setLanguage(currentLanguage === "ar" ? "en" : "ar");
}

$("language-toggle")?.addEventListener(
  "click",
  toggleLanguage
);

$("auth-language-toggle")?.addEventListener(
  "click",
  toggleLanguage
);


/* =====================================================
   LIGHT / DARK THEME
   ===================================================== */

const OS_THEME_KEY = "osApartmentsTheme";

function updateThemeButtons() {
  const isDark =
    document.documentElement.getAttribute("data-theme") === "dark";

  document.querySelectorAll(".theme-toggle").forEach((button) => {
    button.textContent = isDark
      ? currentLanguage === "ar"
        ? "☀️ الوضع الفاتح"
        : "☀️ Light Mode"
      : currentLanguage === "ar"
        ? "🌙 الوضع الداكن"
        : "🌙 Dark Mode";

    button.setAttribute("aria-pressed", String(isDark));
  });
}

function applyTheme(theme) {
  const selected = theme === "dark" ? "dark" : "light";

  document.documentElement.setAttribute(
    "data-theme",
    selected
  );

  localStorage.setItem(OS_THEME_KEY, selected);

  updateThemeButtons();
}

document.addEventListener("click", (event) => {
  const button = event.target.closest(".theme-toggle");

  if (!button) return;

  const current =
    document.documentElement.getAttribute("data-theme");

  applyTheme(current === "dark" ? "light" : "dark");
});

function initializeTheme() {
  applyTheme(
    localStorage.getItem(OS_THEME_KEY) === "dark"
      ? "dark"
      : "light"
  );
}

initializeTheme();

/* =====================================================
   AUTHENTICATION CONFIGURATION AND TRANSLATIONS
   ===================================================== */
const AUTH_REDIRECT = new URL("admin.html", window.location.href).href.split("#")[0].split("?")[0];
let recoveryMode =
  new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery" ||
  new URLSearchParams(window.location.search).get("type") === "recovery";
let authVersion = 0;
const authWords = {
  en: {
    pending: "Your account is waiting for family approval.",
    short: "Password must contain at least 8 characters.",
    mismatch: "Passwords do not match.",
    sent: "Check your email for the confirmation link. Family approval is required.",
    resetSent: "If this email is registered, a reset link will be sent.",
    saved: "Password updated. Please sign in.",
    show: "Show password", hide: "Hide password"
  },
  ar: {
    pending: "حسابك بانتظار موافقة مسؤول العائلة.",
    short: "يجب أن تتكون كلمة المرور من ٨ أحرف على الأقل.",
    mismatch: "كلمتا المرور غير متطابقتين.",
    sent: "تحقق من بريدك الإلكتروني لتأكيد الحساب. يجب انتظار الموافقة.",
    resetSent: "إذا كان البريد مسجلاً، سيصلك رابط الاستعادة.",
    saved: "تم تحديث كلمة المرور. يرجى تسجيل الدخول.",
    show: "إظهار كلمة المرور", hide: "إخفاء كلمة المرور"
  }
};
function authText(key) {
  return authWords[currentLanguage]?.[key] || key;
}

/* =====================================================
   PART 12 — AUTHENTICATION VIEWS
   ===================================================== */

function showAuthView(id) {
  [
    "login-form",
    "signup-form",
    "forgot-form",
    "reset-form",
    "pending-approval"
  ].forEach((name) => {
    const element = $(name);
    if (element) element.hidden = name !== id;
  });

  if ($("login-section")) {
    $("login-section").hidden = false;
  }

  if ($("dashboard-section")) {
    $("dashboard-section").hidden = true;
  }
}

function showLogin() {
  authVersion++;
  bookings = [];
  bookingsLoaded = false;
  selectedPaymentBooking = null;

  showAuthView("login-form");
}

/* =====================================================
   FAMILY APPROVAL
   ===================================================== */

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

  return data?.approved === true;
}

/* =====================================================
   SHOW APPROVED DASHBOARD
   ===================================================== */

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

    if (request !== authVersion) return;

    await loadExpenses();

    if (request !== authVersion) return;

    renderEverything();
  } catch (error) {
    if (request !== authVersion) return;

    console.error("Dashboard initialization failed:", error);

    showMessage(
      currentLanguage === "ar"
        ? `تعذر تحميل لوحة التحكم: ${error.message}`
        : `Could not load dashboard: ${error.message}`,
      true
    );
  }
}

/* =====================================================
   AUTHENTICATION NAVIGATION
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

/* =====================================================
   SIGN IN
   ===================================================== */

$("login-form")?.addEventListener(
  "submit",
  async (event) => {
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
    } catch (error) {
      message.textContent =
        t("loginError") + error.message;
    } finally {
      button.disabled = false;
    }
  }
);

/* =====================================================
   FAMILY ACCOUNT REGISTRATION
   ===================================================== */

$("signup-form")?.addEventListener(
  "submit",
  async (event) => {
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
    } catch (error) {
      message.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  }
);

/* =====================================================
   FORGOT PASSWORD
   ===================================================== */

$("forgot-form")?.addEventListener(
  "submit",
  async (event) => {
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
    } catch (error) {
      message.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  }
);

/* =====================================================
   SAVE NEW PASSWORD
   ===================================================== */

$("reset-form")?.addEventListener(
  "submit",
  async (event) => {
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
    } catch (error) {
      message.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  }
);

/* =====================================================
   CHECK APPROVAL AND LOG OUT
   ===================================================== */

$("check-approval")?.addEventListener(
  "click",
  showDashboard
);

async function signOutFamily() {
  const { error } =
    await supabaseClient.auth.signOut();

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
   SHOW / HIDE PASSWORD
   ===================================================== */

document.querySelectorAll(".password-toggle").forEach(
  (button) => {
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
   SUPABASE AUTH EVENTS
   ===================================================== */

supabaseClient.auth.onAuthStateChange((event) => {
  if (event === "PASSWORD_RECOVERY") {
    recoveryMode = true;
    showAuthView("reset-form");
  }

  if (event === "SIGNED_OUT") {
    showLogin();
  }
});

/* =====================================================
   CHECK EXISTING SESSION
   ===================================================== */

async function checkSession() {
  try {
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
  } catch (error) {
    console.error("Session check failed:", error);
    showLogin();
  }
}

/* =====================================================
   REFRESH DASHBOARD DATA
   ===================================================== */

$("refresh-bookings-btn")?.addEventListener(
  "click",
  async () => {
    await loadBookings();
    await loadExpenses();
  }
);

/* =====================================================
   INITIALIZE OS APARTMENTS DASHBOARD
   ===================================================== */

// Theme is already initialized in Part 11.
// Do not add another theme initialization here.

setLanguage(currentLanguage);
checkSession();

