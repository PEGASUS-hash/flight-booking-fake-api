const cities = [
  "Rabat", "Casablanca", "Paris", "Barcelona", "Madrid", "London", "Rome",
  "Brussels", "Berlin", "New York", "Tokyo", "Sydney", "Dubai", "Amsterdam",
  "Vienna", "Zurich", "Lisbon", "Athens", "Istanbul", "Moscow", "Beijing"
];

const cityCoords = {
  "Rabat": { lat: 34.01325, lng: -6.83255 },
  "Casablanca": { lat: 33.5731, lng: -7.5898 },
  "Paris": { lat: 48.85341, lng: 2.3488 },
  "Barcelona": { lat: 41.38879, lng: 2.15899 },
  "Madrid": { lat: 40.4333, lng: -3.7 },
  "London": { lat: 51.50853, lng: -0.12574 },
  "Rome": { lat: 41.90278, lng: 12.49637 },
  "Brussels": { lat: 50.8503, lng: 4.3517 },
  "Berlin": { lat: 52.5167, lng: 13.3833 },
  "New York": { lat: 40.71427, lng: -74.00597 },
  "Tokyo": { lat: 35.6833, lng: 139.7667 },
  "Sydney": { lat: -33.8667, lng: 151 },
  "Dubai": { lat: 25.2048, lng: 55.2708 },
  "Amsterdam": { lat: 52.37518, lng: 4.897976 },
  "Vienna": { lat: 48.2, lng: 16.3667 },
  "Zurich": { lat: 47.3667, lng: 8.55 },
  "Lisbon": { lat: 38.71667, lng: -9.13333 },
  "Athens": { lat: 37.9833, lng: 23.7333 },
  "Istanbul": { lat: 41.01384, lng: 28.94966 },
  "Moscow": { lat: 55.75, lng: 37.6167 },
  "Beijing": { lat: 39.9075, lng: 116.39723 }
};

const flights = [
  { airline: "Air France", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Air_France_Logo.svg", basePrice: 120 },
  { airline: "Ryanair", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Ryanair_logo.svg", basePrice: 90 },
  { airline: "Iberia", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Iberia-logo.svg", basePrice: 110 }
];

let selected = {
  from: "",
  to: "",
  date: "",
  flight: null,
  seat: "",
  seatPrice: 0,
  carryOn: 1,
  checkedBags: 0,
  luggageCost: 0,
  passenger: { firstName: "", lastName: "", email: "", passport: "" },
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
      .filter(city => city.toLowerCase().includes(query))
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

// Search flights with 3D globe animation
function searchFlights() {
  selected.from = document.getElementById("fromCity").value.trim();
  selected.to = document.getElementById("toCity").value.trim();
  selected.date = document.getElementById("dateInput").value;

  if (!selected.from || !selected.to || !selected.date) {
    alert("Please fill in all fields.");
    return;
  }

  if (!cityCoords[selected.from] || !cityCoords[selected.to]) {
    alert("Coordinates not available for selected cities.");
    return;
  }

  // Show loading with globe
  document.getElementById("searchPage").style.display = "none";
  const loading = document.getElementById("loadingAnimation");
  loading.style.display = "flex";
  document.getElementById("loadingText").textContent = `Flying from ${selected.from} to ${selected.to}...`;

  // Initialize Globe
  const globe = Globe()
    (document.getElementById('globeViz'))
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundColor('rgba(0,0,0,0)');

  // Add flight arc
  const arc = [{
    startLat: cityCoords[selected.from].lat,
    startLng: cityCoords[selected.from].lng,
    endLat: cityCoords[selected.to].lat,
    endLng: cityCoords[selected.to].lng,
    color: ['yellow', 'red'],
    arcDashLength: 0.2,
    arcDashGap: 0.8,
    arcDashInitialGap: () => Math.random(),
    arcDashAnimateTime: 3000
  }];
  globe.arcsData(arc);

  // Auto-rotate
  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.5;

  // Focus on midpoint
  const midLat = (cityCoords[selected.from].lat + cityCoords[selected.to].lat) / 2;
  const midLng = (cityCoords[selected.from].lng + cityCoords[selected.to].lng) / 2;
  globe.pointOfView({ lat: midLat, lng: midLng, altitude: 1.5 });

  // Proceed after animation
  setTimeout(() => {
    loading.style.display = "none";
    showFlights();
  }, 4000);  // Slightly longer for visibility
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
          <p>Date: ${selected.date}</p>
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
  const exitRows = [5];  // Emergency exit at row 5
  for (let row = 1; row <= 10; row++) {
    if (exitRows.includes(row)) {
      html += `<div class="exit-row">Emergency Exit Row ${row}</div>`;
      continue;
    }
    html += `<div class="seat-row">`;
    for (let col of ['A', 'B', 'C', '', 'D', 'E', 'F']) {
      if (col === '') {
        html += `<div class="aisle"></div>`;
        continue;
      }
      const seatNum = `${row}${col}`;
      const occupied = Math.random() < 0.2;
      const priceAdd = row <= 2 ? 50 : (exitRows.includes(row + 1) || exitRows.includes(row - 1) ? 30 : 0);  // Extra for premium and exit rows
      const price = selected.flight.basePrice + priceAdd;
      html += `
        <div class="seat ${occupied ? 'occupied' : ''}" 
             ${occupied ? '' : `onclick="selectSeat('${seatNum}', ${price}, this)"`}
             role="button" tabindex="0" aria-label="Seat ${seatNum}${occupied ? ' (occupied)' : ''} - €${price}">
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

function goToDetails() {
  document.getElementById("luggagePage").style.display = "none";
  document.getElementById("detailsPage").style.display = "block";
}

function backToLuggage() {
  document.getElementById("detailsPage").style.display = "none";
  document.getElementById("luggagePage").style.display = "block";
}

function goToPayment() {
  selected.passenger.firstName = document.getElementById("firstName").value.trim();
  selected.passenger.lastName = document.getElementById("lastName").value.trim();
  selected.passenger.email = document.getElementById("email").value.trim();
  selected.passenger.passport = document.getElementById("passport").value.trim();

  if (!selected.passenger.firstName || !selected.passenger.lastName || !selected.passenger.email || !selected.passenger.passport) {
    alert("Please fill in all passenger details.");
    return;
  }

  document.getElementById("detailsPage").style.display = "none";
  document.getElementById("paymentPage").style.display = "block";

  selected.total = selected.seatPrice + selected.luggageCost;
  document.getElementById("summary").textContent = `Summary: Flight from ${selected.from} to ${selected.to} with ${selected.flight.airline}, Date: ${selected.date}, Passenger: ${selected.passenger.firstName} ${selected.passenger.lastName} (Email: ${selected.passenger.email}, Passport: ${selected.passenger.passport}), Seat: ${selected.seat}, Luggage: ${selected.carryOn} carry-on + ${selected.checkedBags} checked, Total: €${selected.total}`;
}

function backToDetails() {
  document.getElementById("paymentPage").style.display = "none";
  document.getElementById("detailsPage").style.display = "block";
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