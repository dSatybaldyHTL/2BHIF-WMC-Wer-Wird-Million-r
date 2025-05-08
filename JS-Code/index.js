function checkAnswer(userAnswer, correctAnswer) {
    return userAnswer === correctAnswer;
}

fetch('http://localhost:3000/questions')
    .then(response => {
        if (!response.ok) {
            throw new Error('Netzwerkfehler beim Laden der Fragen');
        }
        return response.json();
    })
    .then(questions => {
        let questionCounter = 0;

        function loadQuestion(question) {
            document.getElementById('frageText').textContent = question.question;

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

                    document.getElementById('nextButton').style.display = 'block';
                };

                antwortenContainer.appendChild(button);
            });
        }

        document.getElementById('nextButton').onclick = () => {
            questionCounter++;
            if (questionCounter < questions.length) {
                loadQuestion(questions[questionCounter]);
                document.getElementById('nextButton').style.display = 'none';
            } else {
                document.getElementById('frageText').textContent = "🎉 Quiz beendet!";
                document.getElementById('antworten-container').innerHTML = '';
                document.getElementById('nextButton').style.display = 'none';
            }
        };

        loadQuestion(questions[questionCounter]);
    })
    .catch(error => {
        console.error("Fehler beim Laden der Fragen:", error);
        document.getElementById('frageText').textContent = "❌ Fehler beim Laden der Fragen.";
    });
