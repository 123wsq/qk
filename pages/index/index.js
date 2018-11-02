//index.js
var app = getApp();
Page({
  data: {
    userInfo: {},
    countDownNum:60,
    timer: '',//定时器名字
    hasUserInfo: false,
    showManualNumber: false,//表示显示手动绑定手机号
    showNumber: false,
    validateMsg:'点击获取',
    encryptedData:'',
    iv:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
    mobile: '',
    validateCode: '',
    verificationCode_key:'',
    isClickValidateCode: true, //获取验证码按钮是否可点击
    onLoad: function (options) {

        
        //验证进入入口是否是分享路径进入
        console.log(options)
        if(!app.isEmpty(options.data)){
            let data = JSON.parse(options.data);
            wx.setStorageSync("shareData", JSON.stringify({
                id: data.id,
                custom_detail_url: data.custom_detail_url,
            }));
        } else if (!app.isEmpty(options.scene)){ //表示小程序码进入
            const scene = decodeURIComponent(options.scene);
            let businessId = scene.split("_");
            let url='';
            if (!app.isEmpty(businessId[1])){
                 url= app.onGetUrls('BUSINESS_CARD_DETAILS', false) ;
            }
            wx.setStorageSync("shareData", JSON.stringify({
                id: businessId[0],
                custom_detail_url: url,
            }));
        }else{
            wx.setStorageSync("shareData", '');
        }
        //判断之前是否登录，如果已经登录直接进入到主页面
        if (!app.isEmpty(wx.getStorageSync('token'))) {
            wx.switchTab({
                url: '/pages/tab/Page_Business_Pkg/Page_Business_Pkg'
            })
        }
      
  },
  /**
   * 获取用户信息
   */
    getUserInfo: function (e) {
        let that = this;
     
        if (e.detail.userInfo) {
            wx.setStorageSync('name', e.detail.userInfo.nickName)
            wx.setStorageSync('avatar', e.detail.userInfo.avatarUrl)
            let encryptedData = e.detail.encryptedData;
            let iv = e.detail.iv;
            app.onLoginUser(0, {
                encryptedData: encryptedData,
                iv: iv
            }, function () {
                //绑定手机号
                that.setData({
                    code: wx.getStorageSync('code'),
                    showNumber: true,
                    // showManualNumber: true
                })
            });
              
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                showCancel: false,
                confirmText: '返回授权',
            })
        }
    },
   
 

/**
 * 手机号码输入
 */
    onInputMobileListener: function(e){
        this.mobile=e.detail.value;
    },
    /**
     * 验证码输入
     */
    onInputCodeListener: function(e){
        this.validateCode = e.detail.value;
    },
   

    /**
     * 取消按钮
     */
    onDialogClickListener: function(){
        let showManualNumber = this.data.showManualNumber;
        let showNumber = this.data.showNumber;
        if(showNumber){
            this.setData({ showNumber: false })    
        }
        if(showManualNumber){
            this.setData({ showManualNumber: false })
        }
        
    },

/**
 * 获取验证码
 */
    onGetValidateClickListener: function (e) {
        let that = this;
        let isClickValidateCode = this.isClickValidateCode;
        if(!isClickValidateCode){
            return;
        }
        let validateCodeUrls = app.onGetUrls('GET_VALIDATE');
        //验证手机号码
        if(!app.isMobile(this.mobile)){
            wx.showModal({
                title: '提示',
                content: '请输入正确的手机号码',
                showCancel: false,
            })
            return;
        }
        this.countDown();
        this.isClickValidateCode = false;
        app.onHttpRequest(validateCodeUrls,'GET',{
            type:'4',
            mobile: this.mobile
        },function(data){
            that.verificationCode_key = data.verificationCode_key;
            if (data.need_bind_old_account != undefined && data.need_bind_old_account == 1){
                wx.showModal({
                    title: '提示',
                    content: '手机号不存在，自动绑定失败，请手动绑定！',
                    showCancel: false,
                })
            }
        });
    },
    /**
     * 提交手机号码
     */
    onSubmitBindingNumberListener: function(e){
        let bingdingMobile = app.onGetUrls('MANUAL_BINGDING_MOBILE');
        app.onBindMobile({
            smsCode: this.validateCode,
            verificationCode_key: this.verificationCode_key,
            phoneNumber:this.mobile,
            cookie_temp_key: wx.getStorageSync('cookie_temp_key'),
            bind_type: 2
        });
    },
  /**
   * 获取手机号码
   */
    getPhoneNumber: function(e){
        if (e.detail.errMsg == 'getPhoneNumber:fail user deny'){
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '没有授权获取微信所绑定的手机号码，您将不能进入到应用里面！',
            })

            return;
        }
        let encryptedData = e.detail.encryptedData;
        let iv = e.detail.iv;
        let that = this;
        this.setData({
            showNumber: false,
        })
        let data = {};
        data.encryptedData = encryptedData;
        data.iv = iv;
        data.cookie_temp_key = wx.getStorageSync('cookie_temp_key');
        data.bind_type =1;

        app.onBindMobile(data, function(data){
            that.setData({
                showManualNumber:true,
            })
        });
    },

/**
 * 定时器
 */
    countDown: function () {
        let that = this;
        let countDownNum = that.data.countDownNum;//获取倒计时初始值
        //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
        that.setData({
            timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
                //每隔一秒countDownNum就减一，实现同步
                countDownNum--;
                //然后把countDownNum存进data，好让用户知道时间在倒计着
                that.setData({
                    countDownNum: countDownNum,
                    validateMsg:'还剩'+countDownNum+'s'
                })
                //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
                if (countDownNum == 0) {
                    //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
                    //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
                    that.setData({
                        countDownNum:60,
                        validateMsg:'点击获取',
                    })
                    that.isClickValidateCode = true;
                    clearInterval(that.data.timer);
                    //关闭定时器之后，可作其他处理codes go here
                }
            }, 1000)
        })
    }


})
