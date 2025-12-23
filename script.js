// script.js - Fully fixed autocomplete (shows on typing "Ra" → Rabat)
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
  { name: "Tokyo", code: "TYO" },
  { name: "Berlin", code: "BER" },
  { name: "Rome", code: "FCO" }
];

const airlines = [
  { name: "Air France", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Air_France_Logo.svg", price: 189 },
  { name: "Ryanair", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Ryanair_logo.svg", price: 79 },
  { name: "Royal Air Maroc", logo: "https://upload.wikimedia.org/wikipedia/commons/1/14/Royal_Air_Maroc_logo.svg", price: 145 },
  { name: "EasyJet", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/EasyJet_logo.svg", price: 99 }
];

// Trip type toggle
document.querySelectorAll('.trip-option').forEach(option => {
  option.addEventListener('click', () => {
    document.querySelectorAll('.trip-option').forEach(o => o.classList.remove('active'));
    option.classList.add('active');
    selected.tripType = option.dataset.type;
    document.querySelector('.return-field').style.display = selected.tripType === 'return' ? 'block' : 'none';
  });
});

// Autocomplete - FIXED: now shows immediately when typing "Ra" → Rabat appears
function setupAutocomplete(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    dropdown.innerHTML = '';

    if (query === '') {
      dropdown.style.display = 'none';
      return;
    }

    const matches = cities.filter(city => 
      city.name.toLowerCase().startsWith(query) || 
      city.name.toLowerCase().includes(query) ||
      city.code.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      dropdown.style.display = 'none';
      return;
    }

    matches.forEach(city => {
      const item = document.createElement('div');
      item.innerHTML = `<strong>${city.name}</strong> <span style="color:#888;">(${city.code})</span>`;
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

    dropdown.style.display = 'block';
  });

  // Keep dropdown open while typing, close only when clicking outside
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });

  // Re-open on focus if there's text
  input.addEventListener('focus', () => {
    if (input.value.trim()) {
      input.dispatchEvent(new Event('input'));
    }
  });
}

setupAutocomplete('fromCity', 'fromList');
setupAutocomplete('toCity', 'toList');

// Swap cities
function swapCities() {
  const from = document.getElementById('fromCity');
  const to = document.getElementById('toCity');
  const tempValue = from.value;
  from.value = to.value;
  to.value = tempValue;

  const tempFrom = selected.from;
  const tempFromCode = selected.fromCode;
  selected.from = selected.to;
  selected.fromCode = selected.toCode;
  selected.to = tempFrom;
  selected.toCode = tempFromCode;
}

// Passenger selector
function togglePassengerDropdown() {
  const dropdown = document.getElementById('passengerDropdown');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  document.querySelector('.arrow').style.transform = dropdown.style.display === 'block' ? 'rotate(180deg)' : 'rotate(0)';
}

function changePassengers(delta) {
  selected.adults = Math.max(1, selected.adults + delta);
  document.getElementById('adults').textContent = selected.adults;
  document.querySelector('button[onclick="changePassengers(-1)"]').disabled = selected.adults === 1;
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

// Search flights - working perfectly
function searchFlights() {
  selected.departDate = document.getElementById('departDate').value;
  selected.returnDate = selected.tripType === 'return' ? document.getElementById('returnDate').value : '';

  if (!selected.from || !selected.to || !selected.departDate) {
    alert('Veuillez sélectionner les villes de départ/arrivée et la date de départ.');
    return;
  }

  if (selected.tripType === 'return' && !selected.returnDate) {
    alert('Veuillez sélectionner une date de retour.');
    return;
  }

  document.querySelector('.search-section').style.display = 'none';
  document.getElementById('resultsSection').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const resultsContainer = document.getElementById('flightResults');
  resultsContainer.innerHTML = '<p style="text-align:center; padding:60px; color:#ccc; font-size:1.2rem;">Chargement des vols...</p>';

  setTimeout(() => {
    resultsContainer.innerHTML = '';

    const numFlights = 6;
    for (let i = 0; i < numFlights; i++) {
      const airline = airlines[Math.floor(Math.random() * airlines.length)];
      const duration = Math.floor(Math.random() * 8) + 2;
      const stops = Math.random() > 0.4 ? 'Direct' : '1 escale';
      const price = airline.price + Math.floor(Math.random() * 120) - 40;

      const card = document.createElement('div');
      card.className = 'flight-card';
      card.innerHTML = `
        <div class="flight-info">
          <img src="${airline.logo}" alt="${airline.name}">
          <div class="flight-details">
            <strong>${airline.name}</strong>
            <p>${selected.fromCode} → ${selected.toCode} • ${duration}h ${stops === 'Direct' ? '' : '• ' + stops}</p>
            <p>${selected.departDate} ${selected.tripType === 'return' ? '→ ' + selected.returnDate : ''} • ${selected.adults} adulte(s)</p>
          </div>
        </div>
        <div class="flight-price">
          <div class="price">€${price}</div>
          <button class="select-btn" onclick="event.stopPropagation(); selectFlight('${airline.name}', ${price})">Sélectionner</button>
        </div>
      `;
      resultsContainer.appendChild(card);
    }
  }, 1000);
}

// Flight selection
function selectFlight(airline, price) {
  alert(`Vol sélectionné avec succès !\n✈️ ${airline}\nPrix : €${price}\n\nProchaines étapes : choix du siège, bagages, paiement...`);
}