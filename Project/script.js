// FINAL script.js – Kanchan Kunja Jewellers (100% Working)

function fetchRates() {
  // Pehle turant fallback rate dikha do (user ko wait na kare)
  document.getElementById('rate22').innerText = '₹11,899';
  document.getElementById('rate24').innerText = '₹12,981';

  // Live rate fetch karo
  fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/xau/inr.json')
    .then(response => response.json())
    .then(data => {
      let gold24k = Math.round(data.inr / 31.1035);  // 24K per gram
      let gold22k = Math.round(gold24k * 0.916);     // 22K = 91.6%

      countUp('rate24', gold24k);
      countUp('rate22', gold22k);
    })
    .catch(() => {
      // Agar internet/API fail ho jaye tab bhi latest known rate dikhao
      countUp('rate24', 12981);
      countUp('rate22', 11899);
    });
}

// Smooth count-up animation
function countUp(id, target) {
  let element = document.getElementById(id);
  let current = 0;
  let step = target / 60;
  let timer = setInterval(() => {
    current += step;
    if (current >= target) {
      element.innerText = '₹' + target.toLocaleString('en-IN');
      clearInterval(timer);
    } else {
      element.innerText = '₹' + Math.floor(current).toLocaleString('en-IN');
    }
  }, 40);
}

// Calculator functions
function set(amount) {
  document.getElementById('budget').value = amount;
  calculate();
}

function calculate() {
  let budget = parseFloat(document.getElementById('budget').value) || 0;
  if (budget <= 0) {
    document.getElementById('g22').innerText = '0.000';
    document.getElementById('final').innerText = '0.000';
    return;
  }

  let rate22Text = document.getElementById('rate22').innerText.replace(/[^\d]/g, '');
  let rate22 = parseInt(rate22Text) || 7810;

  let pure22k = (budget / rate22).toFixed(3);
  let withMaking = (budget / (rate22 + 800)).toFixed(3);

  document.getElementById('g22').innerText = pure22k;
  document.getElementById('final').innerText = withMaking;
}

// WhatsApp send
function wa() {
  let budget = document.getElementById('budget').value || '0';
  let weight = document.getElementById('final').innerText;
  let message = `Namaste! ✋\nMera budget ₹${budget} hai\n${weight} gram jewellery banega\nDesigns bhejiye please! 🙏`;

  window.open('https://wa.me/917001068472?text=' + encodeURIComponent(message), '_blank');
}

// Start everything
window.onload = function () {
  fetchRates();                    // Pehli baar rate load
  setInterval(fetchRates, 300000); // Har 5 minute update
  calculate();                     // Agar budget already filled ho
};