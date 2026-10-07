const SUPABASE_URL = "https://ptpdexboeaummnywwgyv.supabase.co";
const SUPABASE_KEY = "sb_publishable_JrsJrxQ86TCBZWRc9g7HTg_bsLXaYJ8";
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// Elements
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");


// Load bookings
async function loadBookings() {

    const { data, error } = await supabaseClient
        .from("Bookings")
        .select("*")
        .order("check_in", { ascending: true });

    if (error) {
        console.error("Error loading bookings:", error);
        return;
    }

    console.log("Bookings loaded:", data);

    const tableBody = document.getElementById("bookings-table-body");

    tableBody.innerHTML = "";

    let totalRevenue = 0;
    let upcomingBookings = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    data.forEach(function (booking) {

        totalRevenue += Number(booking.amount) || 0;

        const checkInDate = new Date(booking.check_in);

        if (checkInDate >= today) {
            upcomingBookings++;
        }

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${booking.guest_name}</td>
            <td>${booking.platform}</td>
            <td>${booking.check_in}</td>
            <td>${booking.check_out}</td>
            <td>${booking.status}</td>
            <td>${booking.amount ?? "-"} SAR</td>
        `;

        tableBody.appendChild(row);
    });


    document.getElementById("total-bookings").textContent =
        data.length;

    document.getElementById("upcoming-bookings").textContent =
        upcomingBookings;

    document.getElementById("total-revenue").textContent =
        totalRevenue + " SAR";
}


// Show dashboard
function showDashboard() {

    loginSection.hidden = true;
    dashboardSection.hidden = false;

    loadBookings();
}


// Show login
function showLogin() {

    loginSection.hidden = false;
    dashboardSection.hidden = true;
}


// Login
loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    loginError.textContent = "";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

    if (error) {

        console.error("Login error:", error);

        loginError.textContent =
            "Incorrect email or password.";

        return;
    }

    console.log("Logged in:", data.user.email);

    showDashboard();
});


// Logout
logoutBtn.addEventListener("click", async function () {

    await supabaseClient.auth.signOut();

    showLogin();
});


// Check existing session
async function checkSession() {

    const { data } = await supabaseClient.auth.getSession();

    if (data.session) {
        showDashboard();
    } else {
        showLogin();
    }
}


checkSession();