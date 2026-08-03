// ==========================================
// MONEY MANAGER - STORAGE
// ==========================================

const STORAGE_KEY = "moneyManagerTransactions";


// ==========================================
// GET ALL TRANSACTIONS
// ==========================================

function getTransactions() {

  try {

    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    const transactions = JSON.parse(data);

    if (!Array.isArray(transactions)) {
      return [];
    }

    return transactions;

  } catch (error) {

    console.error("Unable to read saved data:", error);

    return [];

  }

}


// ==========================================
// SAVE ONE TRANSACTION
// ==========================================

function saveTransaction(transaction) {

  const transactions = getTransactions();

  transactions.push(transaction);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(transactions)
  );

}


// ==========================================
// SAVE ALL TRANSACTIONS
// ==========================================

function saveAllTransactions(transactions) {

  if (!Array.isArray(transactions)) {
    return false;
  }

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(transactions)
    );

    return true;

  } catch (error) {

    console.error("Unable to save data:", error);

    return false;

  }

}


// ==========================================
// DELETE TRANSACTION
// ==========================================

function deleteTransaction(id) {

  const transactions = getTransactions();

  const updatedTransactions = transactions.filter(
    transaction => String(transaction.id) !== String(id)
  );

  saveAllTransactions(updatedTransactions);

  return updatedTransactions;

}


// ==========================================
// CLEAR ALL DATA
// ==========================================

function clearAllTransactions() {

  const confirmed = confirm(
    "Are you sure you want to delete ALL Money Manager data?"
  );

  if (!confirmed) {
    return false;
  }

  localStorage.removeItem(STORAGE_KEY);

  return true;

}


// ==========================================
// EXPORT BACKUP
// ==========================================

function exportBackup() {

  const transactions = getTransactions();

  const backup = {

    app: "Money Manager",

    version: 1,

    exportedAt: new Date().toISOString(),

    transactions: transactions

  };


  const json = JSON.stringify(
    backup,
    null,
    2
  );


  const blob = new Blob(
    [json],
    { type: "application/json" }
  );


  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download =
    `money-manager-backup-${getBackupDate()}.json`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);

}


// ==========================================
// IMPORT BACKUP
// ==========================================

function importBackup(file) {

  return new Promise((resolve, reject) => {

    if (!file) {
      reject("No backup file selected.");
      return;
    }


    const reader = new FileReader();


    reader.onload = event => {

      try {

        const backup =
          JSON.parse(event.target.result);


        if (
          !backup ||
          !Array.isArray(backup.transactions)
        ) {

          reject("Invalid Money Manager backup file.");

          return;

        }


        saveAllTransactions(
          backup.transactions
        );


        resolve(
          backup.transactions.length
        );

      } catch (error) {

        reject(
          "Unable to read backup file."
        );

      }

    };


    reader.onerror = () => {

      reject(
        "Unable to open backup file."
      );

    };


    reader.readAsText(file);

  });

}


// ==========================================
// BACKUP DATE
// ==========================================

function getBackupDate() {

  const now = new Date();

  const year = now.getFullYear();

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;

}


// ==========================================
// CALCULATE TOTAL
// ==========================================

function calculateTotal(type) {

  const transactions = getTransactions();

  return transactions
    .filter(transaction => transaction.type === type)
    .reduce(
      (total, transaction) =>
        total + (Number(transaction.amount) || 0),
      0
    );

}


// ==========================================
// CALCULATE ALL TOTALS
// ==========================================

function calculateTotals() {

  const transactions = getTransactions();


  const totals = {

    bank: 0,

    cash: 0,

    amanat: 0,

    credit: 0

  };


  transactions.forEach(transaction => {

    const amount =
      Number(transaction.amount) || 0;


    if (
      Object.prototype.hasOwnProperty.call(
        totals,
        transaction.type
      )
    ) {

      totals[transaction.type] += amount;

    }

  });


  totals.assets =
    totals.bank + totals.cash;


  totals.liabilities =
    totals.amanat + totals.credit;


  totals.net =
    totals.assets - totals.liabilities;


  return totals;

}
