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

var variantCollection = [];

$(document).ready(function () {
    //fetch categories and products from local storage
    categoryResult = JSON.parse(localStorage.getItem("categoryResult"));
    productResult = JSON.parse(localStorage.getItem("productResult"));
    productVariantsResult = JSON.parse(localStorage.getItem("productVariantsResult"));

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
    } else {
        loadProductDetails();

        $('#colorFilterOptions li').on('click', function (event) {
            $('#colorFilterOptions li').not(this).removeClass('active');
            $(this).addClass('active');
        });

        $('input').iCheck({
            checkboxClass: 'icheckbox_flat-blue',
            radioClass: 'iradio_flat'
        });
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
            loadProductDetails();

            $('#colorFilterOptions li').on('click', function (event) {
                $('#colorFilterOptions li').not(this).removeClass('active');
                $(this).addClass('active');
            });

            $('input').iCheck({
                checkboxClass: 'icheckbox_flat-blue',
                radioClass: 'iradio_flat'
            });
        }
    });
}
function loadMenuCategories(categories) {
    var catPart1 = "<li><a href='products.html'>All Categories</a></li>";
    var catPart2 = '';
    var partition = Math.round((categories.length / 2));

    for (var i = 0; i < partition; i++) {
        var encodedURL = encodeURIComponent(categories[i]);
        catPart1 += "<li><a href='products.html?category=" + encodedURL + "'>" + categories[i] + "</a></li>";
    }
    for (var j = partition; j < categories.length; j++) {
        var encodedURL = encodeURIComponent(categories[j]);
        catPart2 += "<li><a href='products.html?category=" + encodedURL + "'>" + categories[j] + "</a></li>";
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
    var mobileViewMenuCat = '';
    for (var i = 0; i < categories.length; i++) {
        var encodedURL = encodeURIComponent(categories[i]);
        mobileViewMenuCat += "<li><a href='products.html?category=" + encodedURL + "'>" + categories[i] + "</a></li>";
        $('#mobileViewMenuCat').html(mobileViewMenuCat);
    }
}
function loadProductDetails() {

    var productID = localStorage.getItem("selectedProductID");

    if (productID != null) {
        $('#hdnProductID').val(productID);

        var product = productResult.filter(function (obj) {
            return (obj[1] === productID)
        });

        var productDetails = productVariantsResult.filter(function (obj) {
            return (obj[0] === productID)
        });
         
        $('#productDetailImage').attr('src', 'ProductImages/' + product[0][3]);
        $('#productDetailProductName').html(product[0][2]);
        $('#productDetailProductDescription').html(product[0][4]);

        var colorBlock = '';

        var variantsArray = [];

        for (var i = 0; i < productDetails.length; i++) {
            var isUniqueVariant = true;
            for (var j = 0; j < variantCollection.length; j++) {
                if (productDetails[i][3] == variantCollection[j]) {
                    isUniqueVariant = false;
                    break;
                }
            }
            if (isUniqueVariant == true) {
                variantCollection.push(productDetails[i][3]);
            }
        }

        var productDetailTitleBlock = '';
        variantCollection.filter(function (obj) {
            var productDetailVariantBlock = '';

            if (obj != "Color") {
                if (productDetailTitleBlock == '') {
                    productDetailTitleBlock = '<div class="product-single-filter"> <div class="col-xs-6 col-sm-12 col-md-3"> <label>' + obj + ': </label> </div><div class="col-xs-6 col-sm-6 col-md-9"> <div class="row">@@VariantOptions</div></div></div>';
                }

                productDetails.filter(function (obj2) {
                    if (obj == obj2[3]) {
                        productDetailVariantBlock += '<div class="col-md-4 col-sm-6 col-xs-6 pt-3"> <input type="radio" name="' + obj + '" id="' + obj2[3] + '_' + obj2[2] + '" value="' + obj2[2] + '"> <label style="margin-left: 5px;" for="' + obj2[3] + '_' + obj2[2] + '">' + obj2[4] + '</label></div>';
                    }
                });
                productDetailTitleBlock = productDetailTitleBlock.replace("@@VariantOptions", productDetailVariantBlock);
                variantsArray.push(productDetailTitleBlock);
                productDetailTitleBlock = '';

            }
        });
        var divider = '<hr class="divider">';
        $('#otherVariants').html(variantsArray.join(divider));

        productDetails.filter(function (obj) {
            if (obj[3] == "Color") {
                colorBlock += '<li data-val="' + obj[2] + '"><div style="padding:2px;"><a href="javascript:" title="' + obj[4] + '" style="background-color:' + obj[2] + '"></a></div></li>';
            }
        });

        if (colorBlock != '') {
            $('#colorFilterOptions').html(colorBlock);
        }
        else {
            $('#colorFilterDivider').hide();
            $('#colorFilter').hide();
        }


    }
}

function addToCart(finalize) {
    var isValid = true;
    var cartObj = [];
    var cartItem = {};



    cartItem["ProductID"] = $('#hdnProductID').val();
    if ($('#txtQty').val() == null || $('#txtQty').val() == '') {
        isValid = false;
    }
    else {
        cartItem["Quantity"] = $('#txtQty').val();
    }

    variantCollection.filter(function (obj) {
        if (obj == "Color") {
            if ($('#colorFilterOptions .active').attr('data-val') != null) {
                cartItem[obj] = $('#colorFilterOptions .active').attr('data-val');
            }
        }
        else if (obj != "Color") {
            if ($("input[name='" + obj + "']:checked").val() != null) {
                cartItem[obj] = $("input[name='" + obj + "']:checked").val();
            }
        }
    });
    cartObj.push(cartItem);

    variantCollection.filter(function (obj) {
        if (cartObj[0][obj] == null) {
            isValid = false;
        }
    });

    if (isValid) {

        if (localStorage.getItem("cart") != null && localStorage.getItem("cart") != '') {
            //existing cart
            cartObj = cartObj.concat(JSON.parse(localStorage.getItem("cart")));
        }

        localStorage.setItem("cart", JSON.stringify(cartObj));

        if (finalize == 'true') {
            window.location.href = "review.html"
        }
        $('#validationMsg').removeClass('alert alert-danger');
        $('#validationMsg').addClass('alert alert-success');
        $('#validationMsg').html('Item added..')
        $('#validationMsg').fadeIn('fast').delay(2000);
        $('#validationMsg').fadeOut('slow').delay(3000).hide(0);
    }
    else {
        $('#validationMsg').removeClass('alert alert-success');
        $('#validationMsg').addClass('alert alert-danger');
        $('#validationMsg').html('Select all options..')
        $('#validationMsg').fadeIn('fast').delay(2000);
        $('#validationMsg').fadeOut('slow').delay(3000).hide(0);
    }
	updateCartCount();
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