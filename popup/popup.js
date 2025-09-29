/**
 * France Travail Extension - Popup Script
 * 
 * Handles the extension's popup interface for token configuration.
 * 
 * Features:
 * - Token input and validation
 * - Secure storage of authentication tokens
 * - User feedback for save operations
 * 
 * @author hollitizz
 * @version 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
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
