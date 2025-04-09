
function checkAnswer(userAnswer, answer) {
    if (userAnswer === answer) {
        return true;
    }
    return false;
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

                    if (isCorrect) {
                        button.style.backgroundColor = 'green';
                    }
                    else
                        button.style.backgroundColor = 'red';

                    const buttons = document.querySelectorAll('.antwort-button');
                    buttons.forEach((button) => {
                        if (button.textContent === question.rightAnswer) {
                            button.style.backgroundColor = 'green';
                        }
                    });
                    disableButtons();

                    // "Nächste Frage"-Button anzeigen
                    document.getElementById('nextButton').style.display = 'block';
                };
                antwortenContainer.appendChild(button);

            });
        }
    function disableButtons() {
        const buttons = document.querySelectorAll('.antwortButton');
        buttons.forEach(btn => btn.disabled = true);
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
    }
    loadQuestion(data[questionCounter]);
})
.catch(error => console.error("Fehler beim Laden:", error));
