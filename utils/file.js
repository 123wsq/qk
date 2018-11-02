
/**
 * 将图片转换成base64
 */
function onImageToBase64(path, onCallBack){

    var model;
    //验证当前系统
    wx.getSystemInfo({
        success: function(res) {
            model = res.model;
        },
        fail: function(res) {},
        complete: function(res) {},
    })

    if (model.indexOf('iPhone') <= 0) { //IOS机型
        onParse(path, onCallBack);
    } else {//Android机型
        drawCanvas(onCallBack);
    }
    
}
// 缩放图片

function drawCanvas(onCallBack) {
    const ctx = wx.createCanvasContext('attendCanvasId');
    ctx.drawImage(tempFilePaths[0], 0, 0, 94, 96);
    ctx.draw();
     prodImageOpt(onCallBack);
}
// 生成图片
function prodImageOpt(onCallBack) {
    wx.canvasToTempFilePath({
        canvasId: 'attendCanvasId',
        success: function success(res) {
            onParse(res.tempFilePath, onCallBack)
        },
    });
}
function onParse(path, onCallBack){
    wx.getFileSystemManager().readFile({
        filePath: path, //选择图片返回的相对路径
        encoding: 'base64', //编码格式
        success: res => { //成功的回调
            let base64Image = res.data;
            onCallBack(base64Image);
        }
    });
}
module.exports = {
    onImageToBase64: onImageToBase64
}