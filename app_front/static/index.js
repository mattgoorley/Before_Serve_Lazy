$(document).ready(function () {
    var myLikes;
    var myMovieLikes;
    var sendLikes = [];
    var latitude;
    var longitude;

    // Settings slideout menu
    $('.slideout-menu-toggle').on('click', function(event){
        event.preventDefault();
        // create menu variables
        var slideoutMenu = $('.slideout-menu');
        var slideoutMenuWidth = $('.slideout-menu').width();

        // toggle open class
        slideoutMenu.toggleClass("open");

        // slide menu
        if (slideoutMenu.hasClass("open")) {
            slideoutMenu.animate({
                left: "0px"
            });
        } else {
            slideoutMenu.animate({
                left: -slideoutMenuWidth
            }, 250);
        }
    });

    // Likes slideout menu
    $('.slideout-menu-likes-toggle').on('click', function(event){
        event.preventDefault();
        // create menu variables
        var slideoutMenu = $('.slideout-menu-likes');
        var slideoutMenuWidth = $('.slideout-menu-likes').width();

        // toggle open class
        slideoutMenu.toggleClass("open");

        // slide menu
        if (slideoutMenu.hasClass("open")) {
            slideoutMenu.animate({
                right: "0px"
            });
        } else {
            slideoutMenu.animate({
                right: -slideoutMenuWidth
            }, 250);
        }

        // filling in the food likes column
        var template = $('#myfood').html();
        Mustache.parse(template, ["<%","%>"]);
        var check = $('.myfoodstorage').length
        var length = myLikes.length
        if(check!=0){
          for(i=0;i<length;i++){
          var display = myLikes[i]
          $('.myfoodstorage').append(Mustache.render(template,display));
          }
          myLikes = []
          $('.myfoodstorage').hide()
        }else{
        var myFoodStorage = $('<div>',{class:"myfoodstorage"})
        var homeButton = $('<button>',{class:'home',type:'button',text:'Home'})
        $('.content').append(myFoodStorage)
        $('.bar').append(homeButton)
        for(i=0;i<length;i++){
          var display = myLikes[i]
          $('.myfoodstorage').append(Mustache.render(template,display));
          }
          myLikes = []
        }

        // filling in the movie likes template
        var template = $('#myMovie').html();
        Mustache.parse(template, ["<%","%>"]);
        var check = $('.mymoviestorage').length
        var length = myMovieLikes.length
        if(check!=0){
          for(i=0;i<length;i++) {
            var display = myMovieLikes[i]
            $('.mymoviestorage').append(Mustache.render(template,display));
          }

          myMovieLikes = []
          $('.mymoviestorage').hide()
        }
        else{
            var myMovieStorage = $('<div>',{class:"mymoviestorage"})
            $('.content').append(myMovieStorage)
        }

    });

    // Getting the movie and food likes from the database
    var getLikes = function(){
        $.ajax({
            method:'GET',
            url:'/liked',
            datatype:'jsonp',
            success:function(response){
                myLikes = response["likes_name"]
            }
        })
        $.ajax({
            method:'GET',
            url:'/likedmovie',
            datatype:'jsonp',
            success:function(response){
                myMovieLikes = response["likes_name"]
            }
        })
    }
    getLikes()

    $('.myfoodstorage').on('click','.remove',function(event){
        event.preventDefault()
        var classes = this.getAttribute('class')
        var ids = classes.split(' ')
        var removeFood = ids[1]
        var removeFoodClass = '.' + removeFood
        $(removeFoodClass).remove()
        $.ajax({
            method: "DELETE",
            url: '/liked',
            data: {'dishId':removeFood},
            datatype:'jsonp',
            success: function(response){
                console.log("success")
            }
        })

    })

    $('.mymoviestorage').on('click','.remove',function(event){
        event.preventDefault()
        var slide = $(this).closest('div')
        console.log(slide)
        var title = slide.children('.title').text()
        console.log(title)
        $(slide).remove()
        $.ajax({
            method: "DELETE",
            url: '/likedmovie',
            data: {'title':title},
            datatype:'jsonp',
            success: function(response){
                console.log(response)
            }
        })
    })

    $('.foodFab').on('click',function(event){
        event.preventDefault();
        if($('.myfoodstorage').is(':visible')){
            $('.myfoodstorage').hide()
        }else{
            $('.myfoodstorage').show()
        }
    })
    $('.movieFab').on('click',function(event){
        event.preventDefault();
        if($('.mymoviestorage').is(':visible')){
            $('.mymoviestorage').hide()
        }else{
            $('.mymoviestorage').show()
        }
    })

    $('.myfoodstorage').on('click','.order',function(event){
        var url = this.getAttribute('id')
        window.location.href = url
    })

    var displayMenus = function(menus,appender,mid){
      var menusLength = menus.length

      for(var i=0;i<menusLength;i++){
        var miniMenu = menus[i]
        var miniMenuName = miniMenu[0]
        var merchMenuId = mid
        var menuId = miniMenu[2]
        var titleData = {'menuName':miniMenuName,'merchMenuId':merchMenuId,'menuId':menuId}
        var titleTemplate = $('#menuHead').html();
        Mustache.parse(titleTemplate, ["<%","%>"]);
        $(appender).append(Mustache.render(titleTemplate,titleData))
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

  var menusChecked = {}
  $('.myfoodstorage').on('click','.myimageDiv',function(event){
    event.preventDefault()
    var classes = this.getAttribute('class')
    var ids = classes.split(' ')
    var merchId = ids[1]
    var dishId = ids[0]
    var hider = '.' + merchId + '.miniMenu'
    var fullView = '.' + merchId + '.dish'


    if($(hider).length){
      if($(hider).is(':visible')){
        $(hider).hide()
      }else{
        $(hider).show()
      }
    }
    else{
        if(merchId.toString() in menusChecked){
          var useMenu = menusChecked[merchId.toString()]
          displayMenus(useMenu,fullView,merchId)
        }
        else{
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
              // console.log('possible problem')
              // console.log(currentThing[1])
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
          displayMenus(finalMenus,fullView,merchId)

          }
        })
        }
        }
    })

    $('.myfoodstorage').on('click','.menuName',function(event){
        var classes = this.getAttribute('class')
        var listClasses = classes.split(' ')
        var menuChildren = '.'+listClasses[0]+'.menuItem'
        if($(menuChildren).is(':visible')){
          $(menuChildren).hide()
        }else{
          $(menuChildren).show()
        }
    })

    $('.home').on('click',function(event){
        var url = this.getAttribute('id')
        window.location.href = url
    })
});

