const cities = [
  { name: "Rabat", code: "RBA", country: "Maroc" },
  { name: "Casablanca", code: "CMN", country: "Maroc" },
  { name: "Marrakech", code: "RAK", country: "Maroc" },
  { name: "Tanger", code: "TNG", country: "Maroc" },
  { name: "Paris", code: "PAR", country: "France" },
  { name: "Marseille", code: "MRS", country: "France" },
  { name: "Lyon", code: "LYS", country: "France" },
  { name: "Barcelona", code: "BCN", country: "Espagne" },
  { name: "Madrid", code: "MAD", country: "Espagne" },
  { name: "Malaga", code: "AGP", country: "Espagne" },
  { name: "London", code: "LON", country: "Royaume-Uni" },
  { name: "Lisbonne", code: "LIS", country: "Portugal" },
];

const airlines = [
  { name: "Ryanair", logo: "https://1000logos.net/wp-content/uploads/2020/03/Ryanair-Logo.png", color: "#ff6600" },
  { name: "Air Arabia Maroc", logo: "https://download.logo.wine/logo/Air_Arabia_Maroc/Air_Arabia_Maroc-Logo.wine.png", color: "#00a651" },
  { name: "Royal Air Maroc", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Logo_Royal_Air_Maroc.svg/2560px-Logo_Royal_Air_Maroc.svg.png", color: "#c8102e" }
];

let selected = {
  tripType: 'return',
  from: null,
  fromCode: null,
  to: null,
  toCode: null,
  departDate: '',
  returnDate: '',
  adults: 1,
  cabinClass: 'Économie'
};

const fromInput = document.getElementById('fromCity');
const toInput = document.getElementById('toCity');
const fromDropdown = document.getElementById('fromList');
const toDropdown = document.getElementById('toList');
const departDate = document.getElementById('departDate');
const returnDate = document.getElementById('returnDate');
const searchBtn = document.querySelector('.search-button');

// Trip type
document.querySelectorAll('.trip-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.trip-option').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    selected.tripType = opt.dataset.type;
    document.querySelector('.return-field').style.display = selected.tripType === 'return' ? 'block' : 'none';
  });
});

// Autocomplete
function setupAutocomplete(input, dropdown, isFrom) {
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    dropdown.innerHTML = '';
    if (!q) { dropdown.style.display = 'none'; return; }
    const matches = cities.filter(city => city.name.toLowerCase().includes(q) || city.code.toLowerCase().includes(q) || (city.country && city.country.toLowerCase().includes(q)));
    if (matches.length === 0) { dropdown.style.display = 'none'; return; }
    matches.forEach(city => {
      const item = document.createElement('div');
      item.innerHTML = `<strong>${city.name}</strong> (${city.code}) – ${city.country}`;
      item.addEventListener('click', () => {
        input.value = `${city.name} (${city.code})`;
        dropdown.style.display = 'none';
        if (isFrom) { selected.from = city.name; selected.fromCode = city.code; }
        else { selected.to = city.name; selected.toCode = city.code; }
      });
      dropdown.appendChild(item);
    });
    dropdown.style.display = 'block';
  });
  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) dropdown.style.display = 'none';
  });
}
setupAutocomplete(fromInput, fromDropdown, true);
setupAutocomplete(toInput, toDropdown, false);

// Swap
document.querySelector('.swap-btn').onclick = () => {
  [fromInput.value, toInput.value] = [toInput.value, fromInput.value];
  [selected.from, selected.to] = [selected.to, selected.from];
  [selected.fromCode, selected.toCode] = [selected.toCode, selected.fromCode];
};

// Random time
function randomTime() {
  const hour = Math.floor(Math.random() * 16) + 6;
  const min = Math.floor(Math.random() * 12) * 5;
  return `${hour.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}`;
}

// Modal creator
function createModal(content) {
  const overlay = document.createElement('div');
  overlay.className = 'premium-modal';
  overlay.innerHTML = `<div class="modal-content">${content}</div>`;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.remove();
  });

  return overlay;
}

// Search
searchBtn.onclick = () => {
  selected.departDate = departDate.value;
  selected.returnDate = selected.tripType === 'return' ? returnDate.value : '';
  if (!selected.from && fromInput.value) selected.from = fromInput.value.trim();
  if (!selected.to && toInput.value) selected.to = toInput.value.trim();
  if (!selected.from || !selected.to || !selected.departDate) {
    alert('Veuillez remplir les champs obligatoires.');
    return;
  }

  document.getElementById('resultsSection').style.display = 'block';

  const fromDisplay = selected.fromCode ? `${selected.from} (${selected.fromCode})` : selected.from;
  const toDisplay = selected.toCode ? `${selected.to} (${selected.toCode})` : selected.to;

  let flightsHTML = '';
  airlines.forEach((al) => {
    const depart = randomTime();
    const durationH = Math.floor(Math.random() * 3) + 1;
    const durationM = Math.floor(Math.random() * 12) * 5;
    const arriveHour = (parseInt(depart.split(':')[0]) + durationH + Math.floor((parseInt(depart.split(':')[1]) + durationM) / 60)) % 24;
    const arriveMin = (parseInt(depart.split(':')[1]) + durationM) % 60;
    const arrive = `${arriveHour.toString().padStart(2,'0')}:${arriveMin.toString().padStart(2,'0')}`;
    const price = Math.floor(Math.random() * 100) + 40;

    flightsHTML += `
      <div class="flight-item" data-airline="${al.name}" data-depart="${depart}" data-arrive="${arrive}" data-duration="${durationH}h ${durationM}min" data-price="${price}">
        <img src="${al.logo}" alt="${al.name}" style="height:50px;">
        <div class="flight-info">
          <strong>${al.name}</strong>
          <span>${depart} – ${arrive} • ${durationH}h ${durationM}min • Direct</span>
        </div>
        <div class="flight-price">
          <strong>€${price}</strong><small>TTC</small>
        </div>
        <button class="btn-select">Sélectionner</button>
      </div>
    `;
  });

  document.getElementById('flightResults').innerHTML = `
    <h3>Vols disponibles : ${fromDisplay} → ${toDisplay}</h3>
    <p>Départ : <strong>${selected.departDate}</strong> | 1 adulte • Économie</p>
    <div class="flights-container">${flightsHTML}</div>
  `;

  document.querySelectorAll('.btn-select').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.flight-item');
      const flight = {
        airline: parent.dataset.airline,
        depart: parent.dataset.depart,
        arrive: parent.dataset.arrive,
        duration: parent.dataset.duration,
        basePrice: parseInt(parent.dataset.price)
      };
      showLuggagePopup(flight);
    });
  });
};

// Popup Bagages
function showLuggagePopup(flight) {
  const modal = createModal(`
    <h2>Ajouter des bagages ?</h2>
    <p class="subtitle">Bagage en soute 10kg</p>
    <div class="luggage-options">
      <button class="option-btn yes" data-add="true">Oui (+20€)</button>
      <button class="option-btn no" data-add="false">Non merci</button>
    </div>
    <button class="close-btn">×</button>
  `);

  modal.querySelector('.close-btn').onclick = () => modal.remove();
  modal.querySelectorAll('.option-btn').forEach(btn => {
    btn.onclick = () => {
      const addLuggage = btn.dataset.add === 'true';
      modal.remove();
      showPaymentPopup(flight, addLuggage);
    };
  });
}

// Popup Paiement
function showPaymentPopup(flight, addLuggage) {
  const luggageCost = addLuggage ? 20 : 0;
  const total = flight.basePrice + luggageCost;

  const modal = createModal(`
    <div class="modal-content payment">
      <h2>Paiement sécurisé</h2>
      <p class="subtitle">Carte bancaire</p>
      
      <form id="paymentForm">
        <div class="form-group">
          <label>Nom sur la carte</label>
          <input type="text" id="cardName" placeholder="NOM Prénom" required>
        </div>
        <div class="form-group">
          <label>Numéro de carte</label>
          <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" required>
        </div>
        <div class="form-row">
          <div class="form-group half">
            <label>Date d'expiration</label>
            <input type="text" id="expDate" placeholder="MM/AA" required>
          </div>
          <div class="form-group half">
            <label>CVV</label>
            <input type="text" id="cvv" placeholder="123" required>
          </div>
        </div>
        <div class="total-box">
          <span>Total à payer :</span>
          <strong>€${total}</strong>
        </div>
        <button type="submit" class="pay-btn">Confirmer et payer</button>
      </form>
      
      <button class="close-btn">×</button>
    </div>
  `);

  modal.querySelector('.close-btn').onclick = () => modal.remove();

  modal.querySelector('#paymentForm').onsubmit = (e) => {
    e.preventDefault();
    const cardName = modal.querySelector('#cardName').value.trim();
    if (!cardName) return alert('Veuillez remplir le nom sur la carte');
    modal.remove();
    showConfirmationPopup(flight, addLuggage, total, cardName);
  };
}

// Popup Confirmation
function showConfirmationPopup(flight, addLuggage, total, passengerName) {
  const bookingRef = 'SKY' + Math.floor(Math.random() * 1000000).toString().padStart(6,'0');

  const modal = createModal(`
    <div class="modal-content success">
      <div class="success-icon">🎉</div>
      <h2>Réservation confirmée !</h2>
      <p class="subtitle">Merci pour votre confiance</p>

      <div class="recap-box">
        <p><strong>Référence :</strong> ${bookingRef}</p>
        <p><strong>Passager :</strong> ${passengerName}</p>
        <p><strong>Trajet :</strong> ${selected.from} → ${selected.to}</p>
        <p><strong>Départ :</strong> ${selected.departDate}</p>
        <p><strong>Vol :</strong> ${flight.airline} • ${flight.depart} → ${flight.arrive}</p>
        <p><strong>Bagages :</strong> ${addLuggage ? '10kg soute (+20€)' : 'Aucun'}</p>
        <hr>
        <p class="total"><strong>Total payé :</strong> €${total}</p>
      </div>

      <div class="action-buttons">
        <button id="btnPDF">Télécharger PDF</button>
        <button id="btnEmail">Envoyer par email</button>
      </div>

      <button class="close-btn">×</button>
    </div>
  `);

  modal.querySelector('.close-btn').onclick = () => modal.remove();

  modal.querySelector('#btnPDF').onclick = () => {
    alert('PDF téléchargé (simulation) !');
    window.print();
  };

  modal.querySelector('#btnEmail').onclick = () => {
    alert(`Email envoyé (simulation)\nRéf: ${bookingRef} - Total: €${total}`);
  };
}