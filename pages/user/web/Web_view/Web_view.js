// pages/user/web/Web_view/Web_view.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      id:'',
      requestUrl:'',
      isShareData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
      let data = JSON.parse(options.data)
      let path = data.custom_detail_url;
      let id = data.id;
      if (path.indexOf('b_card_detail_share')!=-1){
          path +='?id='+id;
      }
      
     
      this.setData({
          requestUrl: path,
          id:id,
          isShareData: data.isShareData == undefined? false: data.isShareData
      })
      
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      let address = wx.getStorageSync('address');
      if (!app.isEmpty(address)) {
          this.navigationGPS(address);
          wx.setStorageSync('address', '');
          return;
      }
        let that = this;
        //判断当id不为空并且为定制名片的情况下收藏名片
      if (this.data.isShareData){
          setTimeout(function (e) {
              that.loadDetails();
          }, 3 * 1000, 1);
         
      }

  },
    navigationGPS: function (addr) {
        app.OnTencentFormatAddress(addr, function (lng, lat) {
            wx.openLocation({
                latitude: lat,
                longitude: lng,
                scale: '',
                name: addr,
                address: addr,
            })
        });
    },
    loadDetails: function(){
        let that =this;
        let collectUrls = app.onGetUrls('COLLECT_BUSINESS_CARD');
        app.onHttpRequest(collectUrls, 'GET', {
            token: wx.getStorageSync('token'),
            id: that.data.id
        }, function (data) {
            
            wx.showModal({
                title: '名片收藏',
                content: '名片收藏成功,请在名片夹中查看！',
                showCancel: false,
            })
        });
    },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      let requestUrl ={
          custom_detail_url: this.data.requestUrl,
          id: this.data.id,
      }
      return {
          title: '您好！这是我的名片，敬请惠存',
          path: '/pages/index/index?data=' + JSON.stringify(requestUrl),
      }
  }
  
})