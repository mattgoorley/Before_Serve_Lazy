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

        // filling in the movie likes template
        var template = $('#myMovie').html();
        Mustache.parse(template, ["<%","%>"]);
        var check = $('.mymoviestorage').length
        console.log(check)
        var length = myMovieLikes.length
        if(check!=0){
          for(i=0;i<length;i++) {
            var display = myMovieLikes[i]
            $('.mymoviestorage').append(Mustache.render(template,display));
          }

          myMovieLikes = []
          $('.mymoviestorage').show()
        }
        else{
            var myMovieStorage = $('<div>',{class:"mymoviestorage"})
            $('.content').append(myFoodStorage)
        }

    });

    // Getting the movie and food likes from the database
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
        console.log("problem here")
        var title = this.getAttribute('.title')
        var released = this.getAttribute('.released')
        $(this).remove()
        $.ajax({
            method: "DELETE",
            url: '/likedmovie',
            data: {'title':title,'released':released},
            datatype:'jsonp',
            success: function(response){
                console.log(response)
            }
        })
    })

});
