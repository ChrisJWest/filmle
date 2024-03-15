let questions = [];
let results = [];

document.addEventListener('DOMContentLoaded', function() {
    fetch('film_questions.json')
        .then(response => response.json())
        .then(data => {
            questions = selectRandomQuestionsBasedOnDate(data, 5);
            displayQuestions(questions);
        })
        .catch(error => console.error('Error loading questions:', error));

    document.getElementById('submit').addEventListener('click', function() {
        calculateAndDisplayScore();
        highlightAnswers();
        this.disabled = true;
    });

    document.getElementById('copyScore').addEventListener('click', copyScoreToClipboard);
});

function selectRandomQuestionsBasedOnDate(data, count) {
    let seed = (new Date()).getDate(); // Use current date as seed
    const pseudoRandom = (() => {
        let localSeed = seed; // Local variable for manipulation
        return () => {
            const x = Math.sin(localSeed++) * 10000; // Increment local variable instead
            return x - Math.floor(x);
        };
    })();
    const shuffled = [...data].sort(() => 0.5 - pseudoRandom());
    return shuffled.slice(0, count);
}

function displayQuestions(questions) {
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = '';
    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.innerHTML = `<div>${q.question}</div>`;
        const optionsDiv = document.createElement('div');

        q.options.forEach((option, optionIndex) => {
            const optionInput = document.createElement('input');
            optionInput.type = 'radio';
            optionInput.name = `question-${index}`;
            optionInput.value = optionIndex;
            const optionLabel = document.createElement('label');
            optionLabel.appendChild(optionInput);
            optionLabel.append(document.createTextNode(option));
            optionsDiv.appendChild(optionLabel);
        });

        questionDiv.appendChild(optionsDiv);
        gameDiv.appendChild(questionDiv);
    });
}

function calculateAndDisplayScore() {
    let score = 0;
    results = []; // Reset results
    questions.forEach((q, index) => {
        const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
        const correct = selectedOption && parseInt(selectedOption.value) === q.answer;
        score += correct ? 1 : 0;
        results.push(correct);
    });
    document.getElementById('score').textContent = `Your score: ${score}/${questions.length}`;
}

function highlightAnswers() {
    questions.forEach((q, index) => {
        const options = document.querySelectorAll(`input[name="question-${index}"]`);
        options.forEach((option, optionIndex) => {
            const parentLabel = option.parentElement;
            parentLabel.style.backgroundColor = optionIndex === q.answer ? (results[index] ? '#90ee90' : '#ffcccb') : 'transparent';
            option.disabled = true;
        });
    });
}

function copyScoreToClipboard() {
    const scoreText = document.getElementById('score').textContent;
    const emojiResults = results.map(result => result ? '🟩' : '🟥').join('');
    const clipboardText = `${scoreText} ${emojiResults}`;

    navigator.clipboard.writeText(clipboardText).then(() => {
        alert('Score copied to clipboard!');
    }).catch(err => {
        console.error('Could not copy text:', err);
    });
}

