
let score = 0;
let time = 5;

$('form').on('click', '#submit', handleClick);

/* 
handleClick stops form refresh on click, gets guessed word, clear form value, 
sends get request to check guess validity, calls msgUI, scoreKeeper
*/
async function handleClick(e){
    e.preventDefault();
    const $guess = $('#guess');
    const guess = $guess.val();
    $guess.val('');
    const response = await axios.get('/check_guess', {params: { guess: guess }})
    const msg = response.data.result; 
    msgUI(msg);
    scoreKeeper(guess, msg);
}

// Checks response message updates msg UI
function msgUI(msg){
    const $msg = $('#msg')
    if (msg === 'ok'){
        $msg.text('OK!')
    } 
    else if (msg === 'not-on-board'){
        $msg.text('NOT ON BOARD');
    } 
    else if (msg === 'not-word'){
        $msg.text('NOT WORD');
    }
    else if (msg === 'already-guessed'){
        $msg.text('WORD ALREADY GUESSED')
    }
    else if (msg === 'single-char'){
        $msg.text('SIZE OF WORD MUST BE < 1')
    }
}

// Calculates points for correct guess and adds to score
function scoreKeeper(word, msg){
    if (msg === 'ok'){
        const points = word.length;
        score += points;
    }
    $('#score').text(`Score: ${score}`);
}

// Runs game timer and calls gameOver()
function timer(){
    const interID = setInterval(() => {
        time -= 1;
        $('#timer').text(`Time Remaining: ${time}`);
        if (time === 0) {
            clearInterval(interID);
            gameOver();
        }
    }, 1000)
}

// Disables to submit button
function disableButton() {
    $('#submit').attr('disabled', 'true');
};

// Sends score data to server
async function gameOver(){
    const res = await axios.post('/get_scores', {score : score});
    disableButton();
    $('#highscore').text(`Highscore: ${res.data.highscore}`)
    $('#num-plays').text(`Times played: ${res.data.plays}`)
}

// starts timer
const intID = setTimeout(() => {
    timer();
    clearTimeout(intID)
}, 2000)
