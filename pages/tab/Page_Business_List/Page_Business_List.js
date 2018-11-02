// pages/tab/Page_Business_List/Page_Business_List.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      isShowMPCode: false,
      avatar:'',
      screenWidth:0,
      curName:'',
      curFirmName:'',
      itemData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
      
        
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      let that =this;
      let token  = wx.getStorageSync('token');
      if(app.isEmpty(token)){
          wx.reLaunch({
              url: '/pages/index/index',
          })
          return;
      }
      let MyBusiness = app.onGetUrls('BUSINESS_CARD');
      let avatar = wx.getStorageSync('avatar');
      app.onHttpRequest(MyBusiness, 'POST', { token: token}, function(data){
          that.setData({
              itemData: data,
              avatar: avatar.indexOf('http') == 0 ? avatar : app.onGetUrls('DOMAIN', false)
          })
      });
    
      wx.getSystemInfo({
          success: function(res) {
              that.setData({
                  screenWidth: res.screenWidth *0.8
              })
          },
          fail: function(res) {},
          complete: function(res) {},
      })
  },
    onItemClickListener: function(e){
        let index = e.currentTarget.dataset.index;
        let data = this.data.itemData[index];
        if (app.isEmpty(data.custom_detail_url)){
                wx.navigateTo({
                    url: '/pages/user/business/details/Business_Details/Business_Details?data='+JSON.stringify(data),
                })
        }else{
          
            let param={
                custom_detail_url: data.custom_detail_url,
                id: data.id,
            };
            wx.navigateTo({
                url: '/pages/user/web/Web_view/Web_view?data=' + JSON.stringify(param),
            })
        }
    },
    onAddBusinessListener: function(e){
        wx.navigateTo({
            url: '/pages/user/business/edit/Edit_Business/Edit_Business',
        })
        
        
    },
    onDeleteBusiness: function(e){
        let that = this;
        let index = e.currentTarget.dataset.index;
        let totalData = this.data.itemData;
        let data = totalData[index];
        let customPath = data.custom_detail_url;
        if (!app.isEmpty(customPath)) {
            wx.showModal({
                title: '提示',
                content: '定制版名片不能删除！',
                showCancel: false,
            })
            return;
        }
        wx.showModal({
            title: '提示',
            content: '您确定要删除 '+ data.name+" 的名片吗？",
            showCancel: true,
            success: function(res) {
                if(res.confirm){
                    let delUrls = app.onGetUrls('DELETE_BUSNESS') + '/' + data.id;
                    app.onHttpRequest(delUrls, 'GET', { token: wx.getStorageSync('token') }, function(data){
                        totalData.splice(index, 1);
                        that.setData({
                            itemData: totalData
                        })
                    });
                   
                }
            },
            fail: function(res) {},
            complete: function(res) {},
        })
        

    },
   
    onEditBusiness: function(e){
        let index = e.currentTarget.dataset.index;
        let data = this.data.itemData[index];
        wx.navigateTo({
            url: '/pages/user/business/edit/Edit_Business/Edit_Business?data='+JSON.stringify(data),
        })
    },
    onShowProgramCode: function(e){
         let index = e.currentTarget.dataset.index;
        let curData = this.data.itemData[index];
        let param={
            id: curData.id,
            isCustom: app.isEmpty(curData.custom_detail_url),
            name: curData.name,
            smallImage: curData.small_procedure_code,
            custom_detail_url: curData.custom_detail_url,
            firm_name: curData.firm_name,
            position: curData.position,
        }
        wx.navigateTo({
            url: '/pages/user/business/program_code/program_code?data=' + JSON.stringify(param),
        })
       
        // this.setData({
        //     curName: curData.name,
        //     curFirmName: curData.firm_name,
        //     isShowMPCode: !this.data.isShowMPCode
        // })        
    },
    onClickDialog: function(e){
        this.setData({
            isShowMPCode: false
        })
    }

})