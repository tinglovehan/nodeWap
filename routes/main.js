
exports.mainRouter = function (router, common) {

    // 首页
    router.get(['/', '/main'], function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['main', 'index', 'allInfo'],
                parameter: {
                    modelCode:'index'
                }
            }],
            req: req,
            res: res,
            page: 'main',
            title: '黄山-首页'
        });
    });
    // // 首页
    // router.get(['/', '/index'], function (req, res, next) {
    //     res.render('test', {title: '标准版-首页'})
    // });
   // 商品首页
    router.get('/goodsIndex', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['main', 'index', 'allInfo'],
                parameter: {
                    modelCode:'wapGoodsIndex'
                }
            }],
            req: req,
            res: res,
            page: 'shopIndex',
            title: '商品'
        });
    });
    // 攻略首页
    router.get('/strategyIndex', function (req, res, next) {
      res.render('strategyIndex', {title: '攻略'})
    })
    router.post('/strategyIndex', function (req, res, next) {
        for (key in req.query) {
            req.body[key] = req.query[key];
        }
        req.body. modelCode='strategyClassify'
        common.commonRequest({
            url: [{
                urlArr: ['main', 'index', 'listInfo'],
                parameter: req.body,
                method: 'get'
            }],
            isAjax: true,
            req: req,
            res: res,
            title: '攻略'
        });
        // res.render('strategyIndex', {title: '攻略'})
    });
    // 餐饮首页
    router.get('/repastIndex', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['main', 'index', 'allInfo'],
                parameter: {  modelCode:'wapRepastIndex'}
            }, {
                urlArr: ['main', 'classify'],
                parameter: { businessType: 'repast' }
            }
            ],
            req: req,
            res: res,
            page: 'repastIndex',
            title: '餐饮'
        });

    });
    //餐饮首页下方列表
    router.post('/repastList', function (req, res, next) {
        for (key in req.query) {
            req.body[key] = req.query[key];
        }
        common.commonRequest({
            url: [{
                urlArr:  ['repast', 'list', 'pagelist'],
                parameter: req.body,
                method: 'get'
            }],
            isAjax: true,
            req: req,
            res: res
        });

    });

    // 登陆页面
    router.get('/login', function (req, res, next) {
        res.render('login', {title: '登录', redir: req.query.redir || req.session.curUrl || './member'})
    });

    //注册
    router.get('/register', function (req, res, next) {
        res.render('register', {title: '注册', redir: req.session.curUrl || './member'});
    });

    //查看用户协议
    router.get('/register/protocol', function (req, res, next) {
        res.render('member/register/registrationProtocol', {title: '注册协议'});
    });


    // 注册
    router.get('/signIn', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['member', 'register'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });

    //登录
    router.get('/leaguerLogin', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['member', 'login', 'main'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });
    //手机号快捷登录
    router.get('/phoneNumberLogin', function (req, res, next) {
        req.query.channel = 'LOTSWAP'
        common.commonRequest({
            url: [{
                urlArr: ['member', 'login', 'leaguerMobileLogin'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });


    // 发送验证码
    router.post('/checkCode', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['member', 'login', 'sendCheckCode'],
                parameter: req.body
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });

    // 注销用户
    router.get('/loginOut', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['member', 'logout']
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results, reqs, resp, handTag) {
                req.session.destroy()
            }
        });
    });

    //忘记密码
    router.get('/forgetPassword', function (req, res, next) {
        res.render('pwd1', {title: '忘记密码'});
    });

    //核对验证码是否正确
    router.get('/checkPhoneCode', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['member', 'login', 'checkPhoneCode'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });

    //打开重置密码页面
    router.get('/resetPassword', function (req, res, next) {
        res.render('pwd2', {title: '忘记密码',id:req.query.id});
    });

    //设置新密码
    router.get('/setNewPassword', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['member', 'login', 'resetPwd'],
                parameter: req.query,
                method:"POST"
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });

    //无密登录
    router.get('/fastregByAccount', function (req, res, next) {
        req.query.channel = 'LOTSWAP';
        common.commonRequest({
            url: [{
                urlArr: ['member', 'login', 'fastregByAccount'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });

     //错误处理
    router.get('/error', function (req, res, next) {
        res.render('error', {
            message: req.flash('message').toString()
        })
    });

    router.get('/404', function (req, res) {
        res.render('error404', {
            message: req.flash('message').toString()
        })
    });
};