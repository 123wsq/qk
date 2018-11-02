let md5 = require('../md5.js')
let file = require('../file.js')
let sendRequest = require('../request.js')
let app_id = '2107687121'
let app_key = 'sS5KAmqkMGEXW1od'

let request = (path, callback) => {
    wx.showLoading({
        title: '开始压缩',
    })

    let params = {
        app_id: app_id,
        nonce_str: Math.random().toString(36).substr(2),
        time_stamp: parseInt(new Date().getTime() / 1000).toString()
    }

    file.onImageToBase64(path, function (data) {
        params.image = data;
        params['sign'] = _genRequestSign(params)
        sendRequest.onBusiness(params, function(res){
            let formatRes = _formatResult(res.data)
            if (formatRes) {
                callback(formatRes)
            } else {
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
            }
        });
        

    });
    
}



let _genRequestSign = (params) => {
    // 1. 对请求参数按字典升序排序
    params = _sortObject(params)
    // 2. 拼接键值对，value部分进行URL编码
    let paramStr = ''
    let keys = Object.keys(params)
    for (let idx in keys) {
        let key = keys[idx]
        paramStr += key + '=' + encodeURIComponent(params[key]) + '&'
    }
    // 3. 拼接key
    paramStr += 'app_key=' + app_key
    // 4. md5
    return md5.md5(paramStr).toUpperCase()
}

let _sortObject = (obj) => {
    var keys = Object.keys(obj).sort()
    var newObj = {}
    for (var i = 0; i < keys.length; i++) {
        newObj[keys[i]] = obj[keys[i]]
    }
    return newObj
}

let _formatResult = (res) => {
    let format = {}
    if (res.ret == 0 && res.data && res.data.item_list) {
        let itemList = res.data.item_list
        let item, itemName
        let key = 'unknown'
        for (let idx in itemList) {
            item = itemList[idx]
            itemName = item.item
            if (itemName == '姓名')
                key = 'name'
            else if (itemName == '职位')
                key = 'title'
            else if (itemName == '公司')
                key = 'comp'
            else if (itemName == '地址')
                key = 'addr'
            else if (itemName == '邮箱')
                key = 'email'
            else if (itemName == '手机')
                key = 'phone'
            else if (itemName == '电话')
                key = 'tel'
            else if (itemName == 'QQ')
                key = 'QQ'
            else if (itemName == '微信')
                key = 'WX'
            else if (itemName == '传真')
                key = 'fax'
            else if (itemName == '邮编')
                key = 'postcode'

            if (format[key]) {
                format[key].push(item.itemstring)
            } else {
                format[key] = [item.itemstring]
            }
        }
        return format
    }
}

module.exports = {
    request: request,
}