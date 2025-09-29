document.addEventListener("DOMContentLoaded", function () {
  const tokenInput = document.getElementById("token");
  const saveButton = document.getElementById("saveToken");

  chrome.runtime.sendMessage({ action: "getToken" }, (response) => {
    if (response && response.token) {
      tokenInput.value = response.token;
    }
  });

  saveButton.addEventListener("click", function () {
    const token = tokenInput.value.trim();

    if (!token) {
      alert("Veuillez saisir un token");
      return;
    }

    chrome.runtime.sendMessage(
      {
        action: "saveToken",
        token: token,
      },
      (response) => {
        if (response && response.success) {
          alert("Token sauvegardé avec succès !");
        } else {
          alert("Erreur lors de la sauvegarde du token");
        }
      }
    );
  });
});
