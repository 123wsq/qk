// pages/user/business/program_code/program_code.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      name:'',
      smallImage:'',
      imageWidth:0,
      imageHeight:0,
      position:'',
      avatar:'',
      firm_name:'',
  },
    smallImage:'',
    businessId:'',
    isCustom:false,
    imageWidth:0,
    imageHeight:0,
    name:'',
    custom_detail_url: '',
    avatar:'',
    position: '',
    firm_name:'',

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options)
      let data = JSON.parse(options.data);
      this.businessId = data.id;
      this.isCustom = data.isCustom;
      this.name = data.name;
      this.smallImage = data.smallImage;
      this.custom_detail_url = data.custom_detail_url;
      let avatar = wx.getStorageSync('avatar');
      if(app.isEmpty(avatar)){
          this.avatar ='/images/image_header_default.png';
      }else{
        this.avatar = avatar.indexOf('http') == 0 ? avatar : app.onGetUrls('DOMAIN', false)+avatar;
      }
      this.firm_name = data.firm_name;
      this.position = data.position;
  },

  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      let that = this;
      wx.getSystemInfo({
          success: function(res) {
              that.imageWidth = res.screenWidth-200;
              that.imageHeight = res.screenWidth -200;
          },
      })
      if (!app.isEmpty(this.smallImage)){
          this.onInitData(this.smallImage);
          return;
      }
      let url = app.isEmpty(this.custom_detail_url)? "":this.businessId;
      
      let data = {
          path: 'pages/index/index',
          width: '400',
          auto_color: false,
          line_color: { "r": "0", "g": "0", "b": "0" },
          is_hyaline: false,
          scene: this.businessId+'_' + url,
      };
      app.onHttpRequest(app.onGetUrls('SMALL_PROGRAM_CODE'),'POST',{
          data: JSON.stringify(data),
          type:'business_card',
          no: this.businessId,
      },function(res){
          let path = res.image_save_path;
           that.onInitData(path)
          
      });
  },
  onInitData: function(path){
      this.setData({
          name: this.name,
          imageWidth: this.imageWidth,
          imageHeight: this.imageHeight,
          smallImage: path.indexOf('http') == 0 ? path : app.onGetUrls('DOMAIN', false) + path,
          position: this.position,
          avatar: this.avatar,
          firm_name: this.firm_name
      })
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      let data = this.data.businessData;
      let shareData = {
          id: data.id,
          custom_detail_url: custom_detail_url,
      };

      return {
          title: this.name + '名片,敬请惠存',
          path: '/pages/index/index?data=' + JSON.stringify(shareData),
      }
  },

    onSaveNativeListener: function(e){
        console.log(this.data.smallImage)
        const downloadTask = wx.downloadFile({
            url: this.data.smallImage,
            success: function(res) {
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: function(res) {
                        wx.showToast({
                        title: '下载完成',
                        icon: 'none',
                        })
                    },
                    fail: function(res) {},
                    complete: function(res) {},
                })
            },
            fail: function(res) {},
            complete: function(res) {
                console.log(res);
            },
        })
        downloadTask.onProgressUpdate((res)=>{
            console.log("下载进度： "+res.progress)
        })
    }

})