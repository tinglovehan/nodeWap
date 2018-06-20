$(function () {
    /**
     * banner
     */
    var bannerSwiper = new Swiper('#banner_swiper', {
        loop: true,
        //autoplay: 4000,
        pagination: '.swiper-pagination'
    });
    //景区滑动
    var swiper = new Swiper('.swiper-container2', {
        slidesPerView: 2,
        centeredSlides: true,
        slidesPerGroup : 3,
        //paginationClickable: true,
        spaceBetween:10

    });

})