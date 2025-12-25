const cities = [
  { name: "Rabat",         code: "RBA", country: "Maroc"       },
  { name: "Casablanca",    code: "CMN", country: "Maroc"       },
  { name: "Marrakech",     code: "RAK", country: "Maroc"       },
  { name: "Tanger",        code: "TNG", country: "Maroc"       },
  { name: "Paris",         code: "PAR", country: "France"      },
  { name: "Marseille",     code: "MRS", country: "France"      },
  { name: "Lyon",          code: "LYS", country: "France"      },
  { name: "Barcelona",     code: "BCN", country: "Espagne"     },
  { name: "Madrid",        code: "MAD", country: "Espagne"     },
  { name: "Malaga",        code: "AGP", country: "Espagne"     },
  { name: "London",        code: "LON", country: "Royaume-Uni" },
  { name: "Lisbonne",      code: "LIS", country: "Portugal"    },
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

const fromInput    = document.getElementById('fromCity');
const toInput      = document.getElementById('toCity');
const fromDropdown = document.getElementById('fromList');
const toDropdown   = document.getElementById('toList');
const departDate   = document.getElementById('departDate');
const returnDate   = document.getElementById('returnDate');
const searchBtn    = document.querySelector('.search-button');

// Type de voyage
document.querySelectorAll('.trip-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.trip-option').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    selected.tripType = opt.dataset.type;
    document.querySelector('.return-field').style.display = selected.tripType === 'return' ? 'block' : 'none';
  });
});

// Autocomplétion
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

// Fonction pour générer un horaire aléatoire
function randomTime(startHour = 6, endHour = 22) {
  const hour = Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
  const min = Math.floor(Math.random() / 2 * 60);
  return `${hour.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}`;
}

// Recherche → toujours 3 vols fictifs dynamiques
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
  const toDisplay   = selected.toCode ? `${selected.to} (${selected.toCode})` : selected.to;

  let flightsHTML = '';
  airlines.forEach(al => {
    const depart = randomTime();
    const duration = Math.floor(Math.random() * 3) + 1; // durée 1 à 3h
    const arriveHour = (parseInt(depart.split(':')[0]) + duration) % 24;
    const arrive = `${arriveHour.toString().padStart(2,'0')}:${depart.split(':')[1]}`;
    const price = (Math.floor(Math.random() * 100) + 40); // 40€ à 140€
    
    flightsHTML += `
      <div style="background:#112244; border-radius:10px; padding:1.4rem; display:flex; align-items:center; gap:1.3rem; border-left:5px solid ${al.color};">
        <img src="${al.logo}" alt="${al.name}" style="height:60px; width:auto; object-fit:contain;">
        <div style="flex:1;">
          <strong style="font-size:1.2rem;">${al.name}</strong><br>
          <span style="color:#bbbbbb;">${depart} – ${arrive}</span> • ${duration}h 0min • Direct
        </div>
        <div style="text-align:right; min-width:140px;">
          <strong style="font-size:1.6rem; color:#4caf50;">€ ${price}</strong><br>
          <small>TTC</small>
        </div>
        <button class="select-btn" style="background:${al.color}; color:white; border:none; padding:12px 28px; border-radius:6px; cursor:pointer; font-weight:600; font-size:1rem;">
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
      Cliquez sur "Sélectionner" pour continuer (simulation : ajout bagages, informations passager, paiement)
    </p>
  `;

  document.querySelectorAll('.select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      alert('Vol sélectionné !\n\nProchaines étapes (simulation) :\n• Choix des bagages supplémentaires\n• Saisie Nom / Prénom / Email / Passeport\n• Sélection du moyen de paiement\n• Confirmation de la réservation');
    });
  });
};
