var variantCollection = [];
var slideIndex = 1;
var productImageBasePath = window.location.protocol + "//" + window.location.hostname;

$(document).ready(function () {

    /* fetches categories and products from local storage,
    if doesnt found, makes an ajax call and then loads Menu and products.*/

    categoryResult = JSON.parse(localStorage.getItem("categoryResult"));
    productResult = JSON.parse(localStorage.getItem("productResult"));

    if (categoryResult == null || categoryResult == '') {
        getCategoriesAjax();
        categoryResult = JSON.parse(localStorage.getItem("categoryResult"));
    }
    if (productResult == null || productResult == '') {
        getProductsAjax();
        productResult = JSON.parse(localStorage.getItem("productResult"));
    }

    loadProductGallery();

});

function loadProductGallery() {

    var productID = sessionStorage.getItem("productGalleryProductID");
    var product = productResult.filter(function (obj) {
        return (obj[1] === productID)
    });

    var productImageBlock = '';
    var productThumbnailBlock = '';

    for (var i = 1; i < 11; i++) {

        var url = productImageBasePath + '/ProductImages/' + product[0][3] + '/' + i + '.jpg';

        if (urlExists(url) == 200) {
            productImageBlock += '<div class="mySlides"><img src="ProductImages/' + product[0][3] + '/' + i + '.jpg" class="img-aspect img-thumbnail" style="width:100%"></div>';
            productThumbnailBlock += '<div class="column"><img class="demo cursor" src="ProductImages/' + product[0][3] + '/' + i + '.jpg" style="width:100%" onclick="currentSlide(' + i + ')"></div>';
        }
        else {
            break;
        }

    }
    $('#slider-img-list').html(productImageBlock);
    $('#thumbnail-list').html(productThumbnailBlock);

    showSlides(slideIndex);
}

function urlExists(testUrl) {
    var http = jQuery.ajax({
        type: "HEAD",
        url: testUrl,
        async: false
    })
    return http.status;
}


function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("demo");
    // var captionText = document.getElementById("caption");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
    //captionText.innerHTML = dots[slideIndex - 1].alt;
}

jquerySwipeHandler.handleSwipe("#slider-img-list", [
    jquerySwipeHandler.SWIPE_LEFT,
], function (direction) {
    plusSlides(1)
    //console.log("swipe: ", direction);
});
jquerySwipeHandler.handleSwipe("#slider-img-list", [
    jquerySwipeHandler.SWIPE_RIGHT,
], function (direction) {
    plusSlides(-1)
    //console.log("swipe: ", direction);
});