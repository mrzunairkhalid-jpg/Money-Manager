// ==========================================
// MONEY MANAGER - MAIN SCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  initializeNavigation();

  initializeSettings();

  initializeServiceWorker();

});


// ==========================================
// NAVIGATION
// ==========================================

function initializeNavigation() {

  const navItems =
    document.querySelectorAll(".nav-item[data-page]");


  navItems.forEach(item => {

    item.addEventListener("click", () => {

      const page =
        item.dataset.page;


      navItems.forEach(nav => {

        nav.classList.remove("active");

      });


      item.classList.add("active");


      handleNavigation(page);

    });

  });

}


// ==========================================
// HANDLE NAVIGATION
// ==========================================

function handleNavigation(page) {

  if (page === "dashboard") {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    return;

  }


  if (page === "amanat") {

    const section =
      document.getElementById("amanatList");

    if (section) {

      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }

    return;

  }


  if (page === "accounts") {

    const section =
      document.getElementById("bankList");

    if (section) {

      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }

    return;

  }


  if (page === "reports") {

    showReportsMessage();

    return;

  }

}


// ==========================================
// REPORTS
// ==========================================

function showReportsMessage() {

  const totals =
    calculateTotals();


  alert(

    "Money Manager Summary\n\n" +

    "Bank: " +
    formatRupees(totals.bank) +

    "\nCash: " +
    formatRupees(totals.cash) +

    "\nAmanat: " +
    formatRupees(totals.amanat) +

    "\nCredit Card: " +
    formatRupees(totals.credit) +

    "\n\nNet Balance: " +
    formatRupees(totals.net)

  );

}


// ==========================================
// SETTINGS
// ==========================================

function initializeSettings() {

  const settingsBtn =
    document.getElementById("settingsBtn");


  if (!settingsBtn) return;


  settingsBtn.addEventListener("click", () => {

    showSettingsMenu();

  });

}


// ==========================================
// SETTINGS MENU
// ==========================================

function showSettingsMenu() {

  const choice =
    prompt(

      "Money Manager Settings\n\n" +

      "1 = Backup Data\n" +

      "2 = Restore Backup\n" +

      "3 = Delete All Data\n\n" +

      "Enter number:"

    );


  if (choice === "1") {

    exportBackup();

    showToast(
      "Backup created successfully."
    );

  }


  if (choice === "2") {

    openRestorePicker();

  }


  if (choice === "3") {

    const deleted =
      clearAllTransactions();


    if (deleted) {

      loadDashboard();

      showToast(
        "All data deleted."
      );

    }

  }

}


// ==========================================
// RESTORE BACKUP
// ==========================================

function openRestorePicker() {

  const input =
    document.createElement("input");


  input.type = "file";

  input.accept =
    "application/json,.json";


  input.style.display =
    "none";


  document.body.appendChild(input);


  input.addEventListener(
    "change",
    async () => {

      const file =
        input.files[0];


      if (!file) {

        input.remove();

        return;

      }


      try {

        const count =
          await importBackup(file);


        loadDashboard();


        showToast(
          `${count} records restored successfully.`
        );

      } catch (error) {

        showToast(
          String(error),
          "error"
        );

      }


      input.remove();

    }
  );


  input.click();

}


// ==========================================
// SERVICE WORKER
// ==========================================

function initializeServiceWorker() {

  if (
    "serviceWorker" in navigator
  ) {

    window.addEventListener(
      "load",
      () => {

        navigator.serviceWorker
          .register("sw.js")
          .then(() => {

            console.log(
              "Money Manager Service Worker registered."
            );

          })
          .catch(error => {

            console.error(
              "Service Worker registration failed:",
              error
            );

          });

      }
    );

  }

}


// ==========================================
// KEYBOARD SHORTCUT
// ==========================================

document.addEventListener(
  "keydown",
  event => {

    // Ctrl + K / Command + K
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "k"
    ) {

      event.preventDefault();

      openTransactionModal();

    }

  }
);


// ==========================================
// PREVENT ACCIDENTAL FORM SUBMIT
// ==========================================

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter" &&
      event.target.tagName === "INPUT" &&
      event.target.type !== "submit"
    ) {

      // Keep normal input behavior.
      return;

    }

  }
);
