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
            antwortenContainer.innerHTML = ''; // Alle alten Buttons entfernen

            question.antworten.forEach(item => {
                const button = document.createElement('button');
                button.textContent = item;
                button.classList.add('antworten-button');

                button.onclick = () => {
                    const isCorrect = checkAnswer(item, question.rightAnswer); // Überprüfen, ob die Antwort richtig ist

                    // Gehe durch alle Buttons und färbe sie
                    const buttons = document.querySelectorAll('.antworten-button');
                    buttons.forEach((btn) => {
                        if (btn.textContent === question.rightAnswer) {
                            btn.style.backgroundColor = 'green'; // Färbe den richtigen Button grün
                        }
                        if (btn.textContent === item && !isCorrect) {
                            btn.style.backgroundColor = 'red'; // Färbe die falsche Antwort rot
                        }
                        btn.disabled = true; // Alle Buttons deaktivieren, nachdem eine Antwort ausgewählt wurde
                    });

                    // "Nächste Frage"-Button anzeigen
                    document.getElementById('nextButton').style.display = 'block';
                };

                antwortenContainer.appendChild(button);
            });
        }

        // "Nächste Frage"-Button
        document.getElementById('nextButton').onclick = () => {
            questionCounter++;
            if (questionCounter < data.length) {
                loadQuestion(data[questionCounter]);
                document.getElementById('nextButton').style.display = 'none'; // Button wieder verstecken
            } else {
                document.getElementById('frageText').textContent = "Quiz beendet!";
                document.getElementById('antworten-container').innerHTML = '';
                document.getElementById('nextButton').style.display = 'none';
            }
        };

        loadQuestion(data[questionCounter]);
    })
    .catch(error => console.error("Fehler beim Laden:", error));
