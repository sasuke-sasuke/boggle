from boggle import Boggle
from flask import Flask, request, render_template, redirect, session
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = 'chickens'
app.config['DEBUG_TB_INTERCEPT_REDIRECT'] = False
debug = DebugToolbarExtension(app)

boggle_game = Boggle()
