const cities = [
  { name: "Rabat", code: "RBA" },
  { name: "Casablanca", code: "CMN" },
  { name: "Paris", code: "CDG" },
  { name: "Barcelona", code: "BCN" },
  { name: "Madrid", code: "MAD" },
  { name: "London", code: "LHR" },
  { name: "Rome", code: "FCO" },
  { name: "Brussels", code: "BRU" },
  { name: "Berlin", code: "BER" },
  { name: "New York", code: "JFK" },
  { name: "Tokyo", code: "NRT" },
  { name: "Sydney", code: "SYD" },
  { name: "Dubai", code: "DXB" },
  { name: "Amsterdam", code: "AMS" },
  { name: "Vienna", code: "VIE" },
  { name: "Zurich", code: "ZRH" },
  { name: "Lisbon", code: "LIS" },
  { name: "Athens", code: "ATH" },
  { name: "Istanbul", code: "IST" },
  { name: "Moscow", code: "SVO" },
  { name: "Beijing", code: "PEK" },
  { name: "Marseille", code: "MRS" }
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
  "Beijing": { lat: 39.9075, lng: 116.39723 },
  "Marseille": { lat: 43.2965, lng: 5.3698 }
};

const flights = [
  { airline: "Air France", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Air_France_Logo.svg", basePrice: 120 },
  { airline: "Ryanair", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Ryanair_logo.svg", basePrice: 90 },
  { airline: "Iberia", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Iberia-logo.svg", basePrice: 110 }
];

let selected = {
  tripType: "oneway",
  from: "",
  fromCode: "",
  to: "",
  toCode: "",
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

// Modal animations
function openModal(id) {
  const modal = document.getElementById(id);
  modal.style.display = "flex";
  setTimeout(() => modal.classList.add("show"), 10);
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove("show");
  setTimeout(() => modal.style.display = "none", 300);
}

function showLogin() {
  openModal("loginModal");
}

function showRegister() {
  closeModal("loginModal");
  openModal("registerModal");
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
    adjustGridColumns();
  });
});

function adjustGridColumns() {
  const form = document.querySelector(".search-form");
  const cols = selected.tripType === "return" ? "repeat(6, 1fr)" : "repeat(5, 1fr)";
  form.style.gridTemplateColumns = cols;
}

// Switch cities
function switchCities() {
  const fromInput = document.getElementById("fromCity");
  const toInput = document.getElementById("toCity");
  const temp = fromInput.value;
  fromInput.value = toInput.value;
  toInput.value = temp;
}

// Autocomplete with codes
function setupAutoComplete(inputId, listId) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);

  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    list.innerHTML = "";

    if (!query) return;

    cities
      .filter(city => city.name.toLowerCase().includes(query) || city.code.toLowerCase().includes(query))
      .sort((a, b) => a.name.toLowerCase().indexOf(query) - b.name.toLowerCase().indexOf(query))
      .forEach(city => {
        const item = document.createElement("div");
        item.textContent = `${city.name} (${city.code})`;
        item.tabIndex = 0;
        item.addEventListener('click', () => {
          input.value = `${city.name} (${city.code})`;
          list.innerHTML = "";
          if (inputId === "fromCity") {
            selected.from = city.name;
            selected.fromCode = city.code;
          } else {
            selected.to = city.name;
            selected.toCode = city.code;
          }
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

// Search flights
function searchFlights() {
  selected.departDate = document.getElementById("departDate").value;
  selected.returnDate = selected.tripType === "return" ? document.getElementById("returnDate").value : "";
  selected.travelers = document.getElementById("travelers").value;
  selected.nearbyFrom = document.getElementById("nearbyFrom").checked;
  selected.nearbyTo = document.getElementById("nearbyTo").checked;
  selected.directOnly = document.getElementById("directOnly").checked;

  if (!selected.from || !selected.to || !selected.departDate || (selected.tripType === "return" && !selected.returnDate)) {
    alert("Veuillez remplir tous les champs requis.");
    return;
  }

  // Show loading with globe
  const searchPage = document.getElementById("searchPage");
  searchPage.classList.add("fade-out");
  setTimeout(() => {
    searchPage.style.display = "none";
    const loading = document.getElementById("loadingAnimation");
    loading.style.display = "flex";
    loading.classList.add("fade-in");
    document.getElementById("loadingText").textContent = `Recherche de vols de ${selected.from} (${selected.fromCode}) à ${selected.to} (${selected.toCode})...`;
  }, 300);

  // Initialize Globe (similar as before)
  const globe = Globe()
    (document.getElementById('globeViz'))
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundColor('rgba(0,0,0,0)');

  const arc = [{
    startLat: cityCoords[selected.from].lat,
    startLng: cityCoords[selected.from].lng,
    endLat: cityCoords[selected.to].lat,
    endLng: cityCoords[selected.to].lng,
    color: ['#00c6ff', '#007bff'],
    arcDashLength: 0.2,
    arcDashGap: 0.8,
    arcDashInitialGap: Math.random(),
    arcDashAnimateTime: 3000
  }];
  globe.arcsData(arc);

  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.5;

  const midLat = (cityCoords[selected.from].lat + cityCoords[selected.to].lat) / 2;
  const midLng = (cityCoords[selected.from].lng + cityCoords[selected.to].lng) / 2;
  globe.pointOfView({ lat: midLat, lng: midLng, altitude: 1.5 });

  setTimeout(() => {
    document.getElementById("loadingAnimation").classList.remove("fade-in");
    document.getElementById("loadingAnimation").classList.add("fade-out");
    setTimeout(() => {
      document.getElementById("loadingAnimation").style.display = "none";
      showFlights();
    }, 300);
  }, 4000);
}

// Rest of the script (showFlights, etc.) remains similar, with added animations where possible