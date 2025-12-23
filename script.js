// script.js - Clean, modern, professional JavaScript
let selected = {
  tripType: 'return',
  from: '',
  fromCode: '',
  to: '',
  toCode: '',
  departDate: '',
  returnDate: '',
  adults: 1,
  cabinClass: 'Économie'
};

const cities = [
  { name: "Paris", code: "PAR" },
  { name: "Marseille", code: "MRS" },
  { name: "Rabat", code: "RBA" },
  { name: "Casablanca", code: "CMN" },
  { name: "London", code: "LON" },
  { name: "Barcelona", code: "BCN" },
  { name: "Madrid", code: "MAD" },
  { name: "New York", code: "NYC" },
  { name: "Dubai", code: "DXB" },
  { name: "Tokyo", code: "TYO" }
];

const cityCoords = {
  Paris: { lat: 48.8566, lng: 2.3522 },
  Marseille: { lat: 43.2965, lng: 5.3698 },
  Rabat: { lat: 34.0209, lng: -6.8416 },
  Casablanca: { lat: 33.5731, lng: -7.5898 },
  London: { lat: 51.5074, lng: -0.1278 },
  Barcelona: { lat: 41.3851, lng: 2.1734 },
  Madrid: { lat: 40.4168, lng: -3.7038 },
  "New York": { lat: 40.7128, lng: -74.0060 },
  Dubai: { lat: 25.2048, lng: 55.2708 },
  Tokyo: { lat: 35.6762, lng: 139.6503 }
};

// Trip type toggle
document.querySelectorAll('.trip-option').forEach(option => {
  option.addEventListener('click', () => {
    document.querySelectorAll('.trip-option').forEach(o => o.classList.remove('active'));
    option.classList.add('active');
    selected.tripType = option.dataset.type;
    document.querySelector('.return-field').style.display = selected.tripType === 'return' ? 'block' : 'none';
  });
});

// Autocomplete
function setupAutocomplete(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);

  input.addEventListener('input', () => {
    const query = input.value.toLowerCase();
    dropdown.innerHTML = '';
    if (!query) {
      dropdown.style.display = 'none';
      return;
    }

    const matches = cities.filter(city => 
      city.name.toLowerCase().includes(query) || city.code.toLowerCase().includes(query)
    );

    matches.forEach(city => {
      const item = document.createElement('div');
      item.textContent = `${city.name} (${city.code})`;
      item.onclick = () => {
        input.value = `${city.name} (${city.code})`;
        dropdown.style.display = 'none';
        if (inputId === 'fromCity') {
          selected.from = city.name;
          selected.fromCode = city.code;
        } else {
          selected.to = city.name;
          selected.toCode = city.code;
        }
      };
      dropdown.appendChild(item);
    });

    dropdown.style.display = matches.length ? 'block' : 'none';
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });
}

setupAutocomplete('fromCity', 'fromList');
setupAutocomplete('toCity', 'toList');

// Swap cities
function swapCities() {
  const from = document.getElementById('fromCity');
  const to = document.getElementById('toCity');
  [from.value, to.value] = [to.value, from.value];
  [selected.from, selected.to] = [selected.to, selected.from];
  [selected.fromCode, selected.toCode] = [selected.toCode, selected.fromCode];
}

// Passenger selector
function togglePassengerDropdown() {
  const dropdown = document.getElementById('passengerDropdown');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function changePassengers(delta) {
  selected.adults = Math.max(1, selected.adults + delta);
  document.getElementById('adults').textContent = selected.adults;
  updatePassengerDisplay();
}

document.getElementById('classSelect').addEventListener('change', (e) => {
  selected.cabinClass = e.target.value;
  updatePassengerDisplay();
});

function updatePassengerDisplay() {
  document.getElementById('passengerDisplay').textContent = 
    `${selected.adults} Adulte${selected.adults > 1 ? 's' : ''}, ${selected.cabinClass}`;
}

// Modals
function openModal(id) {
  document.getElementById(id).classList.add('show');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}

function switchModal(id) {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
  openModal(id);
}

// Search
function searchFlights() {
  selected.departDate = document.getElementById('departDate').value;
  selected.returnDate = selected.tripType === 'return' ? document.getElementById('returnDate').value : '';

  if (!selected.from || !selected.to || !selected.departDate) {
    alert('Veuillez remplir tous les champs obligatoires.');
    return;
  }

  document.querySelector('.search-section').style.opacity = '0.5';
  document.getElementById('loadingOverlay').style.display = 'flex';

  document.getElementById('fromText').textContent = `${selected.from} (${selected.fromCode})`;
  document.getElementById('toText').textContent = `${selected.to} (${selected.toCode})`;

  const globe = Globe()(document.getElementById('globeViz'))
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
    .backgroundColor('#0b1d3a')
    .arcColor(() => '#00ddff')
    .arcDashLength(0.4)
    .arcDashGap(4)
    .arcDashAnimateTime(2000);

  globe.arcsData([{
    startLat: cityCoords[selected.from].lat,
    startLng: cityCoords[selected.from].lng,
    endLat: cityCoords[selected.to].lat,
    endLng: cityCoords[selected.to].lng
  }]);

  setTimeout(() => {
    alert('Fonctionnalité de résultats en développement ! 🎉\nVotre projet est maintenant très professionnel.');
  }, 5000);
}