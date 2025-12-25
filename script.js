// script.js - Version avec popup paiement carte + récapitulatif final + PDF/Email

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

// Type de voyage
document.querySelectorAll('.trip-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.trip-option').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    selected.tripType = opt.dataset.type;
    document.querySelector('.return-field').style.display = selected.tripType === 'return' ? 'block' : 'none';
  });
});

// Autocomplétion (inchangé)
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

// Inversion villes
document.querySelector('.swap-btn').onclick = () => {
  [fromInput.value, toInput.value] = [toInput.value, fromInput.value];
  [selected.from, selected.to] = [selected.to, selected.from];
  [selected.fromCode, selected.toCode] = [selected.toCode, selected.fromCode];
};

// Horaire aléatoire
function randomTime(startHour = 6, endHour = 22) {
  const hour = Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
  const min = Math.floor(Math.random() * 60 / 5) * 5; // multiples de 5 min
  return `${hour.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}`;
}

// Fonction modal réutilisable
function createModal(content, onClose) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.75); display:flex; align-items:center; justify-content:center; z-index:9999;';
  
  const modal = document.createElement('div');
  modal.style.cssText = 'background:#0f1e38; color:white; border-radius:12px; padding:2.2rem; max-width:580px; width:92%; box-shadow:0 15px 40px rgba(0,0,0,0.6); position:relative;';
  modal.innerHTML = content;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
      if (onClose) onClose();
    }
  });
  
  return { overlay, modal };
}

// Recherche
searchBtn.onclick = () => {
  selected.departDate = departDate.value;
  selected.returnDate = selected.tripType === 'return' ? returnDate.value : '';
  if (!selected.from && fromInput.value) selected.from = fromInput.value.trim();
  if (!selected.to && toInput.value) selected.to = toInput.value.trim();
  if (!selected.from || !selected.to || !selected.departDate) {
    alert('Veuillez indiquer la ville de départ, la destination et la date de départ.');
    return;
  }

  document.getElementById('resultsSection').style.display = 'block';

  const fromDisplay = selected.fromCode ? `${selected.from} (${selected.fromCode})` : selected.from;
  const toDisplay = selected.toCode ? `${selected.to} (${selected.toCode})` : selected.to;

  let flightsHTML = '';
  airlines.forEach((al, index) => {
    const depart = randomTime();
    const durationH = Math.floor(Math.random() * 3) + 1;
    const durationM = Math.floor(Math.random() * 60 / 5) * 5;
    const arriveHour = (parseInt(depart.split(':')[0]) + durationH + Math.floor((parseInt(depart.split(':')[1]) + durationM) / 60)) % 24;
    const arriveMin = (parseInt(depart.split(':')[1]) + durationM) % 60;
    const arrive = `${arriveHour.toString().padStart(2,'0')}:${arriveMin.toString().padStart(2,'0')}`;
    const price = Math.floor(Math.random() * 100) + 40;

    flightsHTML += `
      <div style="background:#112244; border-radius:10px; padding:1.4rem; display:flex; align-items:center; gap:1.3rem; border-left:5px solid ${al.color};">
        <img src="${al.logo}" alt="${al.name}" style="height:60px; width:auto; object-fit:contain;">
        <div style="flex:1;">
          <strong style="font-size:1.2rem;">${al.name}</strong><br>
          <span style="color:#bbbbbb;">${depart} – ${arrive}</span> • ${durationH}h ${durationM.toString().padStart(2,'0')}min • Direct
        </div>
        <div style="text-align:right; min-width:140px;">
          <strong style="font-size:1.6rem; color:#4caf50;">€ ${price}</strong><br>
          <small>TTC</small>
        </div>
        <button class="select-btn" data-index="${index}" data-airline="${al.name}" data-depart="${depart}" data-arrive="${arrive}" data-duration="${durationH}h ${durationM.toString().padStart(2,'0')}min" data-price="${price}" style="background:${al.color}; color:white; border:none; padding:12px 28px; border-radius:6px; cursor:pointer; font-weight:600;">
          Sélectionner
        </button>
      </div>
    `;
  });

  document.getElementById('flightResults').innerHTML = `
    <div style="padding: 1.8rem; background:#0f1e38; border-radius:12px; margin-bottom:2.5rem;">
      <h3 style="margin-bottom:1.6rem; color:#ffffff; font-size:1.5rem;">
        Vols disponibles : ${fromDisplay} → ${toDisplay}
      </h3>
      <p style="margin-bottom:1.8rem; color:#cccccc; line-height:1.6;">
        Départ : <strong>${selected.departDate}</strong><br>
        ${selected.tripType === 'return' ? `Retour : <strong>${selected.returnDate || '—'}</strong><br>` : ''}
        Voyageur(s) : <strong>${selected.adults} Adulte(s)</strong> • <strong>${selected.cabinClass}</strong><br>
        <small style="color:#888888;">(Simulation démo – tous les vols sont fictifs)</small>
      </p>
      <div class="flight-list" style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${flightsHTML}
      </div>
    </div>
    <p style="text-align:center; color:#aaaaaa; margin-top:2.5rem; font-size:1rem;">
      Cliquez sur "Sélectionner" pour continuer
    </p>
  `;

  document.querySelectorAll('.select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const flight = {
        airline: btn.dataset.airline,
        depart: btn.dataset.depart,
        arrive: btn.dataset.arrive,
        duration: btn.dataset.duration,
        basePrice: parseInt(btn.dataset.price)
      };

      // Popup bagages
      createModal(`
        <h2 style="margin-bottom:1.2rem;">Ajouter des bagages ?</h2>
        <p>Voulez-vous ajouter un bagage en soute de 10kg pour 20€ supplémentaires ?</p>
        <div style="display:flex; gap:1rem; justify-content:center; margin-top:1.8rem;">
          <button id="luggageYes" style="background:#4caf50; color:white; padding:12px 32px; border:none; border-radius:6px; cursor:pointer;">Oui</button>
          <button id="luggageNo" style="background:#f44336; color:white; padding:12px 32px; border:none; border-radius:6px; cursor:pointer;">Non</button>
        </div>
      `);

      document.getElementById('luggageYes').onclick = () => {
        document.querySelector('.overlay')?.remove(); // au cas où
        showFlightDetails(flight, true);
      };
      document.getElementById('luggageNo').onclick = () => {
        document.querySelector('.overlay')?.remove();
        showFlightDetails(flight, false);
      };
    });
  });
};

// Détails vol + total
function showFlightDetails(flight, addLuggage) {
  const luggageCost = addLuggage ? 20 : 0;
  const total = flight.basePrice + luggageCost;
  const luggageText = addLuggage ? 'Oui (+20€ - 10kg soute)' : 'Non inclus';

  createModal(`
    <h2 style="margin-bottom:1.2rem;">Détails de votre vol</h2>
    <p><strong>Compagnie :</strong> ${flight.airline}</p>
    <p><strong>Départ :</strong> ${flight.depart} – Arrivée : ${flight.arrive}</p>
    <p><strong>Durée :</strong> ${flight.duration}</p>
    <p><strong>Prix billet :</strong> ${flight.basePrice}€</p>
    <p><strong>Bagages supplémentaires :</strong> ${luggageText}</p>
    <hr style="border-color:#2a3b5c; margin:1.2rem 0;">
    <p style="font-size:1.4rem; font-weight:bold; color:#4caf50;">Total à payer : ${total}€ TTC</p>
    <button id="goToPayment" style="background:#0066cc; color:white; width:100%; padding:14px; border:none; border-radius:8px; font-size:1.1rem; margin-top:1.5rem; cursor:pointer;">
      Procéder au paiement
    </button>
  `);

  document.getElementById('goToPayment').onclick = () => {
    document.querySelector('div[style*="position:fixed"]').remove();
    showPaymentForm(flight, total, addLuggage);
  };
}

// Formulaire paiement (toujours carte)
function showPaymentForm(flight, total, addLuggage) {
  createModal(`
    <h2 style="margin-bottom:1.2rem;">Paiement sécurisé - Carte bancaire</h2>
    <form id="cardForm">
      <label>Nom sur la carte :</label>
      <input type="text" id="cardName" placeholder="NOM Prénom" required style="width:100%; padding:10px; margin:0.5rem 0 1rem; border-radius:6px; border:1px solid #2a3b5c; background:#0b1d3a; color:white;">

      <label>Numéro de carte :</label>
      <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required style="width:100%; padding:10px; margin:0.5rem 0 1rem; border-radius:6px; border:1px solid #2a3b5c; background:#0b1d3a; color:white;">

      <div style="display:flex; gap:1rem;">
        <div style="flex:1;">
          <label>Date d'expiration :</label>
          <input type="text" id="expDate" placeholder="MM/AA" maxlength="5" required style="width:100%; padding:10px; margin:0.5rem 0 1rem; border-radius:6px; border:1px solid #2a3b5c; background:#0b1d3a; color:white;">
        </div>
        <div style="flex:1;">
          <label>CVV :</label>
          <input type="text" id="cvv" placeholder="123" maxlength="4" required style="width:100%; padding:10px; margin:0.5rem 0 1rem; border-radius:6px; border:1px solid #2a3b5c; background:#0b1d3a; color:white;">
        </div>
      </div>

      <button type="submit" style="background:#4caf50; color:white; width:100%; padding:14px; border:none; border-radius:8px; font-size:1.1rem; cursor:pointer; margin-top:1rem;">
        Confirmer et payer ${total}€
      </button>
    </form>
  `);

  document.getElementById('cardForm').onsubmit = (e) => {
    e.preventDefault();
    const cardName = document.getElementById('cardName').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const expDate = document.getElementById('expDate').value.trim();
    const cvv = document.getElementById('cvv').value.trim();

    if (!cardName || !cardNumber || !expDate || !cvv) {
      alert('Veuillez remplir tous les champs de la carte.');
      return;
    }

    // Suppression du formulaire
    document.querySelector('div[style*="position:fixed"]').remove();

    // Grande popup finale avec tous les détails
    const bookingRef = 'SKY' + Math.floor(Math.random() * 1000000).toString().padStart(6,'0');

    createModal(`
      <div style="text-align:center;">
        <div style="font-size:3.5rem; margin-bottom:1rem;">🎉</div>
        <h2 style="color:#4caf50; margin-bottom:1.5rem;">Paiement confirmé !</h2>
        
        <p style="font-size:1.1rem; margin-bottom:1.5rem;">Votre réservation est validée (simulation)</p>
        
        <div style="background:#112244; padding:1.5rem; border-radius:10px; text-align:left; margin-bottom:1.8rem;">
          <p><strong>Référence de réservation :</strong> ${bookingRef}</p>
          <p><strong>Trajet :</strong> ${selected.from} (${selected.fromCode || '—'}) → ${selected.to} (${selected.toCode || '—'})</p>
          <p><strong>Date départ :</strong> ${selected.departDate}</p>
          ${selected.tripType === 'return' ? `<p><strong>Date retour :</strong> ${selected.returnDate}</p>` : ''}
          <p><strong>Compagnie :</strong> ${flight.airline}</p>
          <p><strong>Horaires :</strong> ${flight.depart} → ${flight.arrive} (${flight.duration})</p>
          <p><strong>Bagages supplémentaires :</strong> ${addLuggage ? '10kg soute (+20€)' : 'Aucun'}</p>
          <p><strong>Passager :</strong> ${cardName}</p>
          <hr style="border-color:#2a3b5c; margin:1rem 0;">
          <p style="font-size:1.3rem; font-weight:bold; color:#4caf50;">Montant payé : ${flight.basePrice + (addLuggage ? 20 : 0)}€ TTC</p>
        </div>

        <div style="display:flex; gap:1rem; justify-content:center;">
          <button id="downloadPDF" style="background:#0066cc; color:white; padding:12px 28px; border:none; border-radius:8px; cursor:pointer;">
            Télécharger en PDF
          </button>
          <button id="sendEmail" style="background:#4caf50; color:white; padding:12px 28px; border:none; border-radius:8px; cursor:pointer;">
            Envoyer par email
          </button>
        </div>
      </div>
    `);

    document.getElementById('downloadPDF').onclick = () => {
      alert('Simulation : Le document PDF est en cours de génération...\n\nEn production, vous recevriez un fichier PDF avec tous les détails de la réservation.');
      window.print(); // Ouvre la fenêtre d'impression du navigateur
    };

    document.getElementById('sendEmail').onclick = () => {
      alert(`Simulation : Un email de confirmation a été envoyé à l'adresse que vous avez fournie.\n\nContenu envoyé :\nRéférence: ${bookingRef}\nTrajet: ${selected.from} → ${selected.to}\nDate: ${selected.departDate}\nTotal payé: ${flight.basePrice + (addLuggage ? 20 : 0)}€\n\nMerci pour votre réservation !`);
    };
  };
}
