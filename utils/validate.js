
   /**
     * 验证手机号码
     */
    function isMobile (value){
        console.log('验证手机号码')
     var myreg = /^1(3|4|5|7|8|9)\d{9}$/;
     if (!myreg.test(trim(value))) {
         console.log('手机号码不正确')
       return false;
     } else {
       return true;
     }

    }
    /**
     *验证邮箱
     */
    function isEmail(value){
        console.log('验证邮箱')
      var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if (!myreg.test(trim(value))) {
         console.log('邮箱不正确')
        return false;
      } else {
        return true;
      }
    }
    function isChinese (temp){
        var re = /[^\u4e00-\u9fa5]/;
        if (re.test(temp)){

            return false;
        } 
        return true;
    }
    /**
     * 判断是否为空
     */
    function isEmpty(str){
        if( typeof str == "undefined" || str== undefined || str == null || str == ''){
            return true;
        }
        return false;
    }
    /**
     * 去空格
     */
    function trim(str) {
        return str.replace(/^\s+|\s+$/g, "");
    }

    /** json json对象   filterArrays 不参与验证的参数数组*/
    function validateParam(json, filterArrays){
        for (let key in json){
            let isFilter = false; //是否验证 默认是需要验证的
            for (var j=0; j< filterArrays.length; j++) {
                if (key == filterArrays[j]){
                    isFilter = true;
                    continue;
                }
            }
            switch (key) {
                case 'phone':
                case 'mobile':
                    if (!isMobile(trim(json[key]))) return false;
                    break;
                case "email":
                    if(!isFilter)
                    if (!isEmail(trim(json[key]))) return false;
                    break
                default:
                    if (!isFilter) {
                        let value = json[key];
                        if (isEmpty(value+"")) {
                            return false;
                        }
                    }
                break
            }
            
            
            
        }
        return true;
    }
module.exports = {
    isChinese: isChinese,
    isEmail: isEmail,
    isMobile: isMobile,
    isEmpty: isEmpty,
    validateParam: validateParam,
}