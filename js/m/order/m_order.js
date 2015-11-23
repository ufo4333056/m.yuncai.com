var sub_pay_price = -1;
var sub_points = 0;
var sub_balance = 0;
var sub_chunbo_card = 0;
var sub_coupons_amount = 0;
var sub_coupons_number = 0;
var member_id = $("#sub_member_id").val();
var orther_price = 0;
//商品列表
var product_list_show = 1;

(function($){
    $.fn.orderIndex = function(options) {
        var settings = {
        };
        settings = $.extend({}, settings, options);
        //判断积分 余额 春播卡 券 在右边是否展示
        $("#use_points").val("");
        $("#use_balance").val("");
        $("#chunbo_card").val("");
        $("#sub_points").val("");
        $("#sub_balance").val("");
        $("#sub_chunbo_card").val("");
        $("#sub_coupons_amount").val("");
        $("#sub_coupons_number").val("");

        $(".use_price_checkbox").unbind("click").bind("click", function() {
            var use_type = $(this).siblings("input").attr("name");
            if ($(this).siblings("input").val() == 0) {
                if (usePrice(use_type, "use") === false) {
                    return;
                }
                localStorage.setItem(use_type, 1);
                $(this).addClass("switch-on");
                $(this).siblings("input").val(1);
            } else if ($(this).siblings("input").val() == 1) {
                usePrice(use_type, "cancel");
                localStorage.removeItem(use_type);
                $(this).removeClass("switch-on");
                $(this).siblings("input").val(0);
            }
        });

        $(".show_price_checkbox").unbind("click").bind("click", function() {
            if ($(this).siblings("input").val() == 1) {
                $(this).addClass("switch-on");
                $(this).siblings("input").val(0);
                localStorage.setItem("not_show_price", 1);
            } else if ($(this).siblings("input").val() == 0) {
                $(this).removeClass("switch-on");
                $(this).siblings("input").val(1);
                localStorage.removeItem("not_show_price");
            }
        });

        $(".order-address").unbind("click").bind("click", function() {
            window.location.href = "/Order/getAddressList";
        });

        $("#invoice").unbind("click").bind("click", function() {
            window.location.href = "/Order/editInvoice";
        });

        $("#coupon_list").unbind("click").bind("click", function() {
            window.location.href = "/Order/getCouponList";
        });

        //发票信息
        var invoice_str = localStorage.getItem("invoice");
        if (invoice_str !== null) {
            var invoice = JSON.parse(invoice_str);
            if (invoice.title_id == '2') {
                $("#invoice_title").html(invoice.title_text);
            } else {
                $("#invoice_title").html("个人");
            }
            $("#invoice_content").html(invoice.content);
            $("#needInvoice").val(1);
        }

        var product_total_price_all = $("#product_total_price_all").val();
        sub_pay_price = product_total_price_all;
        $("#total_price").html("￥" + product_total_price_all);
        $("#pay_money").html("￥" + product_total_price_all);
        $("#sub_total_price").val(product_total_price_all);

        $(".product_list").each(function(){
            $(this).unbind("click").bind("click", function(){
                if($(this).next(".product_detail").css("display")=="none"){
                    $(this).next(".product_detail").show();
                }else{
                    $(this).next(".product_detail").hide(); 
                }
            });        
        });

        //礼券信息
        var coupon_exist = localStorage.getItem("useCoupon");
        if (coupon_exist !== null) {
            usePrice("coupons", "use");
        } else {
            usePrice("coupons", "cancel");
        }

        //积分
        var use_points = localStorage.getItem("points");
        if (use_points !== null) {
            usePrice("points", "use");
            $("#points").val(1).siblings("span").addClass("switch-on");
        }

        //礼品卡
        var use_giftcard = localStorage.getItem("chunbo_card");
        if (use_giftcard !== null) {
            usePrice("chunbo_card", "use");
            $("#chunbo_card").val(1).siblings("span").addClass("switch-on");
        }

        //余额
        var use_balance = localStorage.getItem("balance");
        if (use_balance !== null) {
            usePrice("balance", "use");
            $("#balance").val(1).siblings("span").addClass("switch-on");
        }

        var not_show_price = localStorage.getItem("not_show_price");
        if (not_show_price !== null) {
            $("#is_show_price").val(0).siblings("span").addClass("switch-on");
        }

        getOrderDate();
    };
})(Zepto);

//获取订单时间
function getOrderDate() {
    for(var i = 0;i < order_num;i++){
        var send_date = localStorage.getItem("select_send_date"+i);
        var order_date = eval("send_date_arr"+i);
        if(send_date != null){
            if(order_date.indexOf(send_date) >= 0) { 
                $("#select_send_date"+i).find("option[value='"+send_date+"']").attr("selected",true);
                $("#select_send_date"+i).val(send_date);
            }else {
                if(order_date.length > 0){
                    alert("更换地址后，您需要重新确认配送时间"); 
                }
            }    
            changeItemDateHandler($("#select_send_date"+i));
        }
    }     
} 

//清除选定订单时间
function clearOrderDate() {
    for(var i = 0;i < order_num;i++){
        localStorage.removeItem("select_send_date"+i);
    }     
}

//使用积分余额 春播券
function formatMoney(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

function changeItemDateHandler(obj) {
    $(obj).siblings("h6").children("small").html($(obj).find("option:selected").text());
    var date_tag_name = $(obj).attr("id");  
    var date_value = $(obj).val();          
    $(obj).siblings("#book_date").val(date_value);
    localStorage.setItem(date_tag_name, date_value);
}

//删除收货地址
function delete_address(address_id) {
    if (confirm("确认删除收货地址")) {
        var member_id = $("#sub_member_id").val();
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/Order/deleteAddress",
            data: {"address_id": address_id, "member_id": member_id},
            success: function(returnData) {
                if (returnData.flag == 1) {
                    alert("删除成功");
                    window.location.href = "/Order/manageAddress";
                } else {
                    alert("删除失败");
                }
            }
        });
    }

}

function submitAddr() {
    if($("input[name='consignee']").val() == ""){
        alert("姓名不能为空");
        return false;
    }
    if($("input[name='phone']").val() == ""){
        alert("手机号不能为空");
        return false;
    }
    if($("#district_id").val() == ""){
        alert("区/县地址不能为空");
        return false;
    }
    if($("#delivery_id_add").val() == ""){
        alert("环路地址不能为空");
        return false;
    }
    if($("input[name='address']").val() == ""){
        alert("详细地址不能为空");
        return false;
    }
    $("#submitAddr").click();
    return false;
}

function changePrice() {
    var sub_total_price = $("#sub_total_price").val();
    sub_pay_price = formatMoney(sub_total_price) - formatMoney(sub_coupons_amount) - formatMoney(sub_points) - formatMoney(sub_balance) - formatMoney(sub_chunbo_card);
    if (sub_pay_price < 0) {
        sub_pay_price = 0;
        $("#invoice_box_disabled").hide();  
        $("#invoice_box_disabled2").show(); 
    }else{
        $("#invoice_box_disabled2").hide(); 
        $("#invoice_box_disabled").show();  
    }
    $("#pay_money").html("￥" + formatMoney(sub_pay_price));
}
function usePrice(type, useType) {
    if (useType == "use") {
        if (sub_pay_price <= 0 && sub_pay_price != -1) {
            alert("支付金额已经0");
            return false;
        }
    }
    switch (type) {
        case "chunbo_card"://春播卡            
            var old_chunbo_card = parseFloat($("#old_chunbo_card").val());
            if (useType == "use") {
                if (old_chunbo_card == "" || isNaN(old_chunbo_card) || old_chunbo_card == 0) {
                    alert("余额不能为空");
                    return false;
                }
                sub_chunbo_card = parseFloat(old_chunbo_card);
                if (sub_pay_price <= sub_chunbo_card) {
                    sub_chunbo_card = sub_pay_price;
                }
                changePrice();
                var old_chunbo_card_cancel = (old_chunbo_card - sub_chunbo_card).toFixed(2);
                $("#old_chunbo_card").val(old_chunbo_card_cancel);
                $("#chunbo_card_html").html("已用" + formatMoney(sub_chunbo_card) + "元");

                $("#show_chunbo_card_price").show();
                $("#use_chunbo_card").html("-￥" + formatMoney(sub_chunbo_card));

                $("#sub_chunbo_card").val(sub_chunbo_card);
            } else {
                var old_chunbo_card_cancel = (old_chunbo_card + parseFloat(sub_chunbo_card)).toFixed(2);
                $("#old_chunbo_card").val(old_chunbo_card_cancel);
                $("#chunbo_card_html").html("可用" + old_chunbo_card_cancel + "元");

                $("#show_chunbo_card_price").hide();
                $("#use_chunbo_card").html("");

                $("#sub_chunbo_card").val('');
                sub_chunbo_card = 0;
                changePrice();
            }
            break;
        case "points"://使用
            var old_points = parseFloat($("#old_points").val());//原积分
            if (useType == "use") {
                if (old_points == "" || isNaN(old_points)) {
                    alert("积分不能为空");
                    return false;
                }

                sub_points = parseFloat(old_points) / 100;//扣除的积分
                if (sub_pay_price <= sub_points) {
                    sub_points = sub_pay_price;
                }
                changePrice();
                var old_points_cancel = old_points - parseFloat(formatMoney(sub_points * 100));//扣除后的积分
                var rest_points_price = parseFloat(old_points_cancel) / 100;
                //上部显示
                $("#old_points").val(old_points_cancel);
                $("#points_html").html("已用" + (sub_points * 100) + "积分，抵" + formatMoney(sub_points) + "元");

                //下部显示
                $("#show_points_price").show();
                $("#use_points").html("-￥" + formatMoney(sub_points));

                //隐藏
                $("#sub_points").val(sub_points);
            } else {
                var old_points_cancel = old_points + sub_points * 100;
                var rest_points_price = parseFloat(old_points_cancel) / 100;
                $("#old_points").val(old_points_cancel);
                $("#points_html").html("可用" + old_points_cancel + "积分，抵" + rest_points_price + "元");

                $("#show_points_price").hide();
                $("#use_points").html("");

                $("#sub_points").val("");
                sub_points = 0;
                changePrice();
            }
            break;
        case "balance"://使用
            var old_balance = parseFloat($("#old_balance").val());
            if (useType == "use") {
                if (old_balance == "" || isNaN(old_balance) || old_balance == 0) {
                    alert("余额不能为空");
                    return false;
                }
                sub_balance = parseFloat(old_balance);
                if (sub_pay_price <= sub_balance) {
                    sub_balance = sub_pay_price;
                }
                changePrice();
                var old_balance_cancel = (old_balance - sub_balance).toFixed(2);
                $("#old_balance").val(old_balance_cancel);
                $("#balance_html").html("已用" + formatMoney(sub_balance) + "元");

                $("#show_balance_price").show();
                $("#use_balance").html("-￥" + formatMoney(sub_balance));

                $("#sub_balance").val(sub_balance);
            } else {
                var old_balance_cancel = (old_balance + parseFloat(sub_balance)).toFixed(2);
                $("#old_balance").val(old_balance_cancel);
                $("#balance_html").html("可用" + old_balance_cancel + "元");

                $("#show_balance_price").hide();
                $("#use_balance").html("");

                $("#sub_balance").val('');
                sub_balance = 0;
                changePrice();
            }
            break;
        case "coupons"://未使用
            if (useType == "use") {
                var chosen_coupon = localStorage.getItem("useCoupon").split(",");
                var coupons_number = chosen_coupon[1];
                var coupons_type = chosen_coupon[2];
                var amount = chosen_coupon[4];
              //  if (coupons_type == 1) {
                    //A券
                    sub_coupons_amount = parseFloat(amount);
                    if (sub_pay_price <= sub_coupons_amount) {
                        sub_coupons_amount = sub_pay_price;
                    }
                    sub_coupons_number = coupons_number;
                    changePrice();
                    $("#coupons_html").html("已抵用" + sub_coupons_amount + "元");
                    $("#show_coupons_price").show();
                    $("#use_coupons").html("-￥" + formatMoney(sub_coupons_amount));
                    $("#sub_coupons_amount").val(sub_coupons_amount);
                    $("#sub_coupons_number").val(sub_coupons_number);
               // } else {
                    //B券
                //}
            } else {
                $("#coupons_html").html("已抵用0元");
                $("#show_coupons_price").hide();
                $("#use_coupons").html("");

                $("#sub_coupons_amount").val('');
                $("#sub_coupons_number").val('');
                sub_coupons_amount = 0;
                sub_coupons_number = "";
                changePrice();
            }
            break;
    }
}

//获取商品列表公共部分
function getProductList(delivery_id) {
    var product_list_param = new Object();
    if (delivery_id != "" && typeof (delivery_id) != "undefined") {
        product_list_param.delivery_id = delivery_id;
    }
    var is_presale = $("#sub_is_presale").val();
    if (is_presale == 1) {
        product_list_param.is_presale = 1;
    }
    $.ajax({
        type: 'post',
        dataType: 'html',
        url: "/Order/getProductList",
        data: product_list_param,
        success: function(returnData) {
            if (returnData.flag == 0) {
                $.each(returnData.data, function(i, item) {
                    _html += item + "库存不足\n";
                });
                alert(_html);
                var redirect_url = $("#sub_redirect_url").val();
                window.location.href = redirect_url;
                return;
            }
            if (returnData.length > 100) {
                $("#product_list_html").html(returnData);
                changePrice();
            } else {
                var redirect_url = $("#sub_redirect_url").val();
                //window.location.href = redirect_url;return;                  
            }
            sub_pay_price = parseFloat($("#product_total_price_all").val());
        }
    });
}

//处理代金券
function select_coupons(thisa, divClass) {
    var is_disabled_btn = $("#is_disabled_coupons");
    if (is_disabled_btn.hasClass("disabled_li")) {
        return false;
    }
    var thisflag = $(thisa).attr("flag");
    if (thisflag == 1) {
        $(thisa).attr("flag", 0);
        $("." + divClass).show();
    } else {
        $("." + divClass).hide();
        $(thisa).attr("flag", 1);
    }
    //隐藏已经选中的券
    var sub_coupons_number = $("#sub_coupons_number").val();
    var coupons_id = $("#coupons_id_temp").val();
    if (sub_coupons_number != "" && coupons_id != "") {
        $("#coupons_" + coupons_id).hide();
    }
}
//选择券
function selectConpons(thisa, conpons_id) {
    var coupons_number = $("#coupons_number_" + conpons_id).val();
    var coupons_type = $("#coupons_type_" + conpons_id).val();
    var sku = $("#coupons_sku_" + conpons_id).val();
    var amount = $("#coupons_amount_" + conpons_id).val();
    var coupons_html = $(thisa).html();
    $("#conpons_val").html(coupons_html);
    $("#coupons_number_temp").val(coupons_number);
    $("#coupons_id_temp").val(conpons_id);
    $("#coupons_type_temp").val(coupons_type);
    $("#coupons_sku_temp").val(sku);
    $("#coupons_amount_temp").val(amount);
    $(".privilege_slide").hide();
}

//展示第三级区域
function loadCountys(obj, delivery_id_type) {
    var delivery_parent_id = $(obj).val();
    var region_url = "/Order/getDelivery";
    if (delivery_parent_id) {
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: region_url,
            data: {
                "region_id": delivery_parent_id
            },
            success: function(returnData) {
                if (returnData.flag == 1) {
                    var _html = "<option value=''>请选择环路</option>";
                    $.each(returnData.list, function(i, item) {
                        _html += "<option value='" + item.deliveryCode + "'>" + item.deliveryName + "</option>";
                    });
                    $("#" + delivery_id_type).html(_html);
                }
            }
        });
    }
    return false;
}

//展示第四级区域
function getCountys(region_ids, delivery_id) {
    var region_url = "/Order/getDelivery";
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: region_url,
        data: {
            "region_id": region_ids
        },
        success: function(returnData) {
            if (returnData.flag == 1) {
                var _html = "<option value=''>请选择环路</option>";
                $.each(returnData.list, function(i, item) {
                    var sel = "";
                    if (delivery_id == item.deliveryCode) {
                        sel = " selected='selected'";
                    }
                    _html += "<option value='" + item.deliveryCode + "' " + sel + ">" + item.deliveryName + "</option>";
                });
                $("#delivery_id_edit").html(_html);
            }
        }
    });
}

//获取三级地区
function getDistrict(obj, type) {

    var city_id = $(obj).val();
    var province_id = '';
    if(city_id=='110100'){
        var province_id = '110000';
    }else if(city_id=='310100'){
        var province_id = '310000';
    }
    $("#province_id_"+type).val(province_id);
    var district_list = TABMap[city_id].list;

    var district_html = "<option value=''>请选择区/县</option>";
    var delivery_html = "<option value=''>请选择环路</option>";
    $.each(district_list, function (i, item) {
        district_html += "<option value='" + i +"'>" + item.name + "</option>";
    });
    $("#district_id_"+type).html(district_html);
    $("#delivery_id_"+type).html(delivery_html);
}

//展示四级地区
function getDelivery(obj, type){
    var city_id = $("#city_id_"+type).val();
    var district_id = $(obj).val();
    var delivery_list = TABMap[city_id].list[district_id].list;
    
    var delivery_html = "<option value=''>请选择环路</option>";
    $.each(delivery_list, function (i, item) {
        delivery_html += "<option value='" + i +"'>" + item.name + "</option>";
    });
    $("#delivery_id_"+type).html(delivery_html);
}

//展示地址
function showAddress(city_id,district_id,delivery_id,type){
    var city_list = TABMap;
    if(city_id==0 && district_id==0 && delivery_id==0) {
        var city_html = "<option value=''>请选择市</option>";
        var district_html = "<option value=''>请选择区/县</option>";
        var delivery_html = "<option value=''>请选择环路</option>";
        $.each(city_list, function (i, item) {
            city_html += "<option value='" + i + "' >" + item.name + "</option>";
        });
        $("#city_id_"+type).html(city_html);
        $("#district_id_"+type).html(district_html);
        $("#delivery_id_"+type).html(delivery_html);
        return false;
    }
    var district_list = city_list[city_id].list;          
    var delivery_list = district_list[district_id].list;
    $(".add_new_address").addClass("hide");
    var city_html = "<option value=''>请选择市</option>";
    $.each(city_list, function (i, item) {
        var sel = "";
        if(city_id == i) {
            sel = " selected='selected'";
        }
        city_html += "<option value='" + i + "' "+sel+">" + item.name + "</option>";
    });
    $("#city_id_"+type).html(city_html);
    
    var district_html = "<option value=''>请选择区/县</option>";
    $.each(district_list, function (i, item) {
        var sel = "";
        if(district_id == i){
            sel = " selected='selected'";
        }
        district_html += "<option value='" + i +"' "+sel+">" + item.name + "</option>";
    });
    $("#district_id_"+type).html(district_html);

    var delivery_html = "<option value=''>请选择环路</option>";
    $.each(delivery_list, function (i, item) {
        var sel = "";
        if(delivery_id == i){
            sel = " selected='selected'";
        }
        delivery_html += "<option value='" + i +"' "+sel+">" + item.name + "</option>";
    });
    $("#delivery_id_"+type).html(delivery_html);
}

//获取春播卡余额
function getChunboCard(member_id) {
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: "/Order/getChunboCard",
        data: {"member_id": member_id},
        success: function(returnData) {
            if (returnData.flag == 1) {
                $("#is_disabled_chunbo_card").removeClass("disabled_li");
                $("#chunbo_card").removeAttr("disabled");
                $("#old_chunbo_card").html(formatMoney(returnData.balance));
            }
        }
    });
}
//获取地址列表
function getAddressList() {
    $.ajax({
        type: 'post',
        dataType: 'html',
        url: "/Order/getAddressList",
        success: function(returnData) {
            selected_default_address();
        }
    });
}

//切换选中的配送地址
function selected_addr(obj, now_addr_id) {
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: "/Order/editAddress",
        data: {"address_id": now_addr_id},
        success: function(returnData) {
            if (returnData.flag == 1) {
                $(obj).addClass("selected");
                $(obj).siblings("li").removeClass("selected");
                window.location.href = "/Order/index";
            } else {
                alert("选择地址失败，请您重试。");
            }
        }
    });
}
//默认地址选中
function selected_default_address() {
    var first_addr = $("#show_address_list li").eq(0);
    var addr_id = first_addr.attr("name");
    first_addr.addClass("cur");
    var _html = '<b style="color:#2BBC69;font-weight:400;" class="success"><span></span>配送至此地址</b>';
    $("#address_btn_" + addr_id).children(".btn").replaceWith(_html);
    var delivery_id = $("#selected_addr_delivery_id_" + addr_id).val();
    getProductList(delivery_id);
    alert("更换地址后，您需要重新确认配送时间");
}
//四级地址
function is_show_err(thisa) {
    if ($(thisa).val()) {
        $(thisa).next().hide();
    }
}

function closeById(eid) {
    $(eid).hide();
    $(".modal-mask").hide();
}

//页面刷新判断发票信息是否展示
function is_show_invoice() {
    var needInvoice = $("#sub_needInvoice").val();
    if (needInvoice == 1) {
        var invoice_title = $("#sub_invoice_title").val();
        var invoice_content = $("#sub_invoice_content").val();
        $("#invoice_detail_div").show();
        $("#invoice_title_html").html(invoice_title);
        $("#invoice_content_html").html(invoice_content);
    }

}
//发票按钮切换
function invoice_fun(thisa, type, type2) {
    if (type == "title") {
        $(".invoice_title").removeClass("cur");
        $(thisa).addClass("cur");
        $("#companyNameText").val("");
        if (type2 == "com") {
            $("#companyNameText_ishow").show();
        } else {
            $("#companyNameText_ishow").hide();
        }
    } else if (type == "content") {
        $(".invoice_content").removeClass("cur");
        $(thisa).addClass("cur");
        $("#sub_invoice_content").val(type2);
    }
}
//添加发票信息
function addInvoice(type) {
    if (type == "save") {
        var sub_invoice_title;
        var sub_invoice_content;
        if ($("#companyNameText_ishow").is(":hidden")) {
            var title = "个人";
            $("#sub_invoice_title").val("个人");
        } else {
            var invoice_content = $("#companyNameText").val();
            if (invoice_content.replace(/(^\s*)|(\s*$)/g, "") == "") {
                alert("发票抬头必须填写");
                return;
            }
            var title = invoice_content;
            $("#sub_invoice_title").val(invoice_content);
        }
        $("#sub_needInvoice").val(1);
        var content = $("#sub_invoice_content").val();
        $("#invoice_detail_div").show();
        $("#invoice_title_html").html(title);
        $("#invoice_content_html").html(content);
        $(".shade_box").hide();
        $("#add_Invoice").hide();
    } else {
        //$("#sub_invoice_content").val("明细");
        //$("#companyNameText_ishow").val("");
        if (sub_pay_price <= 0) {
            //$("#invoice_box_disabled").addClass("invoice_box_disabled");
            return false;
        }
        $(".shade_box").show();
        $("#add_Invoice").show();
    }
}

function checkPayPass() {
    var flag = 0;
    if (sub_balance > 0 || sub_chunbo_card > 0) {
        $(".modal-mask").removeClass("hide");
        $(".modal-pay").removeClass("hide");
        return;

        var pay_password = $("#pay_password").val();
        if (pay_password == "") {
            $("#pay_password").focus();
            alert("请输入支付密码");

        } else {
            $.ajax({
                type: 'post',
                dataType: 'json',
                async: false,
                url: "/Order/payPassword",
                data: {
                    "member_id": member_id,
                    "password": pay_password
                },
                success: function(returnData) {
                    if (returnData.flag == 2) {
                        $("#pay_password").focus();
                        alert("支付密码有误");
                        flag = -1;
                        return false;
                    }
                }
            });
        }
    }
    if (flag < 0) {
        return false;
    }
}

function confirmPayPass() {
    var pay_password = $("#pay_password").val();
    if (pay_password == "") {
        $("#pay_password").focus();
        alert("请输入支付密码");
    } else {
        $.ajax({
            type: 'post',
            dataType: 'json',
            async: false,
            url: "/Order/payPassword",
            data: {
                "member_id": member_id,
                "password": pay_password
            },
            success: function(returnData) {
                if (returnData.flag == 2) {
                    $("#pay_password").focus();
                    alert("支付密码未设置或有误");
                    flag = -1;
                    return false;
                } else if (returnData.flag == 1) {
                    $("pay_pass_val").val(pay_password);
                    changeProductTag();
                }
            }
        });
    }
}

function cancelPayPass() {
    usePrice("points", "cancel");
    usePrice("balance", "cancel");
    usePrice("chunbo_card", "cancel");
    usePrice("coupons", "cancel");
    $(".switch-btn").removeClass("switch-on").siblings("input").val(0);
    $(".modal-mask").addClass("hide");
    $(".modal-pay").addClass("hide");
}

function preSubmitOrder() {
    disableSubmit();
    if (sub_balance > 0 || sub_chunbo_card > 0) {
        $(".modal-mask").removeClass("hide");
        $(".modal-pay").removeClass("hide");
        enableSubmit();
        return false;
    }
    changeProductTag();
}

function changeProductTag() {
    var product_info = [];
    $("input[name='book_date']").each(function(index) {
        tag_send_date = $(this).val();
        if (tag_send_date == "" || tag_send_date == "请选择送货时间") {
            alert("第" + index + "包裹配送时间不正确");
            enableSubmit();
            return false;
        }
        product_list = $(this).parents(".order-detail-foot").children("input[name='product_info']").val();
        product_info[index] = [tag_send_date, product_list];
    });

    /*var subData = new Object();
    var url = "/Order/changeProductGroup";
    subData.product_info = product_info;
    subData.is_mobile = 1;
    postData(url, subData);*/
    
    $.ajax({
        type: 'post',
        dataType: 'text',
        url: "/Order/changeProductGroup",
        data: {"product_info": product_info},
        success: function(returnData) {
            if (returnData != "<ul>null</ul>") {           
                $("#chang_product_group").html("");
                $("#chang_product_group").html(returnData);
                var group_order_type = $("#group_order_type").val();
                if (group_order_type == 1) {
                    alert("为了减少您的收货次数，我们将可以同时配送的订单进行了合并");
                    submitOrder();
                } else {
                    submitOrder();
                }
            } else {
                alert("网络异常,请稍后重试!");
                enableSubmit();
                return false;
            }
        }
    });
}

function submitOrder() {
    var product_param = new Object();
    product_param.product_list = $("#product_list_param").val();
    product_param.sub_points = sub_points;//积分
    product_param.sub_balance = sub_balance;//余额
    product_param.sub_chunbo_card = sub_chunbo_card;//春播卡       
    product_param.sub_coupons_number = sub_coupons_number;
    product_param.member_id = member_id;
    product_param.order_source = 5;//M端提交订单
    if ($("#needInvoice").val() == 1 && (sub_pay_price>0 || sub_balance>0)) {
        product_param.invoiceTitle = $("#invoice_title").html();
        product_param.invoiceContent = $("#invoice_content").html();
    }
    product_param.address_id = 0;
    var choose_address_id = parseInt($("#choose_address_id").val());
    if (choose_address_id > 0) {
        product_param.address_id = choose_address_id;
    }
    //商品清单是否打印价格
    product_param.is_show_price = $("#is_show_price").val();

    var pay_url = $("#sub_pay_url").val();
    var sub_url = "/Order/submitOrder";
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: sub_url,
        data: product_param,
        success: function(returnData) {
            if (returnData.flag == 1 || returnData.result == 1) {
                $("#sub_points").val('');//积分    
                $("#sub_balance").val('');//余额   
                $("#sub_chunbo_card").val('');//春播卡 
                $("#sub_coupons_number").val('');//券编码 
                $("#sub_coupons_amount").val('');//券      
                removeOrderItem();                                 
                clearOrderDate();
                if (parseFloat(returnData.total_pay_price) <= 0) { 
                    location.href = "/Order/paySuccess";           
                } else {                                           
                    var subData = new Object();                    
                    var openid = $('#wx_token').val();             
                    subData.ORDER_IDS = returnData.orderIds;       
                    subData.CHANNEL_NAME = "default";              
                    subData.OPENID = openid;                       
                    subData.BUYER_ID = product_param.member_id;    
                    postData(pay_url, subData);                    
                }                                                  
            } else {
                var error_code = returnData.erron;
                switch (error_code) {
                    case 5001:
                        alert("没有用户相关信息，请重试");
                        break;
                    case 5005:
                        alert("没有收货地址相关信息，请重试");
                        break;
                    case 5112:
                        alert("未获取您的订单列表信息，请重试");
                        break;
                    case 5017:
                        alert("发票信息有部分缺失，请验证");
                        break;
                    case 5021:
                        alert("未获取您的收货地址，请重试");
                        break;
                    case 5018:
                        alert("四级收货地址为空");
                        break;
                    case 5022:
                        alert("四级地址不存在");
                        break;
                    case 5205:
                        alert("获取促销信息失败，请重试");
                        break;
                    case 5016:
                        alert("请填写您的预约发货时间");
                        break;
                    case 5113:
                        alert("同一件商品出现多次");
                        break;
                    case 5013:
                        alert("商品购买数量小于0");
                        break;
                    case 5114:
                        alert("商品不存在");
                        break;
                    case 5019:
                        alert("指定预约配送时间不在可配送时间范围内");
                        break;
                    case 5202:
                        alert("库存查询失败");
                        break;
                    case 5205:
                        alert("商品信息获取失败，请重试");
                        break;
                    case 5208:
                        alert("赠品信息缺失，请重试");
                        break;
                    case 5023:
                        alert("春播券验证失败，请重试");
                        break;
                    case 5024:
                        alert("积分验证失败，请重试");
                        break;
                    case 5025:
                        alert("春播卡验证失败，请重试");
                        break;
                    case 5026:
                        alert("余额验证失败，请重试");
                        break;
                    case 5115:
                        alert("扣取春播券失败，请重试");
                        break;
                    case 5116:
                        alert("积分扣取失败，请重试");
                        break;
                    case 5117:
                        alert("春播卡扣取失败，请重试");
                        break;
                    case 5118:
                        alert("余额扣取失败，请重试");
                        break;
                    case 5206:
                        alert("商品库存占用失败，请重试");
                        break;
                    case 5207:
                        alert("下单失败，请重试");
                        break;
                    case 5203:
                        var _html="";
                         $.each(returnData.lack_product_list, function (i, item) {
                             _html += $("#product_"+item.sku_code).html()+"库存不足\n";
                        });
                        alert(_html);
                        var redirect_url = $("#sub_redirect_url").val();
                        window.location.href = redirect_url;
                        break;
                    default:
                        alert("网络异常,请稍后重试！");
                }
                enableSubmit();
            }
        }
    });
}

function postData(url, args) {
    var form = $("#sub_form"),
            input;
    form.attr({"action": url});
    $.each(args, function(key, value) {
        input = $("<input type='hidden'>");
        input.attr({"name": key});
        input.val(value);
        form.append(input);
    });
    form.submit();
}

(function($){
    $.fn.modifyAddress = function(options){
        var settings = {
            member_id: "",
            address_id: "",
            consignee: "#consignee",
            phone: "#phone",
            mobile: "#mobile",
            city_id: "#city_id",
            district_id: "#district_id",
            delivery_id: "#delivery_id",
            detail_address: "#detail_address",
            save_btn: "#save_btn",
            delete_btn: "#delete_btn"
        };
        settings = $.extend({}, settings, options);
        var $member_id = settings.member_id;
        var $address_id = settings.address_id;
        var $consignee = $(this).find(settings.consignee);
        var $phone = $(this).find(settings.phone);
        var $mobile = $(this).find(settings.mobile);
        var $city = $(this).find(settings.city_id);
        var $district = $(this).find(settings.district_id);
        var $delivery = $(this).find(settings.delivery_id);
        var $detail_address = $(this).find(settings.detail_address);
        var $save_btn = $(this).find(settings.save_btn);
        var $delete_btn = $(this).find(settings.delete_btn);
        
        var address_json = {
            "110101": "<option value=''>请选择环路</option><option value='110101-001' >东城区*</option>",
            "110102": "<option value=''>请选择环路</option><option value='110102-001' >西城区*</option>",
            "110105": "<option value=''>请选择环路</option><option value='110105-001' >朝阳区（五环内）</option><option value='110105-002' >朝阳区（五环外六环内）</option>",
            "110106": "<option value=''>请选择环路</option><option value='110106-001' >丰台区（五环内）</option><option value='110106-002' >丰台区（五环外六环内）</option><option value='110106-003' >丰台区（六环外）</option>",
            "110107": "<option value=''>请选择环路</option><option value='110107-001' >石景山区（五环内）</option><option value='110107-002' >石景山区（五环外六环内）</option>",
            "110108": "<option value=''>请选择环路</option><option value='110108-001' >海淀区（五环内）</option><option value='110108-002' >海淀区（五环外六环内）</option><option value='110108-003' >海淀区（六环外）</option>",
            "110109": "<option value=''>请选择环路</option><option value='110109-001' >门头沟区（五环外六环内）</option><option value='110109-002' >门头沟区（六环外）</option>",
            "110111": "<option value=''>请选择环路</option><option value='110111-001' >房山区（五环外六环内）</option><option value='110111-002' >房山区（六环外）</option>",
            "110112": "<option value=''>请选择环路</option><option value='110112-001' >通州区（五环外六环内）</option><option value='110112-002' >通州区（六环外）</option>",
            "110113": "<option value=''>请选择环路</option><option value='110113-001' >顺义区（五环外六环内）</option><option value='110113-002' >顺义区（六环外，仅限城区）</option><option value='110113-004' >仁和镇</option>",
            "110114": "<option value=''>请选择环路</option><option value='110114-001' >昌平区（五环外六环内）</option><option value='110114-002' >昌平区（六环外，仅限城区）</option><option value='110114-003' >南邵镇</option>",
            "110115": "<option value=''>请选择环路</option><option value='110115-001' >大兴区（五环内）</option><option value='110115-002' >大兴区（五环外六环内）</option><option value='110115-003' >大兴区（六环外）</option>",
            "110226": "<option value=''>请选择环路</option><option value='110226-001' >平谷区（仅限城区）</option>",
            "110227": "<option value=''>请选择环路</option><option value='110227-001' >怀柔区（仅限城区）</option>",
            "110228": "<option value=''>请选择环路</option><option value='110228-001' >密云县（仅限城区）</option>"
        };
        
        $save_btn.off("click").on("click", function() {
            if ($consignee.val() == "") {
                alert("姓名不能为空");
                return false;
            }
            if ($phone.val() == "") {
                alert("手机号不能为空");
                return false;
            }
            var phone_reg = /^1[3,5,7,8]{1}[0-9]{9}$/;
            if (!(phone_reg.test($phone.val()))) {
                alert("手机号输入错误");
                return false;
            }
            if ($district.val() == "") {
                alert("区/县地址不能为空");
                return false;
            }
            if ($delivery.val() == "") {
                alert("环路地址不能为空");
                return false;
            }
            /*var delivery_reg = /^[0-9]{6,8}\-[0-9]{3,4}$/;
            if (delivery_reg.test($delivery.val())) {
                alert("环路地址输入错误");
                return false;
            }*/
            if ($detail_address.val() == "") {
                alert("详细地址不能为空");
                return false;
            }
            $("#submitAddr").click();
            return false;
        });
        
        $delete_btn.off("click").on("click", function() {
            if($address_id === "" || typeof($address_id) === "undefined"){
                window.location.href = "/Order/manageAddress";
            }
            if (confirm("确认删除收货地址")) {
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: "/Order/deleteAddress",
                    data: {"address_id": $address_id, "member_id": $member_id},
                    success: function(returnData) {
                        if (returnData.flag == 1) {
                            alert("删除成功");
                            window.location.href = "/Order/manageAddress";
                        } else {
                            alert("删除失败");
                        }
                    }
                });
            }
        });
    };
})(Zepto);

//编辑发票页js
(function($) {
    $.fn.editInvoice = function(options) {
        var settings = {
            title: "#title",
            title_tags: "a",
            content: "#content",
            content_tags: "a",
            title_val: "#title_val",
            content_val: "#content_val",
            title_text: "#title_text",
            submit_btn: "#confirm"
        };
        settings = $.extend({}, settings, options);
        var $title = $(settings.title);
        var $content = $(settings.content);
        var $title_tags = $title.find(settings.title_tags);
        var $content_tags = $content.find(settings.content_tags);
        var $title_val = $(settings.title_val);
        var $content_val = $(settings.content_val);
        var $submit_btn = $(settings.submit_btn);
        var $title_text = $(settings.title_text);

        if(localStorage.getItem("invoice")!==null){
            var invoiceObj = JSON.parse(localStorage.getItem("invoice"));
            $("#"+invoiceObj.title_id).addClass("on");
            $title_val.val(invoiceObj.title);
            $title_val.attr("data-id", invoiceObj.title_id);
            if(invoiceObj.title_id === '1'){
                $("#"+invoiceObj.title_id).siblings("input").addClass("hide");
            }else{
                $("#"+invoiceObj.title_id).siblings("input").val(invoiceObj.title_text);
                $("#"+invoiceObj.title_id).siblings("input").removeClass("hide");
            }
            $("#"+invoiceObj.content_id).addClass("on");
            $content_val.val(invoiceObj.content);
            $content_val.attr("data-id", invoiceObj.content_id);
        }

        $title_tags.bind("click", function() {
            $(this).addClass("on").siblings("a").removeClass("on");
            $title_val.val($(this).attr("data"));
            $title_val.attr("data-id", $(this).attr("id"));
            $(this).attr("id") === '1' ? $(this).siblings("input").addClass("hide") : $(this).siblings("input").removeClass("hide");
        });

        $content_tags.bind("click", function() {
            $(this).addClass("on").siblings("a").removeClass("on");
            $content_val.val($(this).attr("data"));
            $content_val.attr("data-id", $(this).attr("id"));
        });

        $submit_btn.bind("click", function() {
            //发票开头判断
            if (!$("#title_text").hasClass("hide")) {
                var invoice_content = $("#title_text").val();
                if (invoice_content.replace(/(^\s*)|(\s*$)/g, "") == "") {
                    alert("发票抬头必须填写");
                    return;
                }
            } 
            var invoice = {title_id: $title_val.attr("data-id"), title: $title_val.val(), title_text: $title_text.val(),content_id: $content_val.attr("data-id"), content: $content_val.val()};
            var invoice_str = JSON.stringify(invoice);
            localStorage.setItem("invoice", invoice_str);
            window.location.href = "/Order/index";
        });
    };
})(Zepto);

//礼券选择页
(function($) {
    $.fn.couponChoose = function(options) {
        var settings = {
            li: "li",
            active_coupon: "#active_coupon"
        };
        settings = $.extend({}, settings, options);
        var $li = $(settings.li);
        var $active_coupon = $(settings.active_coupon);

        $active_coupon.unbind("click").bind("click", function() {
            window.location.href = "/Order/activeCoupon";
        });
        if(localStorage.getItem("useCoupon") != null){
            var chosen_coupon = localStorage.getItem("useCoupon").split(",");
            $("#" + chosen_coupon[0]).addClass("on");
        }
        $li.each(function() {
            $(this).unbind("click").bind("click", function() {
                if ($(this).hasClass("on")) {
                    $(this).removeClass("on");
                    localStorage.setItem("useCoupon", null)
                } else {
                    $(this).addClass("on").siblings("li").removeClass("on");
                    var coupon_info = new Array();
                    $(this).children("input").each(function() {
                        switch ($(this).attr("name")) {
                            case "coupons_id":
                                coupon_info[0] = $(this).val();
                                break;
                            case "coupons_number":
                                coupon_info[1] = $(this).val();
                                break;
                            case "coupons_type":
                                coupon_info[2] = $(this).val();
                                break;
                            case "coupons_sku":
                                coupon_info[3] = $(this).val();
                                break;
                            case "coupons_amount":
                                coupon_info[4] = $(this).val();
                                break;
                            default:
                                break;
                        }
                    });
                    localStorage.setItem("useCoupon", coupon_info);
		            window.location.href = "/Order/index";
                }
            })
        });
    };
})(Zepto);

//激活礼券页
(function($) {
    $.fn.activeCoupon = function(options) {
        var settings = {
            bind_coupons_number: "#bind_coupons_number",
            member_id_input: "#member_id",
            confirm: "#confirm",
        };
        settings = $.extend({}, settings, options);
        var $bind_coupons_number = $(settings.bind_coupons_number);
        var $mem_id_input = $(settings.member_id_input);
        var $confirm = $(settings.confirm);

        $confirm.unbind("click").bind("click", function() {
            var coupons_number = $bind_coupons_number.val();
            if (coupons_number == "") {
                alert("春播券编码不能为空");
                return;
            }
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: "/Order/bindCoupons",
                data: {
                    "coupons_number": coupons_number,
                    "member_id": $mem_id_input.val()
                },
                success: function(returnData) {
                    if (returnData.flag == 1) {
                        window.location.href = "/Order/getCouponList";
                    } else {
                        alert("绑定春播券失败");
                    }
                }
            });
        });
    };
})(Zepto);

function removeOrderItem() {
    //发票
    localStorage.removeItem("invoice");
    //礼券
    localStorage.removeItem("useCoupon");
    //积分
    localStorage.removeItem("points");
    //礼品卡
    localStorage.removeItem("chunbo_card");
    //余额
    localStorage.removeItem("balance");
    //不打印价格
    localStorage.removeItem("not_show_price");
}

function enableSubmit(){//可提交
    $("#submitOrder").attr("onclick","javascript:preSubmitOrder();");  
}

function disableSubmit(){//不可提交
    $("#submitOrder").removeAttr("onclick");
}
