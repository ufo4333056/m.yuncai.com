//----------------------------- 登录 ------------------------------------//
function checkLogin() {
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: "/Login/getLoginInfo",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function (returnData) {
            if (returnData != null && returnData.member_id > 0) {
                $("#red").html("退出");
                $("#red").attr("href", "/Login/logout")

                $("#login").hide();
                $("#login").next().hide();

                $(".header_myhome").show();
            }


        }
    });
}

checkLogin();


//----------------------------- 搜索 ------------------------------------//
$(window).keydown(function (event) {

});


$("#search_key_btn").on("click", function () {
    if ($("#search_key").val().length > 0) {
        goto_search();
    }
});


$("#search_key").unbind("keydown").bind("keydown", function (e) {
    var curKey = e.which;
    if (curKey == 13) {
        goto_search();
    }
});
$("#search_key").unbind("keyup").bind("keyup", function (e) {
    var curKey = e.which;
    if (curKey != 13) {
        var search_key_btn = $("#search_key_btn");
        var search_key = $.trim($("#search_key").val());

        if (search_key.length > 0) {
            search_key_btn.css({"cursor": "pointer"});
        }
        else {
            search_key_btn.css({"cursor": "default"});
        }
    }
});






function goto_search() {
    var search_key = $("#search_key").val();

    location.href = "/Search/index?key=" + search_key;
}


window.__CurrentURL = document.location.href;

function GetQueryString(name)
{
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.__CurrentURL.substr(1).match(reg);
    if (r != null)
        return     unescape(r[2]);
    return   null;
}

$("#search_key").val(GetQueryString("key"));

/*********************************页头购物车*********************************/
//从购物车删除商品
function delCartProduct(dom, product_id) {
    var url = $('#delCartProduct_url').val();
    var parent = $(dom).parents('li.clearfix');
    $.ajax({
        url: url,
        data: {'product_id': product_id},
        type: 'post',
        dataType: 'json',
        success: function (i) {
            if (i.status == 1) {
                parent.remove();
                getHeaderTotalPrice();
                var num = $('div.header_cart a.cart_a span.num').html();
                var prod_quantity = $(dom).siblings("input[name='smallCartQuantity']").val();
                if ((Number(num) - Number(prod_quantity)) <= 0) {
                    $('div.header_cart a.cart_a span.num').hide();
                } else {
                    $('div.header_cart a.cart_a span.num').html(Number(num) - Number(prod_quantity));
                }

            } else {
                alert(i.info);
            }
        }
    })
    return false;
}


//加入购物车
function add_cart_fly(cart_obj, pid_img_url, pid, count, sku_code, is_show_alert, source) {
    var source = typeof(source)!='undefined' ? source : 0;

    // 没有选择配送地址不允许添加购物车
    if(cart_obj.hasClass('btn_green') && !$.cookie('cb_address_street')) {alert('请先选择配送区域'); return false;}

    var thisDom = cart_obj;  //当前dom
    var endDom = $('.header_cart');  //目标dom
    var moveDom = $(document.createElement('img'));

    var left = thisDom.offset().left + (thisDom.outerWidth() - 56) / 2,
            top = thisDom.offset().top + (thisDom.outerHeight() - 56) / 2,
            endLeft = endDom.offset().left + (endDom.outerWidth() - 56) / 2,
            endTop = endDom.offset().top + (endDom.outerHeight() - 56) / 2;

    moveDom.attr('src', pid_img_url);
    moveDom.attr('style', "border:1px solid #2bbc69;display:block;width:54px;height:54px;z-index:10005;position:absolute;left:" + left + "px;top:" + top + "px");

    $('body').append(moveDom);

    moveDom.animate({'left': endLeft + "px", 'top': endTop + "px", 'opacity': '0.1'}, 500, function () {
        moveDom.remove();

        //执行js
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/Cart/add",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {product_id: pid, sku_num: count, sku_code: sku_code, source:source},
            success: function (returnData) {
                if (returnData.status == 1) {
                    if (is_show_alert) {
                        alert(returnData.info);
                    }
                    refreshHeaderCart(pid);
                    _paq.push(['trackEvent', 'Production', 'Buy', 'Success']);      //第三方统计代码
                } else {
                    alert(returnData.info);
                }
            }
        });
    });
}

//有商品名称，临时解决办法
function add_cart_fly_muti(cart_obj, pid_img_url, pid, count, sku_code, is_show_alert,pname) {

    // 没有选择配送地址不允许添加购物车
    if(cart_obj.hasClass('btn_green') && !$.cookie('cb_address_street')) {alert('请先选择配送区域'); return false;}

    var thisDom = cart_obj;  //当前dom

    var endDom = $('.header_cart');  //目标dom
    var moveDom = $(document.createElement('img'));

    var left = thisDom.offset().left + (thisDom.outerWidth() - 56) / 2,
            top = thisDom.offset().top + (thisDom.outerHeight() - 56) / 2,
            endLeft = endDom.offset().left + (endDom.outerWidth() - 56) / 2,
            endTop = endDom.offset().top + (endDom.outerHeight() - 56) / 2;

    moveDom.attr('src', pid_img_url);
    moveDom.attr('style', "border:1px solid #2bbc69;display:block;width:54px;height:54px;z-index:10005;position:absolute;left:" + left + "px;top:" + top + "px");

    $('body').append(moveDom);

    moveDom.animate({'left': endLeft + "px", 'top': endTop + "px", 'opacity': '0.1'}, 500, function () {
        moveDom.remove();

        //执行js
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/Cart/addmuti",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {product_id: pid, sku_num: count, sku_code: sku_code},
            success: function (returnData) {
                if (returnData.status == 1) {
                    if (is_show_alert) {
                        alert(returnData.info);
                    }
                    refreshHeaderCart(pid);
                    _paq.push(['trackEvent', 'Production', 'Buy', 'Success']);      //第三方统计代码
                } else {
                    var msg=pname+returnData.info;
                    alert(msg);
                }
            }
        });
    });
}

//加入购物车 M版本
function add_cart_fly_m(pid, count, sku_code, callback, trackid, source) {
    var trackid = typeof(trackid)!='undefined' ? trackid : 0;
    var source = typeof(source)!='undefined' ? source : 0;
    //执行js
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: "/Cart/add",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        data: {product_id: pid, sku_num: count, sku_code: sku_code, trackid:trackid, source:source},
        success: function (returnData) {

            if (returnData.status == 1) {
                var current_num = $("#AppCartNums").html()!==""?parseInt($("#AppCartNums").html()):0;
                var new_num = parseInt(count) + current_num;
                $("#AppCartNums").html(new_num).show();

            } else {
                // alert(returnData.info);
                console.log(returnData);
            }
            if (typeof (callback) == "function") {
                callback(returnData);
            }
        }
    });
}


//价格计算
function getHeaderTotalPrice() {
    var product_info = [];
    var product_id = '';
    var quantity = '';

    $('.smallCartProduct').each(function (index, element) {
        product_id = $(this).children('.smallCartProduct_id').val();
        quantity = $(this).children('.smallCartQuantity').val();
        product_info[index] = [product_id, quantity];
    })

    if (product_info == '') {
        $('#cartTotalPrice').html('¥ 0');
        return false;
    }
    $.ajax({
        url: $('#getPriceURl').val(),
        data: {'product_info': product_info},
        type: 'post',
        dataType: 'json',
        success: function (info) {
            if (info.status == 1) {
                $('#cartTotalPrice').html('¥ ' + info.info);
            } else {
                alert(info.info);
            }
        }
    })
}

//加入购物车以后局部刷新
function refreshHeaderCart(new_product_id) {
    var product_id = '';
    $('.smallCartProduct_id').each(function (index, element) {
        product_id += $(this).val() + ',';
    })
    product_id += new_product_id;
    var url = $('#refreshHeadCart').val();

    $.ajax({
        url: url,
        dataType: 'text',
        data: {'product_id': product_id, "dotype": 1},
        type: 'post',
        success: function (i) {
            $('#headerProductNum').remove();
            $('.cart_slide').html(i);
            if ($('#headerProductNum').val() > 0) {
                $('.header_cart .cart_a span.num').html($('#headerProductNum').val()).show();
            } else {
                $('.header_cart .cart_a span.num').html($('#headerProductNum').val()).hide();
                $('.cart_slide').hide();
            }
        }
    })
}
//将商品加入心愿单
function addProduct2Favorite(product_id) {
    var url = $('#addFavorite_url').val();
    $.ajax({
        url: url,
        type: 'post',
        data: {'type': 1, 'product_id': product_id},
        dataType: 'json',
        success: function (i) {
            if (i.status == 1) {
                alert('成功加入心愿单');
            } else {
                alert('心愿单中已存在');
            }
        }
    })
}

//评论
$(".Review").click(function () {
    var d = dialog({
        id: 'Review',
        title: ' ',
        url: $(this).attr('href'),
        height: '600px',
        width: '800px'
    });
    d.showModal();
    return false;
})

//关闭已登录邀请注册的弹窗提示
function closePop(dom) {
    $(dom).parents('div.register_red_err').hide();
    $('.shade_box').hide();
    window.location.href = $(dom).attr('href');
    return false;
}
