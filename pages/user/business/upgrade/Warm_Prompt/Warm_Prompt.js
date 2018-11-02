// pages/user/business/upgrade/Warm_Prompt/Warm_Prompt.js

import Validate from "../../../../../utils/validate.js";
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      curVipLevel: 0,
      vip_Data:{},
      protocolState: false,
      userName:'',
      mobile:'',
      authCode:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let data = JSON.parse(options.data)
      this.setData({
          curVipLevel: data.id,
          vip_Data: data
      })
  },

  onInputListener: function(e){
      var inputName = e.currentTarget.dataset.name;
      var inputValue = e.detail.value;
        this.setData({
            [inputName]: inputValue
        })
  },
    onStateChangeListener: function(e){
        let value = e.detail.value[0];
        this.setData({ protocolState: value ==1? true: false})
        
    },
    onClickProtocolListener: function(e){
        let url = app.Urls.SERVICE_WEB +'member.html';
        wx.navigateTo({
            url: '/pages/user/web/Web_view/Web_view?requestUrl='+url,
        })
    },
  /**
   * 创建订单
   */
    onSubmitListener: function(e){
       let that = this;
        let index = this.data.curVipLevel;
        let requestUrls = app.onGetUrls('CREATE_ORDER');
        let productParam = {
            product_id: this.data.vip_Data.id,
            product_name: this.data.vip_Data.name,
            target_id:''
        };
        let requestParam = {
            token: wx.getStorageSync('token'),
            name: this.data.userName,
            phone: this.data.mobile,
            type:'1',
            detail:productParam,
            total_amount: this.data.vip_Data.total_fee_first_year,
            auth_code: this.data.authCode,
            from_id:''
        };

        console.log(requestParam)
        if (!this.data.protocolState){
            wx.showModal({
                title: '提示',
                content: '请先阅读 <<企酷100定制产品服务协议>> ',
                showCancel: false,
            })
            return;
        }
        let filterArrays = ['auth_code','from_id'];
        if (!app.validateParam(requestParam, filterArrays)){
            return;
        }
        app.onHttpRequest(requestUrls, 'POST', requestParam, function(data){
            data.vip_Data.order_no = data.order_no;
            data.vip_Data.order_id = data.order_id;
            wx.navigateTo({
                url: '/pages/user/order/Order_details/Order_details?data=' + JSON.stringify(data.vip_Data),
            })
        });
       

    }
})