// pages/user/business/details/Business_Details/Business_Details.js

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      contentHeight:0,
      template: [],
      isSelfCard: true,
      isShowTemplate: false,
      templatePosition: 0,
      card_template_id:-1,
      isShareData: false,
      id:0,
      businessData:{},
      footList: [
          //   {id:0,name:"分享名片",icon:"/images/image_share_card.png"},
          {id: 1,name: "删除",icon: "/images/image_del_business_icon.png"},
          {id: 2,name: "编辑名片",icon: "/images/image_redact_icon.png"},
          {id: 3,name: "更换模板",icon: "/images/image_skin_btn.png"},
        //   {id: 4,name: "名片升级",icon: "/images/image_vip_icon.png"}
      ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = JSON.parse(options.data);
    this.setData({
        id: data.id,
        isShareData: data.isShareData != undefined ? data.isShareData: false
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
      let that = this;
    
      let businiessInfoUrl = app.onGetUrls('BUSINESS_DETAILS');
      app.onHttpRequest(businiessInfoUrl,'GET',{
          id: this.data.id,
          token: wx.getStorageSync('token')
      }, function(data){
          if (data.template_background_top.indexOf('http') != 0) {
              data.template_background_top = app.onGetUrls('DOMAIN', false) + data.template_background_top;
          }
          if (data.template_background_foot.indexOf('http') != 0) {
              data.template_background_foot = app.onGetUrls('DOMAIN', false) + data.template_background_foot;
          }
          that.setData({
              businessData: data,
              card_template_id: data.card_template_id,
              isSelfCard: data.user_id== wx.getStorageSync('id')? true: false
          })
      });

      let type = this.data.businessData.type;
      wx.getSystemInfo({
          success: function (res) {
              let height;
              let isSelfCard = that.data.isSelfCard;
              if(isSelfCard && type){
                  height = res.screenHeight - 65 - 230 - 70 - 60
              }else{
                  height = res.screenHeight - 65 - 230 - 70 - 40;
              }
              
              that.setData({
                  contentHeight: height
              })
          },
          fail: function (res) { },
          complete: function (res) { },
      })
  },
  onShareAppMessage: function(){
      let data =this.data.businessData;
      let shareData = {
          id: data.id,
          custom_detail_url:'',
      };

      return{
          title: this.data.businessData.name+'名片,敬请惠存',
          path: '/pages/index/index?data=' + JSON.stringify(shareData),
      }
  },
    onSaveContact: function(e){
        console.log(e);

        let data = this.data.businessData;

        app.onFormatAddress(data.firm_add, function (province, city, district, street, street_number){
         

            wx.addPhoneContact({
                photoFilePath: '',
                lastName: data.name.substr(0, 1),
                middleName: data.name.substring(1),
                firstName: data.name,
                remark: '企酷100',
                mobilePhoneNumber: data.phone,
                addressCountry: '中国',
                organization: data.firm_name,
                title: data.position,
                email: data.email,
                url: data.website,
                workAddressCountry: '中国',
                workAddressState: province,
                workAddressCity: city,
                workAddressStreet: district + '' + street + street_number,
            })
        });
        
    },
    onEventClick: function (e) {

        let type = e.currentTarget.dataset.type;
        let data = e.currentTarget.dataset.data;
        switch (type) {
            case 'phone':
                wx.makePhoneCall({
                    phoneNumber: data,
                })
                break
            case 'email':

                break
            case 'firm_add':
                console.log('获取地址')
                wx.navigateTo({
                    url: '/pages/user/web/bridge_view/bridge_view?data='+data,
                    success: function(res) {},
                    fail: function(res) {},
                    complete: function(res) {},
                })
                
                break
        }
    },
    onFocusChangeListener: function(e){
        let id = e.currentTarget.dataset.id;
        let checkIds = e.detail.value;
        if(this.data.isShareData){
            //收藏

            app.onHttpRequest(app.onGetUrls('COLLECT_BUSINESS_CARD'), 'GET',{
                token: wx.getStorageSync('token'),
                id: id
            },function(data){
                app.onShowToast('收藏成功')
            });
            
        }else{  //特别关注
            app.onHttpRequest(app.onGetUrls('UPDATE_FOCUS') + '/' + id, 'GET', {
                token: wx.getStorageSync('token'),
                type: checkIds.length == 1 ? '2' : '0',
            }, function (data) {
                
            });
            
        }
        
    },
    onClickMenuListener: function(e){
        let that = this;
        const id = e.currentTarget.dataset.id;
        let data = this.data.businessData;

        switch (id) {
            case 0: //分享

                break;
            case 1: //删除
                this.modalcnt();
                break;
            case 2: //编辑
                wx.navigateTo({
                    //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
                    url: '/pages/user/business/edit/Edit_Business/Edit_Business?data=' + JSON.stringify(data),

                })
                break;
            case 3: //更换模板
                this.onLoadTemplate();
                break;
            case 4: //升级
                wx.navigateTo({
                    url: '/pages/user/business/upgrade/VIP_Level/VIP_Level',
                })
                break;
        }
    },
    modalcnt: function () {
        let that = this;
        let data = this.data.businessData;
        let custom_detail_url = data.custom_detail_url;
        if (!app.isEmpty(custom_detail_url)) {
            wx.showModal({
                title: '提示',
                content: '定制版名片不能删除！',
                showCancel: false,
            })
            return;
        }
        wx.showModal({
            title: '提示',
                content: '您确定要删除 ' + data.name + " 吗",
            showCancel: true,
            success: function (res) {
                if (res.confirm) {
                    let delUrls = app.onGetUrls('DELETE_BUSNESS') + '/' + data.id;
                    app.onHttpRequest(delUrls, 'GET', {
                        token: wx.getStorageSync('token'),
                    }, function (data) {
                        wx.navigateBack({
                            delta: 1,
                        })
                    });
                    
                } else if (res.cancel) { }
            }
        })
    },
    onLoadTemplate: function (e) {
        let url = app.onGetUrls('BUSINESS_BACKGROUND');
        let that = this;
        app.onHttpRequest(url, 'GET', {}, function (data) {
            for (let i = 0; i < data.length; i++) {
                let thumbnail = data[i].thumbnail;
                let background_foot = data[i].background_foot;
                let background_top = data[i].background_top;

                if (thumbnail.indexOf('http') != 0) {
                    data[i].thumbnail = app.onGetUrls('DOMAIN', false) + thumbnail;
                }
                if (background_top.indexOf('http') != 0) {
                    data[i].background_top = app.onGetUrls('DOMAIN', false) + background_top;
                }
                if (background_foot.indexOf('http') != 0) {
                    data[i].background_foot = app.onGetUrls('DOMAIN', false) + background_foot;
                }
            }


            that.setData({
                template: data,
                isShowTemplate: true
            })
        });
        
    },
    /**
         * 改变选择的样式模板
         */
    onClickTemplateListener: function (e) {
        let curPosition = e.currentTarget.dataset.index;
        let data = this.data.businessData;
        data.template_background_top = this.data.template[curPosition].background_top;
        data.template_background_foot = this.data.template[curPosition].background_foot;
        this.setData({
            templatePosition: curPosition,
            card_template_id: this.data.template[curPosition].id,
            businessData: data

        })
    },
    toggleDialog: function(e){
        let that = this;
        this.setData({
            isShowTemplate: false
        })
        //检测样式模板是否发生变化
        wx.showModal({
            title: '提示',
            content: '是否将该模板使用到当前页面？',
            confirmText: '使用',
            success: function(res) {
                if(res.confirm){
                    
                    that.onSubmitTemplate();
                }
            },
            fail: function(res) {},
            complete: function(res) {},
        })
    },
    /**
       * 提交选择的样式模板
       */
    onSubmitTemplate: function (e) {

   
        let cur_template_id = this.data.card_template_id;
        if (cur_template_id ==-1){
            return;
        }
        let curTemplate = this.data.templatePosition;
        let templateData = this.data.template;

        //获取登录成功之后返回的token
        var token = wx.getStorageSync('token');
        //取出当前选中的名片id
        var id = this.data.businessData.id;
        //获取当前选中的模板的id
        var card_template_id = this.data.template[this.data.templatePosition].id;

        this.setData({
            isShowTemplate: false
        })
        let url = app.onGetUrls('UPDATE_BUSINESS_BACKGROUND');
        app.onHttpRequest(url, 'GET', {
            token: token,
            id: id,
            card_template_id: card_template_id
        }, function (data) {
           
        });
        
    },
})