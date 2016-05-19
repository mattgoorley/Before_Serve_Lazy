from food_api import db
from datetime import datetime

class FoodLikes(db.Model):
  __foodLikes__ = 'food_likes'
  pk = db.Column(db.Integer, primary_key=True)
  merchant_id = db.Column(db.Integer, nullable=False)
  user_id = db.Column(db.Integer, nullable=False)
  dish_id = db.Column(db.Integer, nullable=False)
  created = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
  ordered_from = db.Column(db.Boolean, default=False)




