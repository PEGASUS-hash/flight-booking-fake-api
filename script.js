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

// Trip type selector
document.querySelectorAll('.trip-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.trip-option').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    selected.tripType = opt.dataset.type;
    
    document.querySelector('.return-field').style.display = 
      selected.tripType === 'return' ? 'block' : 'none';
  });
});

// Autocomplete
function setupAutocomplete(input, dropdown, isFrom) {
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    dropdown.innerHTML = '';

    if (!q) {
      dropdown.style.display = 'none';
      return;
    }

    const matches = cities.filter(city => 
      city.name.toLowerCase().includes(q) ||
      city.code.toLowerCase().includes(q) ||
      (city.country && city.country.toLowerCase().includes(q))
    );

    if (matches.length === 0) {
      dropdown.style.display = 'none';
      return;
    }

    matches.forEach(city => {
      const item = document.createElement('div');
      item.innerHTML = `<strong>${city.name}</strong> (${city.code}) – ${city.country}`;
      item.addEventListener('click', () => {
        input.value = `${city.name} (${city.code})`;
        dropdown.style.display = 'none';
        
        if (isFrom) {
          selected.from = city.name;
          selected.fromCode = city.code;
        } else {
          selected.to = city.name;
          selected.toCode = city.code;
        }
      });
      dropdown.appendChild(item);
    });

    dropdown.style.display = 'block';
  });

  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
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

// Search
searchBtn.onclick = () => {
  selected.departDate = departDate.value;
  selected.returnDate = selected.tripType === 'return' ? returnDate.value : '';

  if (!selected.from && fromInput.value) selected.from = fromInput.value;
  if (!selected.to && toInput.value)   selected.to   = toInput.value;

  if (!selected.from || !selected.to || !selected.departDate) {
    alert('Veuillez indiquer la ville de départ, la destination et la date de départ.');
    return;
  }

  document.getElementById('resultsSection').style.display = 'block';

  document.getElementById('flightResults').innerHTML = `
    <div style="padding: 2rem; background:#0f1e38; border-radius:12px;">
      <h3 style="margin-bottom:1rem;">Votre recherche :</h3>
      <p style="font-size:1.2rem; line-height:1.7;">
        ✈️ <strong>${selected.from} (${selected.fromCode || '—'})</strong> 
        → <strong>${selected.to} (${selected.toCode || '—'})</strong><br>
        Départ : <strong>${selected.departDate || '—'}</strong><br>
        ${selected.tripType === 'return' ? `Retour : <strong>${selected.returnDate || '—'}</strong><br>` : ''}
        Voyageur(s) : <strong>${selected.adults} Adulte(s)</strong> – <strong>${selected.cabinClass}</strong>
      </p>
      <p style="margin-top:2rem; color:#aaa;">
        (Simulation – en production vous verriez ici les vrais vols disponibles)
      </p>
    </div>
  `;
};
