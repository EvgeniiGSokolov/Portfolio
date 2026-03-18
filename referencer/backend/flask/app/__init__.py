from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'комполось-вычислитель'
app.config['CORS_ALLOW_HEADERS'] = 'List'
app.config['JWT_SECRET_KEY'] = 'foreveralone'
from app import routes