

/**
 * 修改此参数进行修改调试模式
 * true  表示进入测试版  
 * false  表示进入到正式版
 */
var  DEBUG =false;

/**
 * 获取URL地址
 * @param key  url地址
 * @param isPin 是否拼接参数 模式是拼接的
 */
function getUrls(key,isPin){
    let urls ={
        HTTP_HOST: DEBUG ? 'https://test.qcool100.com/api/' : 'https://qiku100.com/api/', //域名
        DOMAIN: DEBUG ? 'https://test.qcool100.com/' : 'https://qiku100.com/', //域名
        XFyun: 'scanBusinessCard', //讯飞名片识别
        // TencentOcr:'https://recognition.image.myqcloud.com/ocr/businesscard',  //腾讯名片识别
        tencentOcr: 'https://api.ai.qq.com/fcgi-bin/ocr/ocr_bcocr', //腾讯AI
        SERVICE_IMG: 'https://qiku100.com/mypublic/app/images/',  //获取缓存图片资源
        SERVICE_WEB: 'https://qiku100.com/mypublic/app/web/',  //获取资源
        BUSINESS_CARD_DETAILS:'https://qiku100.com/home/b_card_detail_share',  //小程序码打开的路径
        S_WECHAT_LOGIN: 'smallProcedureLogin',  //小程序登录
        MANUAL_BINGDING_MOBILE: 'smallProcedureBindPhoneNumber',  //手动绑定手机号码
        WECHAT_LOGIN: 'wechatLogin',
        GET_VALIDATE: 'getPhoneCode',  //获取验证码
        BIND_PHONE: 'bindWechatPhone', //绑定手机号码
        CREATE_ORDER: 'createOrder', //创建订单
        PAY_ORDER: 'payOrder',  //支付订单
        CANCEL_ORDER: "cancelOrder", //取消订单
        EDIT_BUSINESS: 'BusinessCardEdit',  //编辑名片
        DELETE_BUSNESS: 'businessCardDelete', //删除名片
        COLLECT_BUSINESS_CARD: 'collectBusinessCard',//收藏名片
        UPDATE_FOCUS: "updateSpecialFocus", //特别关注
        BUSINESS_BACKGROUND: "businessCardTemplate", //名片背景资源模板
        UPDATE_BUSINESS_BACKGROUND: "updateBusinessCardTemplate", //更改背景
        BUSINESS_CARD: "myBusinessCard",  //我的名片
        CONTACT_LIST: "businessCard",  //名片夹
        IMG_BASE64: 'img2base64', //将图片转换成base64
        VIP_LEVEL: 'businessCardVipList', //vip级别
        VIP_LEVEL_DETAILS: 'businessCardVipDetail', //名片级别详情
        SHARE_PATH: 'home/b_card_detail',//分享路径
        BUSINESS_DETAILS: 'b_card_detail', //名片详情
        SMALL_PROGRAM_CODE:'getWXACodeUnlimit', //小程序码

    };
    if(isPin== undefined) isPin =true;
    return isPin? urls.HTTP_HOST + urls[key] : urls[key];
}

module.exports = {
    getUrls: getUrls,
}