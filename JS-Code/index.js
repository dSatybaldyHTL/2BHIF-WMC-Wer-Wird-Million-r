function checkAnswer(userAnswer, correctAnswer) {
    return userAnswer === correctAnswer;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function restartQuiz() {
    accountBalance = 0;
    document.getElementById('Balance').textContent = `Balance: 0 €`;
    questionCounter = 0;
    currentLevelIndex = 0;
    fetchQuestions();
}

function goToHomepage() {
    window.location.href = "index-en-uk.html";
}

function showGameOver() {
    document.getElementById('questionPlaintext').textContent = "❌ Game Over!";
    document.getElementById('answer-container').innerHTML = '';
    document.getElementById('nextButton').style.display = 'none';

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

        questions.forEach(question => {
            questionsByLevel[question.level].push(question);
        });

        const selectedQuestions = [];
        Object.keys(questionsByLevel).forEach(level => {
            const levelQuestions = questionsByLevel[level];
            shuffleArray(levelQuestions);
            selectedQuestions.push(...levelQuestions.slice(0, 3));
        });

        let questionCounter = 0;
        let currentLevelIndex = 0;
        const levels = ['sehr leicht', 'leicht', 'mittelschwer', 'schwer', 'sehr schwer'];

        const prizes = [
            100, 200, 300, 500, 1000, 2000, 4000,
            8000, 16000, 32000, 64000, 125000, 250000,
            500000, 1000000
        ];

        let accountBalance = 0;

        function loadQuestion(question) {
            document.getElementById('questionPlaintext').textContent = question.question;
            document.getElementById('Difficulty').textContent = `Difficulty: ${levels[currentLevelIndex]}`;
            document.getElementById('questionNumber').textContent = `Question ${questionCounter + 1} – Prize: ${prizes[questionCounter]} €`;

            const antwortenContainer = document.getElementById('answer-container');
            antwortenContainer.innerHTML = '';

            question.options.forEach(option => {
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
                        document.getElementById('Balance').textContent = `Balance: ${accountBalance} €`;
                        document.getElementById('nextButton').style.display = 'block';
                    } else {
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
                document.getElementById('questionPlaintext').textContent = "🎉 Quiz beendet!";
                document.getElementById('answer-container').innerHTML = '';
                document.getElementById('nextButton').style.display = 'none';
            }

            if (questionCounter % 3 === 0) {
                currentLevelIndex++;
            }
        };

        loadQuestion(selectedQuestions[questionCounter]);
    })
    .catch(error => {
        console.error("Fehler beim Laden der Fragen:", error);
        document.getElementById('questionPlaintext').textContent = "❌ Fehler beim Laden der Fragen.";
    });
