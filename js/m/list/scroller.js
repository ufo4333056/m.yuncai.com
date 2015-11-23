var myScroll;
// var scrollUl = $('#scroller');

// $('#wrapper').height($(window).height() - $('.title').height() - $('.coupon-tab').height());
function getData() {
    //ajax
    var url = $('#getList_url').val();
    var page = $('#getList_url').attr('data-page');
    var page_size = $('#getList_url').attr('data-size');

    $.ajax({
        url: url,
        data: {page: page, page_size: page_size},
        type: 'get',
        dataType: 'text',
        success: function (data) {
            if (data.length > 10) {
                $('#pullUp').show();
                $('#getList_url').attr('data-page', parseInt(page) + 1);
                $('.product_search_list').append(data);


                $('.product_search_list').find(".i-cart").unbind("tap").on("tap", function () {
                    // var thisDom = $(this);  //当前dom
                    // var pid = thisDom.parent().attr("data-product-id");
                    // add_cart_fly_m(pid, 1, "", function () {
                    //     window.Product.getCartListByProduct_m();//重新遍历购物车数量
                    // });
                    var thisDom = $(this);  //当前dom
                    var pid = thisDom.parent().attr("data-product-id");
                    thisDom.append('<div class="cart-loading"></div>');
                    add_cart_fly_m(pid, 1, "", function (d) {
                        if(d.status == 1){
                            alerts(d.info,'succ');
                            window.Product.getCartListByProduct_m();//重新遍历购物车数量
                        }else{
                            alerts(d.info,'warn');
                        }
                        setTimeout(function(){
                            $('.cart-loading').remove();
                        }, 1000);
                        
                    });
                });

            }else{
                $('#pullUp').hide();
            }
            myScroll.refresh();
            window.Product.getCartListByProduct_m();//重新遍历购物车数量
        }
    });

}

function loaded() {
    myScroll = new IScroll('#wrapper', {
        scrollbars: true,
        mouseWheel: true,
        fadeScrollbars: true,
        click: true
    });
    $('#scroller').height()>$('#wrapper').height() ? $('#pullUp').show() : $('#pullUp').hide();
    myScroll.on('scrollEnd', function () {
        if (this.y == this.maxScrollY) {
            getData();
            // myScroll.scrollBy(0, -50);
        }
    });

}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
document.addEventListener('DOMContentLoaded', loaded, false);