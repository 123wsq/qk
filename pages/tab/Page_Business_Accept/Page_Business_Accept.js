// pages/tab/Page_Business_Accept/Page_Business_Accept.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      
      imageWidth:0,
      imageHeight:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let that = this;
      wx.getSystemInfo({
          success: function(res) {
              that.setData({
                  imageWidth:res.screenWidth-100,
                  imageHeight: (res.screenWidth-100)/10*9
              })
          },
          fail: function(res) {},
          complete: function(res) {},
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
    onShow: function(){
        
    },

 
  /**
   * 添加名片
   */
    onAddBusinessClickListener: function(){
        wx.navigateTo({
            //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
            url: '/pages/user/business/edit/Edit_Business/Edit_Business',

        })
    },
    /**
     * 拍照识别
     */
    onCameraDiscernClickListner: function(e){
        let _this = this;
        wx.authorize({
            scope: 'scope.camera',
            success: function (res) {

                wx.chooseImage({
                    count: 1,
                    sizeType: ['compressed'],
                    sourceType: ['camera'],
                    success: function (res) {
                        console.log(res)
                        // var files = res.tempFiles;//[{path:"wxfile://tmp_b5ad1d89c409d0e118234cdf6d72b27f.jpg", size:''}]
                            let path = res.tempFilePaths[0];
                            wx.navigateTo({
                                url: '/pages/user/business/preview/Preview_business/Preview_business?path='+path,
                            })
                    },
                    fail: function (res) {
                        console.log(res)
                    },
                    complete: function (res) {

                    },
                })

            },
            fail: function (res) {
                console.log(res);
            },
            complete: function (res) {
                console.log(res);
            },
        })
      
    },
    onScanQRcodeClickListner: function(e){
        wx.scanCode({
            onlyFromCamera: false,
            scanType: ['qrCode'],
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {
                console.log(res)
                if(app.isEmpty(res.result)){
                    return;
                }
                //扫码结果
                let scanContent = res.result;
                
                //https://qcool100.com/home/myCard/36/myCard
                //http://www.qcool100.com/home/b_card_detail?id=1;
                let param = {
                    isShareData: true
                };
                if (scanContent.indexOf('home/myCard') != -1){
                    param.id = scanContent.split('/')[5];
                    param.custom_detail_url = scanContent;
                } else if (scanContent.indexOf('home/b_card_detail') != -1){
                    param.id = app.getQueryVariable(scanContent,'id');
                    param.custom_detail_url='';
                }else{
                    wx.showModal({
                        title: '提示',
                        content: '暂时只能用于收藏名片,请不要用于其他的用途！',
                        showCancel: false,
                    })
                    return;
                }
                if (app.isEmpty(param.id)) {
                    return;
                }
                
                wx.navigateTo({
                    url: (app.isEmpty(param.custom_detail_url) ?'/pages/user/business/details/Business_Details/Business_Details': '/pages/user/web/Web_view/Web_view')+'?data='+JSON.stringify(param),
                })
                return;
                wx.showModal({
                    title: '提示',
                    content: '您确定要收藏该名片吗？',
                    showCancel: true,
                    success: function(res) {
                        if(res.confirm){

                            let requestUrl = app.onGetUrls('COLLECT_BUSINESS_CARD');
                            app.onHttpRequest(requestUrl,'GET',{
                                id: id,
                                token: wx.getStorageSync('token')
                            },function(data){
                                wx.showModal({
                                    title: '提示',
                                    content: '收藏成功！',
                                    showCancel: false,
                                })
                            });
                            
                        }
                    },
                    fail: function(res) {},
                    complete: function(res) {},
                })

                
            },
        })
    }

    

})