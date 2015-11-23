/***
 * m端
 */
$(function() {
    var is_favorite = $("#is_favorite").val();
    if (is_favorite == 1) {
        mdoAddFavorite();
    }
    //执行删除商品
    $(".m_do_delete").off("click").on("click", function() {
        $(this).parents(".pop_box").hide();
        var url = $(this).attr("flag");
        var parent = $(this).parents('li');
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            success: function(i) {
                if (i.status == 1) {
                    refreshCart2("");
                    parent.remove();
                    //getCartProduct();
                    getTotalPrice();
                } else {
                    alert(i.info);
                }
            }
        });
    });
    //增加商品数量
    var regNum = /^\d+$/;
    $(".m_changeNum").off("blur").on("blur", function() {
        var obj = $(this);
        var product_num = obj.val();
        if (regNum.test(product_num)) {
            m_changeProductNum(obj, product_num, 'input');
        } else {
            alert("商品数量不正确");
            return;
        }
    });
    //增加商品数量
    $('.m_addNum').off("click").on("click", function() {
        var obj = $(this);
        var product_num = parseInt(obj.siblings("input[name='pro_num']").val()) + 1;
        if (regNum.test(product_num)) {
            m_changeProductNum(obj, product_num, 'add');
        } else {
            alert("商品数量不正确");
            return;
        }
    });
    //减少商品数量
    $('.m_SubtractNum').off("click").on("click",function() {
        var obj = $(this);
        var product_num = parseInt(obj.siblings("input[name='pro_num']").val()) - 1;
        if (product_num == 0) {
            alert("商品数量不能小于1");
            return;
        }
        if (regNum.test(product_num)) {
            m_changeProductNum(obj, product_num, "reduce");
        } else {
            alert("商品数量不正确");
            return;
        }
    });
    //商品数量变更
    function m_changeProductNum(obj, inputVal, type) {
        var productTotalPriceObj = $(".one_product_total_price");
        var product_id = obj.siblings("input[name='product_id']").val();
        var one_product_stock = $("#one_product_stock_" + product_id).val();
        var url = $("#changenum_url").val();
        if(obj.parent().attr("name")=='shop_bag'){
            $(obj).siblings("input[name='pro_num']").val(inputVal); 
            m_getTotalPrice();
            getCartNum();
            return;
        }
        $.ajax({
            url: url,
            data: {'num': inputVal, "product_id": product_id},
            type: 'get',
            dataType: 'json',
            success: function(returnData) {
                if (returnData.status == 1) {
                    if (parseInt(inputVal) > 999) {
                        alert("商品件数不能大于999");
                        var now_stock_num = 999;
                    } else {
                        var now_stock_num = inputVal;
                    }
                    if (type != "input") {
                        $(obj).siblings("input[name='pro_num']").val(now_stock_num);
                    } else {
                        $(obj).val(now_stock_num);
                    }

                    obj.parents("li").children().eq(0).addClass("icon-col-del");
                    obj.parents("li").children().eq(0).removeClass("icon-unchecked");
                } else {
                    if (returnData.stock_num > 999) {
                        var now_stock_num = 999;
                    } else {
                        var now_stock_num = returnData.stock_num;
                    }
                    if (now_stock_num == 0) {
                        alert("商品缺货");
                        now_stock_num = 1;
                    } else {
                        alert("库存不足，只有" + now_stock_num + "件");
                    }
                    if (type != "input") {
                        $(obj).siblings("input[name='pro_num']").val(now_stock_num);
                    } else {
                        $(obj).val(now_stock_num);
                    }
                    if (returnData.stock_num > 0) {
                        obj.parents("li").children().eq(0).addClass("icon-col-del");
                        obj.parents("li").children().eq(0).removeClass("icon-unchecked");
                    }
                }
                $(".tag-store").hide();
                m_getTotalPrice();
                getCartNum();
            }
        })
    }

    function refreshCart2(new_product_id) {
        var product_id = '';
        $('.check-product').each(function(index, element) {
            if ($(this).hasClass('cur')) {
                product_id += $(this).attr('value') + ',';
            }
        });
        product_id += new_product_id;
        var url = $('#refresh_url').val();
        $.ajax({
            url: url,
            dataType: 'text',
            data: {'product_id': product_id},
            type: 'post',
            success: function(i) {
                $('#cart_div_html').html(i);
                m_getTotalPrice();
            }
        })
    }
    //获取购物车中商品总数量
    function getCartNum() {
        var cartTotalNum = 0;
        $(".m_product_select").each(function(index, element) {
            if ($(this).hasClass("icon-col-del")) {
                var product_id = $(this).parent().find(".collect-price").find("input[name='product_id']").val();
                var product_num = $("#product_num_" + product_id).val();
                cartTotalNum += parseInt(product_num);
            }
        });
        if($(".shopping-bag").find("i.shopping-bag-select").hasClass("icon-col-del")){
            var shop_bag_pid = $(".shopping-bag").find(".collect-price").find("input[name='product_id']").val();
            var shop_bag_num = $(".shopping-bag").find(".collect-price").find("#product_num_" + shop_bag_pid).val();
            cartTotalNum += parseInt(shop_bag_num);
        }
        $("#m_settlement").html("去结算(" + cartTotalNum + ")");
    }
    
    //购物车编辑
    $("#cartEdit").on("click",function(){
       var thisHtml = $(this).html();
       if(thisHtml == "编辑"){
           $(this).html("完成");
           $("#select-act").attr('class','select-delete');
       }else{
           $(this).html("编辑");
           $("#select-act").attr('class','select-buy');
       }
    });
    //单选
    $(".m_product_select").off("click").on("click", function() {
        if ($(".tag-store").html() != "" && $(".tag-store").html() != null) {
            return false;
        }
        if ($(this).hasClass("icon-col-del")) {
            $(this).removeClass("icon-col-del");
            $(this).addClass("icon-unchecked");
            $("#selectAll").addClass("collect-unchecked");
            $("#selectAll").attr("flag", 0);
        } else {
            $(this).addClass("icon-col-del");
            $(this).removeClass("icon-unchecked");
            var all_check = 1;
            $(this).parents("li").siblings("li").each(function() {
                if (!$(this).find("i").hasClass("icon-col-del")) {
                    all_check = 0;
                }
            });
            if(all_check === 1){
                $("#selectAll").removeClass("collect-unchecked");
                $("#selectAll").attr("flag", 1);
            }
        }
        getCartNum();
        m_getTotalPrice();
    });
    //全选
    $("#selectAll").off("click").on("click", function() {
        var thisFlag = $(this).attr("flag");
        if (thisFlag == 1) {
            $(this).attr("flag", 0);
            $(".m_product_select").removeClass("icon-col-del");
            $(".m_product_select").addClass("icon-unchecked");
            $(this).addClass("collect-unchecked");
        } else {
            $(this).attr("flag", 1);
            $(".m_product_select").addClass("icon-col-del");
            $(".m_product_select").removeClass("icon-unchecked");
                if ($(".not-in-area").length){
                    notIn = $(".not-in-area").find('.m_product_select');
                    for (var i = 0; i < notIn.length; i++){
                        notIn.removeClass("icon-col-del");
                        notIn.addClass("icon-unchecked");
                    }
                 }  
            $(this).removeClass("collect-unchecked");
        }
        getCartNum();
        m_getTotalPrice();
    });
    //购物袋选择
    $("i.shopping-bag-select").off("click").on("click", function(){
        var shop_bag_i = $(this);
        if(shop_bag_i.hasClass("icon-col-del")) {
            shop_bag_i.removeClass("icon-col-del");
            shop_bag_i.addClass("icon-unchecked");
        }else{
            shop_bag_i.addClass("icon-col-del");
            shop_bag_i.removeClass("icon-unchecked")
        }
        getCartNum();
        m_getTotalPrice();
    });

    $('#delCartAll').off("click").on("click", function() {
        var product_id = '';
        $(".m_product_select").each(function(index, element) {
            if ($(this).hasClass("icon-col-del")) {
                product_id += $(this).parent().val() + ',';
            }
        });
        if (product_id == '') {
            alert('请先选择商品');
            return false;
        }
        if (confirm("确认删除商品")) {
            $.ajax({
                url: $(this).attr('href'),
                data: {'product_id': product_id},
                type: 'post',
                dataType: 'json',
                success: function(returnData) {
                    if (returnData.status == 1) {
                        window.location.reload();
                    } else {
                        alert(returnData.info);
                        window.location.reload();
                    }
                }
            });
        }
        return false;
    });
    //价格计算
    function m_getTotalPrice() {
        var product_info = [];
        var product_id = '';
        var quantity = '';
        var i = 0;
        $(".m_product_select").each(function(index, element) {
            if ($(this).hasClass("icon-col-del")) {
                product_id = $(this).parent().find(".collect-price").find("input[name='product_id']").val();
                quantity = $("#product_num_" + product_id).val();
                product_info[i] = [product_id, quantity];
                i++;
            }
        });
        if($(".shopping-bag").find("i.shopping-bag-select").hasClass("icon-col-del")){
            var shop_bag_pid = $(".shopping-bag").find(".collect-price").find("input[name='product_id']").val();
            var shop_bag_num = $(".shopping-bag").find(".collect-price").find("#product_num_" + shop_bag_pid).val();
            product_info[i] = [shop_bag_pid, shop_bag_num];
            i++;
        }
        if (product_info == '') {
            $('#totalPrice').html('¥ 0');
            return false;
        }
        $.ajax({
            url: $('#getPriceURl').val(),
            data: {'product_info': product_info},
            type: 'post',
            dataType: 'json',
            success: function(info) {
                if (info.status == 1) {
                    $('#totalPrice').html('¥' + info.info);
                } else {
                    alert(info.info);
                }
            }
        })
    }
    //批量添加到心愿单
    $("#collectCartAll").off("click").on("click", function() {
        var product_id = '';
        $(".m_product_select").each(function(index, element) {
            if ($(this).hasClass("icon-col-del")) {
                product_id += $(this).parent().val() + ',';
            }
        });
        product_id = product_id.substring(0, product_id.lastIndexOf(','));
        if (product_id == '') {
            alert('请先选择商品');
            return false;
        }
        mdoAddFavorite(product_id, "");
    });
    function mdoAddFavorite(product_id, type) {
        var member_id = $("#member_id").val();
        var add_favorite_pid = $("#add_favorite_pid").val();
        if (add_favorite_pid != "" && typeof (product_id) != "undifined") {
            var product_id = add_favorite_pid ? add_favorite_pid : product_id;
        }
        var type = 1;
        if (typeof (member_id) == "undefined" || member_id == "") {
            $("#add_favorite_pid").val(product_id);
            var redirect = encodeURIComponent("Cart/index/is_favorite/" + type + "/product_id/" + product_id);
            location.href = encodeURI("/Login/index/redirect_url/" + redirect);
            return false;
        }
        var is_favorite = new Object();
        if (type != "") {
            is_favorite.type = type;
        }
        is_favorite.product_id = product_id;
        $.ajax({
            url: "/Favorite/addCart",
            type: "get",
            data: is_favorite,
            dataType: 'json',
            success: function(returnData) {
                if (returnData.flag == 1 || (returnData.flag == 2 && returnData.erron == 4203)) {
                    $.ajax({
                        url: "/Cart/del",
                        type: 'get',
                        data: {"product_id": is_favorite.product_id},
                        dataType: 'json',
                        success: function(returnData) {
                            alert("移入心愿单成功");
                            if (returnData.status == 1) {
                                //购物车删除成功
                                window.location.href="/Cart/index";
                            } else {
                                //购物车删除失败
                            }
                            $("#add_favorite_pid").val("");
                            $("#is_favorite").val("");
                        }
                    });
                } else {
                    alert("添加心愿单失败");
                    return;
                }
            }
        });
    }
    //去结算
    $('#m_settlement').off("click").on("click", function() {
        var product_info = [];
        var product_id = '';
        var quantity = '';
        var i = 0;
        //addClickAll("5-6");
        //判断用户是否选择四级地址
        var address_street = $("#address_street");
        if (address_street.val().length <= 0) {
            alert('请选择收货区域');
            return false;
        }
        $(".m_product_select").each(function(index, element) {                                                       
            if ($(this).hasClass("icon-col-del")) {
                product_id = $(this).parent().find(".collect-price").find("input[name='product_id']").val();
                quantity = $("#product_num_" + product_id).val();
                product_info[i] = [product_id, quantity];
                i++;
            }
        });
        if($(".shopping-bag").find("i.shopping-bag-select").hasClass("icon-col-del")){
            var shop_bag_pid = $(".shopping-bag").find(".collect-price").find("input[name='product_id']").val();
            var shop_bag_num = $(".shopping-bag").find(".collect-price").find("#product_num_" + shop_bag_pid).val();
            product_info[i] = [shop_bag_pid, shop_bag_num];
            i++;
        }
        if (product_info == '') {
            alert('请选择商品');
            return false;
        }
        //库存验证
//        var change_stock_url = $("#changenum_url").val();
//        var is_flag = 1;
//        for (var i = 0; i < product_info.length; i++) {
//            $.ajax({
//                url: change_stock_url,
//                data: {'num': product_info[i][1], "product_id": product_info[i][0]},
//                type: 'get',
//                dataType: 'json',
//                success: function(returnData) {
//                    if (returnData.status != 1) {
//                        $("#product_num_" + product_info[i][0]).focus();
//                        return false;
//                    }
//                }
//            });
//        }
        $.ajax({
            url: $(this).attr('href'),
            type: 'post',
            data: {'product_info': product_info},
            dataType: 'json',
            success: function(i) {
                if (i.status == 1) {
                    var member_id = $("#member_id").val();
                    if (typeof (member_id) == "undefined" || member_id == "") {
                        var redirect = encodeURIComponent("/Order/index");
                        location.href = encodeURI("/Login/index/redirect_url/" + redirect);
                        return false;
                    } else {
                        window.location.href = "/Order/index";
                    }
                }
            }
        })
        return false;
    });

    $('#shopping-bag-act').on('click',function(e){
        e.preventDefault();
        if($(this).hasClass('shopping-bag-open')){
            $(this).removeClass('shopping-bag-open');
            $('.shopping-bag-info').hide();
        }else{
            $(this).addClass('shopping-bag-open');
            $('.shopping-bag-info').show();
            setTimeout(function(){
                $('body').scrollTop($('body').scrollTop()+200)
            },100);
        }
    });
    
    // 如果cookie有地址记录，初始化地址选择器
    $('input[name="city"]').val($.fn.cookie('cb_address_city'));
    $('input[name="district"]').val($.fn.cookie('cb_address_district'));
    $('input[name="street"]').val($.fn.cookie('cb_address_street'));
    
    // 添加数据
    if($.fn.cookie('cb_address_city')){
        new MapUI_M({
            dom: true,
            region:{
                city: {code:$.fn.cookie('cb_address_city')},
                district: {code:$.fn.cookie('cb_address_district')},
                street: {code:$.fn.cookie('cb_address_street')}
            }
        },{
            dom:'.address-cart .text',
            str:'>'//连接符
          });
    }
    $('#cart_div_html').on('click','.address-cart',function(){
        $('.select-con,.mask-bg').addClass('show');
        $('html').css({'overflow':'hidden'});
        var m = new MapUI_M(new Address(),{
            dom:'.address-cart .text',
            str:'>'//连接符
          });
    });
    $('.mask-bg,.select-con .close').on('click',function(){
        $('html').css({'overflow':''})
        $('.mask-bg,.select-con').removeClass('show');
        $('.select-back').addClass('hide');
    });

    var ndelivery_text = "不好意思，以下商品不在" + $("#address-text").html() + "配送区内"; 
    $('#warning_img').after(ndelivery_text);

});

//删除购物车商品
function deleteCartProduct(pid) {
    if (confirm("确认删除商品")) {
        $.ajax({
            url: '/Cart/del.html',
            data: {'product_id': pid},
            type: 'post',
            dataType: 'json',
            success: function(returnData) {
                if (returnData.status == 1) {
                    window.location.reload();
                } else {
                    alert(returnData.info);
                    window.location.reload();
                }

            }
        });
    }
}

$(function(){
    if (!localStorage.cartTip && !$.fn.cookie('cartTip')){
        $('body').addClass('hasTip');
        $('.cart-tip').show();
        $('.cart-tip .close').on('click',function(e){
            e.preventDefault();
            $(this).parent().hide();
            $('body').removeClass('hasTip');
            localStorage.cartTip = 'report';
            $.fn.cookie('cartTip', 'report', { expires: 365 });
        });
    }
})

