var pages=1;
$(function () {
    // 翻页
    var dropBox = $(".drop-box"),
        module = dropBox.data('module'),
        h_type=dropBox.data('type'),
        localUrl = location.pathname + window.location.search,
        url = $('.list-tab').find('li').eq(0).data('url'),
        pageSize = 6, // 每页数据条数
        filterObj ={ currPage: 1, pageSize: pageSize}; // 定义一个对象用于存储筛选条件,默认筛选为翻页第一页


    var dropload = dropBox.dropload({
        scrollArea: window,
        loadDownFn: filterFn
    });

    var urlS,parentCode;


    // 关键字搜索
    touch.on("#searchBar button", "tap", function () {
        var value = $('#searchBar input').val();

        //  重置筛选条件
        initParam();
        filterObj.searchName = value;

        //unLockDropload();
        filterFn(dropload, 1);
    });


    //分类筛选
    touch.on(".list-tab li", "tap", function () {
       $(this).parent().parent().siblings('.drop-box ').find('ul').removeClass('list-Smain').addClass('list-main');
       $(this).parent().parent().siblings('#search-h ').removeClass('search-box2').addClass('search-box')
        url = $(this).data('url');
        $(this).addClass('c-base').siblings().removeClass('c-base');
        module = $(this).data('module'),
        //  重置筛选条件
        initParam2(url);
        unLockDropload();
        filterFn(dropload, 1);
    });
    $('.list-tab').find('li').eq(0).addClass('c-base').siblings().removeClass('c-base');

    function initParam2(url) {
        localUrl = url;
        filterObj.currPage = 1;
    }
    function initParam() {
        localUrl = location.pathname;
        filterObj.currPage = 1;
    }

    // 筛选构造DOM
    function filterFn(dropload, startPage) {
       console.log(localUrl);
        $.ajax({
            type: 'POST',
            url: localUrl,
            data: filterObj,
            dataType: 'json',
            success: function (data) {
                if (data !== 'error' && data[0].flag !== 'error') {
                    var results =data[0].data;

                    if (startPage) {
                        dropBox.find('ul').html(listDom(results.rows, module,h_type));
                    } else {
                        dropBox.find('ul').append(listDom(results.rows, module,h_type));
                    }
                    console.log(filterObj.currPage);
                    //filterObj.currPage = +(results.curPage) + 1;
                    filterObj.currPage += 1;
                    if (filterObj.currPage > results.pages) {
                        dropload.lock();
                        dropload.noData();
                    }
                } else {
                    dropload.lock();
                    dropload.noData();
                }
                // 每次数据加载完，必须重置
                dropload.resetload();
            },
            error: function (xhr, type) {
                // 即使加载出错，也得重置
                dropload.resetload();
            }
        });
    }

    // unLockDropload();
    // filterFn(dropload, 1);
    /**
     * 解锁dropload
     */
    function unLockDropload() {
        //dropload.resetload();
        dropload.unlock();
        //dropload.noData(false);
        dropload.isData = true;

    }
});

// 列表DOM
function listDom(list, module,h_type) {
    var dom = '',
        len = list.length,
        status,
        imgClass;
    if (module === 'strategy'){
        imgClass='raiders-img';
    }else if(module === 'shop'){
        imgClass='goods-list-img'
    }else{
        imgClass='page-list-img'
    }




    list.reverse();
    while (len--) {

            var tag = '', _price = '';
            if (list[len].labels || module === 'guide') {
                var k = module === 'guide' ? 'language' : 'labelsName',
                    lens = 0;

                if (list[len][k]) {
                    var _labels = list[len][k].indexOf(',') !== -1 ? list[len][k].split(',') : new Array(list[len][k]);
                    lens = _labels.length > 3 ? 3 : _labels.length;
                    while (lens--) {
                        tag += '<span class="pro-flag c-base border-base">' + _labels[lens] + '</span>';
                    }
                }
                // list[len][k].split(",").reverse();
            }

            //url
            var url = '';
            switch (module) {
                case 'combo':
                    url = '/detail/combo/' + list[len].goodsCode + '?rateCode=' + list[len].rateCode;
                    break;
                case 'route':
                    url = '/detail/route/' + list[len].goodsCode;
                    break;

            }
            if(module === 'route'||module === 'car'){
                dom += '<li>' +
                    '<a class="clearfix" href="' + url + '">' +
                    '<div class="' + imgClass + '">' +
                    '<img src="' + eN(list[len].mobileImg) + '" alt="图片"/>' +
                    '</div>';
            }else if(module === 'integral'){
                dom += '<li class="opacity">';
            }
            else{
                dom += '<li>' +
                    '<a class="clearfix" href="' + url + '">' +
                    '<div class="' + imgClass + '">' +
                    '<img src="' + eN(module === 'strategy' ? list[len].face_img : list[len].linkMobileImg) + '" alt="图片"/>' +
                    '</div>';}
            switch (module) {
                case 'combo':
                    list[len].currentPrice ? _price = '<span class="price fr"><em>￥</em><strong>' + list[len].currentPrice + '</strong>起</span>' +
                        '<span class="original-price fr"><em>￥</em><strong>' + list[len].priceShow + '</strong></span>' : _price = '';
                    dom += '<div class="page-list-info">' +
                        '<h3 class="page-list-title"><div class="combo-list-title">' + eN(list[len].aliasName) + '</idv></h3>' + tag +
                        '<p class="page-list-explian">' +
                        '<span class="c-base">' + (list[len].salesNum || 0) + '</span>人出游' +
                        _price +
                        '</p>' +
                        '</div></a></li>';
                    break;
                case 'route':
                    list[len].priceShow ? _price = '<span class="price fr"><em>￥</em><strong>' + (list[len].priceShow).toFixed(2) + '</strong>起</span>' : _price = '';
                    dom += '<div class="page-list-info">' +
                        '<h3 class="page-list-title"><div class="combo-list-title">' + eN(list[len].aliasName) + '</idv></h3>' + tag +
                        '<p class="page-list-explian">' +
                        '<span class="c-base">' + (list[len].salesNum || 0) + '</span>人购买' +
                        _price +
                        '</p>' +
                        '</div></a></li>';
                    break;


            }

    }
    return dom;
}

// 空值处理
function eN(t) {
    return t ? t : '';
}

function dialogclose(div) {
    var height = $(".tab-search-panel").eq(div).outerHeight(true);
    $(".tab-search-panel").eq(div).stop().animate({
        top: -height + "px"
    }, 300);
    $("#mask").hide();
    $("#searchtab").find("a").removeClass("c-base");
    div = null;
    return div;
}

function dodiv() {
    var flag = false;
    $(".tab-search-panel").each(function () {
        var top = $(this).position().top;
        if (top > 0) {
            flag = true;
            return false;
        }
    });
    return flag;
}

function getDateStr(data, AddDayCount) {
    var dd = new Date(data);
    dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = (dd.getMonth() + 1) > 9 ? (dd.getMonth() + 1) : "0" + (dd.getMonth() + 1); //获取当前月份的日期
    var d = dd.getDate() > 9 ? dd.getDate() : "0" + dd.getDate();
    return y + "-" + m + "-" + d;
}

function getDay(_date) {
    var dateArray = _date.split('-');
    var _day = parseInt(dateArray[2]);
    return _day;
}