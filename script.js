document.addEventListener('DOMContentLoaded', () => {

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
  { name: "Rabat", code: "RBA" },
  { name: "Casablanca", code: "CMN" },
  { name: "Paris", code: "PAR" },
  { name: "Marseille", code: "MRS" },
  { name: "London", code: "LON" },
  { name: "Madrid", code: "MAD" }
];

/* ===== Trip Type ===== */
document.querySelectorAll('.trip-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.trip-option').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    selected.tripType = opt.dataset.type;
    document.querySelector('.return-field').style.display =
      selected.tripType === 'return' ? 'block' : 'none';
  });
});

/* ===== Autocomplete ===== */
function setupAutocomplete(inputId, listId) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);

  input.addEventListener('input', () => {
    list.innerHTML = '';
    const q = input.value.toLowerCase();
    if (!q) return list.style.display = 'none';

    cities.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q)
    ).forEach(city => {
      const div = document.createElement('div');
      div.innerHTML = `<strong>${city.name}</strong> (${city.code})`;
      div.onclick = () => {
        input.value = `${city.name} (${city.code})`;
        list.style.display = 'none';
        if (inputId === 'fromCity') {
          selected.from = city.name;
          selected.fromCode = city.code;
        } else {
          selected.to = city.name;
          selected.toCode = city.code;
        }
      };
      list.appendChild(div);
    });

    list.style.display = 'block';
  });

  document.addEventListener('click', e => {
    if (!input.contains(e.target)) list.style.display = 'none';
  });
}

setupAutocomplete('fromCity', 'fromList');
setupAutocomplete('toCity', 'toList');

/* ===== Passengers ===== */
window.togglePassengerDropdown = () => {
  const d = document.getElementById('passengerDropdown');
  d.style.display = d.style.display === 'block' ? 'none' : 'block';
};

window.changePassengers = delta => {
  selected.adults = Math.max(1, selected.adults + delta);
  document.getElementById('adults').textContent = selected.adults;
  document.getElementById('passengerDisplay').textContent =
    `${selected.adults} Adulte(s), ${selected.cabinClass}`;
};

document.getElementById('classSelect').addEventListener('change', e => {
  selected.cabinClass = e.target.value;
  document.getElementById('passengerDisplay').textContent =
    `${selected.adults} Adulte(s), ${selected.cabinClass}`;
});

/* ===== Swap ===== */
window.swapCities = () => {
  const f = fromCity.value;
  fromCity.value = toCity.value;
  toCity.value = f;
};

/* ===== Search ===== */
window.searchFlights = () => {
  selected.departDate = departDate.value;
  selected.returnDate = returnDate.value;

  if (!selected.from && fromCity.value) selected.from = fromCity.value;
  if (!selected.to && toCity.value) selected.to = toCity.value;

  if (!selected.from || !selected.to || !selected.departDate) {
    alert('Veuillez remplir départ, destination et date.');
    return;
  }

  document.getElementById('resultsSection').style.display = 'block';
  document.getElementById('flightResults').innerHTML =
    `<p>✈️ Vol ${selected.from} → ${selected.to}<br>Classe: ${selected.cabinClass}</p>`;
};

});
