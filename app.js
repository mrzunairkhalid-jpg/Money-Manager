// ==========================================
// MONEY MANAGER - APP CONTROLLER
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});


// ==========================================
// INITIALIZE
// ==========================================

function initializeApp() {
  setTodayDate();
  loadDashboard();
  setupButtons();
  setupTransactionForm();
}


// ==========================================
// DATE
// ==========================================

function setTodayDate() {
  const input = document.getElementById("transactionDate");

  if (!input) return;

  const today = new Date();

  input.value =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");
}


// ==========================================
// DASHBOARD
// ==========================================

function loadDashboard() {

  const transactions = getTransactions();

  let bank = 0;
  let cash = 0;
  let amanat = 0;
  let credit = 0;

  transactions.forEach(item => {

    const amount = Number(item.amount) || 0;

    if (item.type === "bank") {
      bank += amount;
    }

    if (item.type === "cash") {
      cash += amount;
    }

    if (item.type === "amanat") {
      amanat += amount;
    }

    if (item.type === "credit") {
      credit += amount;
    }

  });


  const assets = bank + cash;

  const liabilities = amanat + credit;

  const net = assets - liabilities;


  updateAmount("bankTotal", bank);
  updateAmount("cashTotal", cash);
  updateAmount("amanatTotal", amanat);
  updateAmount("creditTotal", credit);

  updateAmount("totalAssets", assets);
  updateAmount("totalLiabilities", liabilities);
  updateAmount("netBalance", net);


  renderRecentTransactions(transactions);

  renderAmanat(transactions);

  renderBanks(transactions);

}


// ==========================================
// MONEY FORMAT
// ==========================================

function formatMoney(amount) {

  return "Rs. " +
    Number(amount || 0).toLocaleString("en-PK", {
      maximumFractionDigits: 2
    });

}


function updateAmount(id, amount) {

  const element =
    document.getElementById(id);

  if (element) {
    element.textContent =
      formatMoney(amount);
  }

}


// ==========================================
// BUTTONS
// ==========================================

function setupButtons() {

  const addButton =
    document.getElementById("mainAddBtn");


  if (addButton) {

    addButton.addEventListener(
      "click",
      () => openTransactionModal()
    );

  }


  document.querySelectorAll(
    "[data-action]"
  ).forEach(button => {

    button.addEventListener(
      "click",
      () => {

        openTransactionModal(
          button.dataset.action
        );

      }
    );

  });


  const closeButton =
    document.getElementById("closeModalBtn");


  if (closeButton) {

    closeButton.addEventListener(
      "click",
      closeTransactionModal
    );

  }


  const modal =
    document.getElementById(
      "transactionModal"
    );


  if (modal) {

    modal.addEventListener(
      "click",
      event => {

        if (event.target === modal) {

          closeTransactionModal();

        }

      }
    );

  }

}


// ==========================================
// MODAL
// ==========================================

function openTransactionModal(type = "") {

  const modal =
    document.getElementById(
      "transactionModal"
    );


  if (!modal) return;


  modal.classList.add("show");


  const typeInput =
    document.getElementById(
      "transactionType"
    );


  if (typeInput && type) {

    typeInput.value = type;

  }


  setTodayDate();

}


function closeTransactionModal() {

  const modal =
    document.getElementById(
      "transactionModal"
    );


  if (modal) {

    modal.classList.remove("show");

  }

}


// ==========================================
// FORM
// ==========================================

function setupTransactionForm() {

  const form =
    document.getElementById(
      "transactionForm"
    );


  if (!form) return;


  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const type =
        document.getElementById(
          "transactionType"
        ).value;


      const name =
        document.getElementById(
          "personName"
        ).value.trim();


      const amount =
        Number(
          document.getElementById(
            "amount"
          ).value
        );


      const date =
        document.getElementById(
          "transactionDate"
        ).value;


      const note =
        document.getElementById(
          "transactionNote"
        ).value.trim();


      if (!type) {

        showToast(
          "Please select a type.",
          "error"
        );

        return;

      }


      if (!amount || amount <= 0) {

        showToast(
          "Please enter a valid amount.",
          "error"
        );

        return;

      }


      const transaction = {

        id: Date.now(),

        type: type,

        name:
          name ||
          getDefaultName(type),

        amount: amount,

        date: date,

        note: note,

        createdAt:
          new Date().toISOString()

      };


      saveTransaction(transaction);


      form.reset();

      setTodayDate();

      closeTransactionModal();

      loadDashboard();


      showToast(
        "Transaction saved successfully."
      );

    }
  );

}


// ==========================================
// DEFAULT NAME
// ==========================================

function getDefaultName(type) {

  const names = {

    amanat: "Amanat",

    bank: "Bank Account",

    cash: "Cash",

    credit: "Credit Card"

  };


  return names[type] || "Transaction";

}


// ==========================================
// RECENT TRANSACTIONS
// ==========================================

function renderRecentTransactions(
  transactions
) {

  const container =
    document.getElementById(
      "recentTransactions"
    );


  if (!container) return;


  if (!transactions.length) {

    renderEmptyState(
      container,
      "📋",
      "No Transactions Yet",
      "Your recent transactions will appear here."
    );

    return;

  }


  const recent =
    [...transactions]
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .slice(0, 8);


  container.innerHTML =
    recent.map(item => {

      const color =
        getTypeColor(item.type);


      const icon =
        getTransactionIcon(item.type);


      return `

        <div
          class="transaction-item"
          style="border-left: 3px solid ${color}"
        >

          <div class="item-left">

            <div
              class="item-icon"
              style="
                background:${color}20;
              "
            >
              ${icon}
            </div>

            <div>

              <div class="item-title">
                ${safeHTML(item.name)}
              </div>

              <div class="item-subtitle">
                ${getTransactionLabel(item.type)}
              </div>

            </div>

          </div>


          <div>

            <div class="item-amount">
              ${formatRupees(item.amount)}
            </div>

            <div class="item-date">
              ${formatTransactionDate(item.date)}
            </div>

          </div>

        </div>

      `;

    }).join("");

}


// ==========================================
// AMANAT
// ==========================================

function renderAmanat(transactions) {

  const container =
    document.getElementById(
      "amanatList"
    );


  if (!container) return;


  const amanat =
    transactions.filter(
      item =>
        item.type === "amanat"
    );


  if (!amanat.length) {

    renderEmptyState(
      container,
      "👤",
      "No Amanat",
      "Add people's money from the Add button."
    );

    return;

  }


  const people = {};


  amanat.forEach(item => {

    const name =
      item.name || "Unknown";


    if (!people[name]) {

      people[name] = {

        balance: 0,

        transactions: []

      };

    }


    people[name].balance +=
      Number(item.amount) || 0;


    people[name].transactions.push(
      item
    );

  });


  container.innerHTML =
    Object.entries(people)
      .sort(
        (a, b) =>
          b[1].balance -
          a[1].balance
      )
      .slice(0, 8)
      .map(([name, person]) => {

        return `

          <div
            class="person-item"
            onclick="showPersonHistory('${escapeForAttribute(name)}')"
            style="cursor:pointer"
          >

            <div class="item-left">

              <div class="item-icon">
                👤
              </div>

              <div>

                <div class="item-title">
                  ${safeHTML(name)}
                </div>

                <div class="item-subtitle">
                  Tap to view history
                </div>

              </div>

            </div>


            <div>

              <div class="item-amount">
                ${formatRupees(person.balance)}
              </div>

              <div class="item-date">
                Current Balance
              </div>

            </div>

          </div>

        `;

      }).join("");

}


// ==========================================
// BANKS
// ==========================================

function renderBanks(transactions) {

  const container =
    document.getElementById(
      "bankList"
    );


  if (!container) return;


  const banks =
    transactions.filter(
      item =>
        item.type === "bank"
    );


  if (!banks.length) {

    renderEmptyState(
      container,
      "🏦",
      "No Bank Accounts",
      "Add your bank balance from the Add button."
    );

    return;

  }


  const accounts = {};


  banks.forEach(item => {

    const name =
      item.name || "Bank";


    if (!accounts[name]) {

      accounts[name] = 0;

    }


    accounts[name] +=
      Number(item.amount) || 0;

  });


  container.innerHTML =
    Object.entries(accounts)
      .map(([name, amount]) => {

        return `

          <div class="bank-item">

            <div class="item-left">

              <div class="item-icon">
                🏦
              </div>

              <div>

                <div class="item-title">
                  ${safeHTML(name)}
                </div>

                <div class="item-subtitle">
                  Current Balance
                </div>

              </div>

            </div>


            <div class="item-amount">
              ${formatRupees(amount)}
            </div>

          </div>

        `;

      }).join("");

}


// ==========================================
// PERSON HISTORY
// ==========================================

function showPersonHistory(name) {

  const transactions =
    getTransactions()
      .filter(
        item =>
          item.type === "amanat" &&
          item.name === name
      )
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      );


  if (!transactions.length) {

    showToast(
      "No history found.",
      "error"
    );

    return;

  }


  let balance = 0;


  transactions.forEach(item => {

    balance +=
      Number(item.amount) || 0;

  });


  let message =
    `👤 ${name}\n\n`;


  message +=
    `Current Balance: ${formatRupees(balance)}\n\n`;


  message +=
    "Transaction History:\n";


  transactions.forEach(item => {

    message +=
      `\n${formatTransactionDate(item.date)}`;


    message +=
      ` — ${formatRupees(item.amount)}`;


    if (item.note) {

      message +=
        ` (${item.note})`;

    }

  });


  alert(message);

}


// ==========================================
// HELPERS
// ==========================================

function getTypeColor(type) {

  const colors = {

    amanat: "#f59e0b",

    bank: "#3b82f6",

    cash: "#22c55e",

    credit: "#ef4444"

  };


  return colors[type] || "#d4af37";

}


function getTransactionIcon(type) {

  const icons = {

    amanat: "👤",

    bank: "🏦",

    cash: "💵",

    credit: "💳"

  };


  return icons[type] || "💰";

}


function getTransactionLabel(type) {

  const labels = {

    amanat: "Amanat",

    bank: "Bank",

    cash: "Cash",

    credit: "Credit Card"

  };


  return labels[type] || "Transaction";

}


function formatTransactionDate(date) {

  if (!date) return "";


  const d =
    new Date(date);


  if (Number.isNaN(d.getTime())) {

    return date;

  }


  return d.toLocaleDateString(
    "en-PK",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );

}


function escapeForAttribute(value) {

  return String(value)
    .replaceAll("\\", "\\\\")
    .replaceAll("'", "\\'");

}


// ==========================================
// DONE
// ==========================================
