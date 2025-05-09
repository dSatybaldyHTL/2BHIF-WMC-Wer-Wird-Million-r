// Übersetzungsdaten für Deutsch und Englisch
const translations = {
    de: {
        title: "Die Geschichte",
        intro: "Willkommen auf der Seite!"
    },
    en: {
        title: "The History",
        intro: "Welcome to the page!"
    }
};

// Funktion zum Wechseln der Sprache
function translatePage(language) {
    // Alle Elemente mit dem 'data-translate' Attribut durchgehen
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        // Wenn Übersetzung für den Schlüssel vorhanden ist
        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key]; // Text aktualisieren
        }
    });
}
