function checkAnswer(userAnswer, correctAnswer) {
    return userAnswer === correctAnswer;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updatePrizeList(currentIndex) {
    const prizeItems = document.querySelectorAll('#prizeList li');
    prizeItems.forEach((item, index) => {
        if (index === currentIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function resetPrizeList() {
    const prizeItems = document.querySelectorAll('#prizeList li');
    prizeItems.forEach(item => item.classList.remove('active'));
}

function restartQuiz() {
    accountBalance = 0;
    document.getElementById('Balance').textContent = `Kontostand: 0 €`;
    questionCounter = 0;
    currentLevelIndex = 0;
    resetPrizeList();

    const endScreen = document.getElementById('endGameContainer');
    if (endScreen) endScreen.remove();

    fetchQuestions();
}

function goToHomepage() {
    window.location.href = "index-de.html";
}

function showEndScreen(messageTop, messageBody) {
    document.getElementById('questionPlaintext').textContent = messageTop;
    document.getElementById('answer-container').innerHTML = '';
    document.getElementById('nextButton').style.display = 'none';

    if (!document.getElementById('endGameContainer')) {
        const endGameContainer = document.createElement('div');
        endGameContainer.id = 'endGameContainer';
        endGameContainer.style.textAlign = "center";
        endGameContainer.style.marginTop = "20px";
        endGameContainer.innerHTML = `
            <p>${messageBody}</p>
            <button id="restartButton" style="padding: 10px 20px; font-size: 18px; background-color: #4CAF50; color: white; border: none;">Nochmal spielen</button>
            <button id="homepageButton" style="padding: 10px 20px; font-size: 18px; background-color: #f44336; color: white; border: none;">Zur Hauptseite</button>
        `;
        document.body.appendChild(endGameContainer);

        document.getElementById('restartButton').onclick = restartQuiz;
        document.getElementById('homepageButton').onclick = goToHomepage;
    }
}

function showGameOver() {
    showEndScreen("❌ Game Over!", "Du hast eine falsche Antwort gegeben. Möchtest du es noch einmal versuchen?");
}

function fetchQuestions() {
    fetch('http://localhost:3000/questions')
        .then(response => {
            if (!response.ok) throw new Error('Fehler beim Laden der Fragen');
            return response.json();
        })
        .then(questions => {
            const levels = ['sehr leicht', 'leicht', 'mittelschwer', 'schwer', 'sehr schwer'];
            const prizes = [50, 100, 200, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 500000, 750000, 1000000];

            const questionsByLevel = {
                'sehr leicht': [],
                'leicht': [],
                'mittelschwer': [],
                'schwer': [],
                'sehr schwer': []
            };

            questions.forEach(q => questionsByLevel[q.level].push(q));

            const selectedQuestions = [];
            levels.forEach(level => {
                shuffleArray(questionsByLevel[level]);
                selectedQuestions.push(...questionsByLevel[level].slice(0, 3));
            });

            // Globale Variablen für Quizstatus
            questionCounter = 0;
            currentLevelIndex = 0;
            accountBalance = 0;

            function loadQuestion(question) {
                document.getElementById('questionPlaintext').textContent = question.question;
                document.getElementById('Difficulty').textContent = `Schwierigkeit: ${levels[currentLevelIndex]}`;
                document.getElementById('questionNumber').textContent = `Frage ${questionCounter + 1} – Gewinn: ${prizes[questionCounter]} €`;

                const antwortenContainer = document.getElementById('answer-container');
                antwortenContainer.innerHTML = '';

                // Optionen alphabetisch sortieren
                const sortedOptions = question.options.slice().sort((a, b) => a.charAt(0).localeCompare(b.charAt(0)));

                sortedOptions.forEach(option => {
                    const button = document.createElement('button');
                    button.textContent = option;
                    button.classList.add('antworten-button');

                    button.onclick = () => {
                        const userAnswer = option.charAt(0);
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

                        if (isCorrect) {
                            accountBalance += prizes[questionCounter];
                            document.getElementById('Balance').textContent = `Kontostand: ${accountBalance} €`;
                            updatePrizeList(questionCounter);
                            document.getElementById('nextButton').style.display = 'block';
                        } else {
                            resetPrizeList();
                            showGameOver();
                        }
                    };

                    antwortenContainer.appendChild(button);
                });
            }

            document.getElementById('nextButton').onclick = () => {
                questionCounter++;
                if (questionCounter < selectedQuestions.length) {
                    loadQuestion(selectedQuestions[questionCounter]);
                    document.getElementById('nextButton').style.display = 'none';
                } else {
                    showEndScreen("🎉 Quiz beendet!", "Du hast das Spiel erfolgreich abgeschlossen!");
                }

                if (questionCounter % 3 === 0) currentLevelIndex++;
            };

            // Starte das Quiz mit der ersten Frage
            loadQuestion(selectedQuestions[questionCounter]);
        })
        .catch(error => {
            console.error("Fehler beim Laden der Fragen:", error);
            document.getElementById('questionPlaintext').textContent = "❌ Fehler beim Laden der Fragen.";
        });
}

// Globale Variablen initialisieren
let questionCounter = 0;
let currentLevelIndex = 0;
let accountBalance = 0;

// Starte das Quiz beim Laden der Seite
fetchQuestions();
