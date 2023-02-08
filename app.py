from boggle import Boggle
from flask import Flask, request, render_template, redirect, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = 'chickens'
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)

boggle_game = Boggle()
#game_board = boggle_game.make_board()

@app.route('/')
def index():
    game_board = boggle_game.make_board()
    session['boggle_board'] = game_board
    highscore = session.get('highscore', 0)
    play_throughs = session.get('play_thr', 0)
    return render_template('index.html', game_board=game_board, highscore=highscore, plays=play_throughs)

@app.route('/check_guess')
def check_guess():
    guess = request.args['guess']
    game_board = session['boggle_board']
    res = boggle_game.check_valid_word(game_board, guess)
    return jsonify({ 'result': res })

@app.route('/get_scores', methods=['POST'])
def get_scores():
    score = int(request.json['score'])
    highscore = session.get('highscore', 0)
    session['highscore'] = max(score, highscore)
    play_throughs = session.get('play-thr', 0)
    session['play_thr'] += 1
    return jsonify(highscore)