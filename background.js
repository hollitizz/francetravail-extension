chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message);

  if (message.action === "getToken") {
    chrome.storage.local.get("ft_token", (data) => {
      console.log(
        "Retrieved token from storage:",
        data.ft_token ? "Token exists" : "No token"
      );
      sendResponse({ token: data.ft_token });
    });
    return true;
  }

  if (message.action === "saveToken") {
    chrome.storage.local.set({ ft_token: message.token }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.action === "submitOffer") {
    const { token, formData, dateString } = message.data;

    const requestBody = {
      debut: dateString,
      fin: dateString,
      pourquoi: {
        code: "P03",
        libelle: "Mes candidatures",
      },
      quoi: {
        code: "Q14",
        libelle: "Réponse à des offres d'emploi",
      },
      attributs: [
        {
          libelle: "Nom de l'entreprise",
          libelleSiValeurNulle: "Non renseigné",
          placeholder: "Ex : Société Dupont, S.A.R.L. Jean…",
          type: "TEXTE",
          choixListe: [],
          valeur: formData.enterprise,
        },
        {
          libelle: "Nom du métier",
          libelleSiValeurNulle: "Non renseigné",
          placeholder: "Ex : Fleuriste, Comptable",
          type: "TEXTE",
          choixListe: [],
          valeur: formData.jobTitle,
        },
      ],
      structureFormulaire: {
        attributs: [
          {
            libelle: "Nom de l'entreprise",
            libelleSiValeurNulle: "Non renseigné",
            placeholder: "Ex : Société Dupont, S.A.R.L. Jean…",
            type: "TEXTE",
            choixListe: [],
            valeur: formData.enterprise,
          },
          {
            libelle: "Nom du métier",
            libelleSiValeurNulle: "Non renseigné",
            placeholder: "Ex : Fleuriste, Comptable",
            type: "TEXTE",
            choixListe: [],
            valeur: formData.jobTitle,
          },
        ],
        description:
          "Après avoir ciblé les entreprises et les offres qui correspondent à son profil, proposer sa candidature en envoyant CV et lettre de motivation adaptés",
      },
      libelleLong: "Réponse à des offres d'emploi",
    };

    fetch(
      "https://api.francetravail.fr/exp-demarcheretouremploi/v2/demarches",
      {
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
          authorization: `Bearer ${token.replace("Bearer ", "")}`,
          "content-type": "application/json;charset=UTF-8",
          "pe-nom-application": "pn118-dreusager",
          typeauth: "/individu",
          "cache-control": "no-cache",
          pragma: "no-cache",
          "sec-ch-ua": '"Not=A?Brand";v="24", "Chromium";v="140"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          Referer: "https://candidat.francetravail.fr/",
        },
        body: JSON.stringify(requestBody),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        console.log("Success response:", responseData);
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error("Error submitting offer:", error);
        sendResponse({ success: false, error: error.message });
      });

    return true;
  }
});
