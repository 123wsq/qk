// pages/user/business/upgrade/VIP_Level/VIP_Level.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      backgroundImage: app.onGetUrls('SERVICE_IMG', false) +'image_vip_background.png',
      levelData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
      let that = this;
      let url = app.onGetUrls('VIP_LEVEL');
      app.onHttpRequest(url, 'GET', { token: wx.getStorageSync('token')}, function(data){
          that.setData({
              levelData: data
          })
      });
  
  },

  onVipLevelClickListener: function(e){
    
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
        url: '/pages/user/business/upgrade/VIP_Details/VIP_Details?level=' + this.data.levelData[index].id,
    })
  }
})