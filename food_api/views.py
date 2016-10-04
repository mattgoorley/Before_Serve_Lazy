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

@food_api.route('/food/image',methods=['POST','GET'])
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
  # bing_image_key = IMAGE_KEY
  # bing_headers = {"Ocp-Apim-Subscription-Key":bing_image_key}
  pixaby_url_temp = 'https://pixabay.com/api/?key=3444927-2ac7cdb68b275dc6741ccd7ae&q=food+{dish_name}'
  pix_url = pixaby_url_temp.format(dish_name=dish_name)
  image_response = requests.get(pix_url).json()
  try:
    image_response['hits'][0]['previewURL']
  except IndexError:
    image = 'none'
  except KeyError:
    image = "none"
  else:
    image = image_response['hits'][0]['webformatURL']
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
