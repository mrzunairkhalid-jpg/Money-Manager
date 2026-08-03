// ==========================================
// MONEY MANAGER - MAIN APP
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});


// ==========================================
// START APP
// ==========================================

function initializeApp() {
  setTodayDate();
  createOperationSelector();
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
// ADD / MINUS SELECTOR
// ==========================================

function createOperationSelector() {

  const typeInput =
    document.getElementById("transactionType");

  const amountInput =
    document.getElementById("amount");

  if (!typeInput || !amountInput) return;

  if (document.getElementById("operationType")) return;

  const label = document.createElement("label");

  label.htmlFor = "operationType";
  label.textContent = "Transaction";

  const select = document.createElement("select");

  select.id = "operationType";

  select.innerHTML = `
    <option value="add">➕ Add / Receive</option>
    <option value="minus">➖ Minus / Return</option>
  `;

  amountInput.parentNode.insertBefore(
    label,
    amountInput
  );

  amountInput.parentNode.insertBefore(
    select,
    amountInput
  );
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


  const totalAssets =
    bank + cash;

  const totalLiabilities =
    amanat + credit;

  const netBalance =
    totalAssets - totalLiabilities;


  updateAmount("bankTotal", bank);
  updateAmount("cashTotal", cash);
  updateAmount("amanatTotal", amanat);
  updateAmount("creditTotal", credit);

  updateAmount("totalAssets", totalAssets);
  updateAmount(
    "totalLiabilities",
    totalLiabilities
  );

  updateAmount(
    "netBalance",
    netBalance
  );


  renderRecentTransactions(transactions);
  renderAmanat(transactions);
  renderBanks(transactions);
}


// ==========================================
// MONEY FORMAT
// ==========================================

function formatMoney(amount) {

  return "Rs. " +
    Math.abs(Number(amount || 0))
      .toLocaleString("en-PK", {
        maximumFractionDigits: 2
      });

}


function formatRupees(amount) {

  const number = Number(amount) || 0;

  if (number < 0) {
    return "- Rs. " + Math.abs(number)
      .toLocaleString("en-PK");
  }

  return "Rs. " +
    number.toLocaleString("en-PK");
}


function updateAmount(id, amount) {

  const element =
    document.getElementById(id);

  if (!element) return;

  const number = Number(amount) || 0;

  element.textContent =
    number < 0
      ? "- Rs. " + Math.abs(number).toLocaleString("en-PK")
      : "Rs. " + number.toLocaleString("en-PK");

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
// OPEN MODAL
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

  const operation =
    document.getElementById(
      "operationType"
    );

  if (operation) {
    operation.value = "add";
  }

  setTodayDate();
}


// ==========================================
// CLOSE MODAL
// ==========================================

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


      const rawAmount =
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


      const operationElement =
        document.getElementById(
          "operationType"
        );


      const operation =
        operationElement
          ? operationElement.value
          : "add";


      if (!type) {

        showToast(
          "Please select a type.",
          "error"
        );

        return;
      }


      if (!rawAmount || rawAmount <= 0) {

        showToast(
          "Please enter a valid amount.",
          "error"
        );

        return;
      }


      let amount = rawAmount;


      if (operation === "minus") {
        amount = -rawAmount;
      }


      const transaction = {

        id: Date.now(),

        type: type,

        name:
          name ||
          getDefaultName(type),

        amount: amount,

        operation: operation,

        date: date,

        note: note,

        createdAt:
          new Date().toISOString()

      };


      saveTransaction(transaction);


      form.reset();

      setTodayDate();

      const operationAfterReset =
        document.getElementById(
          "operationType"
        );

      if (operationAfterReset) {
        operationAfterReset.value = "add";
      }


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
          new Date(b.createdAt || b.date) -
          new Date(a.createdAt || a.date)
      )
      .slice(0, 8);


  container.innerHTML =
    recent.map(item => {

      const color =
        getTypeColor(item.type);

      const icon =
        getTransactionIcon(item.type);

      const amount =
        Number(item.amount) || 0;

      const sign =
        amount >= 0 ? "+" : "−";


      return `

        <div
          class="transaction-item"
          style="border-left: 3px solid ${color}"
        >

          <div class="item-left">

            <div
              class="item-icon"
              style="background:${color}20"
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

            <div
              class="item-amount"
              style="color:${color}"
            >
              ${sign} ${formatMoney(amount)}
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
// AMANAT LIST
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
          Math.abs(b[1].balance) -
          Math.abs(a[1].balance)
      )
      .slice(0, 10)
      .map(([name, person]) => {

        const balance =
          Number(person.balance) || 0;


        const color =
          balance >= 0
            ? "#f59e0b"
            : "#22c55e";


        return `

          <div
            class="person-item"
            onclick="showPersonHistory('${escapeForAttribute(name)}')"
            style="
              cursor:pointer;
              border-left:3px solid ${color};
            "
          >

            <div class="item-left">

              <div
                class="item-icon"
                style="background:${color}20"
              >
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

              <div
                class="item-amount"
                style="color:${color}"
              >
                ${formatRupees(balance)}
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
// BANK LIST
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


            <div
              class="item-amount"
              style="color:#3b82f6"
            >
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

    const amount =
      Number(item.amount) || 0;

    const sign =
      amount >= 0 ? "+" : "−";


    message +=
      `\n${formatTransactionDate(item.date)}`;


    message +=
      ` — ${sign} ${formatMoney(amount)}`;


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


function safeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function renderEmptyState(
  container,
  icon,
  title,
  text
) {

  container.innerHTML = `

    <div class="empty-state">

      <div class="empty-icon">
        ${icon}
      </div>

      <h3>
        ${title}
      </h3>

      <p>
        ${text}
      </p>

    </div>

  `;

}
