from boggle import Boggle
from flask import Flask, request, render_template, redirect, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = 'chickens'
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)

boggle_game = Boggle()
guessed_words = []

@app.route('/')
def index():
    game_board = boggle_game.make_board()
    session['boggle_board'] = game_board
    highscore = session.get('highscore', 0)
    plays = session.get('plays', 0)
    return render_template('index.html', game_board=game_board, highscore=highscore, plays=plays)

@app.route('/check_guess')
def check_guess():
    guess = request.args['guess']
    game_board = session['boggle_board']
    return validGuess(guess, game_board)
    

@app.route('/get_scores', methods=['POST'])
def get_scores():
    score = int(request.json['score'])
    highscore = save_high_score(score)
    plays = save_play_throughs()
    return jsonify({'highscore': highscore, 'plays': plays})


def save_play_throughs():
    if 'plays' in session:
        session['plays'] += 1
    else:
        session['plays'] = 1
    return session['plays']

def save_high_score(score):
    highscore = session.get('highscore', 0)
    session['highscore'] = max(score, highscore)
    return session['highscore']

def validGuess(guess, board):
    if len(guess) == 1:
        return jsonify({'result': 'single-char'})
    elif guess in guessed_words:
        return jsonify({'result': 'already-guessed'})
    elif guess not in guessed_words:
        guessed_words.append(guess)
        res = boggle_game.check_valid_word(board, guess)
        return jsonify({ 'result': res })
