// ==========================================
// MONEY MANAGER - APP CONTROLLER
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

function initializeApp() {
  setTodayDate();
  loadDashboard();
  setupButtons();
  setupTransactionForm();
}


// ==========================================
// SET TODAY DATE
// ==========================================

function setTodayDate() {
  const dateInput = document.getElementById("transactionDate");

  if (dateInput) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    dateInput.value = `${year}-${month}-${day}`;
  }
}


// ==========================================
// DASHBOARD
// ==========================================

function loadDashboard() {
  const transactions = getTransactions();

  let bankTotal = 0;
  let cashTotal = 0;
  let amanatTotal = 0;
  let creditTotal = 0;

  transactions.forEach(transaction => {
    const amount = Number(transaction.amount) || 0;

    if (transaction.type === "bank") {
      bankTotal += amount;
    }

    if (transaction.type === "cash") {
      cashTotal += amount;
    }

    if (transaction.type === "amanat") {
      amanatTotal += amount;
    }

    if (transaction.type === "credit") {
      creditTotal += amount;
    }
  });

  const totalAssets = bankTotal + cashTotal;
  const totalLiabilities = amanatTotal + creditTotal;

  const netBalance = totalAssets - totalLiabilities;

  updateAmount("bankTotal", bankTotal);
  updateAmount("cashTotal", cashTotal);
  updateAmount("amanatTotal", amanatTotal);
  updateAmount("creditTotal", creditTotal);

  updateAmount("totalAssets", totalAssets);
  updateAmount("totalLiabilities", totalLiabilities);
  updateAmount("netBalance", netBalance);

  renderRecentTransactions(transactions);
  renderAmanat(transactions);
  renderBanks(transactions);
}


// ==========================================
// FORMAT MONEY
// ==========================================

function formatMoney(amount) {
  const number = Number(amount) || 0;

  return "Rs. " + number.toLocaleString("en-PK", {
    maximumFractionDigits: 2
  });
}


function updateAmount(id, amount) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = formatMoney(amount);
  }
}


// ==========================================
// BUTTONS
// ==========================================

function setupButtons() {

  // Main + button
  const mainAddBtn = document.getElementById("mainAddBtn");

  if (mainAddBtn) {
    mainAddBtn.addEventListener("click", () => {
      openTransactionModal();
    });
  }


  // Quick action buttons
  document.querySelectorAll("[data-action]").forEach(button => {

    button.addEventListener("click", () => {

      const action = button.dataset.action;

      openTransactionModal(action);

    });

  });


  // Close modal
  const closeModalBtn = document.getElementById("closeModalBtn");

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeTransactionModal);
  }


  // Click outside modal
  const modal = document.getElementById("transactionModal");

  if (modal) {

    modal.addEventListener("click", event => {

      if (event.target === modal) {
        closeTransactionModal();
      }

    });

  }


  // View all buttons
  const viewAllBtn = document.getElementById("viewAllBtn");

  if (viewAllBtn) {

    viewAllBtn.addEventListener("click", () => {

      alert("Full transaction history will be available here.");

    });

  }


  const viewAmanatBtn = document.getElementById("viewAmanatBtn");

  if (viewAmanatBtn) {

    viewAmanatBtn.addEventListener("click", () => {

      alert("Amanat management screen will be added next.");

    });

  }


  const viewBanksBtn = document.getElementById("viewBanksBtn");

  if (viewBanksBtn) {

    viewBanksBtn.addEventListener("click", () => {

      alert("Bank management screen will be added next.");

    });

  }

}


// ==========================================
// TRANSACTION MODAL
// ==========================================

function openTransactionModal(type = "") {

  const modal = document.getElementById("transactionModal");

  if (!modal) return;

  modal.classList.add("show");

  const typeInput = document.getElementById("transactionType");

  if (typeInput && type) {
    typeInput.value = type;
  }

  setTodayDate();

}


function closeTransactionModal() {

  const modal = document.getElementById("transactionModal");

  if (modal) {
    modal.classList.remove("show");
  }

}


// ==========================================
// TRANSACTION FORM
// ==========================================

function setupTransactionForm() {

  const form = document.getElementById("transactionForm");

  if (!form) return;

  form.addEventListener("submit", event => {

    event.preventDefault();

    const type = document.getElementById("transactionType").value;
    const name = document.getElementById("personName").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const date = document.getElementById("transactionDate").value;
    const note = document.getElementById("transactionNote").value.trim();


    if (!type) {
      alert("Please select a transaction type.");
      return;
    }


    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }


    const transaction = {

      id: Date.now(),

      type: type,

      name: name || getDefaultName(type),

      amount: amount,

      date: date,

      note: note,

      createdAt: new Date().toISOString()

    };


    saveTransaction(transaction);

    form.reset();

    setTodayDate();

    closeTransactionModal();

    loadDashboard();

  });

}


// ==========================================
// DEFAULT NAMES
// ==========================================

function getDefaultName(type) {

  if (type === "amanat") {
    return "Amanat";
  }

  if (type === "bank") {
    return "Bank Account";
  }

  if (type === "cash") {
    return "Cash";
  }

  if (type === "credit") {
    return "Credit Card";
  }

  return "Transaction";

}


// ==========================================
// RECENT TRANSACTIONS
// ==========================================

function renderRecentTransactions(transactions) {

  const container = document.getElementById("recentTransactions");

  if (!container) return;


  if (!transactions.length) {

    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>No Transactions Yet</h3>
        <p>Your recent transactions will appear here.</p>
      </div>
    `;

    return;
  }


  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);


  container.innerHTML = recent.map(transaction => {

    return `

      <div class="transaction-item">

        <div class="item-left">

          <div class="item-icon">
            ${getTypeIcon(transaction.type)}
          </div>

          <div>

            <div class="item-title">
              ${escapeHTML(transaction.name)}
            </div>

            <div class="item-subtitle">
              ${getTypeName(transaction.type)}
            </div>

          </div>

        </div>


        <div>

          <div class="item-amount">
            ${formatMoney(transaction.amount)}
          </div>

          <div class="item-date">
            ${formatDate(transaction.date)}
          </div>

        </div>

      </div>

    `;

  }).join("");

}


// ==========================================
// AMANAT LIST
// ==========================================

function renderAmanat(transactions) {

  const container = document.getElementById("amanatList");

  if (!container) return;


  const amanat = transactions.filter(
    transaction => transaction.type === "amanat"
  );


  if (!amanat.length) {

    container.innerHTML = `
      <div class="empty-state small">
        <div class="empty-icon">👤</div>
        <p>No Amanat records yet.</p>
      </div>
    `;

    return;
  }


  // Group by name
  const grouped = {};


  amanat.forEach(transaction => {

    const name = transaction.name || "Unknown";

    if (!grouped[name]) {
      grouped[name] = 0;
    }

    grouped[name] += Number(transaction.amount) || 0;

  });


  const people = Object.entries(grouped)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);


  container.innerHTML = people.map(([name, amount]) => {

    return `

      <div class="person-item">

        <div class="item-left">

          <div class="item-icon">
            👤
          </div>

          <div>

            <div class="item-title">
              ${escapeHTML(name)}
            </div>

            <div class="item-subtitle">
              Amanat Balance
            </div>

          </div>

        </div>


        <div class="item-amount">
          ${formatMoney(amount)}
        </div>

      </div>

    `;

  }).join("");

}


// ==========================================
// BANK LIST
// ==========================================

function renderBanks(transactions) {

  const container = document.getElementById("bankList");

  if (!container) return;


  const banks = transactions.filter(
    transaction => transaction.type === "bank"
  );


  if (!banks.length) {

    container.innerHTML = `
      <div class="empty-state small">
        <div class="empty-icon">🏦</div>
        <p>No bank accounts added yet.</p>
      </div>
    `;

    return;
  }


  const grouped = {};


  banks.forEach(transaction => {

    const name = transaction.name || "Bank";

    if (!grouped[name]) {
      grouped[name] = 0;
    }

    grouped[name] += Number(transaction.amount) || 0;

  });


  container.innerHTML = Object.entries(grouped)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, amount]) => {

      return `

        <div class="bank-item">

          <div class="item-left">

            <div class="item-icon">
              🏦
            </div>

            <div>

              <div class="item-title">
                ${escapeHTML(name)}
              </div>

              <div class="item-subtitle">
                Current Balance
              </div>

            </div>

          </div>


          <div class="item-amount">
            ${formatMoney(amount)}
          </div>

        </div>

      `;

    }).join("");

}


// ==========================================
// ICONS
// ==========================================

function getTypeIcon(type) {

  const icons = {

    amanat: "👤",

    bank: "🏦",

    cash: "💵",

    credit: "💳"

  };

  return icons[type] || "💰";

}


// ==========================================
// TYPE NAME
// ==========================================

function getTypeName(type) {

  const names = {

    amanat: "Amanat",

    bank: "Bank",

    cash: "Cash",

    credit: "Credit Card"

  };

  return names[type] || "Transaction";

}


// ==========================================
// DATE
// ==========================================

function formatDate(date) {

  if (!date) return "";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return date;
  }

  return d.toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

}


// ==========================================
// SECURITY
// ==========================================

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}
