(function (window) {
    var product_list = $("#product_list");
    var current_category_name = $("#current_category_name");
    var category_level = $("#category_level");
    var category_children_list = $("#category_children_list");
    var category_id = $("#category_id");
    var category_id_parent = $("#category_id_parent");
    var current_name_parent = $("#current_name_parent");
    var category_property_list = $("#category_property_list");
    var category_tree_info = $("#category_tree_info");
    var ul_filter_div = $("#ul_filter_div");
    var is_promotion = $("#is_promotion");
    var category_father_id;
    var brother_category_list = $("#brother_category_list");
    var property_option_list = $("#property_option_list");
    var site_id = $("#site_id");
    
    function category() {
    }

    category.getCategoryName = function (callback) {
        var cat_level = parseInt(category_level.val());
        var category_id = current_category_name.attr("data-id");
        category_father_id = current_category_name.attr("data-father-id");
        if(cat_level == 3){
            category_id = category_father_id;
        }
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/Category/getCategoryName",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {category_id: category_id},
            success: function (returnData) {
                if (returnData.flag == 1) {
                    current_category_name.html(returnData.category_info.name);
                }

                if (typeof (callback) == 'function')
                    callback();
            }
        });
    }

    category.getChildrenCategoryList = function (callback) {
        var cat_level = parseInt(category_level.val());

        if (cat_level == 1) {
            category.getChildrenCategoryListByPid(category_id.val(), cat_level);
        }
        else if (cat_level == 2) {
            category.getChildrenCategoryListByPid(category_id.val(), cat_level);
            category.getBrotherCategoryListByPid(category_id.val(), cat_level) ;
        }
        else if(cat_level == 3){
            category.getChildrenCategoryListByPid(category_father_id, cat_level);
            category.getBrotherCategoryListByPid(category_father_id, cat_level) ;
        }
        if (typeof (callback) == 'function')
            callback();

    }

    category.getChildrenCategoryListByPid = function (pid, level) {

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/Category/getChildrenCategoryListByPid",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {pid: pid},
            success: function (returnData) {
                var _html = '';
                if(level == 3)
                {
                     _html += '<span><a href=\"/List/index?cid=0-' + pid + '-0\">全部</a></span>'; 
                }
                $.each(returnData, function (idx, item) {
                    if (level == 1) {
                        var cat_url = "/List/index?cid=0-" + item.category_id + "-0";
                        _html += '<span><a href="' + cat_url + '">' + item.name + '</a></span>';
                    } else if (level == 2) {
                        var cat_url = "/List/index?cid=0-0-" + item.category_id;
                        _html += '<span><a href="' + cat_url + '">' + item.name + '</a></span>';
                    }else if (level == 3) {
                        var cat_url = "/List/index?cid=0-0-" + item.category_id;
                                                   
                        if(category_id.val() == item.category_id){
                            _html += "<span><a style='color:#2BBC69' href='" + cat_url + "'>" + item.name + "</a></span>"; 
                        }else{
                            _html += '<span><a href="' + cat_url + '">' + item.name + '</a></span>'; 
                        }
                       
                    }
                });

                category_children_list.html(_html);
            }
        });
    };
    //取得二级类目的所有平级类目
    category.getBrotherCategoryListByPid = function (pid, level) {
        var parent_id;
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/Category/getBrotherCategoryListByPid",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {pid: pid,site_id:site_id.val()},
            success: function (returnData) {
                 var _html = '';
                
                $.each(returnData, function (idx, item) {                   
                    if (level == 2 || level == 3) {
                        var cat_url = "/List/index?cid=0-" + item.category_id + "-0";
                        _html += '<a href="' + cat_url + '">' + item.name + '</a>';
                    }
                    parent_id = item.parent_id;                     

                });
                   _html += '</dl></li>';

                   _html = '<li class=\"category\" ><dl class=\"clearfix\"><dt>所有类目</dt><dd><a href=\"/List/index?cid='+ parent_id +'-0-0\" class=\"cur\">全部</a>' + _html;

                brother_category_list.html(_html);
            }
        });
    };

//取得分类数信息
    category.getCategoryTreeInfo = function () {
        var return_obj;

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/Category/getCategoryTreeInfo",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {category_id: category_id.val(),site_id:site_id.val()},
            success: function (returnData) {
                if (returnData.flag) {
                    var _name = '<span><a href="/">全部</a></span>';

                    $.each(returnData.category_info, function (i, item) {
                        if (i == 0) {
                            _name += '<span><a href="/list/index?cid=' + item.category_id + '-0-0">' + item.name + "</a></span>";
                        }
                        else if (i == 1) {
                            _name += '<span><a href="/list/index?cid=0-' + item.category_id + '-0">' + item.name + "</a></span>";
                        }
                        else if (i == 2) {
                            _name += '<span><a href="/list/index?cid=0-0-' + item.category_id + '">' + item.name + "</a></span>";
                        }
                    });
                }

                category_tree_info.html(_name);
            }
        });

        return return_obj;
    };
    //被选中的属性特殊显示
    category.getOptions = function(){
        var options = $("#option_filter").val();
        
        options=options.substr(1);
        var len=options.length;
        options=options.substr(0,(len-1));
        
         property_option_list.find("a").each(function () {
                    var currentC = $(this);
                       // alert(currentC.attr("data-id"));
                    if (typeof (currentC.attr("data-id")) != "undefined" && currentC.attr("data-id") != null) {    
                        if (currentC.attr("data-id").length > 0 &&  options.indexOf(currentC.attr("data-id")) > 0 ) {
                            currentC.addClass("tag_on");
                            currentC.attr("data-is-choose",1);
                            currentC.append("<i class=\"icon i-del\"></i>");
                            currentC.parent().find(".tag_all").attr("data-is-choose",1);
                        }else{
                           currentC.removeClass("tag_on"); 
                           currentC.remove("i");
                        }
                    }
                });
    };
    category.bind_property_option_click = function () {

        property_option_list.find("a").each(function () {
            var currentA = $(this);

            currentA.unbind("click").bind("click", function () {
                if(currentA.attr("data-is-choose") == 1){
                    currentA.attr("data-id",'')
                }
                var option_data_id = currentA.attr("data-id");

                currentA.addClass("tag_on");

                //过滤url参数
                var keyStr;
                var currentURL = document.location.href;
                var url_tmp = removeUrlParam(parseURL(currentURL), "option_filter");
                if(url_tmp.indexOf('#') > 1){
                    var url_new = url_tmp.substring(0,url_tmp.indexOf('#'));
                    keyStr = url_tmp.substring(url_tmp.indexOf('#')+1);
                }else{
                    var url_new = url_tmp;
                }
                


                //重新整理
                var aryOption = [];
                property_option_list.find("a").each(function () {
                    var currentB = $(this);
                    //属相回到全部
                    if(currentB.attr("class") == "tag_all tag_on" && currentB.attr("data-is-choose") == 1)
                    {
                        currentB.parent().find(".tag_on").removeClass("tag_on");
                    }
                    //添加筛选属性条件
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
                if(currentURL==(url_new + url_option))
                {
                     return false;                    
                }
               // alert(url_option);
                location.href = url_new + url_option + "#" + keyStr;

            });
        });
    };

    //显示心愿单
    category.showFavorite = function () {
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
    //取得当前分类的属性列表
    category.getCategoryPropertyList_m = function () {
        var category_id = $("#category_id").val();

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/Category/getCurrentCategoryPropertyList",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {category_id: category_id, type: 1},
            success: function (returnData) {
                if (returnData.flag) {
                    var option_list = "";

                    //html
                    var _html = "";
                    var currentURL = document.location.href;
                    var url_tmp = removeUrlParam(parseURL(currentURL), "ppid_filter");

                    var i = 0;
                    $.each(returnData.category_property, function (idx, item) {
                        if (i == 0)
                            _html += '<li class="active">';
                        else
                            _html += '<li>';

                        _html += '<h4 class="filter_class_levle_1">' + item[0].property_name + '</h4>';

                        if (i == 0)
                            _html += '<ul class="filter-level-2">';
                        else
                            _html += '<ul class="filter-level-2" style="display:none;">';

                        var ii = 0;
                        _html += '<li><h5><a href="' + url_tmp + '" target="_self" class="filter_goto_a">全部</a></h5></li>';
                        _html += '<ul class="filter-level-3">';

                        $.each(item, function (idx2, itme2) {

                            var new_url = url_tmp + "&ppid_filter=" + itme2.option_id;

                            _html += '<li><h6><a href="' + new_url + '" data-id="option_id_' + itme2.option_id + '" target="_self" class="filter_goto_a">' + itme2.option_name + '</a></h6></li>';

                            option_list += itme2.option_id + "-";

                            if (ii > 5) {
                                return false;
                            }

                            ii++;

                        });

                        _html += '</ul>';

                        _html += '</ul>';
                        _html += '</li>';

                        i++;

                    });

                    ul_filter_div.append(_html);

                    //属性后面的个数
                    var option_list = $.parseJSON(window.property_option_facet);

                    $.each(option_list, function (idx, item) {

                        if (typeof (item) != 'undefined' && item > 0) {
                            //显示 数量
                            ul_filter_div.find("a[data-id='option_id_" + idx + "']").append("(" + item + ")");
                        }

                    });

                    //没有赋值的，清空
                    ul_filter_div.find("a[data-id^='option_id']").each(function () {
                        var aobj = $(this)
                        var txt = aobj.text();
                        if (txt.indexOf("(") > 0 && txt.indexOf(")") > 0) {
                            //
                        }
                        else
                            aobj.parent().parent().hide();
                    });



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


                    });

                    //点击ul也可以跳转
                    ul_filter_div.find(".filter_goto_a").each(function () {
                        var option_ss = $(this);
                        option_ss.parent().parent().unbind("click").bind("click", function () {
                            location.href = option_ss.attr("href");
                        });

                    });

                }

            }
        });
    };


    category.getChildrenCategoryList_m = function (callback) {
        var cate_list_tit = $(".cate-list-tit");

        var cat_level = parseInt(category_level.val());

        if (cat_level == 1) {
            category.getChildrenCategoryListByPid_m(category_id.val(), cat_level);
        }
        else if (cat_level == 2) {
            category.getChildrenCategoryListByPid_m(category_id.val(), cat_level);
        }
        else {
            category.getChildrenCategoryListByPid_m_level3(category_id_parent.val(), 3);

        }

        if (typeof (callback) == 'function')
            callback();

    }


    category.getCategoryName_m = function (callback) {
        var category_id = $("#category_id").val();

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/Category/getCategoryName",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {category_id: category_id},
            success: function (returnData) {
                if (returnData.flag == 1) {
                    $(".cate-list-tit").find("h4").eq(0).html(returnData.category_info.name);
                }

                if (typeof (callback) == 'function')
                    callback();
            }
        });
    }

    category.getChildrenCategoryListByPid_m = function (pid, level) {
        var category_layer = $(".category-layer").find("ul").eq(0);

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/Category/getChildrenCategoryListByPid",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {pid: pid},
            success: function (returnData) {
                var _html = '';

                //全部
                if (level == 1) {
                    //_html += '<li><a href="/list/main" target="_self">全部</a><i class="more"></i></li>';
                }
                else if (level == 2) {
                    var cat_url = "/List/index?cid=" + category_id_parent.val() + "-0-0";
                    _html += '<li><a href="' + cat_url + '" target="_self">' + current_name_parent.val() + ' 全部</a><i class="more"></i></li>';
                }

                $.each(returnData, function (idx, item) {
                    if (level == 1) {
                        var cat_url = "/List/index?cid=0-" + item.category_id + "-0";
                        _html += '<li><a href="' + cat_url + '" target="_self">' + item.name + '</a><i class="more"></i></li>';
                    } else if (level == 2) {
                        var cat_url = "/List/index?cid=0-0-" + item.category_id;
                        _html += '<li><a href="' + cat_url + '" target="_self">' + item.name + '</a><i class="more"></i></li>';
                    }
                });

                category_layer.html(_html);
            }
        });
    };


    category.getChildrenCategoryListByPid_m_level3 = function (pid) {
        var category_layer = $(".category-layer").find("ul").eq(0);

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/Category/getChildrenCategoryListByPid",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {pid: pid},
            success: function (returnData) {
                var _html = '';

                //全部
                var cat_url = "/List/index?cid=0-" + category_id_parent.val() + "-0";
                _html += '<li><a href="' + cat_url + '" target="_self">' + current_name_parent.val() + ' 全部</a><i class="more"></i></li>';

                $.each(returnData, function (idx, item) {
                    var cat_url = "/List/index?cid=0-0-" + item.category_id;
                    _html += '<li><a href="' + cat_url + '" target="_self">' + item.name + '</a><i class="more"></i></li>';
                });

                category_layer.html(_html);
            }
        });
    };

    window.Category = category;
})(window);

