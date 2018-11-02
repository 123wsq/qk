var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        oldMobile:'',
        showMobile:'',
        countDownNum: 60,
        isClick: true,
        isTimerRun: false,
        validateText: '点击获取',
        code: '',
        verificationCode_key: '',
    },
    onLoad:function(){
        let mobile = wx.getStorageSync('mobile');
        let showMobile = mobile.substr(0,3)+"****"+mobile.substr(7,4);
        this.setData({
            oldMobile: mobile,
            showMobile: showMobile
            })
    },
    /**
     * 输入框内容发生变化的时候
     */
    onInputChangeListener: function (e) {
        let intputKey = e.currentTarget.dataset.type;
        let inputValue = e.detail.value;
        this.setData({
            [intputKey]: inputValue
        })
    },
    //获取验证码
    onGetValidateCode: function (e) {
        let that = this;
        let mobile = this.data.oldMobile;
        let isTimerRun = this.data.isTimerRun;
       
        if (isTimerRun) {
            return;
        }
        let validateUrl = app.onGetUrls('GET_VALIDATE');
        wx.request({
            url: validateUrl,
            data: {
                type: 4,
                mobile: mobile
            },
            method: 'GET',
            success: function (res) {
                if (res.data.code != 100) {
                    app.onShowToast(res.data.message);
                   
                    return;
                }
                that.setData({
                    verificationCode_key: res.data.data.verificationCode_key
                })
                if (!isTimerRun) {
                    that.countDown();
                    that.setData({
                        isTimerRun: true
                    })
                }

            }
        })


    },
    /**
     * 实现倒计时
     */
    countDown: function () {
        let that = this;
        let countDownNum = that.data.countDownNum;
        //获取倒计时初始值
        //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
        that.setData({
            timer: setInterval(function () {
                //这里把setInterval赋值给变量名为timer的变量
                //每隔一秒countDownNum就减一，实现同步
                countDownNum--;

                //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
                if (countDownNum < 1) {
                    //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
                    //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭 
                    clearInterval(that.data.timer);
                    //关闭定时器之后，可作其他处理codes go here
                }
                //然后把countDownNum存进data，好让用户知道时间在倒计着
                that.setData({
                    isClick: countDownNum == 0 ? true : false,
                    countDownNum: countDownNum == 0 ? 60 : countDownNum,
                    validateText: countDownNum < 1 ? "点击获取" : countDownNum + 's后重发',
                    isTimerRun: countDownNum == 0 ? false : true
                })

            }, 1000)
        })
    },
    //点击下一步
    onNextListener: function (e) {

        //验证手机号码
        let mobile = this.data.oldMobile;
        let code = this.data.code;
        let verificationCode_key = this.data.verificationCode_key;

        wx.navigateTo({
            url: '/pages/user/more/update_mobile/update_mobile?mobile=' + mobile,
        })
    }

})
