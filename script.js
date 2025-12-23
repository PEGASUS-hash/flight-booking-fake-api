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
  tripType: "oneway",
  from: "",
  to: "",
  departDate: "",
  returnDate: "",
  travelers: "1 Adulte, Économie",
  nearbyFrom: false,
  nearbyTo: false,
  directOnly: false,
  flight: null,
  seat: "",
  seatPrice: 0,
  carryOn: 1,
  checkedBags: 0,
  luggageCost: 0,
  passenger: { firstName: "", lastName: "", email: "", passport: "" },
  total: 0
};

// Login/Register functions (simulated)
function showLogin() {
  document.getElementById("loginModal").style.display = "flex";
}

function showRegister() {
  closeModal("loginModal");
  document.getElementById("registerModal").style.display = "flex";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPassword").value;
  if (email && pass) {
    alert("Connexion réussie!");
    closeModal("loginModal");
  } else {
    alert("Veuillez remplir tous les champs.");
  }
}

function register() {
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const pass = document.getElementById("regPassword").value;
  if (name && email && pass) {
    alert("Compte créé!");
    closeModal("registerModal");
  } else {
    alert("Veuillez remplir tous les champs.");
  }
}

// Trip type change
document.querySelectorAll('input[name="tripType"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    selected.tripType = e.target.value;
    document.getElementById("returnDateGroup").style.display = e.target.value === "return" ? "block" : "none";
  });
});

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
  selected.departDate = document.getElementById("departDate").value;
  selected.returnDate = selected.tripType === "return" ? document.getElementById("returnDate").value : "";
  selected.travelers = document.getElementById("travelers").value;
  selected.nearbyFrom = document.getElementById("nearbyFrom").checked;
  selected.nearbyTo = document.getElementById("nearbyTo").checked;
  selected.directOnly = document.getElementById("directOnly").checked;

  if (!selected.from || !selected.to || !selected.departDate || (selected.tripType === "return" && !selected.returnDate)) {
    alert("Please fill in all required fields.");
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
  }, 4000);
}

function showFlights() {
  document.getElementById("flightsPage").style.display = "block";

  let html = "";
  flights.forEach(f => {
    const isDirect = selected.directOnly ? " (Direct)" : "";
    const returnInfo = selected.tripType === "return" ? `, Return: ${selected.returnDate}` : "";
    html += `
      <div class="flight-card" onclick="selectFlight('${f.airline}', ${f.basePrice})">
        <img src="${f.logo}" alt="${f.airline} logo">
        <div class="info">
          <strong>${f.airline}${isDirect}</strong>
          <p>${selected.from} → ${selected.to}</p>
          <p>Date: ${selected.departDate}${returnInfo}</p>
          <p>${selected.travelers}</p>
        </div>
        <div class="price">From €${f.basePrice}</div>
        <button class="book-btn">Select</button>
      </div>`;
  });
  document.getElementById("flightResults").innerHTML = html;
}

// Rest of the script remains similar...
// (Omit for brevity, but include backToSearch, selectFlight, openSeats, etc. as before)