const cities = ["Rabat","Casablanca","Paris","Barcelona","Madrid","London","Rome"];
const flights = [
 { airline:"Air France", logo:"https://upload.wikimedia.org/wikipedia/commons/6/6b/Air_France_Logo.svg", price:120 },
 { airline:"Ryanair", logo:"https://upload.wikimedia.org/wikipedia/commons/3/3b/Ryanair_logo.svg", price:90 },
 { airline:"Iberia", logo:"https://upload.wikimedia.org/wikipedia/commons/2/20/Iberia-logo.svg", price:110 }
];

let selectedSeat = "";

/* AUTOCOMPLETE */
function setupAuto(inputId, listId) {
 const input = document.getElementById(inputId);
 const list = document.getElementById(listId);

 input.oninput = () => {
  list.innerHTML = "";
  cities.filter(c => c.toLowerCase().startsWith(input.value.toLowerCase()))
    .forEach(c => {
      const div = document.createElement("div");
      div.innerText = c;
      div.onclick = () => { input.value = c; list.innerHTML=""; };
      list.appendChild(div);
    });
 };
}
setupAuto("fromCity","fromList");
setupAuto("toCity","toList");

/* SEARCH */
function searchFlights(){
 document.getElementById("flightPopup").style.display="flex";
 let html="";
 flights.forEach(f=>{
  html+=`
   <div class="flight-card">
    <img src="${f.logo}">
    <div>${f.airline}</div>
    <div>${f.price} €</div>
    <button onclick="openSeats()">Book</button>
   </div>`;
 });
 document.getElementById("flightResults").innerHTML=html;
}

function closePopup(){
 document.getElementById("flightPopup").style.display="none";
}

/* SEATS */
function openSeats(){
 closePopup();
 document.getElementById("seatPopup").style.display="flex";
 let html="";
 for(let i=1;i<=30;i++){
  let occ = i%7===0;
  html+=`<div class="seat ${occ?'occupied':''}" 
  onclick="${occ?'':`selectSeat('S${i}',this)`}">S${i}</div>`;
 }
 document.getElementById("seats").innerHTML=html;
}

function selectSeat(s,e){
 document.querySelectorAll(".seat").forEach(x=>x.classList.remove("selected"));
 e.classList.add("selected");
 selectedSeat=s;
}

function goToPayment(){
 if(!selectedSeat){ alert("Select seat"); return; }
 document.getElementById("seatPopup").style.display="none";
 document.getElementById("paymentPage").style.display="block";
}

/* PAYMENT VALIDATION */
function pay(){
 const num=document.getElementById("cardNumber").value;
 const exp=document.getElementById("expDate").value;
 const cvv=document.getElementById("cvv").value;

 if(!/^\d{16}$/.test(num)){ alert("Card must be 16 digits"); return; }
 if(!/^\d{2}\/\d{2}$/.test(exp)){ alert("Expiry MM/YY"); return; }
 if(!/^\d{3}$/.test(cvv)){ alert("CVV 3 digits"); return; }

 alert("Payment Successful ✅");
 location.reload();
}
