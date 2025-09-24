// --- balance.js ---

// Devise choisie par l'utilisateur (par défaut XOF)
let selectedCurrency = localStorage.getItem("selectedCurrency") || "XOF";

// Symboles pour chaque devise
const symbols = { 
  XOF: "CFA", 
  USD: "$", 
  EUR: "€", 
  GBP: "£", 
  JPY: "¥", 
  CNY: "¥", 
  XAF: "FCFA" 
};

// --- Gestion des opérations ---
function getOperations() {
  return JSON.parse(localStorage.getItem("operations") || "[]");
}

function saveOperation(op) {
  const ops = getOperations();
  ops.unshift(op); // ajouter au début
  localStorage.setItem("operations", JSON.stringify(ops));
}

// --- Calcul du solde total en XOF ---
function getBalanceXOF() {
  return getOperations().reduce((total, op) => {
    if (op.type === "deposit" || op.type === "save") return total + Number(op.amount || 0);
    if (op.type === "withdraw") return total - Number(op.amount || 0);
    return total;
  }, 0);
}

// --- Formatage du montant selon la devise sélectionnée ---
function formatCurrency(value) {
  return value.toLocaleString("fr-FR") + " " + (symbols[selectedCurrency] || selectedCurrency);
}

// --- Actualiser le solde affiché dans le DOM ---
function refreshBalance() {
  const balanceEls = document.querySelectorAll("#balanceAmount, #balanceBadge");
  const balance = getBalanceXOF();
  balanceEls.forEach(el => {
    if (el) el.innerText = formatCurrency(balance);
  });
}

// --- Changer la devise globale ---
function setCurrency(currency) {
  selectedCurrency = currency;
  localStorage.setItem("selectedCurrency", currency);
  refreshBalance();
}

// --- Initialiser le sélecteur de devise sur la page ---
function initBalancePage(currencySelectId) {
  const select = document.getElementById(currencySelectId);
  if (!select) return;

  select.value = selectedCurrency;
  select.addEventListener("change", () => setCurrency(select.value));

  refreshBalance();
}

// --- Exporter les fonctions pour les autres scripts ---
window.getBalanceXOF = getBalanceXOF;
window.formatCurrency = formatCurrency;
window.saveOperation = saveOperation;
window.refreshBalance = refreshBalance;
window.setCurrency = setCurrency;
window.initBalancePage = initBalancePage;
