
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
var productToRange = "E22";
var readProductURL = sheetAPIBaseURL + "/" + ExcelfileID + "/values/" + productSheetName + "!" + productFromRange + ":" + productToRange + "?key=" + apiKey;
/*Read products ends*/

/*Read products*/
var productVariantsSheetName = "ProductVariants";
var productVariantsFromRange = "A1";
var productVariantsToRange = "F100";
var readProductVariantsURL = sheetAPIBaseURL + "/" + ExcelfileID + "/values/" + productVariantsSheetName + "!" + productVariantsFromRange + ":" + productVariantsToRange + "?key=" + apiKey;
/*Read products ends*/


var categoryResult = null;
var productResult = null;
var productVariantsResult = null;

$(document).ready(function () {

    categoryResult = JSON.parse(localStorage.getItem("categoryResult"));
    productResult = JSON.parse(localStorage.getItem("productResult"));

    if (categoryResult == null || categoryResult == '') {
        getCategoriesAjax();
    }
    else {
        loadMenuCategories(categoryResult);
        loadSearchCategories(categoryResult);
        loadMobileViewMenuCat(categoryResult);
    }
    if (productResult == null || productResult == '') {
        getProductsAjax();
    }
    if (productVariantsResult == null || productVariantsResult == '') {
        getProductVariantsAjax();
    }
    else {
        loadReviewCart();
    }
    updateCartCount();
});

function getCategoriesAjax() {

    $.ajax({
        type: "GET",
        url: readCategoryURL,
        cache: false,
        dataType: "json",
        success: function (data) {
            categoryResult = data.values.slice(1); //removed first row. it contains column title
            localStorage.setItem("categoryResult", JSON.stringify(categoryResult));
            loadMenuCategories(categoryResult);
            loadSearchCategories(categoryResult);

            loadMobileViewMenuCat(categoryResult);
        }
    });
}
function getProductsAjax() {

    $.ajax({
        type: "GET",
        url: readProductURL,
        cache: false,
        dataType: "json",
        success: function (data) {
            productResult = data.values.slice(1); //removed first row. it contains column title
            localStorage.setItem("productResult", JSON.stringify(productResult));


        }
    });

}
function getProductVariantsAjax() {
    $.ajax({
        type: "GET",
        url: readProductVariantsURL,
        cache: false,
        dataType: "json",
        success: function (data) {
            productVariantsResult = data.values.slice(1); //removed first row. it contains column title
            localStorage.setItem("productVariantsResult", JSON.stringify(productVariantsResult));
            loadReviewCart();
        }
    });

}

function loadMenuCategories(categories) {
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
function loadSearchCategories(categories) {
    var ddlOptions = "<option value=''>All Categories</option>";
    for (var i = 0; i < categories.length; i++) {
        ddlOptions += "<option value=''>" + categories[i] + "</option>";
    }
    $('#searchCat').html(ddlOptions);
}
function loadMobileViewMenuCat(categories) {
    var mobileViewMenuCat = '<li><a href="javascript:" onclick="navigateToProducts(\'All\')" >All Categories</a></li>';
    for (var i = 0; i < categories.length; i++) {
        var encodedURL = encodeURIComponent(categories[i]);
        mobileViewMenuCat += '<li><a href="javascript:" onclick="navigateToProducts(\'' + categories[i] + '\')">' + categories[i] + '</a></li>';
        $('#mobileViewMenuCat').html(mobileViewMenuCat);
    }
}
function loadReviewCart() {
    var cartObj = [];

    if (localStorage.getItem("cart") != null && localStorage.getItem("cart") != '' && localStorage.getItem("cart") != "[]") {
        cartObj = JSON.parse(localStorage.getItem("cart"));

        var cartItemBlock = '';
        for (var i = 0; i < cartObj.length; i++) {

            var product = productResult.filter(function (obj) {
                return (obj[1] == cartObj[i].ProductID);
            });
            cartItemBlock += '<tr><td class="product-col"><figure class="product-image-container"><a href="javascript:" class="product-image"> <img id="reviewProductImage" src="ProductImages/' + product[0][3] + '" alt="product"> <input type="hidden" id="reviewProductID" /> </a> </figure> <div class="widget widget-categories"> <h4 class="widget-title">' + product[0][2] + '</h4> <ul class="list">@@VariantOptions</div> </td>  <td><div style="vertical-align:bottom; padding: 20px 0px 20px 0px;"><button onclick="editCart(\'' + product[0][1] + '\')" class="btn btn-xs-edit btn-info" type="button"><i class="fa fa-edit"></i></button></div><div style="vertical-align:bottom"> <button data-rowindex="' + cartObj[i].CartRowIndex + '" class="btn btn-xs-delete btn-danger" type="button"><i class="fa fa-trash"></i></button></div></td></tr>';
            var variantList = $.map(cartObj[i].cartItemVariant, function (value, key) {
                return [[key, value]];
            });

            var variantBlock = '<li><a href="javascript:">Quantity : <span class="">' + cartObj[i].Quantity + '</span></a></li>';
            for (var j = 0; j < variantList.length; j++) {

                var currentVariant = productVariantsResult.filter(function (obj) {
                    return (obj[2] == variantList[j][1] && obj[0] == cartObj[i].ProductID);
                });

                if (variantList[j][0] == "Color") {

                    variantBlock += '<li><a href="javascript:">Color:  <span class="">' + currentVariant[0][4] + '</span> | <div style="background-color: ' + variantList[j][1] + '; height: 20px; width: 20px; display: inline-block; margin-bottom: -5px;"></div></a> </li>';
                }
                else {
                    variantBlock += '<li><a href="javascript:">' + variantList[j][0] + ': <span class="">' + currentVariant[0][4] + '</span></a></li>';
                }
            }
            variantBlock += '<li><a href="javascript:">Created Date: <span class="">' + cartObj[i].CreatedDate + '</span></a></li>';
            cartItemBlock = cartItemBlock.replace("@@VariantOptions", variantBlock);
        }

        $('#reviewCart').html(cartItemBlock);
    }
    else {
        $('#reviewCart').html('<tr><td  colspan="3">No Items..</td></tr>');
    }

}
function clearCart() {
    localStorage.setItem("cart", '');
    $('#reviewCart').html('<tr><td  colspan="3">No Items..</td></tr>');
    updateCartCount();
    $("#msg-container").removeClass('hide');
    $("#msg").html('Cart cleared...')
    window.setInterval(function () {
        var timeLeft = $("#timeLeft").html();
        if (eval(timeLeft) == 0) {
            window.location.href = "products.html";
        } else {
            $("#timeLeft").html(eval(timeLeft) - eval(1));
        }
    }, 1000);
}
function getUserAgent() {
    var txt = navigator.userAgent;
    txt += "<br>Resolution: " + Math.round(window.screen.width) + "x" + Math.round(window.screen.height);
    txt += "<br>Browser Online: " + navigator.onLine;
    $('#userAgent').html(txt);
}
function updateCartCount() {
    if (localStorage.getItem("cart") != null && localStorage.getItem("cart") != "") {
        var cartObj = JSON.parse(localStorage.getItem("cart"));
        $('#cartItemCount').html(cartObj.length);
    }
    else {
        $('#cartItemCount').html('0');
    }
}

function navigateToProducts(Category) {
    sessionStorage.setItem("selectedCategory", Category);
    window.location.href = "products.html";
}
function submitOrder() {

    $("#msg-container").removeClass('hide');
    $("#msg").html('Submitted successfully...')
    window.setInterval(function () {
        var timeLeft = $("#timeLeft").html();
        if (eval(timeLeft) == 0) {
            window.location.href = "products.html";
        } else {
            $("#timeLeft").html(eval(timeLeft) - eval(1));
        }
    }, 1000);
}
function editCart(ProductID) {
    sessionStorage.setItem('cartProductToEdit', ProductID);
    window.location.href = "productdetails.html"
}

$(document).on('click', '.btn-xs-delete', function () {
    $('#hdnValueToDelete').val($(this).attr('data-rowindex'))
    $('#confirmDelete').modal('show');
});

function deleteCartRow() {
    var cartRowIndex = $('#hdnValueToDelete').val();
    var cartObj = JSON.parse(localStorage.getItem("cart"));
    cartObj = cartObj.filter(function (obj) {
        return obj.CartRowIndex != cartRowIndex;
    });
    localStorage.setItem("cart", JSON.stringify(cartObj));
    loadReviewCart();
    updateCartCount();
    $('#confirmDelete').modal('hide');
}