$(document).ready(function(){
  console.log("Welcome to the Movie.js")
  var __cache = {}
  var counter = 1000
  var swiped = 0

  var getUser = function() {
    $.ajax({
      method: "GET",
      url:'/onload',
      dataType: "json",
      success: function(response){
        __cache["userId"] = response['id']
      }
    })

  }
  getUser()

  var getMovies = function() {
    $.ajax({
      method:'GET',
      url:'/getmovies',
      datatype: "jsonp",
      success: function(response) {
        len = response['movies'].length
        for(var i=0; i < len; i++) {
          var movie = response['movies'][i]
          var title = movie['title']
          var rating = movie['vote_average']
          var overview = movie['overview']
          var poster = "http://image.tmdb.org/t/p/w92" + movie['poster_path']
          var released = movie['released']
          var template = $('#movie_slides').html();
          var display = {"title":title,"rating":rating,"overview":overview,"poster":poster,"released":released,"counter":counter}
          Mustache.parse(template, ["<%","%>"])
          $(".content").append(Mustache.render(template, display))
          counter --
        }
      }
    })
  }
  getMovies()

  $('.dislikebutton').on('click',function(event){
    $('.content').children(':first').remove()
    if(swiped % 20 === 0){
      getMovies()
    }
    swiped ++
  })

  myMovie = []
  $('.likebutton').on('click',function(event){
    event.preventDefault()
    var slide = $('.content').children(':first')
    console.log(slide)
    var user = __cache["userId"]
    var title = slide.children('.title').text()
    console.log(title)
    var rating = slide.children('.rating').text()
    var overview = slide.children('.description').text()
    var poster = slide.children('.imageDiv').children('.foodImage').prop("src")
    var released = slide.children('.released').text()
    saveMovie = {'userId':user, "title":title, 'rating':rating, 'overview':overview, "poster":poster, 'released':released}
    $('.content').children(':first').remove()

    if(swiped % 20 === 0){
      getMovies()
    }
    swiped ++
    console.log(saveMovie)
    $.ajax({
      method:'POST',
      url:'/likedmovie',
      data:saveMovie,
      datatype:'jsonp',
      success:function(){
        console.log('success')
        myMovie.push(saveMovie)
      }
    })
  })

  var template = $('#myMovie').html();
  Mustache.parse(template, ["<%","%>"]);
  var check = $('.mymoviestorage').length

  var length = myMovie.length
  if(check!=0){
    for(i=0;i<length;i++) {
      var display = myMovieLikes[i]
      $('.mymoviestorage').append(Mustache.render(template,display));
    }

    myMovie = []
    $('.mymoviestorage').show()
  }
  else{
    var myMovieStorage = $('<div>',{class:"mymoviestorage"})
    $('.content').append(myMovieStorage)
  }



})
