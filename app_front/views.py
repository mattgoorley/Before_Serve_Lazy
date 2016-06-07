from flask import render_template, session, request, g, url_for, json, jsonify, Flask, redirect
from app_front import app_front, db
from .models import User, FoodLikes, MovieLikes
from magicbeanstalk.magicbeanstalk import Food, TheBook, Movie
from facebook import get_user_from_cookie, GraphAPI
import requests

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
  location["location"] = {"longitude": request.form["longitude"], "latitude": request.form["latitude"]}
  return jsonify(location=location['location'])

@app_front.route('/onload', methods=['GET'])
def get_user():
  user_id = g.user['id']
  return jsonify(location=location, user=g.user, id=str(user_id))

@app_front.route('/liked',methods=['POST'])
def liked():
  print('in liked POST')
  user_id = request.form['userId']
  print(user_id)
  merchant_id = request.form['merchantId']
  dish_id = request.form['dishId']
  name = request.form['name']
  description = request.form['description']
  price = request.form['price']
  image = request.form['image']
  save_dish = FoodLikes(user_id=user_id,merchant_id=merchant_id,dish_id=dish_id,name=name,description=description,price=price,image=image)
  db.session.add(save_dish)
  db.session.commit()
  return jsonify(success='success')

@app_front.route('/liked',methods=['GET'])
def get_liked():
  user_id = g.user['id']
  saved_likes = FoodLikes.query.filter_by(user_id=user_id).all()

  likes = []
  for i in saved_likes:
    dish = {"merchantId": i.merchant_id,
    "dishId": i.dish_id,
    "name": i.name,
    "description": i.description,
    "price": i.price,
    "image": i.image,
    "created": i.created,
    }
    likes.append(dish)
  return jsonify(likes_name=likes)

@app_front.route('/liked',methods=['DELETE'])
def remove_liked():
  print("in remove liked")
  to_remove = request.form["dishId"]
  print(to_remove)
  FoodLikes.query.filter_by(dish_id=to_remove).delete()
  db.session.commit()
  return jsonify(success='success')

MOVIE_KEY = Movie.movie_key

@app_front.route('/getmovies',methods=['GET'])

def get_movies():
  movie_key = MOVIE_KEY
  movie_url = "http://api.themoviedb.org/3/movie/popular" + "?api_key=" + movie_key
  movies_return = requests.get(movie_url).json()
  movies_list = movies_return['results']

  return jsonify(movies=movies_list)

@app_front.route('/gettv',methods=['GET'])

def get_tv():
  movie_key = MOVIE_KEY
  tv_url = "http://api.themoviedb.org/3/" + movie_key + "&="
  # for poster
  #   http://image.tmdb.org/t/p/
  pass

@app_front.route('/likedmovie',methods=['POST'])
def liked_movie():
  print('in liked_movie POST')
  user_id = request.form['userId']
  title = request.form['title']
  rating = request.form['rating']
  overview = request.form['overview']
  poster = request.form['poster']
  released = request.form['released']
  save_movie = MovieLikes(user_id=user_id,title=title,rating=rating,overview=overview,poster=poster,released=released)
  db.session.add(save_movie)
  db.session.commit()
  return jsonify(success='success')

@app_front.route('/likedmovie',methods=['GET'])
def get_liked_movies():
  user_id = g.user['id']
  saved_movie_likes = MovieLikes.query.filter_by(user_id=user_id).all()
  likes = []
  for i in saved_movie_likes:
    movie = {
    "user_id": i.user_id,
    "title": i.title,
    "rating": i.rating,
    "overview": i.overview,
    "poster": i.poster,
    "released": i.released,
    "created": i.created,
    }
    likes.append(movie)
  return jsonify(likes_name=likes)

@app_front.route('/likedmovie',methods=['DELETE'])
def remove_liked_movies():
  title = request.form["title"]
  released = request.form["released"]
  MovieLikes.query.filter_by(title=title,released=released).delete()
  db.session.commit()
  return jsonify(success='success')




