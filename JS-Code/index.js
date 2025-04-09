function checkAnswer(userAnswer, answer) {
    return userAnswer === answer;
}

fetch('https://localhost:3000/questions')
    .then(response => response.json())
    .then(data => {
        let questionCounter = 0;

        function loadQuestion(question) {
            document.getElementById('frageText').textContent = question.frage;
            const antwortenContainer = document.getElementById('antworten-container');
            antwortenContainer.innerHTML = '';

            question.antworten.forEach(item => {
                const button = document.createElement('button');
                button.textContent = item;
                button.classList.add('antworten-button');

                button.onclick = () => {
                    const isCorrect = checkAnswer(item, question.rightAnswer);
                    const buttons = document.querySelectorAll('.antworten-button');

                    buttons.forEach((btn) => {
                        btn.disabled = true;

                        if (btn.textContent === question.rightAnswer) {
                            btn.style.backgroundColor = 'green';
                        } else if (btn.textContent === item && !isCorrect) {
                            btn.style.backgroundColor = 'red';
                        }
                    });

                    if (isCorrect) {
                        // kleine Pause, dann nächste Frage
                        setTimeout(() => {
                            questionCounter++;
                            if (questionCounter < 15 && questionCounter < data.length) {
                                loadQuestion(data[questionCounter]);
                            } else {
                                showEndScreen("Glückwunsch! Du hast alle 15 Fragen geschafft!");
                            }
                        }, 1500);
                    } else {
                        setTimeout(() => {
                            showEndScreen("Falsch beantwortet. Spiel beendet.");
                        }, 1500);
                    }
                };

                antwortenContainer.appendChild(button);
            });
        }

        function showEndScreen(message) {
            document.getElementById('frageText').textContent = message;
            document.getElementById('antworten-container').innerHTML = '';
        }

        // Start mit der ersten Frage
        loadQuestion(data[questionCounter]);
    })
    .catch(error => console.error("Fehler beim Laden:", error));
