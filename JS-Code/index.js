function checkAnswer(userAnswer, correctAnswer) {
    return userAnswer === correctAnswer;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap
    }
}

function restartQuiz() {
    // Setze den Kontostand zurück
    accountBalance = 0;
    document.getElementById('kontostand').textContent = `Kontostand: 0 €`;

    // Setze den Fragezähler zurück
    questionCounter = 0;
    currentLevelIndex = 0;

    // Starte das Quiz erneut
    fetchQuestions();
}

function goToHomepage() {
    // Umleitung zur Hauptseite (ersetze den Link durch die korrekte URL)
    window.location.href = "index-en-uk.html";  // Beispiel: Hauptseite
}

function showGameOver() {
    // Verstecke alle anderen UI-Elemente
    document.getElementById('frageText').textContent = "❌ Game Over!";

    // Blende die Fragen und Antworten aus
    document.getElementById('antworten-container').innerHTML = '';
    document.getElementById('nextButton').style.display = 'none'; // Verstecke den "Next" Button

    // Erstelle den Game Over Container
    const gameOverContainer = document.createElement('div');
    gameOverContainer.id = 'gameOverContainer';
    gameOverContainer.style.textAlign = "center";
    gameOverContainer.style.marginTop = "20px";
    gameOverContainer.innerHTML = `
        <p>Du hast eine falsche Antwort gegeben. Möchtest du es noch einmal versuchen?</p>
        <button id="restartButton" style="padding: 10px 20px; font-size: 18px; background-color: #4CAF50; color: white; border: none; cursor: pointer;">Nochmal spielen</button>
        <button id="homepageButton" style="padding: 10px 20px; font-size: 18px; background-color: #f44336; color: white; border: none; cursor: pointer;">Zur Hauptseite</button>
    `;
    document.body.appendChild(gameOverContainer);

    // Füge Event-Listener für die Buttons hinzu
    document.getElementById('restartButton').onclick = restartQuiz;
    document.getElementById('homepageButton').onclick = goToHomepage;
}

fetch('http://localhost:3000/questions')
    .then(response => {
        if (!response.ok) {
            throw new Error('Netzwerkfehler beim Laden der Fragen');
        }
        return response.json();
    })
    .then(questions => {
        const questionsByLevel = {
            'sehr leicht': [],
            'leicht': [],
            'mittelschwer': [],
            'schwer': [],
            'sehr schwer': []
        };

        // Gruppiere Fragen nach Schwierigkeitsgrad
        questions.forEach(question => {
            questionsByLevel[question.level].push(question);
        });

        // Ziehe 3 zufällige Fragen aus jedem Schwierigkeitsgrad
        const selectedQuestions = [];
        Object.keys(questionsByLevel).forEach(level => {
            const levelQuestions = questionsByLevel[level];
            shuffleArray(levelQuestions); // Mische die Fragen für das aktuelle Level
            selectedQuestions.push(...levelQuestions.slice(0, 3)); // Wähle 3 zufällige Fragen
        });

        let questionCounter = 0;
        let currentLevelIndex = 0;
        const levels = ['sehr leicht', 'leicht', 'mittelschwer', 'schwer', 'sehr schwer'];

        // Gewinne pro Frage
        const prizes = [
            100, 200, 300, 500, 1000, 2000, 4000,
            8000, 16000, 32000, 64000, 125000, 250000,
            500000, 1000000
        ];

        // Initialer Kontostand
        let accountBalance = 0;

        // Funktion zum Laden der Frage
        function loadQuestion(question) {
            document.getElementById('frageText').textContent = question.question;

            // Setze den aktuellen Schwierigkeitsgrad
            document.getElementById('schwierigkeitsgrad').textContent = `Schwierigkeitsgrad: ${levels[currentLevelIndex]}`;

            // Anzeige des Preises und der Frageanzahl
            document.getElementById('frageNummer').textContent = `Frage ${questionCounter + 1} – Gewinn: ${prizes[questionCounter]} €`;

            const antwortenContainer = document.getElementById('antworten-container');
            antwortenContainer.innerHTML = '';

            question.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.classList.add('antworten-button');

                button.onclick = () => {
                    const userAnswer = option.charAt(0); // Nur A, B, C oder D
                    const isCorrect = checkAnswer(userAnswer, question.answer);

                    const buttons = document.querySelectorAll('.antworten-button');
                    buttons.forEach(btn => {
                        const btnAnswer = btn.textContent.charAt(0);
                        if (btnAnswer === question.answer) {
                            btn.style.backgroundColor = 'green';
                        }
                        if (btnAnswer === userAnswer && !isCorrect) {
                            btn.style.backgroundColor = 'red';
                        }
                        btn.disabled = true;
                    });

                    // Wenn die Antwort korrekt ist, Kontostand aktualisieren
                    if (isCorrect) {
                        accountBalance += prizes[questionCounter];  // Füge den Gewinn zum Kontostand hinzu
                        document.getElementById('kontostand').textContent = `Kontostand: ${accountBalance} €`;  // Aktualisiere den Kontostand
                        document.getElementById('nextButton').style.display = 'block'; // Zeige den "Next" Button
                    } else {
                        showGameOver();  // Zeige Game Over Bildschirm bei falscher Antwort
                    }
                };

                antwortenContainer.appendChild(button);
            });
        }

        // Nächste Frage laden
        document.getElementById('nextButton').onclick = () => {
            questionCounter++;
            if (questionCounter < selectedQuestions.length) {
                loadQuestion(selectedQuestions[questionCounter]);
                document.getElementById('nextButton').style.display = 'none';
            } else {
                document.getElementById('frageText').textContent = "🎉 Quiz beendet!";
                document.getElementById('antworten-container').innerHTML = '';
                document.getElementById('nextButton').style.display = 'none';
            }

            // Aktualisiere den Schwierigkeitsgrad, wenn 3 Fragen pro Level beantwortet wurden
            if (questionCounter % 3 === 0) {
                currentLevelIndex++;
            }
        };

        // Beginne mit der ersten Frage
        loadQuestion(selectedQuestions[questionCounter]);
    })
    .catch(error => {
        console.error("Fehler beim Laden der Fragen:", error);
        document.getElementById('frageText').textContent = "❌ Fehler beim Laden der Fragen.";
    });
