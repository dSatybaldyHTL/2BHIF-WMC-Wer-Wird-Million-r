// quiz-uk.js
document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        {
            question: "What is the capital of the United Kingdom?",
            answers: ["London", "Manchester", "Birmingham", "Liverpool"],
            correct: 0
        },
        {
            question: "How many countries make up the UK?",
            answers: ["2", "3", "4", "5"],
            correct: 2
        },
        {
            question: "Which river flows through London?",
            answers: ["Thames", "Severn", "Mersey", "Tyne"],
            correct: 0
        },
        {
            question: "Who is the current monarch of the UK (2024)?",
            answers: ["Charles III", "Elizabeth II", "William V", "George VI"],
            correct: 0
        },
        {
            question: "Which city hosted the 2012 Summer Olympics?",
            answers: ["London", "Edinburgh", "Cardiff", "Belfast"],
            correct: 0
        },
        {
            question: "What is the national animal of Scotland?",
            answers: ["Unicorn", "Lion", "Dragon", "Wolf"],
            correct: 0
        },
        {
            question: "Which UK country is famous for its leeks and daffodils?",
            answers: ["Wales", "England", "Scotland", "Northern Ireland"],
            correct: 0
        },
        {
            question: "What is the largest lake in the UK?",
            answers: ["Lough Neagh", "Loch Ness", "Lake Windermere", "Loch Lomond"],
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
        questionNumber.textContent = `Question ${current + 1} of ${questions.length}`;
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
            balanceEl.textContent = `Balance: £${balance}`;
            nextButton.style.display = 'inline-block';
        } else {
            questionEl.textContent = "Wrong answer! Game over.";
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
            questionEl.textContent = "Congratulations! You finished the quiz.";
            answerContainer.innerHTML = '';
            nextButton.style.display = 'none';
        }
    };

    showQuestion();
});