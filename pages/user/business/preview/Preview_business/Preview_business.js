// pages/user/business/preview/Preview_business/Preview_business.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      path:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          path: options.path,
      })
     
  },

onReady: function(){
    var _this = this;
    let width;
    wx.getSystemInfo({
        success: function(res) {
            width = res.screenWidth;
        },
        fail: function(res) {},
        complete: function(res) {},
    })
    wx.getImageInfo({
        src: _this.data.path,
        success: function (res) {
            var ctx = wx.createCanvasContext('photo_canvas');
            var ratio = 1;
            var canvasWidth = res.width
            var canvasHeight = res.height;

        
            // 保证宽高均在屏幕宽度以内
            while (canvasWidth > width) {
                //比例取整
                canvasWidth = Math.trunc(res.width / ratio)
                canvasHeight = Math.trunc(res.height / ratio)
                ratio++;
            }
            _this.setData({
                canvasWidth: canvasWidth,
                canvasHeight: canvasHeight
            })//设置canvas尺寸
            ctx.drawImage(_this.data.path, 0, 0, canvasWidth, canvasHeight)  //将图片填充在canvas上
            ctx.draw(false,()=>{
                setTimeout(()=>{
                    wx.canvasToTempFilePath({
                        canvasId: 'photo_canvas',
                        fileType: 'jpg',
                        quality: 0.5,
                        success: function (res) {
                            console.log(res)
                         
                            _this.setData({
                                path: res.tempFilePath

                            })

                            

                        },
                        complete:((res)=>{
                            clearTimeout();
                        })
                    },_this);
                },100);
            })

            
        },
    })

},
   

    onClickListener: function(e){

        let type = e.currentTarget.dataset.type;
        let that = this;
        if(type ==1){
                wx.navigateBack({
                    delta: 1,
                })
        }else{
            // wx.getFileSystemManager().readFile({
            //     filePath: that.data.path, //选择图片返回的相对路径
            //     encoding: 'base64', //编码格式
            //     success:(res)=>{
            //         console.log(res)
            //         app.onHttpRequest(app.onGetUrls('XFyun'), 'POST', {
            //             token: wx.getStorageSync('token'),
            //             file_base64: res.data
            //         }, function (res) {
            //             let data = res.data;
            //             console.log(res)
            //             let businessInf = {
            //                 name: ('formatted_name' in data) ? data.formatted_name[0].item : '',
            //                 phone: ('telephone' in data) ? data.telephone[0].item.number : '',
            //                 email: ('email' in data) ? data.email[0].item : '',
            //                 firm_name: ('organization' in data) ? data.organization[0].item.name : '',
            //                 position: ('title' in data) ? data.title[0].item : '',
            //                 firm_add: ('label' in data) ? data.label[0].item.address : '',
            //                 type: 0,
            //                 //为保证在编辑页面中没有警告，再次添加默认值
            //                 id: '',
            //                 name_url: [],
            //                 custom_detail_url: '',
            //             };
            //             console.log(businessInf)
            //             wx.navigateTo({
            //                 url: '/pages/user/business/edit/Edit_Business/Edit_Business?data=' + JSON.stringify(businessInf),
            //             })
            //         });
            //     }
            // });
            //return;

            app.onTX_OCR(this.data.path, function(data){
                let businessInf = {
                    name:  ('name' in data) ?  data.name[0] :'',
                    phone: ('phone' in data) ? data.phone[0] : '',
                    email: ('email' in data) ? data.email[0] : '',
                    firm_name: ('comp' in data) ? data.comp[0] : '',
                    position: ('title' in data) ? data.title[0] : '',
                    firm_add: ('addr' in data) ? data.addr[0] :'',
                    type: 0,
                    //为保证在编辑页面中没有警告，再次添加默认值
                    id: '',
                    name_url: [],
                    custom_detail_url: '',
                };
                wx.navigateTo({
                    url: '/pages/user/business/edit/Edit_Business/Edit_Business?data=' + JSON.stringify(businessInf),
                })
              
            });
        }
    },
    

    
})