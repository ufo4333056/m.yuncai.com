__page = 1;
__page_total = 0;
__page_size = 10;

function bindPage(callback, page_count) {

    __page_total = Math.ceil(page_count);

    isShowPage(callback);

    $("#prePage").unbind("click").bind("click", function () {
        __page--;

        if (__page <= 0) {
            __page = 1;
        }

        if (typeof (callback) == 'function') {
            callback();
        }
        else {
            if (callback.indexOf("?") > -1) {
                callback = removeUrlParam(parseURL(callback), "page"); 
                if(callback.indexOf("#keyStr") > 0){
                   url_key_ = callback.split("#keyStr");
                   location.href = url_key_[0] + "&page=" + __page+"#keyStr"+url_key_[1];
                }else{
                    location.href = callback + "&page=" + __page;
                }
            } else {
                if(callback.indexOf("#keyStr") > 0){
                   url_key_ = callback.split("#keyStr");
                   location.href = url_key_[0] + "?page=" + __page+"#keyStr"+url_key_[1];
                }else{
                    location.href = callback + "?page=" + __page;
                }
            }    
        }


    });

    $("#nextPage").unbind("click").bind("click", function () {
        __page++;

        if (typeof (callback) == 'function')
        {
            callback();
        }
        else
        {
            if (callback.indexOf("?") > -1) {
                callback = removeUrlParam(parseURL(callback), "page"); 
                if(callback.indexOf("#keyStr") > 0){
                   url_key_ = callback.split("#keyStr");
                   location.href = url_key_[0] + "&page=" + __page+"#keyStr"+url_key_[1];
                }else{
                    location.href = callback + "&page=" + __page;
                }
            } else {
                if(callback.indexOf("#keyStr") > 0){
                   url_key_ = callback.split("#keyStr");
                   location.href = url_key_[0] + "?page=" + __page+"#keyStr"+url_key_[1];
                }else{
                    location.href = callback + "?page=" + __page;
                }
            }            
        }

    });

}

function isShowPage(callback) {

    if (__page_total > 3) {
        if (__page == 1) {
            $("#prePage").hide();
        }
        else {
            $("#prePage").show();
        }

        if (__page >= __page_total) {
            $("#nextPage").hide();
        }
        else {
            $("#nextPage").show();
        }
    }


    if (__page_total <= 1) {
        $("#prePage").hide();
        $("#nextPage").hide();
        $(".page_list").hide();


        __page_total = 1;
    }

    if (__page == 1) {
        $("#prePage").hide();
    }
    if (__page_total == __page) {
        $("#nextPage").hide();
    }

    // if (__page_total % __page_size > 0 && __page_total > 1)
    //     __page_total++;


    $(".page_list").empty();
    var is_print_point = false;

    for (var i = 1; i <= __page_total; i++) {
        var is_select = i == __page ? 'cur' : '';

        if (__page_total <= 10) {
            $(".page_list").append("<a style='cursor:pointer' class='" + is_select + "'> " + i + " </a>");
        }
        else {
            if (i <= 3) {
                $(".page_list").append("<a style='cursor:pointer' class='" + is_select + "'> " + i + " </a>");
            }
            else if (i >= __page_total - 3) {
                $(".page_list").append("<a style='cursor:pointer' class='" + is_select + "'> " + i + " </a>");


            }
            else if (__page == i) {
                if (__page > 4 && __page < __page_total - 4) {
                    $(".page_list").append("..<a style='cursor:pointer' class=''> " + (i - 1) + " </a>");
                    $(".page_list").append("<a style='cursor:pointer' class='" + is_select + "'> " + i + " </a>");
                    $(".page_list").append("<a style='cursor:pointer' class=''> " + (i + 1) + " </a>..");
                }
                else if (__page == 4) {
                    $(".page_list").append("<a style='cursor:pointer' class='" + is_select + "'> " + i + " </a>..");

                } else {
                    $(".page_list").append("..<a style='cursor:pointer' class='" + is_select + "'> " + i + " </a>");
                }
            }
            else {
                if (!is_print_point) {
                    is_print_point = true;
                    $(".page_list").append("<font class='is_print_point'>..</font>");
                }

                if (__page >= 4 && (__page <= __page_total - 4)) {
                    $(".page_list").find("font[class='is_print_point']").remove();//情况多余的标点
                }

                continue;
            }

        }
    }

    $(".page_list").find("a").each(function () {
        $(this).unbind("click").bind("click", function () {
            __page = parseInt($(this).html());

            if (__page <= 0)
                __page = 1;

            if (typeof (callback) == 'function') {
                callback();
            }
            else
            {
                if (callback.indexOf("?") > -1) {
                    callback = removeUrlParam(parseURL(callback), "page"); 
                    if(callback.indexOf("#keyStr") > 0){
                       url_key_ = callback.split("#keyStr");
                       location.href = url_key_[0] + "&page=" + __page+"#keyStr"+url_key_[1];
                    }else{
                        location.href = callback + "&page=" + __page;
                    }
                } else {
                    if(callback.indexOf("#keyStr") > 0){
                       url_key_ = callback.split("#keyStr");
                       location.href = url_key_[0] + "?page=" + __page+"#keyStr"+url_key_[1];
                    }else{
                        location.href = callback + "?page=" + __page;
                    }
                }    
            }

        });

    });

}

