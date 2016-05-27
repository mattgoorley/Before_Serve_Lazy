$(document).ready(function () {
    var myLikes;
    var sendLikes = []
    var latitude;
    var longitude;
    // Finding location w/ Long and Lat
    // function initiate_geolocation() {
    //     navigator.geolocation.getCurrentPosition(handle_geolocation_query);

    // };

    // function handle_geolocation_query(position){
    //     latitude = position.coords.latitude;
    //     longitude = position.coords.longitude;
    //     local = {"latitude": latitude, "longitude":longitude}
    //     $.ajax({
    //       method: "POST",
    //       url:'/onload',
    //       data: local,
    //       datatype: "jsonp",
    //       success: function(response){
    //         console.log(response)
    //       }
    //     })
    // };


    // initiate_geolocation()

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
              $('.home').show()
              $('.myfoodstorage').show()
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
    });

    var getLikes = function(){

        $.ajax({
            method:'GET',
            url:'/liked',
            datatype:'jsonp',
            success:function(response){
                console.log(response)
                myLikes = response["likes_name"]
            }
        })
    }
    getLikes()

    $('.myfoodstorage').on('click','.remove',function(event){
    event.preventDefault()
    var classes = this.getAttribute('class')
    var ids = classes.split(' ')
    var removeFood = ids[1]
    console.log(removeFood)
    var removeFoodClass = '.' + removeFood
    $(removeFoodClass).remove()
    $.ajax({
        method: "DELETE",
        url: '/liked',
        data: {'dishId':removeFood},
        datatype:'jsonp',
        success: function(response){
            console.log("food removed" + removeFood)
        }
    })

  })

    // Selecting Food Button
    $('.btn-food').on('click', function(event){
        event.preventDefault();
        location.href="/food";
    })


    // Selecting Movie Button

});
