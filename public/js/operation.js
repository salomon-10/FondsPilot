// operation.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("operationForm");
    if (!form) return;

    initOperationPage(form.dataset.type);
});

const API_BASE = "https://fondspilot.zya.me/Fondspilot-backend/api";

// --- Auth helpers ---
function getUserToken() {
    const token = sessionStorage.getItem("id_token"); // token Google
    if (!token) {
        alert("Utilisateur non connecté !");
        window.location.href = "../index.html";
    }
    return token;
}

function getUserId() {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
        alert("Utilisateur non connecté !");
        window.location.href = "../index.html";
    }
    return userId;
}

// --- Page init ---
function initOperationPage(type) {
    const form = document.getElementById("operationForm");
    const amountInput = form.querySelector("#amount");
    const originInput = form.querySelector("#origin");
    const refInput = form.querySelector("#ref");

    const previewBtn = document.getElementById("previewBtn");
    const confirmBtn = document.getElementById("confirmBtn");
    const modalBack = document.getElementById("modalBack");
    const modalBody = document.getElementById("modalBody");
    const modalCancel = document.getElementById("modalCancel");
    const modalConfirm = document.getElementById("modalConfirm");

    const sumAmount = document.getElementById("sumAmount");
    const sumMethod = document.getElementById("sumMethod");
    const recap = document.getElementById("recap");
    const sumTime = document.getElementById("sumTime");

    const typeColors = {
        deposit: "#0077b6",
        save: "#3b7a57",
        withdraw: "#c00",
        credit: "#0077b6",
    };
    const color = typeColors[type] || "#333";

    if (sumAmount) sumAmount.parentElement.style.borderLeft = `3px solid ${color}`;
    if (sumTime) sumTime.innerText = "Instantané";

    function updateSummary() {
        const amt = parseFloat(amountInput.value) || 0;
        const currency = document.getElementById("currencySelect")?.value || "";

        const displayAmount = currency
            ? new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(amt)
            : amt;

        sumAmount.innerHTML = `<span class="pill" style="background:${color};color:#fff">${displayAmount}</span>`;
        sumMethod.innerHTML = `<span class="pill">${originInput.value || "—"}</span>`;
        let actionText = type === "save" ? "transférer vers le coffre" : type;
        recap.innerText = amt
            ? `Vous allez ${actionText} ${displayAmount} à partir de ${originInput.value || "—"}.`
            : "Remplis le formulaire pour voir le récapitulatif.";
    }

    [amountInput, originInput, refInput].forEach(i => i.addEventListener("input", updateSummary));
    previewBtn?.addEventListener("click", updateSummary);

    confirmBtn?.addEventListener("click", () => {
        const amt = parseFloat(amountInput.value);
        if (!amt || amt <= 0) return alert("Veuillez saisir un montant valide !");
        modalBody.innerText = recap.innerText;
        modalBack.style.display = "flex";
    });

    modalCancel?.addEventListener(() => (modalBack.style.display = "none"));

    modalConfirm?.addEventListener("click", async () => {
        const amt = parseFloat(amountInput.value);
        const ref = refInput.value || "";
        const origin = originInput.value || "";
        const token = getUserToken();
        const userId = getUserId();

        try {
            const res = await fetch(`${API_BASE}/transactions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId, type, amount: amt, origin, reference: ref }),
            });

            const data = await res.json();
            if (data.status === "success") {
                alert("Opération réussie !");
                modalBack.style.display = "none";
                form.reset();
                updateSummary();
                loadBalance();
                loadTransactions();
            } else {
                alert("Erreur serveur : " + (data.message || "Indisponible"));
            }
        } catch (err) {
            alert("Impossible d’enregistrer l’opération : " + err.message);
        }
    });

    form.addEventListener("submit", e => { e.preventDefault(); confirmBtn.click(); });
    updateSummary();
}

// --- Balance & Transactions ---
async function loadBalance() {
    const token = getUserToken();
    const userId = getUserId();
    const res = await fetch(`${API_BASE}/balance?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    document.querySelectorAll("#balanceAmount, #balanceBadge").forEach(el => {
        el.innerText = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(data.balance);
    });
}

async function loadTransactions() {
    const token = getUserToken();
    const userId = getUserId();
    const res = await fetch(`${API_BASE}/transactions?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const transactions = await res.json();

    const tbody = document.querySelector("#historiqueTable tbody");
    tbody.innerHTML = "";
    if (!transactions.length) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Aucune transaction</td></tr>`;
        return;
    }

    transactions.forEach(tx => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${new Date(tx.createdAt).toLocaleString()}</td>
            <td>${tx.type}</td>
            <td>${Number(tx.amount).toLocaleString()}</td>
            <td>${tx.origin || "-"}</td>
            <td>${tx.reference || "-"}</td>
        `;
        tbody.appendChild(tr);
    });
}
