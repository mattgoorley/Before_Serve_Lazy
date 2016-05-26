from app_front import db
from datetime import datetime

class User(db.Model):
  __tablename__ = 'users'
  id = db.Column(db.Integer, primary_key=True)
  access_token = db.Column(db.String, nullable=False)
  created = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
  updated = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, onupdate=datetime.utcnow)
  name = db.Column(db.String, nullable=False)
  first_name = db.Column(db.String, nullable=False)
  last_name = db.Column(db.String, nullable=False)
  email = db.Column(db.String, nullable=False)
  link = db.Column(db.String, nullable=False)
  gender = db.Column(db.String, nullable=True)
  longitude =  db.Column(db.String, nullable=False)
  latitude = db.Column(db.String, nullable=False)

class FoodLikes(db.Model):
  __foodLikes__ = 'food_likes'
  pk = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, nullable=False)
  merchant_id = db.Column(db.Integer, nullable=False)
  dish_id = db.Column(db.Integer, nullable=False)
  name = db.Column(db.String, nullable=False)
  description = db.Column(db.String,nullable=True)
  price = db.Column(db.Integer,nullable=False)
  image = db.Column(db.String,nullable=True)
  created = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
  ordered_from = db.Column(db.Boolean, default=False)



