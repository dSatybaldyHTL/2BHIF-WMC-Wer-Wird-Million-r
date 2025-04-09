
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
})
