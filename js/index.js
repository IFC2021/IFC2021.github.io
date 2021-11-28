
$(document).ready(function () {
    /* fetches categories and products from local storage, 
    if doesnt found, makes an ajax call and then loads Menu and featured products.*/

    categoryResult = JSON.parse(localStorage.getItem("categoryResult"));
    productResult = JSON.parse(localStorage.getItem("productResult"));

    if (categoryResult == null || categoryResult == '') {
        getCategoriesAjax();
        categoryResult = JSON.parse(localStorage.getItem("categoryResult"));
        loadMenuCategories(categoryResult);
        loadSearchCategories(categoryResult);
        loadMobileViewMenuCat(categoryResult);
    }
    else {
        categoryResult = JSON.parse(localStorage.getItem("categoryResult"));
        loadMenuCategories(categoryResult);
        loadSearchCategories(categoryResult);
        loadMobileViewMenuCat(categoryResult);
    }

    if (productResult == null || productResult == '') {
        getProductsAjax();
        productResult = JSON.parse(localStorage.getItem("productResult"));
        loadFeaturedProducts(productResult);

    }
    else {
        loadFeaturedProducts(productResult);
    }
    updateCartCount();
});
//-------------------------------------------------------------------------------------------
/*Loads featured products */
function loadFeaturedProducts(products) {

    /* retrive featured product by FeaturedProductRank column in execel sheet */
    var featuredProductBlock = '';
    var featuredProductList = products.filter(function (obj) {
        return (obj[6] != null)
    });
    // sort by value
    featuredProductList.sort(function (a, b) {
        return a[6] - b[6];
    });

    $(featuredProductList).each(function (index, product) {
        featuredProductBlock += '<div class="product-default inner-quickview inner-icon"><figure class="img-container-height"><a onclick="navigateToProductDetails(\'' + product[1] + '\')\" href="javascript:"><img class="img-thumbnail img-aspect" src="ProductImages/' + product[3] + '/1.jpg"></a>  </figure> <div class="product-details"> <div class="category-wrap"> <div class="category-list"> <a href="javascript:" class="product-category">' + product[0] + '</a> </div> </div> <h3 class="product-title"> <a href="productdetails.html">' + product[2] + '</a> </h3>  </div></div>';
    })

    $('#featuredProductBlock').html(featuredProductBlock);
    /* After loading featured products HTML, need to re-initialize slider since the HTML and images are created newly in DOM */

    var newSliderOptions = {
        "loop": false,
        "margin": 20,
        "responsiveClass": true,
        "nav": false,
        "navText": [
            "<i class=\"icon-angle-left\">",
            "<i class=\"icon-angle-right\">"
        ],
        "dots": true,
        "autoplay": false,
        "autoplayTimeout": 15000,
        "items": 2,
        "responsive": {
            "576": {
                "items": 3
            },
            "992": {
                "items": 4
            }
        }
    };
    $('#featuredProductBlock').addClass('products-slider owl-carousel');
    $('#featuredProductBlock').owlCarousel(newSliderOptions);

}
/* Shows quick view on click of quick button on products */
//------------------------------------------------------------------------------------------- 
/*navigates to product details page on click of any product (featured products in this page) */
function navigateToProductDetails(productID) {
    sessionStorage.setItem("selectedProductID", productID);
    window.location.href = "productdetails.html";
}
//-------------------------------------------------------------------------------------------
