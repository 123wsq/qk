// pages/user/business/Edit_Business/Edit_Business.js
//获取应用实例
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowWebsite:false,
    isShow: false, //是否显示提示框
    toastMsg:'',
    cur_url:-1,
    websiteType: ["官网", "商城", "其他"],
    id:'',
    name:"",
    phone:"",
    position:'',
    firm_name:'',
    email:'',
    firm_add:'',
    website:'',
    type: -1, // 0他人 1自己 2特别关注
      custom_detail_url:'',
      isEditOther: false
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if(options.data == undefined){
        return;
      }
      let business = JSON.parse(options.data);
      if(business== undefined){
          return;
      }
      let isEditOther = false;
      if(business.type !=1 && !app.isEmpty(business.custom_detail_url)){
          isEditOther = true;
      }

      this.setData({
            id : business.id,
            cur_url: -1,
          name: business.name,
          firm_name: business.firm_name,
          firm_add: business.firm_add,
          position: business.position,
          phone: business.phone,
          email: business.email,
          name_url: business.name_url,
          type: business.type,
          custom_detail_url: business.custom_detail_url,
          isEditOther: isEditOther,
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
  
      let vip_level = wx.getStorageSync('business_card_vip_level')
      if(vip_level !=0){
          this.setData({
              name_url:[{}]
          })
      }
  },


    onCheckChengeListener:function(e){
        this.setData({
            type: e.detail.value
        })
    },
  /**
   * 输入监听
   */
  onInputListener: function(e){
    const inputKey = e.currentTarget.dataset.name;
    const inputValue = e.detail.value;
    this.setData({
        [inputKey]: inputValue
    })
 
  },
  /**
   * 显示提示框
   */
  showToast: function (e) { //方法
    var that = this
    that.setData({
      isShow: true,
      toastMsg: e
    })
    setTimeout(function () {
      that.setData({
        isShow: false
      })
    },1000)
  },
  /**
   * 点击提交按钮
   */
  onSubmitBusiness:function(e){
      let url = app.onGetUrls('EDIT_BUSINESS');
        let that = this;
      let data = {
          token: wx.getStorageSync('token'),
          name: this.data.name,
          phone: this.data.phone,
        //   website: this.data.website,
          type:this.data.type,
          position: this.data.position,
          firm_name: this.data.firm_name,
          email: this.data.email,
          firm_add: this.data.firm_add,
        //   name_url: JSON.stringify(this.data.name_url)
      };
      if(this.data.type==-1){
          app.onShowToast('请选择名片类型')
         
          return;
      }
      if (!app.isEmpty(this.data.id)){
          data.id = this.data.id;
      }

    //验证手机号码
      if (!app.isMobile(data.phone)){
          wx.showModal({
              title: '提示',
              content: '请输入正确的手机号码',
              showCancel: false,
          })
        return;
        }
      if (!app.isEmpty(data.email) && !app.isEmail(data.email)){
          wx.showModal({
              title: '提示',
              content: '请输入正确的邮箱地址',
              showCancel: false,
          })
          return;
        }

      let filterArrays = ['position', 'firm_name', 'email', 'firm_add','id'];
      
      console.log(app.isEmpty(data.type))
      console.log(data)
      if (!app.validateParam(data, filterArrays)){
          wx.showModal({
              title: '提示',
              content: '必要参数不能为空！',
              showCancel: false,
          })

        return;
      }

      app.onHttpRequest(url,'POST',data, function(data){
          wx.showModal({
              title: '提示',
              content: app.isEmpty(that.data.id)?'添加成功!':'修改成功！',
              showCancel: false,
              success: function (e) {
                  wx.navigateBack({
                      delta: 1,
                  })

              }
          })
      });
    
  },
  /**
   * 添加按钮
   */
  onAddWebsiteClickListener: function(e){
      
    var newName = this.data.name_url;
    if(newName.length ==5){
        app.onShowToast('最多只能添加5个网址')
      return;
    }

    newName.push({name: '', url: '', type: 3});
      this.setData({
        name_url: newName
      });
  },

/**
 * 删除name_url的内容
 */
  onRemoveWebsiteClickListener: function(e){
    var index = e.currentTarget.dataset.index;
      let data = this.data.name_url;
    
      if(data.length < 2){
          return;
      }
      data.splice(index, 1);
      console.log(data)
    this.setData({
        name_url: data
    })
    
  },

  /**
   * name_url 数据拼接
   */
  onWebSiteInputListener:function(e){
    const inputKey = e.currentTarget.dataset.name;
    const inputValue = e.detail.value;
    const inputIndex = e.currentTarget.dataset.index;
    
    var newName_url = this.data.name_url;

    if (inputKey === 'url-name'){
      var web = this.data.name_url[inputIndex];
            web.name = inputValue;
          newName_url[inputIndex] = web;
        
    } else if (inputKey ==='url-website'){
        var web = this.data.name_url[inputIndex];
            web.url = inputValue;
            newName_url[inputIndex] = web;
     
    }
    this.setData({
      name_url:newName_url
    })
  },
    onWebsiteTypeClickListener: function(e){
        this.setData({
            cur_url : e.currentTarget.dataset.type,
            isShowWebsite: true
        });
    },
    toggleDialog() {
        this.setData({
            isShowWebsite: !this.data.isShowWebsite
        });
    },
    onClickWebTypeListener: function(e){
        console.log(e.currentTarget.dataset.type)
        let type = e.currentTarget.dataset.type; 
        let data = this.data.name_url;
        data[this.data.cur_url].type = type;
        this.setData({
            name_url: data,
            isShowWebsite: false
        })
        console.log(data);
    },
})