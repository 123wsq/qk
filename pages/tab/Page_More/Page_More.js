// pages/tab/Page_More/Page_More.js
var app= getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      imagePath: app.onGetUrls('SERVICE_IMG',false),
      width:0,
    "about_title":"关于企酷100",
      "about_message":"企酷100电子名片将公司每个成员都打造成公司的一个流量入口，围绕个人信息、公司宣传、产品宣传三个维度，全方位展示公司品牌形象，通过一张电子名片实现立体化全方位营销。",
  },
  onItemClick: function(event){

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu({})
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
      wx.getSystemInfo({
          success: function(res) {
              that.setData({
                  width: res.screenWidth-40
              })
          },
          fail: function(res) {},
          complete: function(res) {},
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
      console.log(res)
      if(res.from == 'button'){
          return {
              title: '企酷致力于打造个性名片定制，专注于企业信息互联网化',
              path: "/pages/index/index",
              imageUrl: "/images/image_template_1.jpg",
          }
      }
  },
    onItemClickList: function(e){
        let type = e.currentTarget.dataset.type;
        console.log(type)
        switch(parseInt(type)){
            case 1:
                wx.navigateTo({
                    url: '/pages/user/more/about_qk/about_qk',
                })
            break
            case 2:
                wx.navigateTo({
                    url: '/pages/user/more/validate_mobile/validate_mobile',
                })
            break
        }
    }
})