document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector("#historiqueTable tbody");
    const searchInput = document.getElementById("searchInput");
    const filterType = document.getElementById("filterType");

    // --- Récupère les opérations depuis localStorage ---
    const transactions = JSON.parse(localStorage.getItem("operations") || "[]");

    // --- Affichage des transactions ---
    function displayTransactions(list) {
        tbody.innerHTML = "";
        if(list.length === 0) {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td colspan="5" style="text-align:center;">Aucune transaction trouvée</td>`;
            tbody.appendChild(tr);
            return;
        }

        list.forEach(tx => {
            const tr = document.createElement("tr");
            const date = tx.date ? new Date(tx.date).toLocaleString() : "-";
            const type = tx.type ? tx.type.charAt(0).toUpperCase() + tx.type.slice(1) : "-";
            const montant = tx.montant !== undefined ? Number(tx.montant).toLocaleString() : "-";
            const categorie = tx.categorie || "-";
            const description = tx.description || "-";

            tr.innerHTML = `
                <td>${date}</td>
                <td>${type}</td>
                <td>${montant}</td>
                <td>${categorie}</td>
                <td>${description}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    displayTransactions(transactions);

    // --- Filtre et recherche dynamique ---
    function filterTransactions() {
        const searchTerm = searchInput.value.toLowerCase();
        const typeFilter = filterType.value.toLowerCase();

        const filtered = transactions.filter(tx => {
            const matchesSearch =
                (tx.description && tx.description.toLowerCase().includes(searchTerm)) ||
                (tx.categorie && tx.categorie.toLowerCase().includes(searchTerm));
            const matchesType = typeFilter === "all" || tx.type.toLowerCase() === typeFilter;
            return matchesSearch && matchesType;
        });

        displayTransactions(filtered);
    }

    searchInput.addEventListener("input", filterTransactions);
    filterType.addEventListener("change", filterTransactions);
});
