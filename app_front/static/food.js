$(document).ready(function(){
  var __cache={};
  console.log("Hi")
  var slideCreationCounter = 1000
  var currentSlideCounter = 1000
  var nearbyMerchants;

  var getMerchants = function(){
    var realLat = __cache["location"]["latitude"]
    var realLong = __cache["location"]["longitude"]
    $.ajax({
    method:'POST',
    url:'http://localhost:8080/food/merchants',
    data:{'latitude':realLat,'longitude':realLong},
    datatype:'jsonp',
    success:function(response){
      nearbyMerchants = response['merchants']['merchants']
      getImages()
  }
})
}

var getUser = function() {
    $.ajax({
      method: "GET",
      url:'/onload',
      datatype: "jsonp",
      success: function(response){
        __cache["userId"] = response["id"]
        __cache["location"] = response["location"]["location"]
        getMerchants();
      }
      })
  }
  getUser()

  var otherRecommended = {}
  var getImages = function(){
      var dishNames = []
      var dishFinal = []
      var maxLength = nearbyMerchants.length

      for(var i=0;i<5;i++){
        var randomMerch = Math.floor(Math.random()*maxLength)
        var merchant = nearbyMerchants[randomMerch]
        var recommended = merchant['summary']['recommended_items']
        var merchantId = merchant['id']
        var recommendedList = Object.keys(recommended)
        var length = recommendedList.length
        if(length != 0){
          var dishId = recommendedList[0]
          var dishName = recommended[dishId]['name']
          var dishDescription = recommended[dishId]['description']
          var dishPrice = recommended[dishId]['price']
          var dishWhole = {'name':dishName,'description':dishDescription,'price':dishPrice,'dishId':dishId,'merchantId':merchantId}
          dishFinal.push(dishWhole)
          otherRecommended[dishId.toString()] = []
          for(var n=0;n<length;n++){
            var otherDishId = recommendedList[n]
            var otherDishName = recommended[otherDishId]['name']
            var otherDishDescription = recommended[otherDishId]['description']
            var otherDishPrice = recommended[otherDishId]['price']
            var otherDishWhole = {'name':otherDishName,'description':dishDescription,'price':otherDishPrice,'allDishId':otherDishId,'allMerchantId':merchantId}
            otherRecommended[dishId.toString()].push(otherDishWhole)
          }
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

  var myFood = []
  $('.likebutton').on('click',function(event){
    event.preventDefault()
    var slides = $('.slide').length
    var likedFood = '.' + currentSlideCounter.toString()
    var name = $(likedFood).children('.name').text()
    var classes = $(likedFood).children('.name').attr('class')
    var ids = classes.split(' ')
    var dishId = ids[0]
    var merchantId = ids[1]
    var user = __cache["userId"]
    console.log(user)
    var image = $(likedFood).children('.imageDiv').children('.foodImage').attr('src')
    var price = $(likedFood).children('.price').text()
    var description = $(likedFood).children('.description').text()
    var fullDish = {'name':name,'price':price,'image':image,'description':description,'dishId':dishId,'merchantId':merchantId}
    var saveDish = {'userId':user,'name':name,'price':price,'image':image,'description':description,'dishId':dishId,'merchantId':merchantId}
    $.ajax({
      method:'POST',
      url:'/liked',
      data:saveDish,
      datatype:'jsonp',
      success:function(){
        console.log('success')
      }
    })
    myFood.push(fullDish)

    if(slides<4){
      getImages()
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
    // var dislikedFood = '.' + currentSlideCounter.toString()
    // var name = $(dislikedFood).children('.name').text()
    // var image = $(dislikedFood).children('.imageDiv').children('.foodImage').attr('src')
    // var price = $(dislikedFood).children('.price').text()
    // var fullDish = {'name':name,'price':price,'image':image}
    // notMyFood.push(fullDish)

    if(slides<4){
      getImages()
      var removeSlide = '.' + currentSlideCounter.toString()
      $(removeSlide).remove()
      currentSlideCounter --

    }else{
      var removeSlide = '.' + currentSlideCounter.toString()
      $(removeSlide).remove()
      currentSlideCounter --
    }
  })
  $('.slideout-menu-likes-toggle').on('click',function(event){
    event.preventDefault()
    // $('.slide').hide()
    // $('.swipe').hide()
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
  $('.myfoodstorage').on('click','.remove',function(event){
    event.preventDefault()
    var classes = this.getAttribute('class')
    var ids = classes.split(' ')
    var removeFood = ids[1]
    var removeFoodClass = '.' + removeFood
    $(removeFoodClass).remove()

  })


  $('.content').on('click','.myimageDiv',function(event){
    event.preventDefault()
    var classes = this.getAttribute('class')
    var ids = classes.split(' ')
    var merchId = ids[1]
    var dishId = ids[0]
    var shell = "." + dishId + ".shell"
    var closeLook = '.'+dishId+'.closeLook'
    var hideShortView = '.' + merchId + '.' + 'dish'
    var menusChecked = {}
    var displayMenus = function(menus){
      var menusLength = menus.length
      for(var i=0;i<menusLength;i++){
        var miniMenu = menus[i]
        var miniMenuName = miniMenu[0]
        var merchMenuId = merchId
        var menuId = miniMenu[2]
        var titleData = {'menuName':miniMenuName,'merchMenuId':merchMenuId,'menuId':menuId}
        var titleTemplate = $('#menuHead').html();
        Mustache.parse(titleTemplate, ["<%","%>"]);
        $(closeLook).append(Mustache.render(titleTemplate,titleData))
        var menuItems = miniMenu[1]
        var itemsLength = menuItems.length
        for(var n=0;n<itemsLength;n++){
          var currentItem = menuItems[n]
          var menuItemId = currentItem['id']
          var menuItemName = currentItem['name']
          var menuItemDescription = currentItem['description']
          var menuItemPrice = currentItem['price']
          var fullMenuItem = {'menuItemId':menuItemId,'menuItemName':menuItemName,'menuItemDescription':menuItemDescription,'menuItemPrice':menuItemPrice,'menuId':menuId}
          var itemTemplate = $('#menuItem').html();
          Mustache.parse(itemTemplate, ["<%","%>"]);
          var miniMenuDiv = "."+menuId+".miniMenu"
          $(miniMenuDiv).append(Mustache.render(itemTemplate,fullMenuItem))
          var hideMenuItems = '.'+menuId.toString()+'.menuItem'
          $(hideMenuItems).hide()
        }
       }
     }

    $(hideShortView).hide()
    var buttonTime = {'allDishId':dishId,'allMerchantId':merchId}
    var slideHolderTemplate = $('#allRecommended').html();
    Mustache.parse(slideHolderTemplate,["<%","%>"]);
    $(shell).append(Mustache.render(slideHolderTemplate,buttonTime))
    var otherSlides = otherRecommended[dishId.toString()]
    var otherSlidesLength = otherSlides.length
    // var currentSlide = otherSlides[0]
    // var name = currentSlide['name']
    // var data = {'name':name}
    for(var z=0;z<otherSlidesLength;z++){
      var currentSlide = otherSlides[z]
      var name = currentSlide['name']
      var data = {'name':name}
      var quickImage = function(currentSlide,data){
        $.ajax({
          method:'POST',
          url:'http://localhost:8080/food/simpleimage',
          data:data,
          datatype:'jsonp',
          success:function(response){
            var image = response['image']
            currentSlide['image'] = image
            var otherSlideTemplate = $('#otherRecommended').html();
            Mustache.parse(otherSlideTemplate,["<%","%>"]);
            $(closeLook).append(Mustache.render(otherSlideTemplate,currentSlide))

          }
      })



    }
      quickImage(currentSlide,data)





    }
    if(merchId.toString() in menusChecked){
      var useMenu = menusChecked[merchId.toString()]
      displayMenus(useMenu)
    }else{
    $.ajax({
      method:'POST',
      url:'http://localhost:8080/food/menu',
      data:{'merchId':merchId},
      datatype:'jsonp',
      success:function(response){
       var startMenu = response['menu']['menu']
       var startMenuLength = startMenu.length
       var storage = []
       var finalMenus = []
       for(var i=0;i<startMenuLength;i++){
        storage.push(startMenu[i])
       }
       for(var n=0;n<storage.length;n++){
        var currentThing = storage[n]
        if(currentThing.constructor === Array){
          if(currentThing[1][0]['type'] === 'menu'){
            var currentThingChildren = currentThing[1][0]['children']
            var currentThingLength = currentThingChildren.length
            for(var i=0;i<currentThingLength;i++){
              var pushThing = [currentThingChildren[i]['name'],currentThingChildren[i]['children'],currentThingChildren[i]['id']]
              storage.push(pushThing)
            }
          }else{
            finalMenus.push(currentThing)
          }
        }else{
        if(currentThing['children'][0]['type']==='menu'){
          var currentThingChildren = currentThing['children']
          var currentThingLength = currentThingChildren.length
          for(var i=0;i<currentThingLength;i++){
          var pushThing = [currentThingChildren[i]['name'],currentThingChildren[i]['children'],currentThingChildren[i]['id']]
          storage.push(pushThing)
          }
        }else if(currentThing['children'][0]['type']==='item'){
          var pushThing = [currentThing['name'],currentThing['children'],currentThing['id']]
          finalMenus.push(pushThing)
          }
        }
        }

      menusChecked[merchId.toString()] = finalMenus
      displayMenus(finalMenus)

      }
    })
  }
  })
  $('.content').on('click','.menuName',function(event){
    var classes = this.getAttribute('class')
    var listClasses = classes.split(' ')
    var menuChildren = '.'+listClasses[0]+'.menuItem'
    if($(menuChildren).is(':visible')){
      $(menuChildren).hide()
    }else{
      $(menuChildren).show()
    }
  })

})
