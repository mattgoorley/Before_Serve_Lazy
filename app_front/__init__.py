from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

app_front = Flask(__name__)
db = SQLAlchemy(app_front)

app_front.config.from_object('config')

from app_front import views, models
