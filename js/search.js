(function (window) {
    var product_list = $("#product_list");
    var cookbook_list = $("#cookbook_list");
    var a_mix = $('#a_mix');
    var a_order_sale = $("#a_order_sale");
    var a_price_sale = $("#a_price_sale");
    var a_release_time = $("#a_release_time");
    var a_review_count = $("#a_review_count");
    var only_show_stock = $("#only_show_stock");
    var is_promotion = $("#is_promotion");
    var page = $("#page");
    var category_property_list = $("#category_property_list");
    var option_filter = $("#option_filter");
    var search_mask = $(".search-mask");
    var ul_filter_div = $("#ul_filter_div");
    var parent_category_list = $("#parent_category_list");
    var current_cid = $("#category_id");

    function search() {
    }

    function kv(key) {
        var _key = new RegExp("[?&]" + key + "\=([^&]+)", "g").exec(location.href);
        if (_key) {
            return _key[1]
        }
        ;
    }
    function setClass(e, n) {
        e.addClass(n)
    }
    switch (+kv('order')) {
        case 1:
            setClass(a_order_sale, 'filter-icon-down');
            break;
        case 2:
            setClass(a_order_sale, 'filter-icon-up');
            break;
        case 3:
            setClass(a_price_sale, 'filter-icon-down');
            break;
        case 4:
            setClass(a_price_sale, 'filter-icon-up');
            break;
        case 5:
            setClass(a_release_time, 'filter-icon-down');
            break;
        case 6:
            setClass(a_release_time, 'filter-icon-up');
            break;
        case 7:
            setClass(a_review_count, 'filter-icon-down');
            break;
        case 8:
            setClass(a_review_count, 'filter-icon-up');
            break;
        default:
            setClass(a_mix, 'on');
            break;
    }



    search.bindClickEvent = function () {
        //综合排序
        a_mix.on('click', function () {
            var myURL = parseURL(document.location.href);
            var _newUrl = replaceUrlParams(myURL, {order: 0, page: parseInt(page.val()), is_hide_page: parseInt(search.get_is_hide_page())});
            location.href = _newUrl;
        })
        //销量排序
        a_order_sale.on("click", function () {
            var myURL = parseURL(document.location.href);
            var my_sale = parseInt($(this).attr("data-id"));
            if (my_sale == 1) {
                var _newUrl = replaceUrlParams(myURL, {order: 2, page: parseInt(page.val()), is_hide_page: parseInt(search.get_is_hide_page())});
                location.href = _newUrl;
            }
            else {
                var _newUrl = replaceUrlParams(myURL, {order: 1, page: parseInt(page.val()), is_hide_page: parseInt(search.get_is_hide_page())});
                location.href = _newUrl;
            }

        });
        //价格排序
        a_price_sale.on("click", function () {
            var myURL = parseURL(document.location.href);
            var my_sale = parseInt($(this).attr("data-id"));
            if (my_sale == 4) {
                var _newUrl = replaceUrlParams(myURL, {order: 3, page: parseInt(page.val()), is_hide_page: parseInt(search.get_is_hide_page())});
                location.href = _newUrl;
            }
            else {
                var _newUrl = replaceUrlParams(myURL, {order: 4, page: parseInt(page.val()), is_hide_page: parseInt(search.get_is_hide_page())});
                location.href = _newUrl;
            }
        });
        //上架时间
        a_release_time.on("click", function () {
            var myURL = parseURL(document.location.href);
            var my_sale = parseInt($(this).attr("data-id"));
            if (my_sale == 5) {
                var _newUrl = replaceUrlParams(myURL, {order: 6, page: parseInt(page.val()), is_hide_page: parseInt(search.get_is_hide_page())});
                location.href = _newUrl;
            }
            else {
                var _newUrl = replaceUrlParams(myURL, {order: 5, page: parseInt(page.val()), is_hide_page: parseInt(search.get_is_hide_page())});
                location.href = _newUrl;
            }
        });
        //评论数
        a_review_count.on("click", function () {
            var myURL = parseURL(document.location.href)
            var my_sale = parseInt($(this).attr("data-id"));
            if (my_sale == 7) {
                var _newUrl = replaceUrlParams(myURL, {order: 8, page: parseInt(page.val()), is_hide_page: parseInt(search.get_is_hide_page())});
                location.href = _newUrl;
            }
            else {
                var _newUrl = replaceUrlParams(myURL, {order: 7, page: parseInt(page.val()), is_hide_page: parseInt(search.get_is_hide_page())});
                location.href = _newUrl;
            }
        });

        //显示有货
        only_show_stock.on("click", function () {
            var myURL = parseURL(document.location.href);

            var _newUrl = replaceUrlParams(myURL, {is_stock: search.get_show_stock(), page: 1});
            location.href = _newUrl;
        });
        //显示促销
        is_promotion.on("click", function () {
            var myURL = parseURL(document.location.href);

            var _newUrl = replaceUrlParams(myURL, {is_promotion: search.get_is_promotion(), page: 1});
            location.href = _newUrl;
        });

        //添加心愿单
        product_list.find(".fav").each(function () {
            var curr_fav = $(this);
            curr_fav.unbind("click").bind("click", function () {
                var classes = curr_fav.attr("class");

                var pids = curr_fav.attr("data-pid").split(",");

                if (classes.indexOf("fav") != -1) {
                    if (classes.indexOf("cur") > 0) {

                        var fids = curr_fav.attr("data-fid").split(",");

                        for (var i = 0, len = fids.length; i < len; i++) {
//                            window.Product.addFavorite(fids[i]);
                            window.Product.removeFavorite(fids[i]);

                        }

                        console.log(curr_fav.attr("data-fid"));
                        curr_fav.removeAttr("data-fid");

//                        window.Product.removeFavorite(curr_fav.attr("data-fid"));
//                        window.Product.removeFavorite(curr_fav.attr("data-fid"));
                        curr_fav.html("<span></span>添加到心愿单");
                        curr_fav.removeClass("cur");
                    }
                    else {
//                        window.Product.addFavorite(curr_fav.attr("data-pid"));

                        for (var i = 0, len = pids.length; i < len; i++) {
                            window.Product.addFavorite(pids[i]);
                        }
                        curr_fav.html("<span></span>已添加到心愿单");
                        curr_fav.addClass("cur");
                    }
                }

//                window.Product.addFavorite(curr_fav.attr("data-pid"));
//                curr_fav.html("<span></span>已添加到心愿单");
//                curr_fav.addClass("cur");

            });
        });

        // 食谱添加心愿单
        cookbook_list.find(".fav").each(function () {
            var curr_fav = $(this);
            curr_fav.unbind("click").bind("click", function () {
                if (curr_fav.attr("class") == "fav cur") {
                    window.Cookbook.removeFavorite(curr_fav.attr("data-fid"));
                    curr_fav.html("<span></span>添加到心愿单");
                    curr_fav.removeClass("cur");
                }
                else {
                    window.Cookbook.addFavorite(curr_fav.attr("data-cookbook-id"), false);
                    curr_fav.html("<span></span>已添加到心愿单");
                    curr_fav.addClass("cur");
                }
            });
        });

        //加入购物车
        product_list.find(".nowAddSkuToCar").each(function () {
//            console.log("Looking for now add sku to car.");
            var curr_fav = $(this);
            curr_fav.unbind("click").bind("click", function () {
//                console.log("Buy click.");
                var img_url = curr_fav.parent().parent().find("img").eq(0).attr("src");
                var i = 0;
                var pids = new Array();
                var skus = new Array();
                var skunums = new Array();
                var stock = new Array();
                var dose = new Array();
                var pName = new Array();
                var productInfoList;

                var productListElements = $(".cookbook-product").each(function () {
                    var cur = $(this).find('.btn_checkbox').attr("class");
                    if (cur) {
                        if (cur.indexOf('cur') >= 0) {
                            productInfoList = $(this).find('.btn_checkbox').attr("value");
                            productInfoList = productInfoList.split(",");
                            pids[i] = productInfoList[0];
                            skus[i] = productInfoList[1];
                            skunums[i] = productInfoList[2];
                            stock[i] = $(this).find(".product-stock").attr("value");
                            dose[i] = $(this).find(".product-dose").attr("value");
                            pName[i] = $(this).find(".name a").html();
                            i++;
                        }
                    }

                });

                // 单个商品添加
                for (var i = 0, len = pids.length; i < len; i++) {
                    console.log(stock[i] + " | " + dose[i]);
                    if (parseInt(stock[i]) >= parseInt(dose[i])) {
                        $("#product-stock-" + pids[i]).attr('value', stock[i] - dose[i]);
                        cookbook_add_cart_fly(curr_fav, img_url, pids[i], skunums[i], skus[i]);
                    }
                    else {
                        alert("[" + pName[i] + "] 库存不足, 未加入购物车.");
                    }
                }

                // @TODO 多商品添加到购物车
//                add_sku_to_cart(curr_fav, img_url, curr_fav.attr("data-sku-list"), curr_fav.attr("data-pid-list"), curr_fav.attr("data-sku-num"));
            });
        });

        //加入购物车
        product_list.find(".nowAddCar").each(function () {
            var curr_fav = $(this);
            curr_fav.unbind("click").bind("click", function () {
                //window.Product.addCart(curr_fav.attr("data-pid"), 1, member_id, true);

                var img_url = curr_fav.parent().parent().find("img").eq(0).attr("src");

                add_cart_fly(curr_fav, img_url, curr_fav.attr("data-pid"), 1, curr_fav.attr("data-sku-code"));

            });
        });
        //预售
        product_list.find(".nowBuyPresale").each(function () {
            //            var curr_fav = $(this);
            //            curr_fav.unbind("click").bind("click", function () {
            //                window.Product.nowBuyPresale(curr_fav.attr("data-pid"), 1);
            //            });

            //********加入购物车******//
            var curr_fav = $(this);
            curr_fav.unbind("click").bind("click", function () {
                //window.Product.addCart(curr_fav.attr("data-pid"), 1, member_id, true);

                var img_url = curr_fav.parent().parent().find("img").eq(0).attr("src");

                add_cart_fly(curr_fav, img_url, curr_fav.attr("data-pid"), 1, curr_fav.attr("data-sku-code"));

            });




        });
        //类目显示
        search.set_parent_category();
        //绑定属性点击事件
        search.bind_category_property_click();
        search.bind_parent_category_click();
        //心愿单商品显示
        search.showFavorite();
    };

    search.get_is_hide_page = function () {
        return $("#is_hide_page").val();
    }

    search.get_show_stock = function () {
        return  only_show_stock.is(":checked") ? 1 : 0;
    };

    search.get_is_promotion = function () {
        return  is_promotion.is(":checked") ? 1 : 0;
    };

    search.bind_category_property_click = function () {
        category_property_list.find("a").each(function () {
            var currentA = $(this);

            currentA.unbind("click").bind("click", function () {

                var option_data_id = currentA.attr("data-id");

                if (currentA.attr('class') == "tag_on")
                {
                    currentA.removeClass("tag_on");
                } else {
                    currentA.parent().find("a").removeClass("tag_on");
                    currentA.addClass("tag_on");
                }
                //过滤url参数
                var currentURL = document.location.href;
                var url_tmp = removeUrlParam(parseURL(currentURL), "option_filter");

                //重新整理
                var aryOption = [];
                category_property_list.find("a").each(function () {
                    var currentB = $(this);
                    if (typeof (currentB.attr("data-id")) != "undefined" && currentB.attr("data-id") != null) {
                        if (currentB.attr("class") == "tag_on" && currentB.attr("data-id").length > 0) {
                            aryOption.push(currentB.attr("data-id"));
                        }
                    }
                });

                var url_option = "";
                if (aryOption.length > 0) {
                    url_option = "&option_filter=" + encodeURIComponent(JSON.stringify(aryOption));
                }

                //页面跳转
                location.href = url_tmp + url_option;

            });
        });
    };
    search.bind_parent_category_click = function () {
        parent_category_list.find("a").each(function () {
            var currentA = $(this);

            currentA.unbind("click").bind("click", function () {


                if (currentA.attr('class') == "cur")
                {
                    currentA.removeClass("cur");
                } else {
                    currentA.parent().find("a").removeClass("cur");
                    currentA.addClass("cur");
                }
                //过滤url参数
                var currentURL = document.location.href;
                var url_tmp = removeUrlParam(parseURL(currentURL), "cid");
                var url_tmp = removeUrlParam(parseURL(url_tmp), "cid_l");

                //页面跳转
                location.href = url_tmp + '&cid=' + currentA.attr("data-cid") + '&cid_l=1';

            });
        });
    };
    search.set_parent_category = function () {
        parent_category_list.find("a").each(function () {
            var currentA = $(this);
            if (currentA.attr('data-cid') == current_cid.val())
            {
                currentA.parent().find("a").removeClass("cur");
                currentA.addClass("cur");
            } else {
                currentA.removeClass("cur");
            }

        });
    };
    //页面选中状态
    search.setOptionFilter = function (callback) {
        var option_str = decodeURIComponent($("#option_filter").val());

        if (option_str.length > 0) {
            var option_obj = $.parseJSON(option_str);

            if (option_obj.length > 0) {
                for (var i = 0; i < option_obj.length; i++) {
                    var op_tmp = option_obj[i];
                    category_property_list.find("a[data-id='" + op_tmp + "']").addClass("tag_on");
                    category_property_list.find("a[data-id='" + op_tmp + "']").append("<i class=\"icon i-del\"></i>");
                    category_property_list.find("a[data-id='" + op_tmp + "']").parent().find("a").eq(0).removeClass("tag_on");
                    var obj = category_property_list.find("a[data-id='" + op_tmp + "']");
                    obj.bind("click", function () {
                        $(this).removeClass("tag_on");
                        $(this).remove("i");
                    });
                }
            }
        }

        if (typeof (callback) == 'function') {
            callback();
        }

    };
    //情况没有结果的数据
    search.clearNotResult = function () {

        //没有赋值的，属性
        category_property_list.find("a[data-id^='property_option']").each(function () {
            var aobj = $(this)
            var txt = aobj.text();

            if (txt.indexOf("(0)") > -1) {
                aobj.hide();
            }
        });

        //没有赋值的，品牌
        category_property_list.find("a[data-id^='brand_name']").each(function () {
            var aobj = $(this)
            var txt = aobj.text();

            if (txt.indexOf("(0)") > -1) {
                aobj.hide();
            }
        });

    };

    //显示心愿单
    search.showFavorite = function () {
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/Favorite/listPid",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {},
            success: function (returnData) {
                if (returnData.flag == 1) {
                    var pids = returnData.list.pids;
                    var fids = returnData.list.fids;

                    $.each($('.fav'), function (idx, item) {
                        for (var i = 0; i < pids.length; i++) {
                            if (pids[i] == $(this).attr('data-pid')) {
                                var fid = fids[i];
                                $(this).addClass("cur");
                                $(this).attr('data-fid', fid);
                                $(this).html("<span></span>已经加到心愿单");
                            }
                        }
                    });
                }
            }
        });
    };
//************************************************** M版 **************************************************//
    search.bindClickEvent_m = function () {
        search.bindClickEvent();

        $("#filter_div").on("click", function () {
            $(".filter-layer").css("display", "block");
            //弹出分类筛选div
            window.Search.bind_filter_category();
        });
        $("#a_filter_hide").on("click", function () {
            //隐藏
            window.Search.filter_hide();
        });

        //隐藏筛选框
        if ($("#category_level").val() <= 1) {
            $("#filter_div").hide();
        }

        //绑定加入购物车
        // $(".i-cart").on("click", function () {
        //     var thisDom = $(this);  //当前dom
        //     var pid = thisDom.parent().attr("data-product-id");
        //     add_cart_fly_m(pid, 1, "", function () {
        //         window.Product.getCartListByProduct_m();//重新遍历购物车数量
        //     });
        // });

        //排序选中事件
        var orderby = parseInt($("#orderby").val());
        a_order_sale.parent().removeClass("on");
        a_price_sale.parent().removeClass("on");
        a_release_time.parent().removeClass("on");
        a_review_count.parent().removeClass("on");
        switch (orderby) {
            case 1:
            case 2:
                a_order_sale.parent().addClass("on");
                break;
            case 3:
            case 4:
                a_price_sale.parent().addClass("on");
                break;
            case 5:
            case 6:
                a_release_time.parent().addClass("on");
                break;
            case 7:
            case 8:
                a_review_count.parent().addClass("on");
                break;
        }

    }

    //绑定分类筛选条件
    search.bind_filter_category = function () {
    }

    //隐藏过滤div
    search.filter_hide = function () {
        $(".filter-layer").css("display", "none");
    }



    //绑定搜索筛选条件
    search.bind_filter_search = function () {
        search_mask.show();
        var filter_div = search_mask.next();
        filter_div.show();


        //默认显示
        ul_filter_div.find("li").eq(0).addClass("active");

        //展开收起事件
        ul_filter_div.find(".filter_class_levle_1").each(function () {
            var current_a = $(this);

            current_a.unbind("click").bind("click", function () {
                //箭头
                ul_filter_div.find("li[class='active']").removeClass("active");
                current_a.parent().addClass("active");

                //层显示
                ul_filter_div.find("filter-level-2").hide();
                current_a.next().show();

            });


            //过滤没有必要的数据
            var tmp_count = 0;
            current_a.next().find("li").each(function () {
                if (tmp_count > 5) {
                    $(this).remove();
                }

                tmp_count++;
            });


        });

        //点击ul也可以跳转
        ul_filter_div.find(".filter_goto_a").each(function () {
            var option_ss = $(this);
            option_ss.parent().parent().unbind("click").bind("click", function () {
                location.href = option_ss.attr("href");
            });

        });

        //页面选中状态
        search.setOptionFilter_m();

        //情况没有结果的数据
        search.clearNotResult_m();

        //点击跳转
        search.bind_category_property_click_m();

        //过滤数据

    }


    //页面选中状态
    search.setOptionFilter_m = function (callback) {
        var option_str = decodeURIComponent($("#option_filter").val());

        if (option_str.length > 0) {

            var option_obj = $.parseJSON(option_str);

            if (option_obj.length > 0) {
                for (var i = 0; i < option_obj.length; i++) {
                    var op_tmp = option_obj[i];
                    ul_filter_div.find("a[data-id='" + op_tmp + "']").parent().parent().parent().find("a").removeClass("selected");
                    ul_filter_div.find("a[data-id='" + op_tmp + "']").addClass("selected");
                }
            }
        }

    };


    //情况没有结果的数据
    search.clearNotResult_m = function () {

        //没有赋值的，属性
        ul_filter_div.find("a[data-id^='property_option']").each(function () {
            var aobj = $(this)
            var txt = aobj.text();

            if (txt.indexOf("(0)") > -1) {
                aobj.parent().parent().hide();
            }
        });

        //没有赋值的，品牌
        ul_filter_div.find("a[data-id^='brand_name']").each(function () {
            var aobj = $(this)
            var txt = aobj.text();

            if (txt.indexOf("(0)") > -1) {
                aobj.parent().parent().hide();
            }
        });

    };

    //搜索的点击事件
    search.bind_category_property_click_m = function () {
        ul_filter_div.find("a").each(function () {
            var currentA = $(this);

            currentA.unbind("click").bind("click", function () {
                currentA.parent().parent().parent().find("a").removeClass("selected");
                currentA.addClass("selected");
            });
        });
    };

    //提交 搜索
    search.bind_search_sumbit_m = function () {
        //过滤url参数
        var currentURL = document.location.href;
        var url_tmp = removeUrlParam(parseURL(currentURL), "option_filter");

        //重新整理
        var aryOption = [];
        ul_filter_div.find("a").each(function () {
            var currentB = $(this);
            if (typeof (currentB.attr("data-id")) != "undefined" && currentB.attr("data-id") != null) {
                if (currentB.hasClass("selected") && currentB.attr("data-id").length > 0) {
                    aryOption.push(currentB.attr("data-id"));
                }
            }
        });

        var url_option = "";

        if (aryOption.length > 0) {
            url_option = "&option_filter=" + encodeURIComponent(JSON.stringify(aryOption));
        }

        //页面跳转
        location.href = url_tmp + url_option;
    }




    window.Search = search;
})(window);