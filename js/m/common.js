$(function(){
	$('.changeSystem').click(function(){
		var val = $(this).attr('value');
		var url = $('#changeSystem_url').val();
		$.ajax({
			url:url,
			data:{'type':val},
			type:'post',
			dataType:'json',
			success:function(){
				window.location.reload();
			}
		})
	})
})