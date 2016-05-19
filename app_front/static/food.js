$(document).ready(function(){
  console.log("Hi")
  var slideCreationCounter = 0
  var currentSlideCounter = 0

  function initiate_geolocation() {
        navigator.geolocation.getCurrentPosition(handle_geolocation_query);

        }

    function handle_geolocation_query(position){
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        console.log(latitude)
        console.log(longitude)
    foodGetter()
        }



  var foodGetter = function(){
    var realLat = latitude
    var realLong = longitude
    console.log(latitude)
    $.ajax({
    method:'POST',
    url:'http://localhost:8080/food/merchants',
    data:{'latitude':realLat,'longitude':realLong},
    datatype:'jsonp',
    success:function(response){
      var merchants = response['merchants']['merchants']
      var dishNames = []
      var dishFinal = []
      var maxLength = merchants.length
      console.log(maxLength)

      for(i=0;i<5;i++){
        var randomMerch = Math.floor(Math.random()*maxLength)
        console.log(maxLength)
        console.log(randomMerch)
        var merchant = merchants[randomMerch]
        var recommended = merchant['summary']['recommended_items']
        var recommendedList = Object.keys(recommended)
        var length = recommendedList.length
        if(length != 0){
          var dishId = recommendedList[0]
          var dishName = recommended[dishId]['name']
          var dishDescription = recommended[dishId]['description']
          var dishPrice = recommended[dishId]['price']
          var dishWhole = {'name':dishName,'description':dishDescription,'price':dishPrice}
          dishFinal.push(dishWhole)
        }


        }
      var dishesLength = dishFinal.length
      for(n=0;n<dishesLength;n++){
        var display = null
        var searchDish = dishFinal[n]
        var data = searchDish
        var promise = $.ajax({
          method:'POST',
          url:'http://localhost:8080/food/image',
          data:data,
          datatype:'jsonp',
          success:function(response){
            var template = $('#postfood').html();
            Mustache.parse(template, ["<%","%>"]);
            var display = $.extend(response,{'num':slideCreationCounter});
            $('.content').append(Mustache.render(template,display));
            slideCreationCounter--

          }
      })


      }
    }
  })
  }
  initiate_geolocation()
  var myFood = []
  $('.likebutton').on('click',function(event){
    event.preventDefault()
    var slides = $('.slide').length
    var likedFood = '.' + currentSlideCounter.toString()
    var name = $(likedFood).children('.name').text()
    var image = $(likedFood).children('.imageDiv').children('.foodImage').attr('src')
    var price = $(likedFood).children('.price').text()
    var description = $(likedFood).children('.description').text()
    var fullDish = {'name':name,'price':price,'image':image,'description':description}
    myFood.push(fullDish)

    if(slides<4){
      foodGetter()
      var removeSlide = '.' + currentSlideCounter.toString()
      $(removeSlide).remove()
      currentSlideCounter --

    }else{
      var removeSlide = '.' + currentSlideCounter.toString()
      $(removeSlide).remove()
      currentSlideCounter --
    }
  })
  var notMyFood = []
  $('.dislikebutton').on('click',function(event){
    event.preventDefault()
    var slides = $('.slide').length
    var dislikedFood = '.' + currentSlideCounter.toString()
    var name = $(dislikedFood).children('.name').text()
    var image = $(dislikedFood).children('.imageDiv').children('.foodImage').attr('src')
    var price = $(dislikedFood).children('.price').text()
    var fullDish = {'name':name,'price':price,'image':image}
    notMyFood.push(fullDish)

    if(slides<4){
      foodGetter()
      var removeSlide = '.' + currentSlideCounter.toString()
      $(removeSlide).remove()
      currentSlideCounter --

    }else{
      var removeSlide = '.' + currentSlideCounter.toString()
      $(removeSlide).remove()
      currentSlideCounter --
    }
  })
  $('.myfoodbutton').on('click',function(event){
    event.preventDefault()
    $('.slide').hide()
    $('.swipe').hide()
    var template = $('#myfood').html();
    Mustache.parse(template, ["<%","%>"]);
    var check = $('.myfoodstorage').length
    var length = myFood.length
    if(check!=0){
      for(i=0;i<length;i++){
      var display = myFood[i]
      $('.myfoodstorage').append(Mustache.render(template,display));
      }
      myFood = []
      $('.home').show()
      $('.myfoodstorage').show()
    }else{
    var myFoodStorage = $('<div>',{class:"myfoodstorage"})
    var homeButton = $('<button>',{class:'home',type:'button',text:'Home'})
    $('.content').append(myFoodStorage)
    $('.bar').append(homeButton)
    for(i=0;i<length;i++){
      var display = myFood[i]
      $('.myfoodstorage').append(Mustache.render(template,display));
      }
      myFood = []
    }

  })
  $('.bar').on('click','.home',function(event){
    event.preventDefault()
    $('.home').hide()
    $('.myfoodstorage').hide()
    $('.swipe').show()
    $('.slide').show()
  })
  $('.content').on('click','.remove',function(event){
    event.preventDefault()

  })
})
