$(function () {
    // 翻页
    var dropBox = $(".drop-box"),
        localUrl = '/strategyIndex',
        // parentCode= $('.repeat-title').find('li').eq(0).data('id'),
        pageSize = 6, // 每页数据条数
        filterObj = { currPage: 1, pageSize: pageSize }; // 定义一个对象用于存储筛选条件,默认筛选为翻页第一页

    var dropload = dropBox.dropload({
        scrollArea: window,
        loadDownFn: filterFn
    });
    // 关键字搜索
    // touch.on("#searchBar button", "tap", function () {
    //     var value = $('#searchBar input').val();
    //
    //     //  重置筛选条件
    //     initParam();
    //
    //     filterObj.searchName = value;
    //     unLockDropload();
    //     filterFn(dropload, 1);
    // });


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
                    var results =  data[0].data;
                    dropBox.find('ul').append(listDom(results.rows));


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
function listDom(list) {
    var dom = '',
        len = list.length;

    list.reverse();
    while (len--) {
        var tag = '', _price = '';
        if (list[len].labels) {
            var k =  'labelsName',
                lens = 0;

            if (list[len][k]) {
                var _labels = list[len][k].indexOf(',') !== -1 ? list[len][k].split(',') : new Array(list[len][k]);
                lens = _labels.length > 3 ? 3 : _labels.length;
                while (lens--) {
                    tag += '<label >' + _labels[lens] + '</label>';
                }
            }
        }
        var url = '/list/strategy?parentCode='+ list[len].baseCode;

        dom += '<li>' +
            '<a class="clearfix" href="' + url + '">' +
            '<img src="' + eN(list[len].mig) + '" alt="图片"/>' +
            '</a></li>';




    }
    return dom;
}

// 空值处理
function eN(t) {
    return t ? t : '';
}
