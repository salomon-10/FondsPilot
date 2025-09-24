// ==== coffre.js ====
try {
  // ----- Variables -----
  let coffreCode = localStorage.getItem("coffreCode") || "123456";
  let coffreOuvert = false;
  let inputCode = "";

  // ----- Éléments DOM -----
  const screen = document.getElementById("consoleScreen");
  const numBtns = document.querySelectorAll(".num-btn");
  const clearBtn = document.getElementById("clearBtn");
  const enterBtn = document.getElementById("enterBtn");
  const coffreAccess = document.getElementById("coffreAccess");

  const changeCodeBtn = document.getElementById("changeCodeBtn");
  const changeCodeForm = document.getElementById("changeCodeForm");
  const oldCodeInput = document.getElementById("oldCodeInput");
  const newCodeInput = document.getElementById("newCodeInput");
  const saveNewCode = document.getElementById("saveNewCode");

  const coffreTotalEl = document.getElementById("coffreTotal");
  const totalEpargneEl = document.getElementById("totalEpargne");
  const coffreList = document.getElementById("coffreList");

  const withdrawInput = document.getElementById("withdrawAmount");
  const withdrawBtn = document.getElementById("withdrawCoffreBtn");

  const modalBack = document.getElementById("modalBack");
  const modalBody = document.getElementById("modalBody");
  const modalCancel = document.getElementById("modalCancel");
  const modalConfirm = document.getElementById("modalConfirm");

  const resetBtn = document.getElementById("resetCoffreBtn");
  const coffreIllustration = document.querySelector(".coffre-illustration");

  let coffreData = JSON.parse(localStorage.getItem("coffreData")) || [];

  // ----- Fonctions -----

  function updateScreen() {
    const display = inputCode.padEnd(6, "_");
    screen.innerHTML = display + '<span class="cursor">|</span>';
  }

  function verifierCode() {
    if (inputCode === coffreCode) {
      coffreOuvert = true;
      coffreAccess.style.display = "flex";
      ouvrirCoffre();
      alert("Code correct ! Coffre ouvert.");
    } else {
      alert("Code incorrect !");
    }
    inputCode = "";
    updateScreen();
  }

  function ouvrirCoffre() {
    const coffreBody = document.querySelector(".coffre-body");
    if (!coffreBody) return;
    coffreBody.style.transition = "transform 0.5s ease";
    coffreBody.style.transform = "rotateX(15deg)";
    setTimeout(() => {
      coffreBody.style.transform = "rotateX(0deg)";
    }, 500);
  }

  function recalculerTotal() {
    let total = 0;
    let totalEpargne = 0;

    coffreData.forEach(op => {
      total += (op.type === "withdraw" ? -op.amount : op.amount);
      if (op.type === "save") totalEpargne += op.amount;
    });

    if(coffreTotalEl) coffreTotalEl.textContent = total.toFixed(2);
    if(totalEpargneEl) totalEpargneEl.textContent = totalEpargne.toFixed(2);
    return total;
  }

  function loadCoffre() {
    coffreList.innerHTML = "";
    coffreData.forEach(op => {
      const item = document.createElement("div");
      item.className = "coffre-item";

      if(op.type === "deposit" || op.type === "save") {
        item.textContent = `${op.type === "save" ? "Épargne" : "Dépôt"} : +${op.amount.toFixed(2)}`;
      } else if(op.type === "withdraw") {
        item.textContent = `Retrait : -${op.amount.toFixed(2)}`;
      }

      coffreList.appendChild(item);
    });
  }

  function ajouterOperation(type, montant, origin = "", ref = "") {
    montant = parseFloat(montant);
    if (isNaN(montant) || montant <= 0) return;
    coffreData.push({ type, amount: montant, origin, ref, date: new Date().toISOString() });
    localStorage.setItem("coffreData", JSON.stringify(coffreData));
    loadCoffre();
    recalculerTotal();
  }

  // ----- Événements -----
  numBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if(inputCode.length < 6) {
        inputCode += btn.textContent;
        updateScreen();
      }
    });
  });

  clearBtn.addEventListener("click", () => {
    inputCode = "";
    updateScreen();
  });

  enterBtn.addEventListener("click", () => {
    if(!coffreOuvert) verifierCode();
  });

  changeCodeBtn.addEventListener("click", () => {
    changeCodeForm.style.display = changeCodeForm.style.display === "none" ? "block" : "none";
  });

  saveNewCode.addEventListener("click", () => {
    const oldCode = oldCodeInput.value;
    const newCode = newCodeInput.value;
    if(oldCode === coffreCode && newCode.length === 6) {
      coffreCode = newCode;
      localStorage.setItem("coffreCode", coffreCode);
      alert("Code changé avec succès !");
      oldCodeInput.value = "";
      newCodeInput.value = "";
      changeCodeForm.style.display = "none";
    } else {
      alert("Ancien code incorrect ou nouveau code invalide !");
    }
  });

  withdrawBtn.addEventListener("click", () => {
    const montant = parseFloat(withdrawInput.value);
    const totalCoffre = recalculerTotal();
    if(isNaN(montant) || montant <= 0) return alert("Montant invalide !");
    if(montant > totalCoffre) return alert("Montant supérieur au total du coffre !");

    modalBody.textContent = `Voulez-vous retirer ${montant.toFixed(2)} du coffre ?`;
    modalBack.style.display = "flex";

    modalConfirm.onclick = () => {
      ajouterOperation("withdraw", montant);
      withdrawInput.value = "";
      modalBack.style.display = "none";
    };
    modalCancel.onclick = () => modalBack.style.display = "none";
  });

  // ----- Appui long 5 secondes pour reset (desktop + mobile) -----
  let pressTimer;

  function startPressTimer() {
    pressTimer = setTimeout(() => {
      if(resetBtn) {
        resetBtn.style.display = "inline-block";
        alert("Mode admin activé !");
      }
    }, 5000); // 5 secondes
  }

  function cancelPressTimer() {
    clearTimeout(pressTimer);
  }

  if(coffreIllustration) {
    // Desktop
    coffreIllustration.addEventListener("mousedown", startPressTimer);
    coffreIllustration.addEventListener("mouseup", cancelPressTimer);
    coffreIllustration.addEventListener("mouseleave", cancelPressTimer);
    // Mobile
    coffreIllustration.addEventListener("touchstart", startPressTimer);
    coffreIllustration.addEventListener("touchend", cancelPressTimer);
  }

  if(resetBtn) {
    resetBtn.addEventListener("click", () => {
      if(confirm("Réinitialiser le coffre au code par défaut (123456) ?")) {
        localStorage.setItem("coffreCode", "123456");
        alert("Code réinitialisé : 123456");
        resetBtn.style.display = "none";
      }
    });
  }

  // ----- Initialisation -----
  loadCoffre();
  recalculerTotal();
  updateScreen();

  // Rendre disponible pour d'autres pages
  window.ajouterOperation = ajouterOperation;

} catch(e) {
  console.error("Erreur coffre.js :", e);
}
