exports.mainRouter = function (router,common){
    // 个人中心
    router.get('/member',function (req,res,next){
        if(req.session.member.id==''||!req.session.member){
           res.redirect('/login');
           return;
        }
        common.commonRequest({
            url: [{
                urlArr: ['member','info'],
                parameter: { leaguerId: req.session.member.id}
            }],
            req: req,
            res: res,
            page: 'member',
            title: '个人中心'
        });
    });

    // 用户中心
    router.get('/member/user',function (req,res,next){
        common.commonRequest({
            url: [{
                urlArr: ['member','info'],
                parameter: {leaguerId: req.session.member.id}
            }],
            req: req,
            res: res,
            page: 'member/user/index',
            title: '用户中心',
            callBack: function (results, reObj, res, handTag){
                let userInfo = results[0].data;
                for (key in userInfo){
                    req.session.member[key] = userInfo[key];
                }
            }
        });
    });

    // 修改用户信息
    router.get('/member/user/:modify',function (req,res,next){
        res.render('member/user/modify',{title:'修改信息',modify:req.params.modify,data:req.session.member});
    });

    //打开修改密码页面
    router.get('/member/changePassword',function (req,res,next){
        res.render('member/user/changePassword');
    });

    //修改用户密码
    router.get('/member/leaguerFixPwd',function (req,res,next){
        req.query.loginName = req.session.member.loginName;
        common.commonRequest({
            url: [{
                urlArr: ['member','leaguerFixPwd'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });

     // 提交用户修改
    router.post('/member/modify',function (req,res,next){
        console.log(req.query);
        req.query.loginId = req.session.member.id;
        common.commonRequest({
            url: [{
                urlArr: ['member','modify'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results){
                for (key in req.query){
                    req.session.member[key] = req.query[key];
                }
            }
        });
    });

    /*----- 订单列表在list.js(方便统一做翻页) -----*/

    // 订单详情
    router.get('/member/order/:orderNo',function (req,res,next){
        common.commonRequest({
            url: [{
                urlArr: ['member','order','detail'],
                parameter: {
                    orderNo: req.params.orderNo,
                    leaguerId:req.session.member.id
                }
            }],
            req: req,
            res: res,
            page: 'member/order/detail',
            title: '订单详情',
            callBack: function (results,reqs,resp,handTag){
                req.session.orderinfo=results[0].data;
            }
        });
    });
    // 退单详情
    router.get('/member/refundDetail/:orderNo',function (req,res,next){
        let refundNo=req.query.refundNo;
        common.commonRequest({
            url: [{
                urlArr: ['member','order','refundDetail'],
                parameter: {
                    orderNo: req.params.orderNo,
                    refundNo:refundNo,
                    leaguerId:req.session.member.id
                }
            }],
            req: req,
            res: res,
            page: 'member/order/refundDetail',
            title: '订单详情',
            callBack: function (results,reqs,resp,handTag){
                req.session.orderinfo=results[0].data;
            }
        });
    });

    // 订单评论页
    router.get('/member/comment/:module',function (req,res,next){
        res.render('member/order/comment',{title:'订单评论',module:req.params.module,orderNo:req.query.orderNo,modelCode:req.query.modelCode});
    });

    // 提交评论
    router.post('/member/comment',function (req,res,next){
        req.body.leaguerId = req.session.member.id;
        req.body.leaguerName = req.session.member.realName ? req.session.member.realName : req.session.member.loginName;
        common.commonRequest({
            url: [{
                urlArr: ['main','comment','add'],
                parameter: req.body
            }],
            isAjax: true,
            req: req,
            res: res
        });
    });

    // 退款页面
    router.get('/member/refund/:module',function (req,res,next){
        res.render('member/order/refund',{
            title:'订单退款',
            orderNo: req.query.orderNo,
            module: req.params.module,
            maxNum:req.query.maxNum
        });
    });

    // 提交退款
    router.post('/member/refund/:module',function (req,res,next){
        req.query.leaguerId =  req.session.member.id;
        common.commonRequest({
            url: [{
                urlArr: ['member','order','refund'],
                parameter: req.query
            }],
            isAjax: true,
            req: req,
            res: res
        });
    });

    //取消订单
    router.post('/member/cancle/:orderNo',function (req, res, next) {
        common.commonRequest({
            url:[{
                urlArr:['member','order','cancel'],
                parameter:{
                    orderNo:req.params.orderNo,
                    leaguerId:req.session.member.id
                }
            }],
            isAjax: true,
            req: req,
            res: res
        })
    });
    //确定收货
    router.get('/member/received/:orderNo',function (req, res, next) {
        common.commonRequest({
            url:[{
                urlArr:['member','order','receivedGoods'],
                parameter:{
                    orderNo:req.params.orderNo,
                    leaguerId:req.session.member.id
                }
            }],
            isAjax: true,
            req: req,
            res: res
        })
    })
    //删除订单
    router.post('/member/remove/:orderNo',function (req, res, next) {
        common.commonRequest({
            url:[{
                urlArr:['member','order','remove'],
                parameter:{orderId:req.params.orderId}
            }],
            isAjax: true,
            req: req,
            res: res
        })
    })
}