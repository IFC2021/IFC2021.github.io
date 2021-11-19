$(document).ready(function () {
    //regex to allow only alphanumeric characters

    var regex = /[^a-zA-Z0-9 ]/g;
    $('.validate-chars').on('keyup', function (e) {
        var str = e.target.value;
        if (str.match(regex) != null) {
            $(str.match(regex)).each(function (index, val) { str = str.replace(val,''); })
        }
        e.target.value = str;
    });

});