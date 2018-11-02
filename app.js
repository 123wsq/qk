//app.js

import md5 from 'utils/md5.js';
import base64 from 'utils/base64.js'
import pinyin from 'utils/chinese2pinyin.js'
import validate from 'utils/validate.js'
import util from 'utils/util.js'
import httpReqest from 'utils/request.js'
import QQMapWX from'utils/map/qqmap-wx-jssdk.js';
import urls from 'utils/urls.js';
import txOcr from 'utils/ocr/tx.js';
var tencent;
App({

  onLaunch: function () {
      //
      httpReqest.onCheckUpdate();
      tencent = new QQMapWX({
          key: 'A6CBZ-H4VW6-KYCS2-MCLCY-BF3PJ-WYBRG' // 必填，换成自己申请的    
      });
    },

  globalData: {
    DEBUG: true,    
    scence:0,
    userInfo: null,
    wx_appId:'wx1075d48e5be96e86',
    wx_secret:'0156473a046d4e8d905606d8e6a1495e',
    XF_appId:'5b73db66',
    XF_apiKey:'bf25f01bf992ce22bfc756fb5edcdcb2',
    TX_appId:'APPID2107687121',
    TX_apptKey:'sS5KAmqkMGEXW1od',
  },
    
    onGetUrls: function(key, isPin){
        return urls.getUrls(key, isPin==undefined? true: false);
    },
    onShowToast: function(msg){
        util.onShowToast(msg);
    },
    strToBase64: function(str){
        return base64.encode(str);
    },
    MD5: function (str) {
        var encrypted = md5.md5(str, '', false);
        return encrypted;
    },
    chineseToPinyin: function(str){
        return pinyin.chineseToPinYin(str);
    },
    isChinese:function(str){

        return validate.isChinese(str);
    },
    sortArrays: function(arr){

        return arr.sort(app.compare);
    },
    isEmpty: function(str){
        return validate.isEmpty(str);
    },
    isMobile: function(str){
        return validate.isMobile(str);
    },
    isEmail: function (str){
        return validate.isEmail(str);
    },
    validateParam: function (str, arrays){
        return validate.validateParam(str,arrays);
    },
    getQueryVariable: function (url, variable){
        return util.getQueryVariable(url, variable);
    },
    onHttpRequest: function (url, mothod, param, onSuccess){
        httpReqest.onHttpRequest(url, mothod, param, onSuccess);
    },
    onTX_OCR: function(path, onCallBack){
        txOcr.request(path, onCallBack);
    },
    cancelRecognition: function(){
        txOcr.cancelRequst();
    },
    onBindMobile: function (param) {
        httpReqest.onBindMobile(param);
    },
    /**
     * @param type  0登录页  1请求响应
     */
    onLoginUser: function (type, params, onCallBack){
        httpReqest.onLoginUser(type,params, onCallBack);
    },
    /**
     * 地址转换经纬度
     */
    OnTencentFormatAddress: function(address, onCallBack, onFailBack){
        
        tencent.geocoder({
            address: address,
            success: function (res) {
                console.log(res);
                let location = res.result.location;
                 onCallBack(location.lng, location.lat)
            },
            fail: function(res){
                wx.showModal({
                    title: '导航提示',
                    content: '检索地址失败,请输入详细地址在进行导航！',
                    showCancel: false,
                    success:(res)=>{
                        onFailBack();
                    }
                })
                
            },
            complete:function(res){
            }
        })
    },
    onFormatAddress: function(address, onCallBack){
        tencent.geocoder({
            address: address,
            success: function (res) {
                let addr = res.result.address_components;
                onCallBack(addr.province, addr.city, addr.district, addr.street, addr.street_number);
            },
            fail: function (res) {
                wx.showModal({
                    title: '导航提示',
                    content: '检索地址失败,请输入详细地址在进行导航！',
                    showCancel: false,
                })
            },
            complete: function (res) {
            }
        })
    },
})