// ========== STEP 1: LOAD DATA (browser memory) ==========
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// ========== STEP 2: SAVE DATA ==========
function save() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// ========== STEP 3: RUPEE FORMAT (Indian style) ==========
function rupees(num) {
  return '₹' + Number(num).toLocaleString('en-IN');
}

// ========== STEP 4: ADD EXPENSE ==========
const form = document.getElementById('expenseForm');

form.addEventListener('submit', function(e) {
  e.preventDefault(); // stops page refresh

  const expense = {
    id: Date.now(), // unique id for delete
    desc: document.getElementById('desc').value,
    amount: Number(document.getElementById('amount').value),
    category: document.getElementById('category').value,
    date: document.getElementById('date').value
  };

  expenses.push(expense); // add to list
  save();                 // save to memory
  form.reset();           // clear form
  document.getElementById('date').valueAsDate = new Date();
  render();               // update screen
});

// ========== STEP 5: DELETE EXPENSE ==========
function deleteExpense(id) {
  expenses = expenses.filter(exp => exp.id !== id);
  save();
  render();
}

// ========== STEP 6: SHOW EVERYTHING ON SCREEN ==========
function render() {
  const list = document.getElementById('expenseList');
  const filter = document.getElementById('filter').value;

  // filter category (All = show everything)
  const shown = filter === 'All'
    ? expenses
    : expenses.filter(exp => exp.category === filter);

  // total amount
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  document.getElementById('totalAmount').textContent = rupees(total);

  // expense list (newest first)
  list.innerHTML = '';
  if (shown.length === 0) {
    list.innerHTML = '<p class="empty">No expenses yet — add your first one! 🎉</p>';
  }
  shown.slice().reverse().forEach(exp => {
    const item = document.createElement('div');
    item.className = 'expense-item';
    item.innerHTML = `
      <div class="expense-info">
        <strong>${exp.desc}</strong>
        <small>${exp.category} • ${exp.date}</small>
      </div>
      <div class="expense-right">
        <span class="amount">${rupees(exp.amount)}</span>
        <button class="delete-btn" onclick="deleteExpense(${exp.id})">🗑️</button>
      </div>`;
    list.appendChild(item);
  });

  renderChart();
}

// ========== STEP 7: CATEGORY CHART ==========
function renderChart() {
  const chart = document.getElementById('chart');
  const card = document.getElementById('chartCard');

  if (expenses.length === 0) {
    card.style.display = 'none';
    return;
  }
  card.style.display = 'block';

  // category-wise total
  const totals = {};
  expenses.forEach(exp => {
    totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
  });

  const max = Math.max(...Object.values(totals));

  chart.innerHTML = '';
  Object.entries(totals).forEach(([cat, amt]) => {
    const percent = (amt / max) * 100;
    chart.innerHTML += `
      <div class="chart-row">
        <span class="chart-label">${cat}</span>
        <div class="bar-bg"><div class="bar" style="width:${percent}%"></div></div>
        <span class="chart-val">${rupees(amt)}</span>
      </div>`;
  });
}

// ========== STEP 8: FILTER + STARTUP ==========
document.getElementById('filter').addEventListener('change', render);
document.getElementById('date').valueAsDate = new Date(); // default = today

// ========== STEP 9: PWA (offline + install) ==========
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

render(); // first load ku screen update