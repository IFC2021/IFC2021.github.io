
var mailObj = mailUtil();
//------------------------------------------------------------------------
$(document).ready(function () {

    /* fetches categories, products and product details from local storage,
  if doesnt found, makes an ajax call and then loads Menu and product details.*/

    categoryResult = JSON.parse(localStorage.getItem("categoryResult"));
    productResult = JSON.parse(localStorage.getItem("productResult"));
    productVariantsResult = JSON.parse(localStorage.getItem("productVariantsResult"));

    if (categoryResult == null || categoryResult == '') {
        getCategoriesAjax();
        categoryResult = JSON.parse(localStorage.getItem("categoryResult"));
        loadMenuCategories(categoryResult);
        loadSearchCategories(categoryResult);
        loadMobileViewMenuCat(categoryResult);
    }
    else {
        loadMenuCategories(categoryResult);
        loadSearchCategories(categoryResult);
        loadMobileViewMenuCat(categoryResult);
    }
    if (productResult == null || productResult == '') {
        getProductsAjax();
        productResult = JSON.parse(localStorage.getItem("productResult"));
    }
    else {
        productResult = JSON.parse(localStorage.getItem("productResult"));
    }
    if (productVariantsResult == null || productVariantsResult == '') {
        getProductVariantsAjax();
        productVariantsResult = JSON.parse(localStorage.getItem("productVariantsResult"));
    }
    else {
        loadReviewCart();
    }
    updateCartCount();
    
    mailObj.Initialize();
});
//------------------------------------------------------------------------
/*function to load review cart */
function loadReviewCart() {
    var cartObj = [];

    if (sessionStorage.getItem("showPreviousCart") == "1") {
        //checks if call is to show previous cart, then assign previous cart object to cartObj
        if (localStorage.getItem("previousCart") != null && localStorage.getItem("previousCart") != '' && localStorage.getItem("previousCart") != "[]") {
            cartObj = JSON.parse(localStorage.getItem("previousCart"))[0].Cart; // Order json will contain only one row, so [0]th position.
            $('#txtOrderComments').val(JSON.parse(localStorage.getItem("previousCart"))[0].OrderComment);
            $('#txtOrderComments').attr('disabled', 'disabled');

            $('#btnClearPreviousCart').removeClass('hide');
            $('#btnClearCurrentCart').addClass('hide');
            $('#btnSubmitOrder').addClass('hide');
        }
        else {
            $('#btnClearPreviousCart').addClass('hide');
        }

    }
    else {
        //else shows current cart
        if (localStorage.getItem("cart") != null && localStorage.getItem("cart") != '' && localStorage.getItem("cart") != "[]") {
            cartObj = JSON.parse(localStorage.getItem("cart"));
            $('#btnClearPreviousCart').addClass('hide');
            $('#btnClearCurrentCart').removeClass('hide');
            $('#btnSubmitOrder').removeClass('hide');
        }
        else {
            $('#btnClearCurrentCart').addClass('hide');
        }
        if (localStorage.getItem("previousCart") == null || localStorage.getItem("previousCart") == '' || localStorage.getItem("previousCart") == "[]") {
            $('#btnShowPreviousCart').addClass('hide');
            $('#btnShowCurrentCart').addClass('hide');
        }
    }
    if (cartObj.length > 0) {

        var cartItemBlock = '';
        for (var i = 0; i < cartObj.length; i++) {
            //Loop thru cart object for each product and prepares the row for each products

            var product = productResult.filter(function (obj) {
                return (obj[1] == cartObj[i].ProductID);
            });
            //creates the row with product info.
            cartItemBlock += '<tr><td class="product-col"><figure class="product-image-container"><a href="javascript:" class="product-image"> <img id="reviewProductImage" src="ProductImages/' + product[0][3] + '/1.jpg' + '" alt="product"> <input type="hidden" id="reviewProductID" /> </a> </figure> <div class="widget widget-categories"> <h4 class="widget-title">' + product[0][2] + '</h4> <ul class="list">@@VariantOptions</div> </td>  <td><div style="vertical-align:bottom; padding: 20px 0px 20px 0px;"><button onclick="editCart(\'' + product[0][1] + '\')" class="btn btn-xs-edit btn-info" type="button"><i class="fa fa-edit"></i></button></div><div style="vertical-align:bottom"> <button data-rowindex="' + cartObj[i].CartRowIndex + '" class="btn btn-xs-delete btn-danger" type="button"><i class="fa fa-trash"></i></button></div></td></tr>';

            //find the selected variants from cartItemVariants
            var variantList = $.map(cartObj[i].cartItemVariant, function (value, key) {
                return [[key, value]];
            });

            //prepares the <li> list for each variants
            var variantBlock = '<li><a href="javascript:">Quantity : <span class="">' + cartObj[i].Quantity + '</span></a></li>';

            for (var j = 0; j < variantList.length; j++) {
                //loop thru each selected variant and finds all the details of that selected variant.
                var currentVariant = productVariantsResult.filter(function (obj) {
                    return (obj[2] == variantList[j][1] && obj[0] == cartObj[i].ProductID);
                });

                if (variantList[j][0] == "Color") {
                    if (currentVariant[0][4].toLowerCase().indexOf('x') == -1) {
                        variantBlock += '<li><a href="javascript:">Color:  <span class="">' + currentVariant[0][4] + '</span> | <div style="background-color: ' + variantList[j][1] + '; height: 20px; width: 20px; display: inline-block; margin-bottom: -5px; border:solid 1px black"></div></a> </li>';
                    }
                    else {
                        variantBlock += '<li><a href="javascript:">Color:  <span class="">' + currentVariant[0][4] + '</span></li>';
                    }
                }
                else {
                    variantBlock += '<li><a href="javascript:">' + variantList[j][0] + ': <span class="">' + currentVariant[0][4] + '</span></a></li>';
                }
            }
            variantBlock += '<li><a href="javascript:">Created Date: <span class="">' + cartObj[i].CreatedDate + '</span></a></li>';
            if (cartObj[i].ProductComment != '') {
                variantBlock += '<li><a href="javascript:">Comments: <span class="">' + cartObj[i].ProductComment + '</span></a></li>';
            }

            /*Completes the <tr> by replacing @@VariantOptions with prepared <li> list of variants*/
            cartItemBlock = cartItemBlock.replace("@@VariantOptions", variantBlock);
        }
        //loads the all prepared html
        $('#reviewCart').html(cartItemBlock);

    }
    else {
        if (sessionStorage.getItem("showPreviousCart") == "1") {
            $('#reviewCart').html('<tr><td  colspan="3">No Previous Cart..</td></tr>');
        }
        else {
            $('#reviewCart').html('<tr><td  colspan="3">No Items..</td></tr>');
        }
        $('#btnSubmitOrder').addClass('hide');
        $('#divComments').addClass('hide');
    }
    if (sessionStorage.getItem("showPreviousCart") == "1") {
        //if previous cart is loaded. all unwanted buttons are hidden.
        $('.btn-xs-delete').hide();
        $('.btn-xs-edit').hide();
        $('#activeBreadCrumb').text('Previous Cart');
        $('#btnShowCurrentCart').removeClass('hide');
        $('#btnShowPreviousCart').addClass('hide');

        sessionStorage.setItem("showPreviousCart", "");
    }

}
//------------------------------------------------------------------------
/*Section - clear cart*/
function confirmClearCart(cartType) {
    $('#hdnCartTypeToDelete').val(cartType);
    $('#confirmClearCart').modal('show');
}
//------------------------------------------------------------------------
function clearCart() {
    $('#confirmClearCart').modal('hide');
    if ($('#hdnCartTypeToDelete').val() == 'current-cart') {
        localStorage.setItem("cart", '');
    }
    else if ($('#hdnCartTypeToDelete').val() == 'previous-cart') {
        localStorage.setItem("previousCart", '');
    }

    $('#btnSubmitOrder').addClass('disabled');
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
/*Section - Clear cart*/
//------------------------------------------------------------------------
function successEventPostAPI(event){
    console.log('Success from sendmail API. ');
}
function failureEventPostAPI(err){
    console.log('Error from sendmail API! ', err);
}
//------------------------------------------------------------------------
/* submit web order*/
function submitWebOrder() {
    var Order = [];

    var OrderObj = {};

    // check if email ID is valid
    var frmEml = $('#txtOrderFromEmail').val().trim();
    if (validateEmail(frmEml)){
        console.log("valid Email: " + frmEml);
        OrderObj.OrderComment = $('#txtOrderComments').val().trim();
        OrderObj.Cart = JSON.parse(localStorage.getItem("cart"));
        Order.push(OrderObj);

        var cartString = getOrderString();
        //console.log("See " + cartString);
        //showAndroidToast('Order => ' + cartString);
        mailObj.SendMail(cartString, successEventPostAPI, failureEventPostAPI);
        /* moves current order to previous cart */					   
                                                
        localStorage.setItem("previousCart", JSON.stringify(Order));

        $("#msg-container").removeClass('hide');
        $("#msg").html('Submitted successfully...')
        window.setInterval(function () {
            var timeLeft = $("#timeLeft").html();
            if (eval(timeLeft) == 0) {
                /*clears current cart and redirects to products page*/
                localStorage.setItem("cart", '');
                window.location.href = "products.html";
            } else {
                $("#timeLeft").html(eval(timeLeft) - eval(1));
            }
        }, 1000);
    }else{
        console.log("Wrong Email: " + frmEml);
        alert("Fix email address first!");
        return;
    }
    
    
}
//------------------------------------------------------------------------
function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
//------------------------------------------------------------------------
/* submit order.*/
function submitOrder() {
    if(typeof Android !== "undefined" && Android !== null) {
        submitAndroidOrder();
    } else {
        submitWebOrder();
    }
}
//------------------------------------------------------------------------
/* submit Phone order.*/
function submitAndroidOrder() {
    var Order = [];
    var OrderObj = {};

    OrderObj.OrderComment = $('#txtOrderComments').val().trim();
    OrderObj.Cart = JSON.parse(localStorage.getItem("cart"));
    Order.push(OrderObj);

    var cartString = getOrderString();
    //console.log("See " + cartString);
	showAndroidToast('Order => ' + cartString);															
    /* moves current order to previous cart */					   
											   
    localStorage.setItem("previousCart", JSON.stringify(Order));

    $("#msg-container").removeClass('hide');
    $("#msg").html('Submitted successfully...')
    window.setInterval(function () {
        var timeLeft = $("#timeLeft").html();
        if (eval(timeLeft) == 0) {
            /*clears current cart and redirects to products page*/
            localStorage.setItem("cart", '');
            window.location.href = "products.html";
        } else {
            $("#timeLeft").html(eval(timeLeft) - eval(1));
        }
    }, 1000);
}
//------------------------------------------------------------------------
function editCart(ProductID) {
    /*set product id to storage and redirects to product details. value of cartProductToEdit is used in product detail page to decide of call is from edit cart*/
    sessionStorage.setItem('cartProductToEdit', ProductID);
    window.location.href = "productdetails.html"
}
//------------------------------------------------------------------------
/*Section - Delete item from cart*/
$(document).on('click', '.btn-xs-delete', function () {
    $('#hdnValueToDelete').val($(this).attr('data-rowindex'))
    $('#confirmDelete').modal('show');
});
//------------------------------------------------------------------------
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
/*Section ends - Delete item from cart*/
//------------------------------------------------------------------------
/*Show previous cart or current cart*/
function switchCart(showPreviousCart) {
    if (showPreviousCart) {
        sessionStorage.setItem("showPreviousCart", "1");
    }
    window.location.href = "review.html";
}
//------------------------------------------------------------------------
function getOrderString(){
   var cartObj = [];
   var sResponse="";
   if (localStorage.getItem("cart") != null && localStorage.getItem("cart") != '' && localStorage.getItem("cart") != "[]") {
    cartObj = JSON.parse(localStorage.getItem("cart"));
   }
   if (cartObj.length > 0) {
    var prevProduct="";
    var productComment="";
    var seperatorLine= ";*********************;";
    for (var i = 0; i < cartObj.length; i++) {
        //Loop thru cart object for each product and prepares the row for each products

        var product = productResult.filter(function (obj) {
            return (obj[1] == cartObj[i].ProductID);
        });
        var prodName = product[0][2];
        var variantList = $.map(cartObj[i].cartItemVariant, function (value, key) {
            return [[key, value]];
        });
        var sQTY = cartObj[i].Quantity;
        
        var attrVal="";
        for (var j = 0; j < variantList.length; j++) {
            var currentVariant = productVariantsResult.filter(function (obj) {
                return (obj[2] == variantList[j][1] && obj[0] == cartObj[i].ProductID);
            });  
            //attrVal += variantList[j][0].toUpperCase() + "= " + currentVariant[0][4] + ", "; // Attribute name and value
            attrVal += currentVariant[0][4] + ", ";// only Attribute value
        }
        var attrString = "[" + attrVal + "QTY#=" + sQTY +  "]";
        if (cartObj[i].ProductComment.trim().length>0)
            {productComment="Prd-notes: _" +cartObj[i].ProductComment +"_"}
            else{productComment=""};

        if (prevProduct===cartObj[i].ProductID){
            // same product
            sResponse=sResponse.replace(productComment,"");
            sResponse += prodName + ": " + attrString + ";;";
            sResponse += productComment;
        }
        else{
            if (sResponse.trim().length>0){
                sResponse += seperatorLine;
            }
            sResponse += prodName + ": " + attrString + ";";
            sResponse += productComment + ";";
        }
        prevProduct=cartObj[i].ProductID; // save current product for comparision next time
        
    }
    sResponse += seperatorLine;

    sResponse += getOrderComments();
    return  sResponse;
   }

}
//------------------------------------------------------------------------    
function getOrderComments(){
    var oComments="";
    try{
        if ($("#txtOrderComments").val().trim().length>0)
        oComments= "Order notes: _" + $("#txtOrderComments").val().trim() + "_" ;
    }
    catch(e)
    {}
    return oComments;
}
//------------------------------------------------------------------------
function showAndroidToast(toast) {
    if(typeof Android !== "undefined" && Android !== null) {
        Android.TestDirectWA2(toast);
    } else {
        alert("Not viewing in webview " + toast);
    }
}
//------------------------------------------------------------------------