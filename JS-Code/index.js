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
                        if (btn.textContent === question.rightAnswer) {
                            btn.style.backgroundColor = 'green';
                        }
                        if (btn.textContent === item && !isCorrect) {
                            btn.style.backgroundColor = 'red';
                        }
                        btn.disabled = true;
                    });

                    // "Nächste Frage"-Button anzeigen
                    document.getElementById('nextButton').style.display = 'block';
                };

                antwortenContainer.appendChild(button);
            });
        }

        document.getElementById('nextButton').onclick = () => {
            questionCounter++;
            if (questionCounter < data.length) {
                loadQuestion(data[questionCounter]);
                document.getElementById('nextButton').style.display = 'none';
            } else {
                document.getElementById('frageText').textContent = "Quiz beendet!";
                document.getElementById('antworten-container').innerHTML = '';
                document.getElementById('nextButton').style.display = 'none';
            }
        };

        loadQuestion(data[questionCounter]);
    })
    .catch(error => console.error("Fehler beim Laden:", error));
