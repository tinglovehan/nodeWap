$(function(){
    var paymold=$("#pay-mold").find("a");
    touch.on(".toogleli","tap",function(){
        $(this).parents('.order-list').prev('.orderDetails').slideToggle();
        $(this).find("a").toggleClass("arrow-down");
        $(this).parent().toggleClass("arrow-down");
    });
    // touch.on(paymold,'tap',function(event){
    //     paymold.find(".icon-iconfont-gougou").removeClass("c-base");
    //     $(this).find(".icon-iconfont-gougou").addClass("c-base");
    //     $(this).addClass("c-base");
    // });
});