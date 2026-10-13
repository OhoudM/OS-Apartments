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
const availabilityResult = document.getElementById("availability-result");
const calendarGrid = document.getElementById("calendar-grid");
const calendarMonth = document.getElementById("calendar-month");

const todayString = localDateString(new Date());
let bookings = [];
let bookingsLoaded = false;
let displayedMonth = new Date();
displayedMonth.setDate(1);

function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function activeBooking(b) {
  return [
    "confirmed",
    "checked_in",
    "checked-in",
    "checked in"
  ].includes(String(b.status || "").toLowerCase());
}

function overlaps(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

function bookingCoversDate(b, date) {
  return activeBooking(b) &&
    b.check_in <= date &&
    date < b.check_out;
}

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

async function loadBookings() {
  dashboardMessage.textContent = "Loading bookings…";
  bookingsLoaded = false;
  availabilityResult.textContent = "";

  try {
    const all = [];
    const pageSize = 500;

    for (let offset = 0; ; offset += pageSize) {
      const { data, error } = await supabaseClient
        .from("Bookings")
        .select("id,guest_name,platform,check_in,check_out,status,amount")
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
    renderTable();
    renderCalendar();

  } catch (error) {
    console.error("Unable to load bookings", error);
    bookings = [];
    bookingsLoaded = false;

    dashboardMessage.textContent =
      "Could not load bookings. Check your Supabase key, login permissions, and internet connection.";

    setText("total-bookings", "—");
    setText("upcoming-bookings", "—");
    setText("total-revenue", "—");

    document.getElementById("bookings-table-body").replaceChildren();
    calendarGrid.replaceChildren();
  }
}

function renderStatistics() {
  const valid = bookings.filter(b => activeBooking(b));

  setText("total-bookings", String(bookings.length));

  setText(
    "upcoming-bookings",
    String(valid.filter(b => b.check_in >= todayString).length)
  );

  const total = valid.reduce(
    (sum, b) => sum + (Number(b.amount) || 0),
    0
  );

  setText(
    "total-revenue",
    `${total.toLocaleString("en-SA", {
      maximumFractionDigits: 2
    })} SAR`
  );
}

function renderTable() {
  const body = document.getElementById("bookings-table-body");
  body.replaceChildren();

  if (!bookings.length) {
    const row = body.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 6;
    cell.textContent = "No bookings recorded yet.";
    return;
  }

  for (const booking of bookings) {
    const row = body.insertRow();

    const values = [
      booking.guest_name,
      booking.platform,
      booking.check_in,
      booking.check_out,
      booking.status,
      booking.amount == null
        ? "—"
        : `${booking.amount} SAR`
    ];

    for (const value of values) {
      const cell = row.insertCell();
      cell.textContent = String(value ?? "—");
    }
  }
}

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
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < offset; i++) {
    const blank = document.createElement("div");
    blank.className = "calendar-day outside";
    blank.setAttribute("aria-hidden", "true");
    calendarGrid.appendChild(blank);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = localDateString(new Date(year, month, day));

    const occupied = bookings.some(
      b => bookingCoversDate(b, date)
    );

    const cell = document.createElement("div");

    cell.className =
      `calendar-day ${occupied ? "booked" : ""} ` +
      `${date === todayString ? "today" : ""}`;

    cell.setAttribute("role", "gridcell");
    cell.setAttribute(
      "aria-label",
      `${date}: ${occupied ? "Booked" : "No booking recorded"}`
    );

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
    loginError.textContent =
      "Unable to sign in. Check your email and password.";
    return;
  }

  showDashboard();
});

document.getElementById("logout-btn").addEventListener(
  "click",
  async () => {
    await supabaseClient.auth.signOut();
    showLogin();
  }
);

document.getElementById("refresh-bookings-btn")
  .addEventListener("click", loadBookings);

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

    availabilityResult.className = "availability-result";

    if (!bookingsLoaded) {
      availabilityResult.textContent =
        "Bookings have not loaded. Please refresh and try again.";
      availabilityResult.classList.add("warning");
      return;
    }

    const start = document.getElementById("check-in-date").value;
    const end = document.getElementById("check-out-date").value;

    if (!start || !end || start >= end) {
      availabilityResult.textContent =
        "Check-out must be after check-in.";
      availabilityResult.classList.add("warning");
      return;
    }

    const conflict = bookings.some(
      b => activeBooking(b) &&
        overlaps(start, end, b.check_in, b.check_out)
    );

    availabilityResult.textContent = conflict
      ? "These dates overlap an existing reservation."
      : "No conflicting reservation recorded in Supabase for these dates. Verify other platforms before accepting a booking.";

    availabilityResult.classList.add(
      conflict ? "warning" : "success"
    );
  });

document.getElementById("check-in-date")
  .addEventListener("change", event => {
    document.getElementById("check-out-date").min =
      event.target.value;
  });

(async function checkSession() {
  if (
    SUPABASE_KEY ===
    "PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE"
  ) {
    loginError.textContent =
      "Setup required: add your Supabase publishable key to admin.js.";
    return;
  }

  const { data, error } = await supabaseClient.auth.getUser();

  if (!error && data.user) {
    showDashboard();
  } else {
    showLogin();
  }
})();