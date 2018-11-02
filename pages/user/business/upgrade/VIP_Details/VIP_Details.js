// pages/user/business/upgrade/VIP_Details/VIP_Details.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imagePath:'',
        vip_level:0,
        curPageData: {},
        item_array: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            vip_level: options.level,
            imagePath: app.Urls.SERVICE_IMG
        })
    },



    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this;
        let url = app.onGetUrls('VIP_LEVEL_DETAILS');
        console.log(this.data.vip_level);
        app.onHttpRequest(url, 'GET', { id: this.data.vip_level}, function(data){
            let len = data.length;
            let arrLen = len % 2 == 0 ? len / 2 : (parseInt(len / 2) + 1);
            let arrays = new Array();
            for (let i = 0; i < arrLen; i++) {
                let arr = new Array();
                let item1 = data[i * 2];
                let pic = item1.pic;
                item1.pic = pic.indexOf('http') == 0 ? pic : app.Urls.DOMAIN + pic;
                arr.push(item1);
                if (i * 2 + 1 != len) {
                    let item2 = data[i * 2 + 1];
                    let pic2 = item2.pic;
                    item2.pic = pic2.indexOf('http') == 0 ? pic2 : app.Urls.DOMAIN + pic2;
                    arr.push(item2);
                }
                arrays.push(arr);
            }
            that.setData({
                curPageData: res.data.data,
                item_array: arrays
            })
        });
        
        
    },


    onClickDredgeListener: function (e) {
        let data = this.data.curPageData;
        data.vip_privilege=[],
        wx.navigateTo({
            url: '/pages/user/business/upgrade/Warm_Prompt/Warm_Prompt?data=' + JSON.stringify(data),
        })
    }
})