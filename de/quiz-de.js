// quiz-de.js
document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        {
            question: "Was ist die Hauptstadt von Deutschland?",
            answers: ["Berlin", "München", "Hamburg", "Köln"],
            correct: 0
        },
        {
            question: "Wie viele Bundesländer hat Deutschland?",
            answers: ["14", "15", "16", "17"],
            correct: 2
        },
        {
            question: "Welcher Fluss fließt durch Köln?",
            answers: ["Rhein", "Elbe", "Donau", "Main"],
            correct: 0
        },
        {
            question: "Wer ist der aktuelle Bundeskanzler (2024)?",
            answers: ["Olaf Scholz", "Angela Merkel", "Frank-Walter Steinmeier", "Armin Laschet"],
            correct: 0
        },
        {
            question: "Welches Tier ist das Wappentier Deutschlands?",
            answers: ["Adler", "Löwe", "Bär", "Wolf"],
            correct: 0
        },
        {
            question: "Welches Bundesland ist flächenmäßig das größte?",
            answers: ["Bayern", "Nordrhein-Westfalen", "Niedersachsen", "Baden-Württemberg"],
            correct: 0
        },
        {
            question: "Welcher See ist der größte in Deutschland?",
            answers: ["Bodensee", "Chiemsee", "Starnberger See", "Steinhuder Meer"],
            correct: 0
        },
        {
            question: "Welches Fest ist weltweit als deutsches Volksfest bekannt?",
            answers: ["Oktoberfest", "Karneval", "Weihnachtsmarkt", "Maifest"],
            correct: 0
        }
        // Weitere Fragen können hier ergänzt werden
    ];

    let current = 0;
    let balance = 0;
    const prizeSteps = [50, 100, 200, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 500000, 750000, 1000000];

    const questionEl = document.getElementById('questionPlaintext');
    const answerContainer = document.getElementById('answer-container');
    const nextButton = document.getElementById('nextButton');
    const balanceEl = document.getElementById('Balance');
    const prizeList = document.getElementById('prizeList').children;
    const questionNumber = document.getElementById('questionNumber');

    function showQuestion() {
        const q = questions[current];
        questionEl.textContent = q.question;
        questionNumber.textContent = `Frage ${current + 1} von ${questions.length}`;
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
            balanceEl.textContent = `Kontostand: €${balance}`;
            nextButton.style.display = 'inline-block';
        } else {
            questionEl.textContent = "Falsche Antwort! Spiel beendet.";
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
            questionEl.textContent = "Herzlichen Glückwunsch! Du hast das Quiz beendet.";
            answerContainer.innerHTML = '';
            nextButton.style.display = 'none';
        }
    };

    showQuestion();
});