const SUPABASE_URL = "https://ptpdexboeaummnywwgyv.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_JrsJrxQ86TCBZWRc9g7HTg_bsLXaYJ8";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function loadBookings() {

    const { data, error } = await supabaseClient
    .from("bookings")
        .select("*")
        .order("check_in", { ascending: true });

    if (error) {
    console.error("Error loading bookings:", error.message);
    console.error("Full error:", error);
    return;
}

    const tableBody =
        document.getElementById("bookings-table-body");

    tableBody.innerHTML = "";

    let totalRevenue = 0;
    let upcomingBookings = 0;

    const today = new Date();

    data.forEach(function(booking) {

        totalRevenue += Number(booking.amount) || 0;

        if (new Date(booking.check_in) >= today) {
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


loadBookings(); 