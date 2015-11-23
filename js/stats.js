(function () {
    var statsDomain = localStorage.getItem('webdomain');
    if(!statsDomain){
        var returnData = getWebDomain();
        statsDomain = returnData? returnData :'http://www.chunbo.com';
        localStorage.setItem('webdomain',statsDomain);       
    }
    var d = document, b = document.getElementsByTagName('body')[0], i = document.createElement('img');
    var src = statsDomain+'/Stats/?w=' + screen.width + '&h=' + screen.height + '&aw=' + screen.availWidth + '&ah=' + screen.availHeight;
    src += '&href=' + encodeURIComponent(document.URL) + '&ref=' + encodeURIComponent(document.referrer);
    i.src = src;
    
    var addClick = function(clickD){    
        var d = clickD;
            $(document).on('click', function(e){
                var target = e.target;
                var clickData = target.getAttribute("cbclick") ? target.getAttribute("cbclick") : d;
                if(clickData !="" && clickData != 'undefined' && clickData != null){
                    var src = statsDomain+'/Stats/addClick?d='+clickData+'&ref=' + encodeURIComponent(document.URL);
                    i.src = src;
                }
            });
    }
    addClick();
})();

//获取域名配置
function getWebDomain (){
    var webdomain;
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: "/Stats/getConfig",
            async:false,
            success: function (returnData) {
                if(returnData.flag == 1){
                    webdomain = returnData.key;
                }else{
                    webdomain = ''; 
                }
            }
        });
        return webdomain;
}
function addClickAll (clickD){
    var statsDomain = localStorage.getItem('webdomain');
    if(!statsDomain){
        var returnData = getWebDomain();
        statsDomain = returnData? returnData :'http://www.chunbo.com';
        localStorage.setItem('webdomain',statsDomain);       
    }
    i = document.createElement('img');
    var src = statsDomain+'/Stats/addClick?d='+clickD+'&ref=' + encodeURIComponent(document.URL);  
    i.src = src;
}  
