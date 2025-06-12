document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        {
            question: "Was ist die Hauptstadt von Deutschland?",
            answers: ["Berlin", "München", "Hamburg", "Köln"],
            correct: 0
        },
        {
            question: "Wie viele Bundesländer hat Deutschland?",
            answers: ["14", "16", "18", "20"],
            correct: 1
        }
    ];

    let current = 0;
    let balance = 0;
    const prizeSteps = [50, 100];

    const questionEl = document.getElementById('questionPlaintext');
    const answerContainer = document.getElementById('answer-container');
    const nextButton = document.getElementById('nextButton');
    const balanceEl = document.getElementById('Balance');
    const prizeList = document.getElementById('prizeList').children;

    function showQuestion() {
        const q = questions[current];
        questionEl.textContent = q.question;
        answerContainer.innerHTML = '';
        q.answers.forEach((ans, idx) => {
            const btn = document.createElement('button');
            btn.textContent = ans;
            btn.onclick = () => checkAnswer(idx);
            answerContainer.appendChild(btn);
        });
        nextButton.style.display = 'none';
        updatePrizeList();
    }

    function checkAnswer(idx) {
        const q = questions[current];
        if (idx === q.correct) {
            balance += prizeSteps[current];
            balanceEl.textContent = `Kontostand: ${balance} €`;
            nextButton.style.display = 'inline-block';
        } else {
            questionEl.textContent = "Falsche Antwort! Spiel vorbei.";
            answerContainer.innerHTML = '';
            nextButton.style.display = 'none';
        }
    }

    function updatePrizeList() {
        for (let i = 0; i < prizeList.length; i++) {
            prizeList[i].classList.toggle('active', i === current);
        }
    }

    nextButton.onclick = () => {
        current++;
        if (current < questions.length) {
            showQuestion();
        } else {
            questionEl.textContent = "Glückwunsch! Du hast das Quiz beendet.";
            answerContainer.innerHTML = '';
            nextButton.style.display = 'none';
        }
    };

    showQuestion();
});