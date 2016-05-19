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

