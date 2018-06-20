// var promoteCode = getCookie("qyyx_code_wangqiang");

$(function () {
	// 响应式布局
	var winWidth = $(window).width();
	$("html").css("fontSize", (winWidth / 640) * 40 + "px");




	// 不知道什么鬼
	if($('#details-tab').size()>0) {
		tab("details-tab");
	}

	// 轮播
	// if($('#home_slider').size()>0){
	// 	$('#home_slider').flexslider({
	// 		animation : 'slide',
	// 		controlNav : true,
	// 		directionNav : true,
	// 		animationLoop : true,
	// 		slideshow : false,
	// 		useCSS : false,
	// 		slideshow:true,
	// 		slideshowSpeed: 3000
	// 	});	
	// }

	// 轮播
	if($('#rec_slider').size()>0){
		$('#rec_slider').flexslider({
			animation : 'slide',
			controlNav : true,
			directionNav : true,
			animationLoop : true,
			slideshow : false,
			useCSS : false,
			slideshow:true,
			slideshowSpeed: 3500
		});	
	}
	if($('#tab').size()>0){
		tabs.init("tab");	
	}
	if($('.number').size()>0){
		if($("#route-list").length>0){
				var totalp=0;
					$(".route-price").each(function(){
						var price=$(this).find("strong").text();
						totalp=operation.accAdd(totalprice,price);
					});
					$("#totalprice").text(totalp);
					$('input[name=totalPrice]').val(totalp);
				}
				else{
					totalprice(1);
				}
		$(".number").numSpinner({
			min:1,
			onChange:function(evl,value){
				if($("#route-list").length>0){
					routetotalprice();
				}
				else{
					totalprice(value);
				}
			}
		});	
	}
	$("#mask").height($(document).height());
	$(".tips-wrapper").css("min-height",$(window).height());
	
	// pop tips
	$('.tips a').on('click',function (){
		$('.mask,.tips').hide();
	});
});

var tabs={
	init:function(divid){
		$("#"+divid).find("a").click(function(e){
			var itmeId=$(this).attr("href");
			if(itmeId.substr(0,1)=="#"){
				e.preventDefault();
			}
			$(itmeId).addClass('active').siblings().removeClass("active");
			$(this).parent().addClass('active').siblings().removeClass("active");
		});
	}
};

/**
 *计算购买支付价格
 * @param {*购买数量} num 
 * @param {*优惠券满减限制} fullCat 
 * @param {*优惠券类型} couponType
 * @param {*优惠券券值} couponValue
 */
function totalprice(num){
	var price=$("#price").text();
	var payPrice = $('.payPrice');
	var couponInfo = $('#couponInfo');
    var couponHandlePrice = $('.couponHandlePrice');
	var couponType, fullCat, couponValue;

	if (couponInfo){
		couponType = couponInfo.data('T');
		fullCat = couponInfo.data('F');
		couponValue = couponInfo.data('V');
	}

	var _totalPrice = parseFloat(operation.accMul(price, num).toFixed(2));
	var _handledPrice = '';
	$("#totalprice").text(_totalPrice);
	$('#cost-dialog .cost-dialog-explian strong').text(_totalPrice);
	if (couponType&&couponValue&&(+_totalPrice >= fullCat)){	
		_handledPrice = (+couponType)
			? (_totalPrice * ((+couponValue) / 10)).toFixed(2)
			: (_totalPrice - (+couponValue)).toFixed(2);

		payPrice.html(_handledPrice);

        var handlePrice='';
        couponInfo.data('T') === '0'
            ? handlePrice = '- ' + couponInfo.data('V') + ' ='
            : handlePrice = '* ' + (couponInfo.data('V') / 10) + ' =';
        couponHandlePrice.html(handlePrice);

		$('input[name=totalPrice]').val(_handledPrice);

		return 1; //优惠券有效处理了价格
	} else {
		$('input[name=totalPrice]').val(_totalPrice);
		payPrice.html('');
        couponHandlePrice.html('');
		return 0; //没有用优惠券处理价格
	}
}

function routetotalprice(){
	var totalprice=0;
	$(".number").each(function(){
		var val=$(this).val();
		var price=$(this).parent().next().find("strong").text();
		totalprice=operation.accAdd(totalprice,operation.accMul(val,price));
	});
	$("#totalprice").text(totalprice);
	$('input[name=totalPrice]').val(totalprice);
}

//四则运算
var operation={
	accMul:function(arg1,arg2){
		var m=0,s1=arg1.toString(),s2=arg2.toString();
		try{m+=s1.split(".")[1].length}catch(e){}
		try{m+=s2.split(".")[1].length}catch(e){}
		return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
	},
	accDiv:function(arg1,arg2){
		var t1=0,t2=0,r1,r2;
	    try{t1=arg1.toString().split(".")[1].length}catch(e){}
	    try{t2=arg2.toString().split(".")[1].length}catch(e){}
	    with(Math){
	        r1=Number(arg1.toString().replace(".",""));
	        r2=Number(arg2.toString().replace(".",""));
	        return (r1/r2)*pow(10,t2-t1);
	    }
	},
	accAdd:function(arg1,arg2){
		var r1,r2,m;
	    try{r1=arg1.toString().split(".")[1].length;}catch(e){r1=0;}
	    try{r2=arg2.toString().split(".")[1].length;}catch(e){r2=0;}
	    m=Math.pow(10,Math.max(r1,r2));
	    return (arg1*m+arg2*m)/m;
	},
	accSub:function(arg1,arg2){
		var r1,r2,m,n;
	     try{
	         r1=arg1.toString().split(".")[1].length;
	         }catch(e){
	             r1=0;
	             }
	     try{
	         r2=arg2.toString().split(".")[1].length;
	         }catch(e){
	             r2=0;
	             }
	     m=Math.pow(10,Math.max(r1,r2));
	     //last modify by deeka
	     //动态控制精度长度
	     n=(r1>=r2)?r1:r2;
	     return ((arg2*m-arg1*m)/m).toFixed(n);
	}
};
function tab(id){
	var touchObj=$("#"+id).find("a");
	 $("#tab-panel").find(".details-tab-item:eq(0)").css("height","auto");
	 touch.on(touchObj,'tap',function(){
		 var index=$(this).parent().index(),divid=$(this).data("div");
		 touchObj.removeClass("active");
		 $(this).addClass("active");
		 $("#tab-panel").css("margin-left",-(Math.round(index * 10000)/100).toFixed(2) + '%').find(".details-tab-item").removeAttr("style");
		 $("#"+divid).css("height","auto");
	 });
 }

//  业务类型
function getModule(module){
	var title="";
	switch (module){
		case "ticket":
			title="景区";
			break;
		case "hotel":
			title="酒店";
			break;
		case "route":
			title="跟团游";
			break;
		case "line":
			title="自由行";
			break;
		case "cate":
			title="餐饮";
			break;
		case "goods":
			title="商品";
			break;
		case "raiders":
			title="攻略";
			break;
		case "guide":
			title="导游";
			break;
	}
	return title;
}

// 业务类型图标
function getIcon(m){
	switch (m){
		case 'ticket':
			return '<span class="order-info"><i class="font-icon icon-iconfont-menpiao"></i>' +
                   '<em>景区';
			break;
		case 'hotel':
			return '<span class="order-info"><i class="font-icon icon-iconfont-jiudian"></i>' +
                   '<em>酒店';
			break;
		case 'combo':
			return '<span class="order-info"><i class="font-icon icon-iconfont-ziyouxing"></i>' +
                   '<em>自由行';
			break;
		case 'shop':
			return '<span class="order-info"><i class="font-icon icon-iconfont-shouji3"></i>' +
                   '<em>购物';
			break;
		case 'repast':
			return '<span class="order-info"><i class="font-icon icon-iconfont-canting"></i>' +
                   '<em>美食';
			break;
		case 'amuse':
			return '<span class="order-info"><i class="font-icon icon-iconfont-amuse"></i>' +
                   '<em>娱乐';
			break;
		case 'traffic':
			return '<span class="order-info"><i class="font-icon icon-iconfont-amuse"></i>' +
                   '<em>交通';
			break;
        case 'route':
            return '<span class="order-info"><i class="font-icon icon-iconfont-shouji5"></i>' +
                '<em>跟团游';
            break;
        case 'car':
            return '<span class="order-info"><i class="font-icon icon-iconfont-shouji32"></i>' +
                '<em>租车';
            break;
        case 'guide':
            return '<span class="order-info"><i class="font-icon icon-iconfont-zhanghu"></i>' +
                '<em>导游';
            break;
	}
}

//  导游等级
function guideLevel(level){
	switch (level){
		case '铜牌':
			return '<i class="icon-guide-level3"></i>';
			break;
		case '银牌':
			return '<i class="icon-guide-level2"></i>';
			break;
		case '金牌':
			return '<i class="icon-guide-level"></i>';
			break;
	}
}

//  床型
function isBed(bed){
	switch (bed){
		case 0:
			return '大床';
			break;
		case 1:
			return '大床';
			break;
		case 2:
			return '大床';
			break;
	}
}

//  早餐
function isBreakfast(Breakfast){
	switch (Breakfast){
		case 0:
			return '单早';
			break;
		case 1:
			return '单早';
			break;
		case 2:
			return '单早';
			break;
	}
}

// 检测终端
function ispc(){
	 var flag=true;
	 var system = {
		 win: false,
		 mac: false,
		 xll: false,
		 ipad:false
	 };
	 //检测平台
	 var p = navigator.platform;
	 system.win = p.indexOf("Win") == 0;
	 system.mac = p.indexOf("Mac") == 0;
	 system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
	 system.ipad = (navigator.userAgent.match(/iPad/i) != null)?true:false;
	 //跳转语句，如果是手机访问就自动跳转到wap.baidu.com页面
	 if (system.win || system.mac || system.xll||system.ipad) {
		 flag=true;
	 } else {
		 flag=false;
	 }
	 return flag;
 }

//  跳转错误页面
function error(){
	window.location.href = '/error';
}

// 订单状态
function payStatus(s,m){
	s = typeof s === 'string' ? parseInt(s) : s;
	switch (s){
		case 0:
			return '待支付'; break;
		case 1:
			return '待消费'; break;
		case 2:
			return '交易成功'; break;
		case 3:
			return '已退款'; break;
		case 4:
			return '交易取消'; break;
		case 5:
			return '待确认'; break;

	}
}
// 退单状态状态
function refundStatus(s,m){
    s = typeof s === 'string' ? parseInt(s) : s;
    switch (s){
        case 0:
            return '待审核'; break;
        case 1:
            return '等待审核'; break;
        case 2:
            return '退款中'; break;
        case 3:
            return '退款失败'; break;
        case 4:
            return '退票中'; break;
        case 5:
            return '退票失败'; break;
        case 6:
            return '退单成功'; break;
        case 7:
            return '退款成功'; break;
        case 8:
            return '第三方退单失败'; break;
        case 9:
            return '退单失败'; break;
        case 10:
            return '退单申请成功,等待平台返回'; break;
    }
}

/**
 * 去除日历数据中的时间，保留日期
 * @param date (eg:2017-10-17 12:05:05)
 */
function dealTimeDate(date){
	var dateArray = date.split(' ');
	return dateArray[0];
}

/**
 * 订单使用状态
 * @param t
 * @returns {*}
 */
function useStatus(t) {
	switch (t){
		case '0':
			return '未使用'; break;
		case '1':
			return '使用中'; break;
		case '2':
			return '已使用'; break;
		default:break;

	}
}

//对接全员营销
// (function() {
// 	var hm = document.createElement("script");
// 	hm.id = "statis-qyyx";
// 	hm.src = "//192.168.200.40:8081/static/h-ui/js/pro.js?wangqiang";
// 	var s = document.getElementsByTagName("script")[0];
// 	s.parentNode.insertBefore(hm, s);
// })();

//获取cookie
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
