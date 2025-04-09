
fetch('https://localhost:3000/questions')
.then(response => response.json())
.then(data => {
    data.forEach((question) => {

    })
})

function checkAnswer(userAnswer, answer) {
    if (userAnswer === answer) {
        return true;
    }
    return false;
}