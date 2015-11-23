$(function(){
	$('.login_tab').click(function(){
		var tab = $(this).attr('data');
		$(this).addClass('sel').siblings('.login_tab').removeClass('sel');
		$('.login-wrap').hide();
		$(tab).show();
		return false;
	})

	//手机号注册
    $('#reg_mobile').click(function() {
    	if($(this).attr('disabled')){
    		return false;
    	}
    	var submitBtn = $(this);
        var username = $("input[name='username']").val();
        var password = $("input[name='password']").val();
        var invite_id = $("input[name=invite_id]").val();
        var invite_member_id = $('input[name=invite_member_id]').val();
        var nickname = $('input[name=nickname]').val();
        var verify = $("input[name='verify']").val();
        var isMobile = /^(?:13\d|14\d|15\d|17\d|18\d)\d{5}(\d{3}|\*{3})$/;

        var url = $("#reg_mobile_url").val();
        if (verify == '') {
            alert('请输入验证码');
            return false;
        }
        if (username == '') {
            alert('请输入手机号');
            return false;
        }
        if (password == '') {
            alert('请输入密码');
            return false;
        }
        if($(this).attr('disabled')){
            return false;
        }
        if (!isMobile.test(username)) {
            alert('请输入正确的手机号');
            return false;
        }
        $(this).attr('disabled','disabled');
        if(invite_id != undefined){
        	var flag = true;
            $.ajax({
                url:checkInviteLink,
                type:'post',
                dataType:'json',
                data:{invite_id:invite_id},
                success:function(i){
                    if(i.status == 0){
                        if(!confirm(i.info)){
                           flag = false;
                        }
                    }
                }
            })
            if(!flag){
	            submitBtn.removeAttr('disabled');
	            return false;
        	}
        }

        $.post(url, {
            username: username,
            password: password,
            verify: verify.toLowerCase(),
            invite_id: invite_id,
            invite_member_id: invite_member_id,
            nickname: nickname,
        },
        function(i) {
        	submitBtn.removeAttr('disabled');
            if (i.status == 1) {
                window.parent.location.href = i.url;
            } else {
                alert(i.info);
            }
        },
        "json");
        return false;
    })
})
//手机注册
function regMobile(dom){
	if($(dom).attr('disabled')){
    	return false;
    }

	var url = $(dom).attr('href');
	//验证用户名和密码
	var username = $('input[name=username]').val();
	var password = $('input[name=password]').val();
	var isMobile = /^(?:13\d|14\d|15\d|17\d|18\d)\d{5}(\d{3}|\*{3})$/;
	var verify = $('input[name=verify]').val();
	var redirect_url = $('inpit[name=redirect_url]').val();
	if(!isMobile.test(username)){
		alert('请输入正确的手机号');
		return false;
	}

	if(username == ''){
		alert('请输入手机号');
		return false;
	}

	if(password == ''){
		alert('请输入密码');
		return false;
	}

	$(dom).attr('disabled','disabled');

	$.ajax({
		url:url,
		data:{username:username,password:password,verify:verify,redirect_url:redirect_url},
		type:'post',
		dataType:'json',
		success:function(i){
			$(dom).removeAttr('disabled');

			if(i.status == 1){
				window.location.href = i.url;
			}else{
				alert(i.info);
			}
		}
	})
	return false;
}

//邮箱注册
function regEmail(dom){
	if($(dom).attr('disabled')){
    	return false;
    }

	var url = $(dom).attr('href');
	var username = $('input[name=username]').val();
	var password = $('input[name=password]').val();
	var redirect = $('inpit[name=redirect]').val();
	if(username == ''){
		alert('请输入邮箱');
		return false;
	}
	if(password == ''){
		alert('请输入密码');
		return false;
	}
	var isEmail = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
	if(!isEmail.test(username)){
		alert('请输入正确的邮箱');
		return false;
	}
	$(dom).attr('disabled','disabled');
	$.ajax({
		url:url,
		data:{username:username,password:password,redirect:redirect},
		type:'post',
		dataType:'json',
		success:function(i){
			$(dom).removeAttr('disabled');
			if(i.status == 0){
				alert(i.info);
			}else{
				var html = '<div class="dialog" style="display:block;"><div class="mask"></div><div class="dialog-box"><a href="'+i.url+'" class="close"></a><h2>注册春播</h2><p>激活邮件已经发到'+i.info+'</p><div class="dialog-act"><a href="'+i.url+'" class="btn btn-sub">关闭</a></div></div></div>';
				$('body').append(html);
			}
		}
	})
	return false;
}
//登录
function login(dom){
	if($(dom).attr('disabled')){
    	return false;
    }

	var url = $(dom).attr('href');
	//验证用户名和密码
	var username = $('input[name=username]').val();
	var password = $('input[name=password]').val();
	var form_token = $('input[name=form_token]').val();
        var keep_login = $('input[name=keep_login]').val();
	var isMobile = /^(?:13\d|14\d|15\d|17\d|18\d)\d{5}(\d{3}|\*{3})$/;
	var isEmail = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
	var redirect_url = $('input[name=redirect_url]').val();
	if(username == ''){
		alert('用户名不可为空');
		return false;
	}

	if(password == ''){
		alert('请输入密码');
		return false;
	}

	if(!isMobile.test(username) && !isEmail.test(username)){
		alert('请输入正确的手机号');
		return false;
	}
	$(dom).attr('disabled','disabled');
	$.ajax({
		url:url,
		data:{
                    username:username,
                    password:password,
                    redirect_url:redirect_url,
                    form_token:form_token,
                    keep_login:keep_login
                },
		type:'post',
		dataType:'json',
		success:function(i){
			$(dom).removeAttr('disabled');
			if(i.status == 1){
				window.location.href=i.url;
			}else{
				alert(i.info);
			}
		}
	})
	return false;
}

//发送手机注册验证码
function sendRegVerify(dom,type){
	if($(dom).attr('disabled')){
		return false;
	}
	var mobile = $('input[data-sms]').val();
	var form_token = $('input[name=form_token]').val();
	var url = $(dom).attr('href');

	if(form_token == ''){
		alert('页面错误,请刷新后重试');
		return false;
	}
	if(mobile == ''){
		alert('请输入手机号');
		return false;
	}

	var isMobile = /^(?:13\d|14\d|15\d|17\d|18\d)\d{5}(\d{3}|\*{3})$/;
    if (!isMobile.test(mobile)) {
        alert('请输入正确的手机号');
        return false;
    }
    if(type == 2){
    	var flag = checkMobileReg(mobile);
        if (flag == 1) {
            alert('手机号不存在');
            return false;
        }
    }

    if(type == 1){
    	var flag = checkMobileReg(mobile);
        if (flag == 0) {
            alert('手机号已存在');
            return false;
        }
    }
    $(dom).attr('disabled','disabled');
	$.ajax({
        url: url,
        data: {
            mobile: mobile,
            type: type,
            form_token:form_token
        },
        type: 'post',
        dataType: 'json',
        success: function(i) {
        	$(dom).removeAttr('disabled');
            if (i.status == 1) {
                alert(i.info);
                settime($(dom), 60);
            } else {
                alert(i.info);
            }
        }
    })
    return false;
}

//手机找回密码
function getPwdbyMobile(dom){
	if($(dom).attr('disabled')){
   		return false;
    }

	var url = $(dom).attr('href');
	var mobile = $('input[name=mobile]').val();
	var verify = $('input[name=verify]').val();
	var form_token = $('input[name=form_token]').val();
	if(mobile == ''){
		alert('请输入手机号');
		return false;
	}
	if(verify == ''){
		alert('请输入验证码');
		return false;
	}
	var isMobile = /^(?:13\d|14\d|15\d|17\d|18\d)\d{5}(\d{3}|\*{3})$/;

    if (!isMobile.test(mobile)) {
        alert('请输入正确的手机号');
        return false;
    }
    $(dom).attr('disabled','disabled');
	$.ajax({
		url:url,
		data:{
			username:mobile,
			verify:verify,
			form_token:form_token
		},
		type:'post',
		dataType:'json',
		success:function(i){
			$(dom).removeAttr('disabled');
			if(i.status == 0){
				alert(i.info);
			}else{

				window.location.href = i.url;
			}
		}
	})
	return false;
}

//邮箱找回密码
function getPwdbyEmail(dom){
	if($(dom).attr('disabled')){
   		return false;
    }

	var url = $(dom).attr('href');
	var email = $('input[name=email]').val();
	var form_token = $('input[name=form_token]').val();
	if(email == ''){
		alert('请输入邮箱');
		return false;
	}
	var isEmail = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
	if(!isEmail.test(email)){
		alert('请输入正确的邮箱');
		return false;
	}
	$(dom).attr('disabled','disabled');
	$.ajax({
		url:url,
		data:{
			username:email,
			form_token:form_token
		},
		type:'post',
		dataType:'json',
		success:function(i){
			$(dom).removeAttr('disabled');

			if(i.status == 0){
				alert(i.info);
			}else{
				var html = '<div class="dialog" style="display:block;"><div class="mask"></div><div class="dialog-box"><a href="'+i.url+'" class="close"></a><h2>找回密码</h2><p>找回密码邮件已经发到'+i.info+'</p><div class="dialog-act"><a href="'+i.url+'" class="btn btn-sub">关闭</a></div></div></div>';

				$('body').append(html);
			}
		}
	})
	return false;
}
//修改密码
function modifyPwd(dom){
	if($(dom).attr('disabled')){
   		return false;
    }

	var url = $(dom).attr('href');
	var password = $('input[name=password]').val();
	var rep_password = $('input[name=rep_password]').val();
	if(password == ''){
		alert('请输入新密码');
		return false;
	}
	if(rep_password == ''){
		alert('请再次输入新密码');
		return false;
	}
	if(password.length <6 || password.length>16){
		alert('密码长度最小6位,最长16位');
		return false;
	}
	if(password != rep_password){
		alert('两次密码不一致');
		return false;
	}
	$(dom).attr('disabled','disabled');
	$.ajax({
		url:url,
		data:{password:password,rep_password:rep_password},
		type:'post',
		dataType:'json',
		success:function(i){
			$(dom).removeAttr('disabled');
			if(i.status == 0){
				alert(i.info);
			}else{
				window.location.href=i.url;
			}
		}
	})
	return false;
}

function sendSMS(dom, type) {
    var mobile = $('input[name=username]').val();
    var form_token = $('input[name=form_token]').val();
    var url = $('#sendSMS_url').val();
    if(form_token == ''){
    	alert('页面错误,请刷新重试');
    	return false;
    }

    if (mobile == '') {
        alert('请输入手机号');
        return false;
    }
    var isMobile = /^(?:13\d|14\d|15\d|17\d|18\d)\d{5}(\d{3}|\*{3})$/;
    if (!isMobile.test(mobile)) {
        alert('请输入正确的手机号');
        return false;
    }
    if (type == 1) {
        var flag = checkMobileReg(mobile);
        if (flag == 0) {
            alert('此手机号已注册过');
            return false;
        }
    }
    $.ajax({
        url: url,
        data: {
            'mobile': mobile,
            'type': type,
            'form_token':form_token
        },
        type: 'post',
        dataType: 'json',
        success: function(i) {
            if (i.status == 1) {
                alert(i.info);
                settime($(dom), 60);
                $('.error_line').hide();
            } else {
                alert(i.info);
            }
        }
    })

    return false;
}

function settime(val, countdown) {
    if (countdown == 0) {
        val.removeAttr('disabled');
        val.html('发送验证码');
        countdown = 60;
        return false;
    } else {
        val.attr('disabled','disabled');
        val.html("重新发送(" + countdown + ")");
        countdown--;
    }
    setTimeout(function() {
        settime(val, countdown)
    },
    1000)
}

//检查手机号是否已经注册过
function checkMobileReg(mobile) {
    var result = $.ajax({
        url: '/Login/checkMobileReg',
        data: {
            mobile: mobile
        },
        type: 'post',
        async: false,
        dataType: 'json',
        success: function(i) {}
    }).responseText;

    var res = $.parseJSON(result);
    return res.status;
}
