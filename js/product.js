(function (window) {
    var product_list = $("#product_list");
    var add_cart = $("#add_cart");
    var add_heart = $("#add_heart");
    var product_id_obj = $("#product_id");
    var member_id_obj = $("#member_id");
    var product_style_list = $("#product_style_list");
    var product_url = $("#product_url").val();
    var up_p_count = $("#up_p_count");
    var down_p_count = $("#down_p_count");
    var product_count = $("#product_count");
    var product_image_list = $("#product_image_list");
    var about_shicai = $("#about_shicai");
    var about_shicai_pic1 = $("#about_shicai_pic1");
    var about_shicai_pic2 = $("#about_shicai_pic2");
    var about_shicai_pic3 = $("#about_shicai_pic3");
    var product_nutrition = $("#product_nutrition");
    var more_place_story = $("#more_place_story");
    var sku_code = $("#sku_code").val();
    var product_dbm = $(".product_dbm");
    var product_dbm_list = $("#product_dbm_list");
    var dbm_total_price = $("#dbm_total_price");
    var product_dbm_add_cart = $("#product_dbm_add_cart");
    var stock_count = parseInt($("#stock_count").val());
    var wareId = parseInt($("#wareId").val());
    var cdsy_content = $("#cdsy_content");
    var product_cookbook = $(".product_cookbook");
    var product_specifications = $("#product_specifications");
    var fresh_pop = $("#fresh_pop");
    var fresh_pop_content = $("#fresh_pop_content");
    var anxin_pop = $("#anxin_pop");
    var anxin_pop_content = $("#anxin_pop_content");
    var product_inspection_content = $("#product_inspection_content");
    var product_inspection_div = $("#product_inspection_div");
    var choose_num = $("#choose_num");
    var no_stock_div = $("#no_stock_div");
    var no_sale_div = $("#no_sale_div");
    var is_fresh_promo = $("#is_fresh_promo");
    var fresh_area_div = $("#fresh_area_div");
    var is_pre_sale = $("#is_pre_sale");
    var now_buy = $("#now_buy");
    var pop_close = $("#pop_close");
    var promotion_sale_end_time = $("#promotion_sale_end_time");
    var address_div = $("#address_div");
    var trackid = $("#trackid").val();
    var source = $("#source").val();

    function product() {
    }

    product.init = function () 
    {
        //小提示
        if ($.trim($("#little_tip").text()).length > 0) 
        {
            $(".little_tip").show();
        }

        //默认选中第一个图片
        $(".pic_info_list").find("img").eq(0).attr("class", "cur");
        //判断商品大图不显示
        setTimeout(function () 
        {
            var product_img_big = $("#zoom1").find("img").eq(0).attr("src");
            if (product_img_big == "") 
            {
                var product_big = $(".pic_info_list").find("img").eq(0).attr("src").replace("_110_110.jpg", "_500_500.jpg");
                $("#zoom1").find("img").eq(0).attr("src", product_big);
            }
        }, 3000);

        //买手推荐
        product.getProducBuyerInfo();
        //产地溯源
        product.getProducProductAreaInfo();
        //营养表
        product.getProductNutritionInfo();
        //打包买
        window.Product.getProductDBM();
        //食谱
        window.Product.getProductCookbook();

        //规格
        //if (product_specifications.html() != "")
        // product_specifications.show();

        //安心度
        if (product_inspection_content.find("img").length > 0) 
        {
            product_inspection_div.show();
        }

        //促销类型
        if (is_fresh_promo.val() == "1") 
        {
            //极致新鲜
            fresh_area_div.show();
        }
        
        if (is_pre_sale.val() == "1") 
        {
            //预售
            add_cart.hide();
            now_buy.show();
            choose_num.show();
            no_stock_div.hide();
            no_sale_div.hide();

            if (stock_count > 3)
                $("#stock_count").val("3");
        }
        else 
        {
            now_buy.hide();
        }

        //规格
        if ($("#td_specifications").text() == "") {
            $("#td_specifications").text("-");
        }
        //产地
        if ($("#td_producing_area").text() == "") {
            $("#td_producing_area").text("-");
        }
        //保质期
        if ($("#td_expiration_date").text() == "0天") {
            $("#td_expiration_date").text("-");
        }
        //品牌
        if ($("#td_brand_name").text() == "") {
            $("#td_brand_name").text("-");
        }
        //储存方式
        if ($("#td_product_ccfs").text() == "") {
            $("#td_product_ccfs").text("-");
        }

        //促销时间判断
        product.setPromotionTime();

        //库存
        product.checkProductStock();
    }

    //设置促销时间
    product.setPromotionTime = function () 
    {
        if (promotion_sale_end_time.length > 0) 
        {
            var promotion_web_time = $("#promotion_web_time");

            var end_date = promotion_sale_end_time.val();
            var today = new Date().format('yyyy-MM-dd hh:mm:ss');

            //距离现在还有多少秒
            var time_diff_minute = GetDateDiff(today, end_date, "minute");
            var time_diff_hour = GetDateDiff(today, end_date, "hour");
            var time_diff_day = GetDateDiff(today, end_date, "day");
            var time_diff_minit = time_diff_minute % 60;

            if (time_diff_minit >= 0) {
                promotion_web_time.parent().show();
            }

            //还有几天
            var time_day_str = (time_diff_day + 0);

            //小时 求余
            time_diff_hour = time_diff_hour % 24;

            if (time_diff_hour == 0)
                time_diff_hour++;

            var _html = "还剩<span class='c_d9'>" + time_day_str + "</span>天<span class='c_d9'>" + time_diff_hour + "</span>小时";

            promotion_web_time.html(_html);
        }
    }

    product.bindClickEvent = function () {
        add_cart.on("click", function () {//添加购物车
            var thisDom = $(this);  //当前dom
//            var endDom = $('.header_cart');  //目标dom
//            var moveDom = $(document.createElement('img'));
//
//            var left = thisDom.offset().left + (thisDom.outerWidth() - 56) / 2,
//                    top = thisDom.offset().top + (thisDom.outerHeight() - 56) / 2,
//                    endLeft = endDom.offset().left + (endDom.outerWidth() - 56) / 2,
//                    endTop = endDom.offset().top + (endDom.outerHeight() - 56) / 2;
//
//            moveDom.attr('src', $("#hc_zoom_list").find("img").attr("src"));
//            moveDom.attr('style', "border:1px solid #2bbc69;display:block;width:54px;height:54px;z-index:10005;position:absolute;left:" + left + "px;top:" + top + "px");
//
//            $('body').append(moveDom);
//
//            moveDom.animate({'left': endLeft + "px", 'top': endTop + "px", 'opacity': '0.1'}, 1000, function () {
//                moveDom.remove();
//
//                //执行js
//                product.addCart(product_id_obj.val(), parseInt(product_count.text()), parseInt(member_id_obj.val()));
//            });

            add_cart_fly(thisDom, $("#hc_zoom_list").find("img").attr("src"), product_id_obj.val(), parseInt(product_count.text()), sku_code,false, source);

        });
        now_buy.on("click", function () {//预售
            //product.nowBuyPresale(product_id_obj.val(), parseInt(product_count.text()));

            var thisDom = $(this);  //当前dom
            add_cart_fly(thisDom, $("#hc_zoom_list").find("img").attr("src"), product_id_obj.val(), parseInt(product_count.text()), sku_code,false, source);

        });
        add_heart.on("click", function () {//添加心愿单
            if ($(this).attr("class") == "btn_white btn_cur") {
                product.removeFavorite(parseInt($(this).attr("data-id")));
                $(this).removeClass("btn_cur");
                $(this).html("添加到心愿单<span></span>");
            }
            else {
                product.addFavorite(product_id_obj.val(), false);
                $(this).addClass("btn_cur");
                $(this).html("已经添加心愿单<span></span>");
            }

        });
        up_p_count.on("click", function () {
            product.add_product_count();
        });
        down_p_count.on("click", function () {
            product.reduce_product_count();
        });

        //点击图片
        product_image_list.find("ul").eq(0).find("li").on("click", function () {
            var current_li = $(this);
            var image_url = current_li.find("img").attr("src");
            var is_square = current_li.find("img").attr("data-is-square");
            // if (parseInt(is_square) != 1) {
            //     product_image_list.find(".pic_info_img").find("img").eq(0).attr("src", image_url.replace("_110_110", "_500_400")); //大图赋值
            //     product_image_list.find(".pic_info_img").find("img").eq(0).css("width", "588px").css("height", "470px");
            // }
            // else {
            //     product_image_list.find(".pic_info_img").find("img").eq(0).attr("src", image_url.replace("_110_110", "_500_500")); //大图赋值
            //     product_image_list.find(".pic_info_img").find("img").eq(0).css("width", "470px").css("height", "470px");
            // }

            product_image_list.find(".pic_info_img").find("img").eq(0).attr("src", image_url.replace("_110_110", parseInt(is_square) != 1 ? "_500_400" : "_500_500"));

            // product_image_list.find(".pic_info_img").find("a").eq(0).attr("href", image_url); //隐藏图赋值
            product_image_list.find("ul").find("img").removeClass("cur");
            current_li.find("img").addClass("cur");
            //放大镜（重新加载）
            //$('.cloud-zoom, .cloud-zoom-gallery').CloudZoom();
        });
        product_dbm_add_cart.on("click", function () {//添加购物车
            product.addCartMuti(parseInt(member_id_obj.val()));
        });
        

        //极致新鲜 提示
        fresh_pop.hover(function () {
            fresh_pop_content.show("fast");
        }, function () {
            fresh_pop_content.hide();
        });

        //安心度 提示
        anxin_pop.hover(function () {
            anxin_pop_content.show("fast");
        }, function () {
            anxin_pop_content.hide();
        });
        product_inspection_content.find("img").click(function () {
            //第一版本
//            var aryImglist = $(this).attr("data-img-list").split(";");
//
//            var img_html = "";
//            for (var jj = 0; jj < aryImglist.length; jj++) {
//                img_html += "<img src='" + aryImglist[jj] + "' />";
//            }
//
//            if (aryImglist.length > 0) {
//                $('.shade_box').show();
//                $('.product_pop').find(".product_pop_title").html("安心度");
//                $('.product_pop').find(".product_pop_msg").html(img_html);
//                $('.product_pop').fadeIn(300);
//                $('.product_pop').css("top", $(document).scrollTop() + 100);
//            }


            var aryImglist = $(this).attr("data-img-list").split(";");

            var img_html = "";
            for (var jj = 0; jj < aryImglist.length; jj++) {
                img_html += "<img src='" + aryImglist[jj] + "' />";
            }

            if (aryImglist.length > 0) {
                $('.shade_box').show();
                $('body').css('height', '100%').css('overflow', 'hidden');
                $('.product_pop').css('position', 'fixed').css('top', '70px');
                $('.product_pop .product_pop_over').css('height', $('.shade_box').height() - 150 + 'px');
                $('.product_pop').find(".product_pop_title").html("安心度");
                $('.product_pop').find(".product_pop_msg").html(img_html);
                $('.product_pop').fadeIn(300);
            }


        });

        //关闭弹框
        $("#pop_close").on("click", function () {
            //第一版本
            //$(this).parent().hide();
            //$(this).parent().prev().hide();

            $('body').css('height', '').css('overflow', '');
            $(this).parent().hide();
            $(this).parent().prev().hide();

        });


    };
    product.addCart = function (pid, count, member_id, is_show_alert) {

//        $.ajax({
//            type: 'post',
//            dataType: 'json',
//            url: "/Product/add_cart",
//            contentType: "application/x-www-form-urlencoded; charset=utf-8",
//            data: {product_id: pid, count: count, member_id: member_id, sku_code: sku_code},
//            success: function (returnData) {
//                if (returnData.flag == 1) {
//                    if (is_show_alert) {
//                        alert("购物车添加成功");
//                    }
//                } else
//                {
//                    alert("购物车添加失败" + returnData.erron);
//                }
//            }
//        });
    };

    //预售专用
    product.nowBuyPresale = function (pid, count) {
        var product_info = [];
        product_info[0] = [pid, count];

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/Cart/settlement_presale",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {product_info: product_info},
            success: function (returnData) {
                //console.log(returnData);
                if (returnData.status == 1) {
                    location.href = "/Order/index/is_presale/1";
                }
                else if (returnData.status == 2) {
                    location.href = "/Order/index/is_presale/1";
                }
                else
                {
                    alert("购物车添加失败" + returnData.erron);
                }
            }
        });
    };

    //批量添加购物车
//    product.addCartMutiNew = function (member_id) {
//        var product_dbm_ids = $(".product_dbm").attr("data-id");
//        var id_array = product_dbm_ids.split(",");
//
//        var product_list="";
//        $("#product_dbm_list").find("li").each(function () {
//            var product_id = parseInt($(this).attr("data-id"));
//
//            if (product_id > 0) {
//                if ($(this).find(".cur").length > 0) {
//                    product_list+=product_id+",";
//                    //add_cart_fly($("#product_dbm_add_cart"), $("#dbm_img_" + product_id).attr("src"), product_id, 1, "", false);
//                }
//            }
//
//        });
//        product_list=product_list.ToString().RTrim(',');
//        add_cart_fly_muti($("#product_dbm_add_cart"), $("#dbm_img_" + product_id).attr("src"), product_list, 1, "", false);
//        
//    };

    product.addCartMuti = function (member_id) {
        var product_dbm_ids = $(".product_dbm").attr("data-id");
        var id_array = product_dbm_ids.split(",");


        $("#product_dbm_list").find("li").each(function () {
            var product_id = parseInt($(this).attr("data-id"));
            var product_name=$(this).find('.name').text();//alert(product_name);
            if (product_id > 0) {
                if ($(this).find(".cur").length > 0) {
                    add_cart_fly_muti($("#product_dbm_add_cart"), $("#dbm_img_" + product_id).attr("src"), product_id, 1, "", false,product_name);
                }
            }

        });
    };
    //添加
    product.addFavorite = function (pid, is_show_alert) {
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/Product/add_favorite",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {product_id: pid},
            success: function (returnData) {
                //console.log(returnData);
                if (returnData.flag == 1) {
                    product_list.find(".fav").each(function () {
                        var pids = $(this).attr("data-pid").split(",");
                        for (var i = 0, len = pids.length; i < len; i++) {
                            if (pids[i] == pid) {
//                                fids = fids + returnData.favorite_id + ",";
//                                console.log(pids[i] + " == " + pid + " => " + fids);
                                if ($(this).attr("data-fid")) {
                                    var new_val = $(this).attr("data-fid") + "," + returnData.favorite_id;
                                }
                                else {
                                    new_val = returnData.favorite_id;
                                }

                                $(this).attr("data-fid", new_val);
                            }
                        }

//                        console.log(fids);

//                        console.log($(this).attr("data-pid") + " = " + pid);
//                        if ($(this).attr("data-pid") == pid) {
//                            $(this).attr("data-fid", returnData.favorite_id);
//                        }
                    });
                    if (is_show_alert)
                        alert("添加成功");
                }
                else if (returnData.erron == 4001)
                {
                    location.href = "/Login/index";
                }
                else {
                    //alert("已经在心愿单中了");
                }
            }
        });
    };
    //移除心愿单
    product.removeFavorite = function (favorite_id) {
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/Product/remove_favorite",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {favorite_id: favorite_id},
            success: function (returnData) {
                if (returnData.flag == 1) {
                    //alert("取消成功");
                }
            }
        });
    };
    //取得同款商品
    product.getProductRelationByPid = function (pid, callback) {
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/Product/get_style_product",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {product_id: pid},
            success: function (returnData) {
                if (returnData != null && returnData.length > 0) {
                    $.each(returnData, function (idx, item) {
                        if (item.property_option_name_all != "")
                        {
                            var newUrl = product_url.replace('{0}', item.product_id);
                            product_style_list.append('<a data-p-option="' + item.product_id + '" href="' + newUrl + '" class="btn-gray btn-mini" title="' + item.property_option_name_all + '">' + subString(item.property_option_name_all, 20, "") + '</a>&nbsp;');
                        }
                    });
                    //变色
                    product_style_list.find("a[data-p-option='" + pid + "']").addClass("cur");
                }

                if (typeof (callback) == 'function')
                    callback();
            }
        });
    }

    product.add_product_count = function () {
        var count = parseInt(up_p_count.prev().text());
        if (count > 99 || count >= stock_count) {
            return;
        }

        up_p_count.prev().text(++count);
    }


    product.reduce_product_count = function () {
        var count = parseInt(up_p_count.prev().text());
        if (count <= 1) {
            return;
        }

        up_p_count.prev().text(--count);
    }

    product.getProducImageList = function (pid, callback) {
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/Product/getProducImageList",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {product_id: pid},
            success: function (returnData) {
                if (returnData.result) {
                    $.each(returnData.data, function (idx, item) {
                        var img_url_tmp = item.url;
                        product_image_list.find("ul").eq(0).find("li").eq(idx).find("img").attr("src", img_url_tmp);
                    });
                    //默认第一个选中
                    product_image_list.find("ul:eq(0)").find("li:eq(0)").click();
                }

                if (typeof (callback) == 'function')
                    callback();
            }
        });
    }

//买手推荐
    product.getProducBuyerInfo = function () 
    {
        var content_id = $(".product_mstj").attr("data-id");
        if (parseInt(content_id) > 0) 
        {
            $(".product_mstj").show();

            if ($.trim(about_shicai.html()).length > 0)
                $(".product_mstj2").show();

            if (about_shicai_pic1.attr("src").length <= 25) {
                about_shicai_pic1.hide();
            }
            if (about_shicai_pic2.attr("src").length <= 25) {
                about_shicai_pic2.hide();
            }
            if (about_shicai_pic3.attr("src").length <= 25) {
                about_shicai_pic3.hide();
            }

        }
    }

    //原产地溯源
    product.getProducProductAreaInfo = function (pid, callback) 
    {
        var content_id = $(".product_cdsy").attr("data-id");

        if (parseInt(content_id) > 0) 
        {
            $(".product_cdsy").show();
            more_place_story.hide();

            if (cdsy_content.val().length > 0)
            {
                more_place_story.show();
                more_place_story.unbind("click").bind("click", function (event) 
                {
                    $('.shade_box').show();
                    $('.product_pop').find(".product_pop_title").html("产地溯源");
                    $('.product_pop').find(".product_pop_msg").html(decodeURIComponent(cdsy_content.val()));
                    $('.product_pop').fadeIn(300);
                    $('.product_pop').css({"top": '100px', 'position': 'fixed'});
                    $('body').css('overflow', 'hidden');

                });
            }
        }
    }

    //营养表
    product.getProductNutritionInfo = function () 
    {
        if ($.trim(product_nutrition.html()).length > 5) 
        {
            $(".product_yyb").show();
        }
        else
        {
            $(".product_yyb").hide();
        }
    };
    
    //获取食谱
    product.getProductCookbook = function () 
    {
        var cookbook_ids = $(".product_cookbook").attr("data-id");
        if (cookbook_ids != "") {
            product_cookbook.show();
        }
    };
    
    //取得品牌名称
    product.getBrandName = function (callback) {
        var brand_id = $(".brand_id").html();
        if (brand_id > 0) {

            $.ajax({
                type: 'post',
                dataType: 'json',
                url: "/Product/getBrandName",
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                data: {brand_id: brand_id},
                success: function (returnData) {
                    if (returnData.flag) {
                        $(".brand_id").html(returnData.brand_info.name)
                    }

                    if (typeof (callback) == 'function')
                        callback();
                },
            });
        } else {
            if (typeof (callback) == 'function') {
                callback();
            }
        }
    };
    
    //获取打包买
    product.getProductDBM = function (callback) 
    {
        var product_dbm_ids = $(".product_dbm").attr("data-id");
        var product_subname = $("#product_subname").val();
        var product_name = $("#product_name").val();
        var chunbo_price = $("#chunbo_price").val();
        var specifications = $("#specifications").val();
        var sale_price = $("#sale_price").val();

        if (product_dbm_ids.length > 0) {
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: "/Product/getByIdsDBM",
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                data: {product_id: product_dbm_ids},
                success: function (returnData) {
                    //console.log(returnData);
                    if (returnData.flag == 1) {
                        product_dbm.show();
                        //主商品
                        var p_url = product_url.replace("{0}", product_id_obj.val());
                        var _html = "<li data-id='" + product_id_obj.val() + "'>";
                        var img_u = $("[data-is-square=1]").eq(0).attr("src");

                        _html += '<a href="' + p_url+ '#keyStr=product-tag-d1" class="img" target="_blank"><img src="' + img_u + '"> </a>';
                        _html += '<p class="name">' + product_subname + '</p>';
                        _html += '<h4><a  target="_blank" href="' +  '#keyStr=product-tag-d1">' + product_name + '</a></h4>';


                        var price_tmp = chunbo_price;
                        if (sale_price > 0)
                            price_tmp = sale_price;

                        _html += '<p class="price"><strong>¥ ' + price_tmp + '</strong></p>';


                        _html += '<p class="num">' + specifications + '</p>';
                        _html += '<a href="javascript:;" class="btn_checkbox cur" data-price="' + price_tmp + '"></a>';
                        _html += '</li>';
                        product_dbm.find("ul").eq(0).append(_html);


                        $.each(returnData.product_info, function (idx, item) {
                            //console.log(item);
                            var p_url = product_url.replace("{0}", item.product_id);
                            var _html = "<li data-id='" + item.product_id + "'>";
                            var img_u = returnData.img_list[item.product_id].url;
                            var p_stock = item.stock_num;
                            if (p_stock > 0) {
                                var tag_index = parseInt(idx)+2;
                                _html += '<a href="' + p_url+'#keyStr=product-tag-d'+tag_index + '" class="img"><img id="dbm_img_' + item.product_id + '" src="' + img_u + '"> </a>';
                                _html += '<p class="name">' + item.subname + '</p>';
                                _html += '<h4><a href="' + p_url+'#keyStr=product-tag-d'+tag_index + '">' + item.name + '</a></h4>';
                                _html += '<p class="price"><strong>¥ ' + item.chunbo_price + '</strong></p>';
                                _html += '<p class="num">' + item.specifications + '</p>';
                                _html += '<a href="javascript:;" class="btn_checkbox cur" data-price="' + item.chunbo_price + '"></a>';
                                _html += '</li>';
                                product_dbm.find("ul").eq(0).append(_html);

                            }
                        });
                        var ii = 0;
                        product_dbm.find(".btn_checkbox").each(function () {
                            if (ii > 0) {
                                $(this).unbind("click").bind("click", function () {
                                    if ($(this).attr("class") != "btn_checkbox cur") {
                                        $(this).addClass("cur");
                                    }
                                    else {
                                        $(this).removeClass("cur");
                                    }

                                    //从新计算价格
                                    var total_price = 0;
                                    product_dbm_list.find("li").each(function () {
                                        if ($(this).find(".cur").length > 0) {
                                            total_price += parseFloat($(this).find(".cur").attr("data-price"));
                                        }
                                    });
                                    dbm_total_price.html("￥" + product.formatMoney(total_price + ""));
                                });
                            }
                            ii++;
                        });
                        //初始化计算
                        var total_price = 0;
                        product_dbm_list.find("li").each(function () {
                            if ($(this).find(".cur").length > 0) {
                                total_price += parseFloat($(this).find(".cur").attr("data-price"));
                            }
                        });
                        dbm_total_price.html("￥" + product.formatMoney(total_price + ""));
                    }

                    if (typeof (callback) == 'function')
                        callback();
                }
            });

        }
    };
    
    //取得产品库存
    product.checkProductStock = function () 
    {
        //无库存
        if (stock_count <= 0 && wareId > 0)
        {
            add_cart.remove();
            choose_num.hide();
            now_buy.hide();
            address_div.hide();
            no_sale_div.hide();

            no_stock_div.show();
        }
        //此次不销售
        else if(stock_count <= 0 && wareId == 0)
        {
            add_cart.remove();
            choose_num.hide();
            now_buy.hide();
            address_div.hide();
            no_stock_div.hide();
            
            no_sale_div.show();
        }

        $(".address").show();
        
    };

    //写入浏览历史
    product.setReadHistory = function (product_id, callback) {
        var pids = $.cookie("look_history");
        var ary_pid_new = [];

        if (pids) {
            var ary_pid = pids.split(",");

            for (i = 0; i < ary_pid.length; i++) {
                if (ary_pid[i] != product_id) {
                    ary_pid_new.push(ary_pid[i]);
                }
            }

            if (ary_pid_new.length > 10) {
                ary_pid_new.pop();//尾部
            }
        }

        ary_pid_new.unshift(product_id);

        //不要随便修改：Bzq
        var date_history = new Date();
        date_history.setTime(date_history.getTime() + (365 * 24 * 60 * 60 * 1000));
        $.cookie("look_history", ary_pid_new.join(","), {expires: date_history, path: "/"}); 


        if (typeof (callback) == 'function') {
            callback();
        }

    };


    product.setAddressSelectList = function () {
        var district_id = $.cookie("product_district_id");
        var delivery_id = $.cookie("product_delivery_id");

        $("#district_id_add").val(district_id);

        loadCountys($("#district_id_add"), "delivery_id_add", function () {
            $("#delivery_id_add").val(delivery_id);

            loadProductRevicedTime($("#delivery_id_add"));

        });
    };


    product.formatMoney = function (mymoney) {
        var moy_aryy = mymoney.split(".");
        var mony_0 = moy_aryy[0];
        var mony_1 = moy_aryy[1];

        if (moy_aryy[1] != null && moy_aryy[1].length > 0) {

            if (moy_aryy[1].length > 2)
                mony_1 = moy_aryy[1].substring(0, 2);

            return mony_0 + "." + mony_1;
        }

        return mony_0;
    };



    //************************************************** M版 **************************************************//
    product.getProductRelationByPid_m = function (pid, callback) {
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/Product/get_style_product",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {product_id: pid},
            success: function (returnData) {
                if (returnData != null && returnData.length > 0) {
                    product_style_list.append("规格：");
                    $.each(returnData, function (idx, item) {
                        if (item.property_option_name_all != "")
                        {
                            var newUrl = product_url.replace('{0}', item.product_id);
                            product_style_list.append('<a data-p-option="' + item.product_id + '" href="' + newUrl + '" class="btn-mini" title="' + item.property_option_name_all + '">' + subString(item.property_option_name_all, 20, "") + '</a>&nbsp;');
                        }
                    });
                    //变色
                    product_style_list.find("a[data-p-option='" + pid + "']").addClass("on");
                }
            }
        });
    };

    //加减操作
    product.bindClickEvent_m = function () {
        up_p_count.on("click", function () {
            product.add_product_count_m();
        });
        down_p_count.on("click", function () {
            product.reduce_product_count_m();
        });


        add_cart.on("tap", function () {//添加购物车
            var thisDom = $(this);  //当前dom
            add_cart_fly_m(product_id_obj.val(), parseInt(product_count.val()), sku_code, function (d) {
                // alert("添加购物车成功");
                if (d.status == 1) {
                    alerts(d.info, 'succ');
                    window.Product.getCartListByProduct_m();//重新遍历购物车数量
                } else {
                    alerts(d.info, 'warn');
                }
                setTimeout(function () {
                    $('.cart-loading').remove();
                }, 1000);
            },trackid,source);

        });

        //安心标签
        $('.anxin a').click(function (e) {
            e.preventDefault();
            if ($(this).children('img').attr('data-img-list')) {
                var imgViewDate = $(this).children('img').attr('data-img-list').split(';');
                for (var i = 0; i < imgViewDate.length; i++) {
                    $('.imgView ul').append('<li><img src="' + imgViewDate[i] + '"></li>')
                }
                ;
                $('body').addClass('disableScorll');
                $('.imgView').show();
            }
        })


        ////绑定加入购物车
        // $(".i-cart").on("click", function () {
        //     var thisDom = $(this);  //当前dom
        //     var pid = thisDom.parent().attr("data-product-id");
        //     add_cart_fly_m(pid, 1, "", function () {
        //         window.Product.getCartListByProduct_m();//重新遍历购物车数量
        //     });
        // });

    };


    product.add_product_count_m = function () {
        var count = parseInt(up_p_count.prev().val());
        if (count > 99 || count >= stock_count) {
            return;
        }

        up_p_count.prev().val(++count);
    };


    product.reduce_product_count_m = function () {
        var count = parseInt(up_p_count.prev().val());
        if (count <= 1) {
            return;
        }

        up_p_count.prev().val(--count);
    };


    product.checkProductStock_m = function () {
        if (stock_count <= 0)
        {
            $("#add_cart").remove();
            $("#now_buy").remove();

            no_stock_div.show();
        }
    };

    //取得购物车列表
    product.getCartListByProduct_m = function () {
        var layer_list = $(".layer-list");
        var layer_list2 = $(".layer-list2");

        //取得当前页面的全部pid
        var product_ids = [];

        layer_list.find("li").each(function () {
            product_ids.push($(this).attr("data-product-id"));
        });
        layer_list2.find("li").each(function () {
            product_ids.push($(this).attr("data-product-id"));
        });

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/Cart/getCartProductNum",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {product_id: product_ids.join(",")},
            success: function (returnData) {
                if (returnData["flag"] == 1) {
                    $.each(returnData["data"], function (pid, stock_count) {
                        layer_list.find("li[data-product-id='" + pid + "']").find(".i-cart").html("<i>" + stock_count + "</i>");
                        layer_list2.find("li[data-product-id='" + pid + "']").find(".i-cart").html("<i>" + stock_count + "</i>");

                    });
                }
            }
        });
    };


    window.Product = product;

})(window);