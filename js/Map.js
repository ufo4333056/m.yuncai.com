/*选择配送区域*/
function Address(){
	this.region = {
		city: '',
		district: '',
		street: ''
	};
}
Address.prototype = {
	constructor: Address,
    updateRegion:function(obj){
        // 更新区域记录
        if(obj){
            // 传参注意没有值的要传null
            if(obj.city.code){
                this.region.city = {code: obj.city.code, name: TABMap[obj.city.code].name};
                return;
            }
            if(obj.district.code){
                this.region.district = {code: obj.district.code, name: TABMap[this.region.city.code].list[obj.district.code].name};
                return;
            }
            if(obj.street.code){
                this.region.street = {code: obj.street.code, name: TABMap[this.region.city.code].list[this.region.district.code].list[obj.street.code].name};
            }
        }else{
            this.region.city = this.region.district = this.region.street = '';
        }
    },
    fixDom: function (obj, tag) {
        var _li = '',
                addArr = this.getKeys(obj.list);
        addArr.map(function (item) {
            _li += '<li data-' + tag + '="' + item + '">' + obj.list[item].name + '</li>';
        });
        return _li;
    },
    getAddress: function () {
        if (!this.region.city.code) {
            return {name: '城市', list: TABMap};
        }
        if (!this.region.district.code) {
            var cityArr = this.getKeys(TABMap);
            return TABMap[this.region.city.code];
        }
        if (!this.region.street.code) {
            var cityArr = this.getKeys(TABMap);
            return TABMap[this.region.city.code]['list'][this.region.district.code];
        }
    },
    getKeys: function (obj) {
        if (!Object.keys) {
            Object.keys = (function () {
                'use strict';
                var hasOwnProperty = Object.prototype.hasOwnProperty,
                        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
                        dontEnums = [
                            'toString',
                            'toLocaleString',
                            'valueOf',
                            'hasOwnProperty',
                            'isPrototypeOf',
                            'propertyIsEnumerable',
                            'constructor'
                        ],
                        dontEnumsLength = dontEnums.length;

                return function (obj) {
                    if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                        throw new TypeError('Object.keys called on non-object');
                    }

                    var result = [], prop, i;

                    for (prop in obj) {
                        if (hasOwnProperty.call(obj, prop)) {
                            result.push(prop);
                        }
                    }

                    if (hasDontEnumBug) {
                        for (i = 0; i < dontEnumsLength; i++) {
                            if (hasOwnProperty.call(obj, dontEnums[i])) {
                                result.push(dontEnums[i]);
                            }
                        }
                    }
                    return result;
                };
            }());
        }
        return Object.keys(obj);
    },
    backUpLevel: function () {
        var that = this;
        if (that.region.street.code) {
            that.region.street = '';
            return 'street'
        }
        if (that.region.district.code) {
            that.region.district = '';
            return 'district'
        }
        if (that.region.city.code) {
            that.region.city = '';
            return 'city'
        }
    }
};
/*选择配送区域UI:PC*/

function MapUI_PC(address){
  if(!address.dom){
    this.address = address;
    this.init();
  }else{
    this.city = address.city;
    this.district = address.district;
    this.street = address.street;

    this.buidDOM();
  }
}
MapUI_PC.prototype.init = function(address){
  var that = this;
  var _str = '';
  var cityCodeArr = that.address.getKeys(TABMap);
  var inputCityVal = $('input[name="city"]').val();

  if (inputCityVal) {
    that.address.updateRegion({
      city: { code: inputCityVal},
      district: { code: $('input[name="district"]').val()},
      street: { code:null}
    });

    cityCodeArr.forEach(function(i){
      _str +='<li data-city="'+i+'"'+(inputCityVal==i?' class="on"' : '')+'>'+TABMap[i].name+'</li>';
    })

    $('.tab-con.city').html(_str);
    $('.tab-tit .district').addClass('on').siblings().removeClass('on');
    $('.tab-con.district').show().siblings('.tab-con').hide();
  } else {
    cityCodeArr.forEach(function(i){
      _str +='<li data-city="'+i+'">'+TABMap[i].name+'</li>';
    })

    $('.tab-con.city').html(_str);
  }
  that.bindE();
};
MapUI_PC.prototype.bindE = function(){
  var that = this;
  // pc端选择地址
  $('.tab-con').on('click', 'li', function () {
      var _$this = $(this);
      if (_$this.data('street')) {
          $('#address-text').removeClass('hover');
          $('#address-text').siblings('.content').addClass('hide');
          // that.region.street = {code: _$this.data('street'), name: _$this.text()};
          that.address.updateRegion({
            city: { code: null},
            district: { code: null},
            street: { code: _$this.data('street')}
          });

          _$this.addClass('on').siblings().removeClass('on')
          $('.tab-tit .street').find('span').text(that.address.region.street.name)
          $('#address-text').text(that.address.region.city.name + that.address.region.district.name + that.address.region.street.name).addClass('text');
          $('input[name="city"]').val(that.address.region.city.code);
          $('input[name="district"]').val(that.address.region.district.code);
          $('input[name="street"]').val(that.address.region.street.code);

          //写入cookie:PC
          var date_history = new Date();
          date_history.setTime(date_history.getTime() + (365 * 24 * 60 * 60 * 1000));
          $.cookie("cb_address_city", that.address.region.city.code, {expires: date_history, path: "/", domain:'.chunbo.com'});
          $.cookie("cb_address_district", that.address.region.district.code, {expires: date_history, path: "/", domain:'.chunbo.com'});
          $.cookie("cb_address_street", that.address.region.street.code, {expires: date_history, path: "/", domain:'.chunbo.com'});
          $.cookie("cb_address_text", that.address.region.city.name + that.address.region.district.name + that.address.region.street.name, {expires: date_history, path: "/", domain:'.chunbo.com'});

          // cookie写入站点信息
          // $.removeCookie("cb_site_id", {domain:'.chunbo.com',path:'/'});
          $.cookie("cb_site_id", TABMap[that.address.region.city.code].site_id, {expires: date_history, path: "/", domain:'.chunbo.com'});
          // $.removeCookie("cb_site_name", {domain:'.chunbo.com',path:'/'});
          $.cookie("cb_site_name", TABMap[that.address.region.city.code].site_name, {expires: date_history, path: "/", domain:'.chunbo.com'});

          // 计算配送时间
          loadProductRevicedTime(that.address.region.street.code);

          location.reload();

      } else {
          // 可以根据当前点击的对象得知所在地址层级
          var tag = that.address.getKeys(_$this.data())[0];
          that.address.region[tag] = {code: _$this.data(tag), name: _$this.text()};
          if (tag == 'city') {
              that.address.region.district = that.address.region.street = '';
              // dom 重新初始化
              $('.tab-tit .city').siblings().find('span').text('请选择');
              $('.tab-con.district,.tab-con.street').empty();
          } else if (tag == 'district') {
              that.address.region.street = '';
          }

          var addObj = that.address.getAddress();
          $('.tab-tit .' + tag).find('span').text(that.address.region[tag].name)
          if (tag == 'city') {
              tag = 'district';
          } else if (tag == 'district') {
              tag = 'street';
          }
          _$this.addClass('on').siblings().removeClass('on')
          $('.tab-con.' + tag).html(that.address.fixDom(addObj, tag));
          $('.' + tag).show().siblings('.tab-con').hide();
          $('.tab-tit .' + tag).addClass('on').siblings('li').removeClass('on');

      }
  });

  $('.tab-tit li').click(function () {
      if ($(this).hasClass('on'))
          return;
      var i = $(this).index();
      $(this).addClass('on').siblings('li').removeClass('on');
      $('.tab-con').eq(i).show().siblings('.tab-con').hide();
  });
};
MapUI_PC.prototype.buidDOM = function(){
  var that = this;

  var addressObj = new Address();

  $('.tab-tit .city span').text(TABMap[that.city].name);
  $('.tab-tit .district span').text(TABMap[that.city].list[that.district].name);
  $('.tab-tit .street span').text(TABMap[that.city].list[that.district].list[that.street].name);
  $('#address-text').text(TABMap[that.city].name+TABMap[that.city].list[that.district].name+TABMap[that.city].list[that.district].list[that.street].name);

  var addArr = addressObj.getKeys(TABMap),
      addStr = '';
  addArr.forEach(function(o){
    addStr += '<li data-city="'+o+'"'+(o == that.city ? ' class="on"' : '')+'>'+TABMap[o].name+'</li>';
  });
  $('.tab-con.city').html(addStr);

  addArr = addressObj.getKeys(TABMap[that.city].list);
  addStr = '';

  addArr.forEach(function(o){
    addStr += '<li data-district="'+o+'"'+(o == that.district ? ' class="on"' : '')+'>'+TABMap[that.city].list[o].name+'</li>';
  });
  $('.tab-con.district').html(addStr);  

  addArr = addressObj.getKeys(TABMap[that.city].list[that.district].list);
  addStr = '';

  addArr.forEach(function(o){
    addStr += '<li data-street="'+o+'"'+(o == that.street ? ' class="on"' : '')+'>'+TABMap[that.city].list[that.district].list[o].name+'</li>';
  });
  $('.tab-con.street').html(addStr); 
};

/*选择配送区域UI:M*/

function MapUI_M(address, obj){
  this.address = address;
  this.obj = obj;

  if(!address.dom){
    this.init();
  } else{
    this.address.region.city.name = TABMap[this.address.region.city.code].name;
    this.address.region.district.name = TABMap[this.address.region.city.code].list[this.address.region.district.code].name;
    this.address.region.street.name = TABMap[this.address.region.city.code].list[this.address.region.district.code].list[this.address.region.street.code].name;
    this.onSuccess();
  }
}
MapUI_M.prototype.init = function(){
  var that = this;
  var cityCodeArr = that.address.getKeys(TABMap);
  var _str = '';

  that.address.updateRegion();

  cityCodeArr.forEach(function(i){
    _str += '<li data-city="'+i+'">'+TABMap[i].name+'</li>'
  })
  
  $('#select-scroller ul').html(_str);
  
  that.bindE();
};
MapUI_M.prototype.bindE = function(){
  var that = this;

  $('#select-scroller').on('click', 'li', function () {
    var dom = $(this);
    if (dom.data().street) {
      // 如果是最后一级地址，做收尾处理
      that.address.updateRegion({
        city: {code: null},
        district: {code: null},
        street:{code: dom.data('street')}
      });
      that.onSuccess();
                          
      //写入cookie:M
      var date_history = new Date();
      date_history.setTime(date_history.getTime() + (365 * 24 * 60 * 60 * 1000));
      $.fn.cookie("cb_address_city", that.address.region.city.code, {expires: date_history, path: "/", domain:'.chunbo.com'});
      $.fn.cookie("cb_address_district", that.address.region.district.code, {expires: date_history, path: "/", domain:'.chunbo.com'});
      $.fn.cookie("cb_address_street", that.address.region.street.code, {expires: date_history, path: "/", domain:'.chunbo.com'});
      $.fn.cookie("cb_address_text", that.address.region.city.name + that.address.region.district.name + that.address.region.street.name, {expires: date_history, path: "/", domain:'.chunbo.com'});

      // cookie写入站点信息
      $.fn.cookie("cb_site_id", TABMap[that.address.region.city.code].site_id, {expires: date_history, path: "/", domain:'.chunbo.com'});
      $.fn.cookie("cb_site_name", TABMap[that.address.region.city.code].site_name, {expires: date_history, path: "/", domain:'.chunbo.com'});

      loadProductRevicedTime(that.address.region.street.code);

      //刷新当前页
      if ($("#isCartPageM").val() == 1) {//如果是购物车页面，刷新当前页
          location.reload();
      }
        
    } else {
      that.address.updateRegion({
        city: {code: dom.data('city')},
        district: {code: dom.data('district')},
        street: {code: dom.data('street')}
      });

      var addObj = that.address.getAddress();
      var tag = '';
      if (!addObj)
          return;
      var addArr = that.address.getKeys(addObj.list);

      if (!that.address.region.city.code) {
          tag = 'city';
      } else if (!that.address.region.district.code) {
          tag = 'district';
      } else {
          tag = 'street';
      }
      that.onOneStep(addObj, addArr, tag);
    }
  });
  $('.select-back').tap(function () {
      var tag = that.address.backUpLevel();
      var addObj = that.address.getAddress();
      var addArr = that.address.getKeys(addObj.list);

      that.onOneStep(addObj, addArr, tag);
  });
}

MapUI_M.prototype.onOneStep = function(obj, addArr, tag){
  var _li = '';
  addArr.map(function(item){
      _li += '<li data-'+tag+'="'+item+'">'+obj.list[item].name+'</li>';
  });
  if(tag == 'city') $('.select-back').addClass('hide');
  else $('.select-back').removeClass('hide');
  $('#select-scroller ul').html(_li);
  myScroll.refresh();
};

MapUI_M.prototype.onSuccess = function(){
  var that = this;
  var response = that.address.region;
  var $dom = $(that.obj.dom);
  $('.mask-bg,.select-con').removeClass('show');
  $('.select-back').addClass('hide');
  // 填充数据
  $dom.text(response.city.name + that.obj.str + response.district.name + that.obj.str + response.street.name);
  $('input[name="city"]').val(response.city.code);
  $('input[name="district"]').val(response.district.code);
  $('input[name="street"]').val(response.street.code);
}

function loadProductRevicedTime(delivery_id) 
{
        var is_fresh_promo = parseInt($("#is_fresh_promo").val());
        var is_pre_sale = parseInt($("#is_pre_sale").val());
        var stock_count = parseInt($("#stock_count").val());

    if (is_fresh_promo <= 0 && is_pre_sale <= 0 && stock_count > 0) 
    {
        var region_url = "/Product/getRevicedTimeByDid";
        if (delivery_id) {
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: region_url,
                data: {
                    "delivery_id": delivery_id
                },
                success: function (returnData) {
                    if (returnData.data.flag) {
                        fixTime(returnData.data.start_date);
                    }
                }
            });
        }
    }
    //极致新鲜
    else if (is_fresh_promo > 0 && stock_count > 0) 
    {
        fixTime($("#fresh_start_time").val());
    }
    //预售
    else if (is_pre_sale > 0 && stock_count > 0) {
        fixTime($("#pre_start_time").val());
    }

function fixTime(start_date){
    var revice_time_show = $("#revice_time");

    var start_date = start_date;
    var DataAry = start_date.split('-');
    var today = new Date().format('yyyy-MM-dd hh:mm:ss');

    //距离现在还有多少秒
    var time_diff_minute = GetDateDiff(today, start_date, "minute");
    var time_diff_hour = GetDateDiff(today, start_date, "hour");
    var time_diff_day = GetDateDiff(today, start_date, "day");
    var time_diff_minit = time_diff_minute % 60;

    if (time_diff_minit >= 0) {
        revice_time_show.parent().show();
    }

    //还有几天
    var time_day_str = "明天";
    if (time_diff_day == 1)
        time_day_str = "后天";
    // else if (time_diff_day > 1)
    //     time_day_str = (time_diff_day + 1) + "天";

    // var _html = "<span class='c_green'>" + time_day_str + "</span>(" + DataAry[1] + "月" + DataAry[2] + "日)，请在<span class='c_green'>" + time_diff_hour + "小时" + time_diff_minit + "分钟</span> 内下单";
    var _html = '';

    if(time_diff_day > 1){
      _html = DataAry[1]+'月'+ DataAry[2]+ '日，';
    }else{
      _html = '<span class="c_green">'+time_day_str+'</span>('+DataAry[1]+'月'+ DataAry[2]+ '日)，';
    }

    if(time_diff_hour >= 24){
      _html += "请在<span class='c_green'>" + Math.floor(time_diff_hour/24) + "天</span> 内下单";
    }else{
      _html += "请在<span class='c_green'>" + time_diff_hour + "小时" + time_diff_minit + "分钟</span> 内下单";
    }


    revice_time_show.html(_html);

}
    return false;
}
