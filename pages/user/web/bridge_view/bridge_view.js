// pages/user/web/bridge_view/bridge_view.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
    address:'',
    isFirst:true,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(options);
      this.address = options.data;
    //   wx.setStorageSync('address', options.data);
      
  },
  onShow: function(){
    //   wx.showLoading({
    //       title: '加载地图中。。。',
    //   })
    //   setTimeout(function (e) {
    //       wx.navigateBack({
    //           delta: 1,
    //       })
    //       wx.hideLoading()
    //   }, 1.5 * 1000, 1);
    console.log(this.isFirst)
      if (!this.isFirst){
          wx.navigateBack({
              delta: 1,
          })
          return;
      }
      let that = this;
      app.OnTencentFormatAddress(this.address, function (lng, lat) {

          that.isFirst = false;

          wx.openLocation({
              latitude: lat,
              longitude: lng,
              scale: '',
              name: that.address,
              address: that.address,
          })
          
      }, function () {
              wx.navigateBack({
                  delta: 1,
              })
          });
  }

    
})