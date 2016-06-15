from flask import request, json, jsonify, url_for
from food_api import food_api, db
from app_front.models import FoodLikes
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
  dish_name = dish['dishName']
  price = dish['price']
  description = dish['description']
  dish_id = dish['dishId']
  merchant_id = dish['merchantId']
  merchant_name = dish['merchantName']
  url = dish['url']
  bing_image_key = IMAGE_KEY
  bing_headers = {"Ocp-Apim-Subscription-Key":bing_image_key}
  bing_url_temp = 'https://bingapis.azure-api.net/api/v5/images/search?q={dish_name}&count=1&offset=0&mkt=en-us&safeSearch=Strict'
  bing_url = bing_url_temp.format(dish_name=dish_name)
  image_response = requests.get(bing_url,headers=bing_headers).json()
  try:
    image_response['value'][0]['contentUrl']
  except IndexError:
    image = 'none'
  except KeyError:
    image = "none"
  else:
    image = image_response['value'][0]['contentUrl']
  # image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7ITbPjeMfmpVljRAZ5bVXW89HaMQZhteKdGuZhdu1HhyOJiVWqg'
  return jsonify(image=image,dishName=dish_name,description=description,price=price,merchantId=merchant_id,dishId=dish_id,merchantName=merchant_name,url=url)

@food_api.route('/food/menu',methods=['POST',])
@cross_origin()

def menus():
  merch_id = request.form['merchId']
  delivery_key = FOOD_KEY
  delivery_url = "https://api.delivery.com/merchant/" + str(merch_id) + "/menu?client_id=" + delivery_key
  menu = requests.get(delivery_url).json()
  print(delivery_url)
  return jsonify(menu=menu)

@food_api.route('/', methods=["GET",])
def test():
  return jsonify(menu="hello")
