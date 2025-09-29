function extractOffer() {
  let hostname = location.hostname;

  /**
 * France Travail Extension - Content Script
 * 
 * This script injects a floating UI element on supported job sites
 * that allows users to quickly submit job applications to France Travail.
 * 
 * Features:
 * - Floating action button with expand/collapse functionality
 * - Form for entering company name and job title
 * - Real-time status updates (loading, success, error)
 * - Automatic cleanup after successful submission
 * 
 * @author hollitizz
 * @version 1.0
 */

// Only run on specific domains
if (window.location.hostname === "www.hellowork.com") {
    return {
      enterprise:
        document.querySelector(
          "#main-content > span.tw-flex.tw-items-center.tw-gap-2 > a"
        )?.innerText ||
        document.querySelector("h1#main-content span:nth-child(2)")
          ?.innerText ||
        "Non renseigné",
      jobTitle:
        document.querySelector('[data-cy="jobTitle"]')?.innerText ||
        document.querySelector(".job-title")?.innerText ||
        "Non renseigné",
      url: window.location.href,
    };
  }
  document.querySelector(
    "#main-content > span.tw-block.tw-typo-xl.sm\\:tw-typo-2xl.tw-mb-1"
  );
  if (hostname.includes("welcometothejungle.com")) {
    return {
      enterprise:
        document.querySelector("[data-testid='company-name']")?.innerText ||
        document.querySelector("a[href*='/companies/']")?.innerText ||
        "Non renseigné",
      jobTitle:
        document.querySelector('[data-testid="job-metadata-block"] h2')
          ?.innerText || "Non renseigné",
      url: window.location.href,
    };
  }

  return null;
}

const arrowTopRightSVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right"><path d="m7 7 10 0 0 10"/><path d="m7 17 10-10"/></svg>';

const loadingSVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>';

const checkSVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20,6 9,17 4,12"/></svg>';

const xSVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="m18 6-12 12"/><path d="m6 6 12 12"/></svg>';

/** @type {HTMLDivElement} */
let container;

function initContainer() {
  const containerEl = document.createElement("div");
  containerEl.className = "ft-sender-box";
  containerEl.setAttribute("data-expanded", "false");

  container = containerEl;
}

/** @type {HTMLButtonElement} */
let button;

function initButton() {
  const buttonEl = document.createElement("button");
  buttonEl.className = "ft-send-button";
  buttonEl.innerHTML = arrowTopRightSVG;
  buttonEl.title = "Envoyer cette offre vers France Travail";

  button = buttonEl;
}

function resetButton() {
  button.innerHTML = arrowTopRightSVG;
  button.disabled = false;
  if (container.getAttribute("data-expanded") === "true") {
    button.innerHTML = "Envoyer vers France Travail" + arrowTopRightSVG;
  }
}

/**
 * @param {"loading" | "success" | "error"} state - The button state
 * @param {string} [text=""] - Optional text to display
 */
function updateButtonState(state, text = "") {
  switch (state) {
    case "loading":
      button.innerHTML = loadingSVG + (text || "Envoi en cours...");
      button.disabled = true;
      break;
    case "success":
      button.innerHTML = checkSVG + (text || "Envoyé!");
      button.disabled = true;
      setTimeout(() => resetButton(), 1500);
      break;
    case "error":
      button.innerHTML = xSVG + (text || "Erreur");
      button.disabled = true;
      setTimeout(() => resetButton(), 1500);
      break;
    default:
      resetButton();
  }
}

/**
 * @typedef {Object} FormValues
 * @property {string} enterprise - The enterprise name
 * @property {string} jobTitle - The job title
 */

/**
 * @typedef {Object} FormObject
 * @property {HTMLDivElement} form - The form HTML element
 * @property {() => FormValues} getValues - Function to get form values
 * @property {(nValues: FormValues) => void} setValues - Function to set form values
 * @property {Function} reset - Function to reset the form
 */

/** @type {FormObject} */
let form;

/**
 * @param {FormValues} formData
 */
async function handleSubmit(formData) {
  updateButtonState("loading");

  chrome.runtime.sendMessage({ action: "getToken" }, (tokenResponse) => {
    if (chrome.runtime.lastError || !tokenResponse || !tokenResponse.token) {
      updateButtonState("error", "Token non trouvé");
      return;
    }

    const now = new Date();
    now.setHours(2);
    now.setMinutes(0);
    now.setSeconds(0);

    const dateString = now.toISOString().slice(0, 19) + "+02:00";

    const requestData = {
      token: tokenResponse.token,
      formData: formData,
      dateString: dateString,
    };

    chrome.runtime.sendMessage(
      { action: "submitOffer", data: requestData },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error submitting offer:", chrome.runtime.lastError);
          updateButtonState("error", "Erreur d'envoi");
          return;
        }

        if (response && response.success) {
          updateButtonState("success", "Démarche enregistrée!");

          setTimeout(() => {
            container.setAttribute("data-expanded", "false");
            const formEl = container.querySelector(".ft-form");
            if (formEl) {
              container.removeChild(formEl);
            }
          }, 1500);
        } else {
          updateButtonState("error", "Erreur d'envoi");
        }
      }
    );
  });
}

function initForm() {
  const formEl = document.createElement("div");
  formEl.className = "ft-form";

  const enterpriseLabel = document.createElement("label");
  enterpriseLabel.textContent = "Nom de l'entreprise";
  const enterpriseInput = document.createElement("input");
  enterpriseInput.type = "text";
  enterpriseInput.className = "ft-enterprise-input";

  const jobTitleLabel = document.createElement("label");
  jobTitleLabel.textContent = "Nom du métier";
  const jobTitleInput = document.createElement("input");
  jobTitleInput.type = "text";
  jobTitleInput.className = "ft-job-title-input";

  formEl.appendChild(enterpriseLabel);
  formEl.appendChild(enterpriseInput);
  formEl.appendChild(jobTitleLabel);
  formEl.appendChild(jobTitleInput);

  const resetForm = () => {
    enterpriseInput.value = "";
    jobTitleInput.value = "";
  };

  /** @returns {FormValues} */
  const getValues = () => ({
    enterprise: enterpriseInput.value,
    jobTitle: jobTitleInput.value,
  });

  /**
   * @param {FormValues} nValues
   * */
  const setValues = (nValues) => {
    enterpriseInput.value = nValues.enterprise;
    jobTitleInput.value = nValues.jobTitle;
  };

  form = { form: formEl, reset: resetForm, getValues, setValues };
}

function submitForm() {
  const formData = form.getValues();

  if (!formData.enterprise || !formData.jobTitle) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  handleSubmit(formData);
}

/**
 * @param {MouseEvent} e - The mouse event
 */
function handleClick(e) {
  if (!e.target.closest(".ft-sender-box") || button.disabled) {
    return;
  }

  if (container.getAttribute("data-expanded") === "false") {
    e.stopPropagation();
    container.setAttribute("data-expanded", "true");

    if (!container.querySelector(".ft-form")) {
      container.insertBefore(form.form, button);

      const offer = extractOffer();
      if (offer) {
        form.setValues({
          enterprise: `${offer.enterprise} - ${offer.url}`,
          jobTitle: offer.jobTitle,
        });
      }

      setTimeout(() => {
        const enterpriseInput = container.querySelector(".ft-enterprise-input");
        if (enterpriseInput) enterpriseInput.focus();
      }, 100);
    }

    button.innerHTML = "Envoyer vers France Travail" + arrowTopRightSVG;
  } else if (
    e.target instanceof HTMLButtonElement &&
    e.target.classList.contains("ft-send-button")
  ) {
    submitForm();
  }
}

function createSendContainer() {
  if (document.querySelector(".ft-sender-box")) {
    return;
  }

  if (!container) initContainer();
  if (!button) initButton();
  if (!form) initForm();

  container.appendChild(button);

  document.addEventListener("click", handleClick, true);

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      container.getAttribute("data-expanded") === "true"
    ) {
      e.stopPropagation();
      container.setAttribute("data-expanded", "false");

      if (form.form) {
        container.removeChild(form.form);
      }
      resetButton();
    }
  });

  document.body.appendChild(container);
}

function init() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createSendContainer);
  } else {
    createSendContainer();
  }

  setTimeout(createSendContainer, 1000);
}

init();

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getOffer") {
    sendResponse(extractOffer());
  }
});
