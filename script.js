const cities = [
  "Rabat", "Casablanca", "Paris", "Barcelona", "Madrid", "London", "Rome",
  "Brussels", "Berlin", "New York", "Tokyo", "Sydney", "Dubai", "Amsterdam",
  "Vienna", "Zurich", "Lisbon", "Athens", "Istanbul", "Moscow", "Beijing"
];

const flights = [
  { airline: "Air France", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Air_France_Logo.svg", basePrice: 120 },
  { airline: "Ryanair", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Ryanair_logo.svg", basePrice: 90 },
  { airline: "Iberia", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Iberia-logo.svg", basePrice: 110 }
];

let selected = {
  from: "",
  to: "",
  date: "",
  wholeMonth: false,
  flight: null,
  seat: "",
  seatPrice: 0,
  carryOn: 1,
  checkedBags: 0,
  luggageCost: 0,
  total: 0
};

// Autocomplete setup
function setupAutoComplete(inputId, listId) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);

  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    list.innerHTML = "";

    if (!query) return;

    cities
      .filter(city => city.toLowerCase().includes(query))  // Changed to includes for broader search
      .sort((a, b) => a.toLowerCase().indexOf(query) - b.toLowerCase().indexOf(query))
      .forEach(city => {
        const item = document.createElement("div");
        item.textContent = city;
        item.tabIndex = 0;
        item.addEventListener('click', () => {
          input.value = city;
          list.innerHTML = "";
        });
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') item.click();
        });
        list.appendChild(item);
      });
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !list.contains(e.target)) {
      list.innerHTML = "";
    }
  });
}

setupAutoComplete("fromCity", "fromList");
setupAutoComplete("toCity", "toList");

// Search flights with animation
function searchFlights() {
  selected.from = document.getElementById("fromCity").value.trim();
  selected.to = document.getElementById("toCity").value.trim();
  selected.date = document.getElementById("dateInput").value;
  selected.wholeMonth = document.getElementById("wholeMonth").checked;

  if (!selected.from || !selected.to || (!selected.date && !selected.wholeMonth)) {
    alert("Please fill in all fields.");
    return;
  }

  // Show loading animation
  document.getElementById("searchPage").style.display = "none";
  const loading = document.getElementById("loadingAnimation");
  loading.style.display = "flex";
  document.getElementById("loadingText").textContent = `Flying from ${selected.from} to ${selected.to}...`;

  // Simulate delay for animation
  setTimeout(() => {
    loading.style.display = "none";
    showFlights();
  }, 3000);  // 3 seconds animation
}

function showFlights() {
  document.getElementById("flightsPage").style.display = "block";

  let html = "";
  flights.forEach(f => {
    html += `
      <div class="flight-card" onclick="selectFlight('${f.airline}', ${f.basePrice})">
        <img src="${f.logo}" alt="${f.airline} logo">
        <div class="info">
          <strong>${f.airline}</strong>
          <p>${selected.from} → ${selected.to}</p>
          <p>Date: ${selected.wholeMonth ? "Any in month" : selected.date}</p>
        </div>
        <div class="price">From €${f.basePrice}</div>
        <button class="book-btn">Select</button>
      </div>`;
  });
  document.getElementById("flightResults").innerHTML = html;
}

function backToSearch() {
  document.getElementById("flightsPage").style.display = "none";
  document.getElementById("searchPage").style.display = "block";
}

// Select flight and go to seats
function selectFlight(airline, basePrice) {
  selected.flight = { airline, basePrice };
  openSeats();
}

function openSeats() {
  document.getElementById("flightsPage").style.display = "none";
  document.getElementById("seatPage").style.display = "block";

  let html = "";
  for (let row = 1; row <= 10; row++) {
    html += `<div class="row">`;
    for (let col of ['A', 'B', 'C', '', 'D', 'E', 'F']) {  // Aisle in middle
      if (col === '') {
        html += `<div class="aisle"></div>`;
        continue;
      }
      const seatNum = `${row}${col}`;
      const occupied = Math.random() < 0.2;  // 20% occupied
      const price = row <= 2 ? 50 : (row <= 5 ? 20 : 0);  // Premium front rows
      html += `
        <div class="seat ${occupied ? 'occupied' : ''}" 
             ${occupied ? '' : `onclick="selectSeat('${seatNum}', ${price + selected.flight.basePrice}, this)"`}
             role="button" tabindex="0" aria-label="Seat ${seatNum}${occupied ? ' (occupied)' : ''} - €${price + selected.flight.basePrice}">
          ${seatNum}
        </div>`;
    }
    html += `</div>`;
  }
  document.getElementById("seats").innerHTML = html;
}

function selectSeat(seat, price, element) {
  document.querySelectorAll(".seat").forEach(s => s.classList.remove("selected"));
  element.classList.add("selected");
  selected.seat = seat;
  selected.seatPrice = price;
  document.getElementById("seatPrice").textContent = `Selected Seat Price: €${price}`;
}

function backToFlights() {
  document.getElementById("seatPage").style.display = "none";
  document.getElementById("flightsPage").style.display = "block";
}

function goToLuggage() {
  if (!selected.seat) {
    alert("Please select a seat.");
    return;
  }
  document.getElementById("seatPage").style.display = "none";
  document.getElementById("luggagePage").style.display = "block";

  // Update luggage cost on change
  document.getElementById("checkedBags").addEventListener('input', updateLuggageCost);
  updateLuggageCost();
}

function updateLuggageCost() {
  selected.carryOn = parseInt(document.getElementById("carryOn").value) || 0;
  selected.checkedBags = parseInt(document.getElementById("checkedBags").value) || 0;
  selected.luggageCost = selected.checkedBags * 30;
  document.getElementById("luggageCost").textContent = `Luggage Cost: €${selected.luggageCost}`;
}

function backToSeats() {
  document.getElementById("luggagePage").style.display = "none";
  document.getElementById("seatPage").style.display = "block";
}

function goToPayment() {
  document.getElementById("luggagePage").style.display = "none";
  document.getElementById("paymentPage").style.display = "block";

  selected.total = selected.seatPrice + selected.luggageCost;
  document.getElementById("summary").textContent = `Summary: Flight from ${selected.from} to ${selected.to} with ${selected.flight.airline}, Seat ${selected.seat}, Luggage: ${selected.carryOn} carry-on + ${selected.checkedBags} checked, Total: €${selected.total}`;
}

function backToLuggage() {
  document.getElementById("paymentPage").style.display = "none";
  document.getElementById("luggagePage").style.display = "block";
}

// Payment validation
document.getElementById("paymentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const cardNumber = document.getElementById("cardNumber").value.replace(/\s/g, '');
  const expDate = document.getElementById("expDate").value;
  const cvv = document.getElementById("cvv").value;

  if (!/^\d{16}$/.test(cardNumber)) {
    alert("Card number must be exactly 16 digits.");
    return;
  }
  if (!/^\d{2}\/\d{2}$/.test(expDate)) {
    alert("Expiry date must be in MM/YY format.");
    return;
  }
  if (!/^\d{3}$/.test(cvv)) {
    alert("CVV must be 3 digits.");
    return;
  }

  alert("Payment Successful! ✅\nThank you for booking with SkyBook.");
  location.reload();
});

// Auto-format card number
document.getElementById("cardNumber").addEventListener("input", function (e) {
  let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  let parts = [];
  for (let i = 0; i < v.length; i += 4) {
    parts.push(v.substring(i, i + 4));
  }
  e.target.value = parts.join(' ');
});