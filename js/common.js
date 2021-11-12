
var sheetAPIBaseURL = "https://sheets.googleapis.com/v4/spreadsheets"
var ExcelfileID = "1QvHgvjouMiFIMZJoAdVPo6NHhLRQJlG_0mmn3B7Zc3E";
var apiKey = "AIzaSyAmElMC6fNzymbUfgLF9_3r0GbIqwHjGyE";

/*Read categories*/
var categorySheetName = "Categories";
var categoryFromRange = "A1";
var categoryToRange = "A22";

var readCategoryURL = sheetAPIBaseURL + "/" + ExcelfileID + "/values/" + categorySheetName + "!" + categoryFromRange + ":" + categoryToRange + "?key=" + apiKey;
/*Read categories ends*/

/*Read products*/
var productSheetName = "Products";
var productFromRange = "A1";
var productToRange = "F500";
var readProductURL = sheetAPIBaseURL + "/" + ExcelfileID + "/values/" + productSheetName + "!" + productFromRange + ":" + productToRange + "?key=" + apiKey;
/*Read products ends*/

/*Read products*/
var productVariantsSheetName = "ProductVariants";
var productVariantsFromRange = "A1";
var productVariantsToRange = "F2001";
var readProductVariantsURL = sheetAPIBaseURL + "/" + ExcelfileID + "/values/" + productVariantsSheetName + "!" + productVariantsFromRange + ":" + productVariantsToRange + "?key=" + apiKey;
/*Read products ends*/

/*Read Header Text Carousel*/

var headerTextCarouselSheetName = "HeaderTextCarousel";
var headerTextCarouselFromRange = "A1";
var headerTextCarouselToRange = "C20";
var readHeaderTextCarouselURL = sheetAPIBaseURL + "/" + ExcelfileID + "/values/" + headerTextCarouselSheetName + "!" + headerTextCarouselFromRange + ":" + headerTextCarouselToRange + "?key=" + apiKey;

/*Read Header Text Carousel ends*/

var categoryResult = null;
var productResult = null;
var productVariantsResult = null;
var headerTextCarouselResult = null;

/*Function to fetch product categories*/
function getCategoriesAjax() {

    $.ajax({
        type: "GET",
        url: readCategoryURL,
        cache: false,
        async: false,
        dataType: "json",
        success: function (data) {
            categoryResult = data.values.slice(1); //removed first row. it contains column title
            localStorage.setItem("categoryResult", JSON.stringify(categoryResult));
        }
    });
}

/*Function to fetch products*/
function getProductsAjax() {
    $.ajax({
        type: "GET",
        url: readProductURL,
        cache: false,
        async: false,
        dataType: "json",
        success: function (data) {
            productResult = data.values.slice(1); //removed first row. it contains column title
            localStorage.setItem("productResult", JSON.stringify(productResult));
        }
    });

}

/*Function to fetch product details*/
function getProductVariantsAjax() {
    $.ajax({
        type: "GET",
        url: readProductVariantsURL,
        cache: false,
		async: false,			 
        dataType: "json",
        success: function (data) {
            productVariantsResult = data.values.slice(1); //removed first row. it contains column title
            localStorage.setItem("productVariantsResult", JSON.stringify(productVariantsResult));
            loadProductDetails();

        }
    });
}

/*Function to fetch product details*/
function getHeaderTextCarouselAjax() {
    console.log("fetching online carouself text");
    $.ajax({
        type: "GET",
        url: readHeaderTextCarouselURL,
        cache: false,
        async: false,
        dataType: "json",
        success: function (data) {
            headerTextCarouselResult = data.values.slice(1); //removed first row. it contains column title
            sessionStorage.setItem("headerTextCarouselResult", JSON.stringify(headerTextCarouselResult));
        }
    });
}
/*Load categories for main menu*/
function loadMenuCategories(categories) {

    /* main menu contains two columns so total product list length is devided by two and shown in two columns*/

    var catPart1 = '<li><a href="javascript:" onclick="navigateToProducts(\'All\')" >All Categories</a></li>';
    var catPart2 = '';
    var partition = Math.round((categories.length / 2));

    for (var i = 0; i < partition; i++) {
        catPart1 += '<li><a href="javascript:" onclick="navigateToProducts(\'' + categories[i] + '\')"> ' + categories[i] + '</a ></li >';
    }
    for (var j = partition; j < categories.length; j++) {
        catPart2 += '<li><a href="javascript:" onclick="navigateToProducts(\'' + categories[j] + '\')"> ' + categories[j] + '</a ></li >';
    }
    $('#catPart1').html(catPart1);
    $('#catPart2').html(catPart2);
}

/* categories show in global search dropdown*/
function loadSearchCategories(categories) {

    var ddlOptions = '<option value=\'All\'>All Categories</option>';
    for (var i = 0; i < categories.length; i++) {
        ddlOptions += '<option value=\'' + categories[i] + '\'>' + categories[i] + '</option>';
    }
    $('#searchCat').html(ddlOptions);
}

/* Load categories for mobile view main menu (responsive menu) */
function loadMobileViewMenuCat(categories) {
    var mobileViewMenuCat = '<li><a href="javascript:" onclick="navigateToProducts(\'All\')" >All Categories</a></li>';
    for (var i = 0; i < categories.length; i++) {
        var encodedURL = encodeURIComponent(categories[i]);
        mobileViewMenuCat += '<li><a href="javascript:" onclick="navigateToProducts(\'' + categories[i] + '\')">' + categories[i] + '</a></li>';
        $('#mobileViewMenuCat').html(mobileViewMenuCat);
    }
}

/* Shows user agent details at bottom right corner*/
function getUserAgent() {
    var txt = navigator.userAgent;
    txt += "<br>Resolution: " + Math.round(window.screen.width) + "x" + Math.round(window.screen.height);
    txt += "<br>Browser Online: " + navigator.onLine;
    $('#userAgent').html(txt);
}
/* updates the count of cart to show on cart icon at top header */
function updateCartCount() {
    if (localStorage.getItem("cart") != null && localStorage.getItem("cart") != "") {
        var cartObj = JSON.parse(localStorage.getItem("cart"));
        $('#cartItemCount').html(cartObj.length);
    }
    else {
        $('#cartItemCount').html('0');
    }
}

/* to navigate to products page on click of categories from menu  */
function navigateToProducts(Category) {
    sessionStorage.setItem("selectedCategory", Category);
    window.location.href = "products.html";
}

function getMonthFromString(mon){
    return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1;
 }
// A $( document ).ready() block.
$(document).ready(function () {
    console.log("document ready main EVENT -> fetching online carouself text");
    if (headerTextCarouselResult == null) {
        getHeaderTextCarouselAjax();
    }
    headerTextCarouselResult = JSON.parse(sessionStorage.getItem("headerTextCarouselResult"))

    var headerTextCarouselBlock = '';

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + '-' + mm + '-' + yyyy;

    $(headerTextCarouselResult).each(function (index, obj) {

        var dateFrom = obj[1];
        var dateTo = obj[2];
        var dateCheck = today;

        var d1 = dateFrom.split("-");
        var d2 = dateTo.split("-");
        var c = dateCheck.split("-");
        var monthINT1 = getMonthFromString(d1[1]);
        var monthINT2 = getMonthFromString(d2[1]);
        var from = new Date(d1[2], parseInt(monthINT1) - 1, d1[0]);  // -1 because months are from 0 to 11
        var to = new Date(d2[2], parseInt(monthINT2) - 1, d2[0]);
        var check = new Date(c[2], parseInt(c[1]) - 1, c[0]);
         
        if (check >= from && check <= to) {
            //console.log("got match - show msg " + obj[0]);
            headerTextCarouselBlock += '<div class="top-notice bg-dark text-white"> <div class="container text-center"> <h5 class="d-inline-block mb-0 mr-2">' + obj[0] + ' </h5> </div>  </div>';
        }
    });

    $('#headerTextCarousel').html(headerTextCarouselBlock);
});

 