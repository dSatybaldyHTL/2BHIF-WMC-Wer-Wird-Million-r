function makeUpperCase(value) {
    console.log(value.toUpperCase());
}

function reverseString(str) {
    console.log(str.split('').reverse().join(''));
}

function handleName(name, cb) {
    const fullName = `${name} smith`;
    cb(fullName);
}

// handleName('peter', makeUpperCase);
// handleName('peter', reverseString);

handleName('susan', (value) => console.log(value));

const btn = document.querySelector('.btn');

btn.addEventListener('click', function() {
    console.log('Hello World!');
})