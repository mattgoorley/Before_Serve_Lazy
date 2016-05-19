from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.cors import CORS

food_api = Flask(__name__)
food_api.config.from_object('config')
db = SQLAlchemy(food_api)
cors = CORS(food_api)

from food_api import views, models
