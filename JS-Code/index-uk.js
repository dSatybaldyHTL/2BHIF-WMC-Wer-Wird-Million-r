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
    document.getElementById('Balance').textContent = `Balance: 0 £`;
    questionCounter = 0;
    currentLevelIndex = 0;
    resetPrizeList();

    const endScreen = document.getElementById('endGameContainer');
    if (endScreen) endScreen.remove();

    fetchQuestions();
}

function goToHomepage() {
    window.location.href = "index-en.html";
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
            <button id="restartButton" style="padding: 10px 20px; font-size: 18px; background-color: #4CAF50; color: white; border: none;">Play Again</button>
            <button id="homepageButton" style="padding: 10px 20px; font-size: 18px; background-color: #f44336; color: white; border: none;">Go to Homepage</button>
        `;
        document.body.appendChild(endGameContainer);

        document.getElementById('restartButton').onclick = restartQuiz;
        document.getElementById('homepageButton').onclick = goToHomepage;
    }
}

function showGameOver() {
    showEndScreen("❌ Game Over!", "You gave a wrong answer. Would you like to try again?");
}

function fetchQuestions() {
    fetch('http://localhost:3000/questions')
        .then(response => {
            if (!response.ok) throw new Error('Error loading questions');
            return response.json();
        })
        .then(questions => {
            const levels = ['very easy', 'easy', 'medium', 'hard', 'very hard'];
            const prizes = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];

            const questionsByLevel = {
                'very easy': [],
                'easy': [],
                'medium': [],
                'hard': [],
                'very hard': []
            };

            questions.forEach(q => questionsByLevel[q.level].push(q));

            const selectedQuestions = [];
            levels.forEach(level => {
                shuffleArray(questionsByLevel[level]);
                selectedQuestions.push(...questionsByLevel[level].slice(0, 3));
            });

            // Global variables for quiz state
            questionCounter = 0;
            currentLevelIndex = 0;
            accountBalance = 0;

            function loadQuestion(question) {
                document.getElementById('questionPlaintext').textContent = question.question;
                document.getElementById('Difficulty').textContent = `Difficulty: ${levels[currentLevelIndex]}`;
                document.getElementById('questionNumber').textContent = `Question ${questionCounter + 1} – Prize: ${prizes[questionCounter]} £`;

                const answerContainer = document.getElementById('answer-container');
                answerContainer.innerHTML = '';

                // Sort options alphabetically
                const sortedOptions = question.options.slice().sort((a, b) => a.charAt(0).localeCompare(b.charAt(0)));

                sortedOptions.forEach(option => {
                    const button = document.createElement('button');
                    button.textContent = option;
                    button.classList.add('answer-button');

                    button.onclick = () => {
                        const userAnswer = option.charAt(0);
                        const isCorrect = checkAnswer(userAnswer, question.answer);

                        const buttons = document.querySelectorAll('.answer-button');
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
                            updatePrizeList(questionCounter);
                            document.getElementById('nextButton').style.display = 'block';
                        } else {
                            resetPrizeList();
                            showGameOver();
                        }
                    };

                    answerContainer.appendChild(button);
                });
            }

            document.getElementById('nextButton').onclick = () => {
                questionCounter++;
                if (questionCounter < selectedQuestions.length) {
                    loadQuestion(selectedQuestions[questionCounter]);
                    document.getElementById('nextButton').style.display = 'none';
                } else {
                    showEndScreen("🎉 Quiz Completed!", "You successfully finished the game!");
                }

                if (questionCounter % 3 === 0) currentLevelIndex++;
            };

            // Start the quiz with the first question
            loadQuestion(selectedQuestions[questionCounter]);
        })
        .catch(error => {
            console.error("Error loading questions:", error);
            document.getElementById('questionPlaintext').textContent = "❌ Error loading questions.";
        });
}

// Initialize global variables
let questionCounter = 0;
let currentLevelIndex = 0;
let accountBalance = 0;

// Start the quiz when the page loads
fetchQuestions();
