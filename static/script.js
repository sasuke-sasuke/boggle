
let score = 0;

$('form').on('click', '#submit', handleClick);

async function handleClick(e){
    e.preventDefault();
    const $guess = $('#guess');
    const guess = $guess.val();
    $guess.val('');
    const response = await axios.get('/check_guess', {params: { guess: guess }})
    const msg = response.data.result; 
    console.log(msg);
    msgUI(msg);
    scoreKeeper(guess, msg);
}

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
}

function scoreKeeper(word, msg){
    if (msg === 'ok'){
        const points = word.length;
        score += points;
    }
    $('#score').text(`Score: ${score}`);
}

function timer(){
    let time = 3;
    const interID = setInterval(() => {
        time -= 1;
        $('#timer').text(`Time Remaining: ${time}`);
        if (time === 0) {
            disableButton();
            clearInterval(interID);
            gameOver();
        }
    }, 1000)
}

function disableButton() {
    $('#submit').attr('disabled', 'true');
};

async function gameOver(){
    await axios.post('/get_scores', {score : score})

}

// starts timer
const intID = setTimeout(() => {
    timer();
    clearTimeout(intID)
}, 2000)
