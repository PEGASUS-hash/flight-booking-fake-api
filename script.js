const flights = [
    {
        airline: "Air France",
        route: "Paris → London",
        time: "08:00 - 09:30",
        price: 120
    },
    {
        airline: "Ryanair",
        route: "Paris → London",
        time: "12:00 - 13:20",
        price: 90
    },
    {
        airline: "British Airways",
        route: "Paris → London",
        time: "18:00 - 19:30",
        price: 150
    }
];

let selectedSeat = "";

function setStep(stepNumber) {
    document.querySelectorAll(".step").forEach((s, i) => {
        s.classList.toggle("active", i === stepNumber - 1);
    });
}

function searchFlights() {
    setStep(1);
    let html = "";
    flights.forEach(f => {
        html += `
            <div class="card">
                <h3>${f.airline}</h3>
                <p>${f.route}</p>
                <p>${f.time}</p>
                <p><b>${f.price} €</b></p>
                <button onclick="openSeatMap()">Book</button>
            </div>
        `;
    });
    document.getElementById("results").innerHTML = html;
}

/* STEP 2 */
function openSeatMap() {
    setStep(2);
    seatModal.style.display = "flex";
    let seats = "";

    for (let i = 1; i <= 20; i++) {
        let occupied = i % 6 === 0;
        seats += `
            <div class="seat ${occupied ? 'occupied' : ''}"
            onclick="${occupied ? '' : `selectSeat('A${i}', this)`}">
            A${i}
            </div>`;
    }
    document.getElementById("seats").innerHTML = seats;
}

function selectSeat(seat, el) {
    document.querySelectorAll(".seat").forEach(s => s.classList.remove("selected"));
    el.classList.add("selected");
    selectedSeat = seat;
}

/* STEP 3 */
function showPassengerForm() {
    if (!selectedSeat) {
        alert("Please select a seat first");
        return;
    }
    setStep(3);
    seatModal.style.display = "none";
    passengerModal.style.display = "flex";
}

/* STEP 4 */
function showPayment() {
    setStep(4);
    passengerModal.style.display = "none";
    paymentModal.style.display = "flex";
    document.getElementById("seatInfo").innerText = selectedSeat;
}

function pay() {
    alert("Payment Successful ✅\nThank you for your booking!");
    location.reload();
}
