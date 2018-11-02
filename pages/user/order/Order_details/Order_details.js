// pages/user/order/Order_details/Order_details.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      curVipLevel:0,   //会员等级
      vip_Data:{},
      order_no:'2018091214510098',  //订单号
      isShowGoodDetails: true, //是否展开订单详情
      img_next:'/images/image_down_icon.png',  //展开时显示的向下的箭头
      totalAmount:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
      let data = JSON.parse(options.data);
      this.setData({
          vip_Data: data,
          curVipLevel: data.id,
      })
      //计算总价值
      if(this.data.curVipLevel == 6){
          let total = parseInt(data.extra_fee) + parseInt(data.website_fee) + parseInt(data.price_first_year);
          this.setData({
              totalAmount: total
          })
      }
      console.log(data)
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


    onNextClickListener:  function(e){

        let state = e.currentTarget.dataset.state;
        this.setData({
            isShowGoodDetails: !state,
            img_next: state ? '/images/image_right_icon.png' :'/images/image_down_icon.png'
        })
    },

    onPayClickListener: function(e){
        let payUrls = app.onGetUrls('PAY_ORDER');
        let that = this;
        app.onHttpRequest(payUrls, 'POST',{
            token: wx.getStorageSync('token'),
            pay_type: 2,
            trade_type: 'JSAPI',
            order_id: that.data.vip_Data.order_id
        }, function(data){
            let prepay_id = data.orderString.prepay_id;
            var myDate = new Date();//获取系统当前时间
            let milliseconds = parseInt(myDate.getTime() / 1000);
            let nonceStr = that.getPayRandomStr();
            let sign = that.getPaySign(milliseconds, nonceStr, prepay_id);

            wx.requestPayment({
                timeStamp: milliseconds.toString(), //时间戳，从 1970 年 1 月 1 日 00:00:00 至今的秒数，即当前的时间
                nonceStr: nonceStr,  //随机字符串，长度为32个字符以下
                package: 'prepay_id=' + prepay_id,    //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=***
                signType: 'MD5',   //签名算法，暂支持 MD5
                paySign: sign,        //签名
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) {
                    console.log(res)
                },
            })
        });
        
    },
    /**
 * 之后获取32位长度的字符串
 */
  getPayRandomStr: function(){
      var arrays = ["A", "B", "C", "D", "E", "F", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        let str='';
        for(var i=0; i<32; i++){
            let s = arrays[Math.round(Math.random() * (arrays.length - 1))]; 
            str += Math.round(Math.random()*1) ==1 ?s.toUpperCase() : s.toLowerCase();
        }
    return str;
    },
    getPaySign: function (milliseconds, nonceStr, prepay_id){
        let showStr = 'appId=' + app.globalData.appId+"&"
            + "nonceStr=" + nonceStr+"&"
            +"package="
            + "prepay_id=" + prepay_id+"&"
            +"&signType=MD5"
            +"timeStamp=" + milliseconds+"&"
            +"key=Rdhh7mJbAASqiSS3WFlU4Hcxep97ELhR";
            
        return app.MD5(showStr);
    }
})