from flask import request, json, jsonify, url_for
from food_api import food_api, db
from .models import FoodLikes
from magicbeanstalk.magicbeanstalk import Food
from flask.ext.cors import cross_origin
import requests

FOOD_KEY = Food.delivery_key
IMAGE_KEY = Food.bing_image_key

@food_api.route('/food/merchants',methods=['POST',])
@cross_origin()

def merchants():
  latitude = request.form['latitude']
  longitude = request.form['longitude']
  delivery_key = FOOD_KEY
  delivery_url = "https://api.delivery.com/merchant/search/delivery?client_id=" + delivery_key + "&latitude=" + str(latitude) + "&longitude=" + str(longitude)
  merchants = requests.get(delivery_url).json()
  return jsonify(merchants=merchants)

@food_api.route('/food/image',methods=['POST',])
@cross_origin()

def image():
  dish = request.form
  name = dish['name']
  price = dish['price']
  description = dish['description']
  # bing_image_key = IMAGE_KEY
  # bing_headers = {"Ocp-Apim-Subscription-Key":bing_image_key}
  # bing_url_temp = 'https://bingapis.azure-api.net/api/v5/images/search?q={name}&count=1&offset=0&mkt=en-us&safeSearch=Strict'
  # bing_url = bing_url_temp.format(name=name)
  # image_response = requests.get(bing_url,headers=bing_headers).json()
  # try:
  #   image_response['value'][0]['contentUrl']
  # except IndexError:
  #   image = 'none'
  # except KeyError:
  #   image = "none"
  # else:
  #   image = image_response['value'][0]['contentUrl']
  image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7ITbPjeMfmpVljRAZ5bVXW89HaMQZhteKdGuZhdu1HhyOJiVWqg'
  return jsonify(image=image,name=name,description=description,price=price)
