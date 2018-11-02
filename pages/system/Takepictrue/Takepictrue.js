// pages/system/Takepictrue/Takepictrue.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

      
  },
    onTakePictureListener: function(e){
        console.log("拍照")
        const ctx = wx.createCameraContext(this);
        ctx.takePhone({
            quality:'high',
            success: (res)=>{
                console.log(res);
            }
        })
    }
})