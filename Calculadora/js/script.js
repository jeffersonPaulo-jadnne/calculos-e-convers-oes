// ===== Abas =====
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

// ===== Juros Compostos =====
document.getElementById("calculateCompound").addEventListener("click", () => {
  const principal = parseFloat(document.getElementById("principal").value);
  const rate = parseFloat(document.getElementById("rate").value) / 100;
  const time = parseInt(document.getElementById("time").value);

  let html = "<tr><th>Mês</th><th>Saldo (R$)</th></tr>";
  let amount = principal;
  for (let i = 1; i <= time; i++) {
    amount *= (1 + rate);
    html += `<tr><td>${i}</td><td>${amount.toFixed(2)}</td></tr>`;
  }

  document.getElementById("compoundTable").innerHTML = html;
  document.getElementById("compoundInvested").textContent = `R$ ${principal.toFixed(2)}`;
  document.getElementById("compoundFinal").textContent = `R$ ${amount.toFixed(2)}`;
});

// ===== Investimentos =====
const stocks = [
  { symbol: 'AAPL', name: 'Apple', price: 175 },
  { symbol: 'MSFT', name: 'Microsoft', price: 330 },
  { symbol: 'GOOGL', name: 'Alphabet', price: 145 },
  { symbol: 'AMZN', name: 'Amazon', price: 130 },
  { symbol: 'META', name: 'Meta', price: 300 },
  { symbol: 'TSLA', name: 'Tesla', price: 250 },
  { symbol: 'NFLX', name: 'Netflix', price: 450 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 600 },
  { symbol: 'PETR4.SA', name: 'Petrobras', price: 28 },
  { symbol: 'VALE3.SA', name: 'Vale', price: 95 },
  { symbol: 'ITUB4.SA', name: 'Itaú', price: 28 },
  { symbol: 'BBDC4.SA', name: 'Bradesco', price: 24 },
  { symbol: 'ABEV3.SA', name: 'Ambev', price: 15 },
  { symbol: 'SAN.PA', name: 'Santander', price: 5 },
  { symbol: 'SIE.DE', name: 'Siemens', price: 145 },
  { symbol: 'BP.L', name: 'BP', price: 27 }
];

const carouselTrack = document.getElementById("carouselTrack");
const stockSelect = document.getElementById("stockSelect");
let index = 0;

// Criar cards e opções
stocks.forEach(stock => {
  const card = document.createElement("div");
  card.className = "carousel-card";
  card.dataset.symbol = stock.symbol;
  card.dataset.price = stock.price;
  card.innerHTML = `
    <img src="https://logo.clearbit.com/${stock.name.replace(/\s+/g,'').toLowerCase()}.com" alt="${stock.name}">
    <h3>${stock.symbol}</h3>
    <p class="price">US$ ${stock.price.toFixed(2)}</p>
  `;
  card.addEventListener("click", () => showStockDetails(stock.symbol));
  carouselTrack.appendChild(card);

  const option = document.createElement("option");
  option.value = stock.symbol;
  option.textContent = stock.name;
  stockSelect.appendChild(option);
});

// Botões do carrossel
document.getElementById("prevBtn").addEventListener("click", () => {
  index = (index - 1 + stocks.length) % stocks.length;
  carouselTrack.style.transform = `translateX(-${index * 240}px)`;
});
document.getElementById("nextBtn").addEventListener("click", () => {
  index = (index + 1) % stocks.length;
  carouselTrack.style.transform = `translateX(-${index * 240}px)`;
});

// Mostrar detalhes da ação
let stockChart;
function showStockDetails(symbol) {
  const stock = stocks.find(s => s.symbol === symbol);
  document.getElementById("selectedStock").textContent = `Ação: ${stock.symbol}`;

  const labels = Array.from({length: 12}, (_, i) => `Mês ${i+1}`);
  const values = labels.map(() => stock.price * (0.95 + Math.random() * 0.1));

  if (stockChart) stockChart.destroy();
  const ctx = document.getElementById("stockChart").getContext("2d");
  stockChart = new Chart(ctx, {
    type: "line",
    data: { labels, datasets: [{ label: stock.symbol, data: values, borderColor: "#58a6ff", fill: false }] },
    options: { responsive: true, scales: { x: { ticks: { color: "#fff" } }, y: { ticks: { color: "#fff" } } }, plugins: { legend: { labels: { color: "#fff" } } } }
  });
}

// Calculadora de investimento
document.getElementById("calculateBtn").addEventListener("click", () => {
  const symbol = stockSelect.value;
  const quantity = parseInt(document.getElementById("quantity").value);
  const years = parseInt(document.getElementById("investmentPeriod").value);

  const stock = stocks.find(s => s.symbol === symbol);
  if (!stock) return;

  const invested = stock.price * quantity;
  const dividendYield = 0.03;
  const dividends = invested * dividendYield * years;

  let html = "<tr><th>Ano</th><th>Dividendo (US$)</th></tr>";
  for (let i = 1; i <= years; i++) html += `<tr><td>${i}</td><td>${(invested*dividendYield*i).toFixed(2)}</td></tr>`;

  document.getElementById("resultTable").innerHTML = html;
  document.getElementById("totalInvestment").textContent = `US$ ${invested.toFixed(2)}`;
  document.getElementById("dividendAmount").textContent = `US$ ${(invested + dividends).toFixed(2)}`;
});
