// quiz-de.js
document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        {
            question: "Welcher dieser Begriffe stammt ursprünglich aus der Fotografie und bedeutet heute „besonders beliebt“?",
            answers: ["Zoom", "Klick", "Schnappschuss", "Highlight"],
            correct: 3
        },
        {
            question: "Welche dieser Städte ist nicht Hauptstadt eines Landes?",
            answers: ["Paris", "Madrid", "Zürich", "Rom"],
            correct: 2
        },
        {
            question: "Was ist die Hauptzutat von traditionellem Pesto Genovese?",
            answers: ["Tomaten", "Basilikum", "Paprika", "Thymian"],
            correct: 1
        },
        {
            question: "Welche Maßeinheit steht für elektrische Spannung?",
            answers: ["Ampere", "Volt", "Ohm", "Watt"],
            correct: 1
        },
        {
            question: "Wer ist der Erfinder der Relativitätstheorie?",
            answers: ["Stephen Hawking", "Galileo Galilei", "Albert Einstein", "Isaac Newton"],
            correct: 2
        },
        {
            question: "Wofür steht das „D“ im Kürzel „DVD“?",
            answers: ["Digital", "Direct", "Disk", "Data"],
            correct: 0
        },
        {
            question: "Wie nennt man eine besonders schnelle Internetverbindung?",
            answers: ["DSL", "GPS", "HTML", "VGA"],
            correct: 0
        },
        {
            question: "Welche Band veröffentlichte das Album „The Dark Side of the Moon“?",
            answers: ["Queen", "Pink Floyd", "The Beatles", "Nirvana"],
            correct: 1
        },
        {
            question: "Was ist ein Synonym für das Wort „kurios“?",
            answers: ["Langweilig", "Merkwürdig", "Fröhlich", "Laut"],
            correct: 1
        },
        {
            question: "Welcher Planet besitzt ein ausgeprägtes Ringsystem?",
            answers: ["Mars", "Neptun", "Saturn", "Venus"],
            correct: 2
        },
        {
            question: "Welcher deutsche Philosoph prägte den Begriff des „Übermenschen“?",
            answers: ["Hegel", "Kant", "Nietzsche", "Schopenhauer"],
            correct: 2
        },
        {
            question: "Was bedeutet „Carpe Diem“ aus dem Lateinischen übersetzt?",
            answers: ["Genieße den Abend", "Nutze den Tag", "Fürchte den Morgen", "Ergreife die Stunde"],
            correct: 1
        },
        {
            question: "Wie heißt der kleine Bruder von Mario im Nintendo-Universum?",
            answers: ["Luigi", "Yoshi", "Bowser", "Wario"],
            correct: 0
        },
        {
            question: "In welcher Sportart gibt es einen „Schmetterball“?",
            answers: ["Volleyball", "Handball", "Basketball", "Tischtennis"],
            correct: 0
        },
        {
            question: "Was ist das chemische Symbol von Gold?",
            answers: ["Au", "Ag", "Go", "Gd"],
            correct: 0
        }
    ];

    // Shuffle function (Fisher-Yates)
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    shuffle(questions); // Fragen mischen

    let current = 0;
    let balance = 0;
    const prizeSteps = [50, 100, 200, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];

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

    function showEndButtons() {
        // Restart-Button
        const restartBtn = document.createElement('button');
        restartBtn.textContent = 'Restart';
        restartBtn.onclick = () => location.reload();
        answerContainer.appendChild(restartBtn);

        // Home-Button
        const homeBtn = document.createElement('button');
        homeBtn.textContent = 'Home';
        homeBtn.onclick = () => window.location.href = 'index.html'; // ggf. Pfad anpassen
        answerContainer.appendChild(homeBtn);
    }

    function checkAnswer(idx) {
        const q = questions[current];
        if (idx === q.correct) {
            balance = prizeSteps[current];
            balanceEl.textContent = `Kontostand: €${balance.toLocaleString('de-DE')}`;
            nextButton.style.display = 'inline-block';
        } else {
            questionEl.textContent = `Falsche Antwort! Spiel vorbei.\nGewinn: €${balance.toLocaleString('de-DE')}`;
            answerContainer.innerHTML = '';
            nextButton.style.display = 'none';
            showEndButtons();
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
            showEndButtons();
        }
    };

    showQuestion();
});