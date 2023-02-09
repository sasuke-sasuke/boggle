
let score = 0;
let time = 60;

$('form').on('click', '#submit', handleClick);

/* 
handleClick stops form refresh on click, gets guessed word, clear form value, 
sends get request to check guess validity, calls msgUI, scoreKeeper
*/
async function handleClick(e){
    e.preventDefault();
    const $guess = $('#guess');
    const guess = $guess.val();
    let response, msg;
    $guess.val('');
    try {
        response = await axios.get('/check_guess', {params: { guess: guess }})
        msg = response.data.result; 
    } catch (error) {
        msg = 'danger-guess'
    }
    
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
    } else {
        $msg.text('WHATEVER YOU DID JUST STOP IT!')
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

// Sends score data to server and updates UI with highscore and times played
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
