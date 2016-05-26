from flask import render_template, session, request, g, url_for, json, jsonify, Flask, redirect
from app_front import app_front, db
from .models import User, FoodLikes
from magicbeanstalk.magicbeanstalk import Food, TheBook
from facebook import get_user_from_cookie, GraphAPI


SECRET_KEY = TheBook.book_secret
APP_ID = TheBook.book_app_id
APP_NAME = "Lazy Sunday"
location = {}

@app_front.route('/')
@app_front.route('/index')
def index():
  if g.user:
    print(g.user)
    return render_template('landing.html', app_id=APP_ID, app_name=APP_NAME, user=g.user)
  else:
    return render_template('login.html', app_id=APP_ID, app_name=APP_NAME)

@app_front.route('/logout')
def logout():
  session.pop('user', None)
  return redirect(url_for('index'))

@app_front.before_request
def get_current_user():
  if session.get('user'):
    g.user = session.get('user')
    return

  result = get_user_from_cookie(cookies=request.cookies, app_id=APP_ID, app_secret=SECRET_KEY)

  if result:

    user = User.query.filter(User.id == result['uid']).first()

    if not user:

      graph = GraphAPI(result['access_token'])
      profile = graph.get_object('me?fields=email,first_name,last_name,name,link,id,gender')


      user = User(id=str(profile['id']), name=profile['name'], first_name=profile['first_name'], last_name=profile['last_name'], email=profile['email'], gender=profile['gender'], link=profile['link'], access_token=result['access_token'])
      db.session.add(user)

    elif user.access_token != result['access_token']:

      user.access_token = result['access_token']

    session['user'] = dict(id=user.id, name=user.name, access_token=user.access_token)


  db.session.commit()
  g.user = session.get('user', None)



@app_front.route('/food')
def food():
  return render_template('food.html', app_id=APP_ID, app_name=APP_NAME, user=g.user)

@app_front.route('/movies')
def movies():
  return render_template('movies.html', app_id=APP_ID, app_name=APP_NAME, user=g.user)

@app_front.route('/onload', methods=['POST'])
def give_user():
  print('in get_user POST')
  print(location)
  location["location"] = {"longitude": request.form["longitude"], "latitude": request.form["latitude"]}
  print(location)
  print(g.user)
  return jsonify(location=location['location'])

@app_front.route('/onload', methods=['GET'])
def get_user():
  print("in get_user GET")
  return jsonify(location)
