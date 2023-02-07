from boggle import Boggle
from flask import Flask, request, render_template, redirect, session
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = 'chickens'
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)

boggle_game = Boggle()
game_board = boggle_game.make_board()

@app.route('/')
def index():
    session['boggle_board'] = game_board
    return render_template('index.html', game_board=game_board)

@app.route('/guess', methods=['POST'])
def guess():
    return redirect('/')

@app.route('/words')
def check_guess():
    return redirect('/')
