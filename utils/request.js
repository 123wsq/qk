import validate from 'validate.js'
import urls from 'urls.js';

var requestTask;
/**
 * 接口公共访问方法
 *  @param {Object} url 访问路径
 *  @param {Object} mothod 请求方式  GET/POST
 *  @param {Object} param 请求参数
 *  @param {Object} onSuccess 成功回调
 */
function onHttpRequest(url, mothod, param, onSuccess){

    //
    wx.showLoading({
        title: '加载中',
    })
    if (requestTask != null) {
        requestTask.abort();
    }
    wx.request({
        url: url,
        data: param,
        method: mothod,
        dataType: 'json',
        success: function(res) {
            switch(res.data.code){
                case 100:
                    onSuccess(res.data.data);
                break
                case 107:
                    if(validate.isEmpty(wx.getStorageSync(''))){
                        onBreakIndex();
                    }else{
                        onLoginUser(1, { unionEncrypt: wx.getStorageSync('unionEncrypt')});
                    }
                break;
                default:
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000,
                    })
                break
            }

        },
        fail: function(res) {
                
        },
        complete: function(res) {
              console.log(url + '\n[param]:' + JSON.stringify(param)+'\n[Response]: '+ JSON.stringify(res.data));
            wx.hideLoading();
        },
    })
   
}


/**
* 绑定手机号码登录
*/
function onBindMobile(requestParam, onManualMobile) {
    let bindMobile = urls.getUrls('MANUAL_BINGDING_MOBILE');
    onHttpRequest(bindMobile, 'POST', requestParam, function (data) {
        if (data.is_need_phone_manual != undefined){
            wx.showModal({
                title: '提示',
                content: '手机号不存在，自动绑定失败，请手动绑定！',
                showCancel: false,
                success: function(res) {
                onManualMobile();
                },
            })
        }else{
            onLoginSuccessData(data);
        }
    });
}
/**
 * 登录用户
 */
function onLoginUser(type, param, onCallBack){
    
    if(type ==0){
        authLogin(param, onCallBack);
    }else{
        login(param, onCallBack);
    }
    
}   
/**
 * 授权登录
 */
function authLogin(param, onCallBack){
    wx.login({
        success: function(res) {
            let code = res.code;
            wx.setStorageSync('code', code);
            param.code = code;
            login(param, onCallBack);
        },
        fail: function(res) {},
        complete: function(res) {},
    })
}
/**
 * 开始登录
 */
function login(param, onCallBack){
    let checkWxUrl = urls.getUrls('S_WECHAT_LOGIN');
    onHttpRequest(checkWxUrl, 'POST', param, function(data){
        if (!validate.isEmpty(data.is_need_phone)){
            //如果需要绑定手机号码,则需要返回
            wx.setStorageSync('cookie_temp_key', data.cookie_temp_key);
                onCallBack();
        }else{
            //如果登录成功，直接缓存数据,进行跳转
            onLoginSuccessData(data);
        }

    });
      
}
/**
 * 解析登录成功的数据
 */
function onLoginSuccessData(data){
    wx.setStorageSync('id', data.id)
    wx.setStorageSync('name', data.name)
    let IMAGE_URL = urls.getUrls('DOMAIN',false);
    if(!validate.isEmpty(data.avatar)){
        let avatar = data.avatar.indexOf('http') == 0
            ? data.avatar
            : IMAGE_URL + data.avatar;
        wx.setStorageSync('avatar', avatar)
    }
    wx.setStorageSync('token', data.token)
    wx.setStorageSync('business_card_vip_level', data.business_card_vip_level);
    wx.setStorageSync('mobile', data.mobile);
    wx.setStorageSync('unionEncrypt', data.unionEncrypt)
    wx.switchTab({
        url: '/pages/tab/Page_Business_Pkg/Page_Business_Pkg'
    })
}

function onBreakIndex(){
    wx.clearStorageSync('token')
    wx.navigateTo({
        url: '/pages/index/index',
    })
}

function onCheckUpdate(){
    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        
    });
    updateManager.onUpdateReady(function(){
        wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                }
            }
        })

    });
    updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        wx.showModal({
            title: '更新提示',
            content: '新版本下载失败',
            showCancel: false
        })
    })

}


function onBusiness(params, onCallBack){

    wx.showLoading({
        title: '开始解析',
    })
    if (requestTask != null){
        requestTask.abort();
    }
    requestTask = wx.request({
        url: urls.getUrls('tencentOcr', false),
        data: params,
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(res) {
            onCallBack(res);
        },
        fail: function(res) {
            wx.showModal({
                title: '提示',
                content: '识别失败，请重新拍照识别',
                showCancel: false,
                success: function (res) {
                    wx.navigateBack({
                        delta: 1,
                    })
                },
            })
        },
        complete: function(res) {
            console.log(res);
            wx.hideLoading();
        },
    })
}

module.exports = {
    onHttpRequest: onHttpRequest,
    onLoginUser: onLoginUser,
    onBindMobile: onBindMobile,
    onCheckUpdate: onCheckUpdate,
    onBusiness: onBusiness,
}