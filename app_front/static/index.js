$(document).ready(function () {

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
    });

    // Selecting Food Button
    $('.btn-food').on('click', function(event){
        event.preventDefault();
        location.href="/food";
    })

    // Selecting Movie Button

});
