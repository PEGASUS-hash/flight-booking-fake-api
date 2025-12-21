const flights = [
    {
        id: 1,
        airline: "Air France",
        from: "Paris",
        to: "London",
        depart: "08:00",
        arrive: "09:30",
        price: 120
    },
    {
        id: 2,
        airline: "Ryanair",
        from: "Paris",
        to: "London",
        depart: "12:00",
        arrive: "13:20",
        price: 90
    },
    {
        id: 3,
        airline: "British Airways",
        from: "Paris",
        to: "London",
        depart: "18:00",
        arrive: "19:30",
        price: 150
    }
];

let selectedSeat = "";

function searchFlights() {
    let html = "";
    flights.forEach(f => {
        html += `
            <div class="card">
                <h3>${f.airline}</h3>
                <p>${f.from} → ${f.to}</p>
                <p>${f.depart} - ${f.arrive}</p>
                <p><b>${f.price} €</b></p>
                <button onclick="openSeatMap()">Book</button>
            </div>
        `;
    });
    document.getElementById("results").innerHTML = html;
}

function openSeatMap() {
    document.getElementById("seatModal").style.display = "flex";
    let seatHtml = "";

    for (let i = 1; i <= 20; i++) {
        let occupied = i % 5 === 0;
        seatHtml += `
            <div class="seat ${occupied ? 'occupied' : ''}"
                onclick="${occupied ? '' : `selectSeat('A${i}', this)`}">
                A${i}
            </div>
        `;
    }
    document.getElementById("seats").innerHTML = seatHtml;
}

function selectSeat(seat, element) {
    document.querySelectorAll(".seat").forEach(s => s.classList.remove("selected"));
    element.classList.add("selected");
    selectedSeat = seat;
}

function showPassengerForm() {
    if (!selectedSeat) {
        alert("Please select a seat");
        return;
    }
    document.getElementById("seatModal").style.display = "none";
    document.getElementById("passengerModal").style.display = "flex";
}

function showPayment() {
    document.getElementById("passengerModal").style.display = "none";
    document.getElementById("paymentModal").style.display = "flex";
    document.getElementById("seatInfo").innerText = selectedSeat;
}

function pay() {
    alert("Payment Successful ✅");
    location.reload();
}
