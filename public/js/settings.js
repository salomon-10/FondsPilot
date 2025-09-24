document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const currencySelect = document.getElementById("currencySelect");
    const notifToggle = document.getElementById("notifToggle");
    const saveBtn = document.getElementById("saveSettings");
    const resetHistoryBtn = document.getElementById("resetHistory");

    // --- Charger les paramètres depuis localStorage ---
    const settings = JSON.parse(localStorage.getItem("settings") || "{}");

    // Appliquer les valeurs
    if(settings.darkMode) document.body.classList.add("dark-mode");
    darkModeToggle.checked = settings.darkMode || false;

    currencySelect.value = settings.currency || "XOF";
    notifToggle.checked = settings.notifications || false;

    // --- Événement pour appliquer le mode sombre immédiatement ---
    darkModeToggle.addEventListener("change", () => {
        document.body.classList.toggle("dark-mode", darkModeToggle.checked);
    });

    // --- Sauvegarder les paramètres ---
    saveBtn.addEventListener("click", () => {
        const newSettings = {
            darkMode: darkModeToggle.checked,
            currency: currencySelect.value,
            notifications: notifToggle.checked
        };
        localStorage.setItem("settings", JSON.stringify(newSettings));
        alert("Paramètres sauvegardés !");
    });

    // --- Réinitialiser l'historique ---
    resetHistoryBtn.addEventListener("click", () => {
        if(confirm("Voulez-vous vraiment réinitialiser tout l'historique ?")) {
            localStorage.removeItem("operations");
            localStorage.removeItem("coffre");
            alert("Historique réinitialisé !");
            window.location.reload();
        }
    });
});
