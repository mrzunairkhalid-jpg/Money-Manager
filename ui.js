// ==========================================
// MONEY MANAGER - UI HELPERS
// ==========================================

function showToast(message, type = "success") {

  let toast = document.getElementById("moneyManagerToast");

  if (!toast) {

    toast = document.createElement("div");

    toast.id = "moneyManagerToast";

    toast.style.position = "fixed";
    toast.style.left = "50%";
    toast.style.bottom = "90px";
    toast.style.transform = "translateX(-50%)";
    toast.style.zIndex = "9999";
    toast.style.padding = "12px 18px";
    toast.style.borderRadius = "14px";
    toast.style.fontSize = "13px";
    toast.style.fontWeight = "700";
    toast.style.boxShadow = "0 10px 30px rgba(0,0,0,.35)";
    toast.style.maxWidth = "90%";
    toast.style.textAlign = "center";

    document.body.appendChild(toast);

  }


  if (type === "error") {

    toast.style.background = "#ef4444";
    toast.style.color = "#ffffff";

  } else {

    toast.style.background = "#d4af37";
    toast.style.color = "#111111";

  }


  toast.textContent = message;

  toast.style.display = "block";


  clearTimeout(window.moneyManagerToastTimer);


  window.moneyManagerToastTimer = setTimeout(() => {

    toast.style.display = "none";

  }, 2500);

}


// ==========================================
// CONFIRM DIALOG
// ==========================================

function confirmAction(message) {

  return window.confirm(message);

}


// ==========================================
// EMPTY STATE
// ==========================================

function renderEmptyState(
  container,
  icon,
  title,
  message
) {

  if (!container) return;


  container.innerHTML = `

    <div class="empty-state">

      <div class="empty-icon">
        ${icon}
      </div>

      <h3>
        ${title}
      </h3>

      <p>
        ${message}
      </p>

    </div>

  `;

}


// ==========================================
// SET TEXT SAFELY
// ==========================================

function setText(id, value) {

  const element =
    document.getElementById(id);


  if (element) {

    element.textContent =
      value ?? "";

  }

}


// ==========================================
// SHOW / HIDE ELEMENT
// ==========================================

function showElement(element) {

  if (!element) return;

  element.style.display = "";

}


function hideElement(element) {

  if (!element) return;

  element.style.display = "none";

}


// ==========================================
// MODAL HELPERS
// ==========================================

function showModal(id) {

  const modal =
    document.getElementById(id);


  if (!modal) return;


  modal.classList.add("show");

}


function hideModal(id) {

  const modal =
    document.getElementById(id);


  if (!modal) return;


  modal.classList.remove("show");

}


// ==========================================
// FORMAT NUMBER
// ==========================================

function formatNumber(number) {

  const value =
    Number(number) || 0;


  return value.toLocaleString(
    "en-PK",
    {
      maximumFractionDigits: 2
    }
  );

}


// ==========================================
// FORMAT RUPEES
// ==========================================

function formatRupees(number) {

  return `Rs. ${formatNumber(number)}`;

}


// ==========================================
// GET TODAY
// ==========================================

function getToday() {

  const today =
    new Date();


  const year =
    today.getFullYear();


  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, "0");


  const day =
    String(
      today.getDate()
    ).padStart(2, "0");


  return `${year}-${month}-${day}`;

}


// ==========================================
// FORM RESET
// ==========================================

function resetTransactionForm() {

  const form =
    document.getElementById(
      "transactionForm"
    );


  if (!form) return;


  form.reset();


  const dateInput =
    document.getElementById(
      "transactionDate"
    );


  if (dateInput) {

    dateInput.value =
      getToday();

  }

}


// ==========================================
// TYPE COLORS
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


// ==========================================
// TYPE ICON
// ==========================================

function getTransactionIcon(type) {

  const icons = {

    amanat: "👤",

    bank: "🏦",

    cash: "💵",

    credit: "💳"

  };


  return icons[type] || "💰";

}


// ==========================================
// TYPE LABEL
// ==========================================

function getTransactionLabel(type) {

  const labels = {

    amanat: "Amanat",

    bank: "Bank",

    cash: "Cash",

    credit: "Credit Card"

  };


  return labels[type] || "Transaction";

}


// ==========================================
// DATE FORMATTER
// ==========================================

function formatTransactionDate(date) {

  if (!date) return "";


  const parsed =
    new Date(date);


  if (Number.isNaN(parsed.getTime())) {

    return date;

  }


  return parsed.toLocaleDateString(
    "en-PK",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );

}


// ==========================================
// SAFE HTML
// ==========================================

function safeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


// ==========================================
// SCROLL TO TOP
// ==========================================

function scrollToTop() {

  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}


// ==========================================
// VIBRATION
// ==========================================

function vibrate() {

  if (
    "vibrate" in navigator
  ) {

    navigator.vibrate(10);

  }

}


// ==========================================
// LOADING STATE
// ==========================================

function setButtonLoading(
  button,
  loading
) {

  if (!button) return;


  if (loading) {

    button.dataset.originalText =
      button.textContent;

    button.textContent =
      "Please wait...";

    button.disabled =
      true;

  } else {

    button.textContent =
      button.dataset.originalText ||
      "Save";

    button.disabled =
      false;

  }

}
