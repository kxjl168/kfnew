
///import {sha256} from "@/utils/sha256"

const sha =require("./sha256");

const sha256=window.sha256||sha.sha256;

//console.log(sha256);

const SignUtil = {
  // HMACSHA256加密获取sign
  HMACSHA256: function (jsonobj) {
    var signstr = this.obj2str(jsonobj)
    var key = jsonobj.key;
    if (typeof (key) == "undefined") {
     // console.log("key is required!");
      return;
    }
    //  signstr = signstr + '&key=' + key;

   // console.log("signstrkey:", signstr)
   // console.log("key:", key)
    var sign = sha256.hmac(key, signstr); // 验证调用返回或微信主动通知签名时，传送的sign参数不参与签名，将生成的签名与该sign值作校验。
   // console.log("sign:", sign)

    return sign.toUpperCase();
  },


  // 参数类型转换，json对象的值转str
  formatParam: function (args) {
    var keys = Object.keys(args)
    keys = keys.sort() // 参数名ASCII码从小到大排序（字典序）；
    var newArgs = {}

    var key = args.key;
    if (typeof (key) == "undefined") {
      console.log("key is required!");
      return;
    }

    keys.forEach(function (key) {
      if (typeof (args[key]) == "string") {
        if (args[key] != 'undefined' && args[key].trim() != "") {  // 如果参数的值为空不参与签名；

          try {
            //JSON.parse(args[key]);
            newArgs[key] = args[key].trim()  // 参数名区分大小写；
          } catch (error) {
            newArgs[key] = args[key].trim() // 参数名区分大小写；
          }


        
        } else {
          newArgs[key] = ""//空值
        }
      }
      else if (typeof (args[key]) == "number") {  // 如果参数的值为json对象
        newArgs[key] = args[key].toString()  // 参数string
      }
      else if (typeof (args[key]) == "object") {  // 如果参数的值为json对象
       // debugger;
        if (args[key] instanceof Array) {
          newArgs[key] = args[key].toString()
        } else if (args[key] instanceof Object) {
          newArgs[key] = JSON.stringify(args[key])  // 参数string
        }
        else {
          newArgs[key] = args[key];
        }
      }

    });

    return newArgs;
  },

  // object转string,用于签名计算
  obj2str: function (args) {
    var keys = Object.keys(args)
    keys = keys.sort() // 参数名ASCII码从小到大排序（字典序）；
    var newArgs = {}

    var key = args.key;
    if (typeof (key) == "undefined") {
      console.log("key is required!");
      return;
    }

    keys.forEach(function (key) {
      if (args[key] != "" && args[key] != 'undefined') {  // 如果参数的值为空不参与签名；
        newArgs[key] = args[key]  // 参数名区分大小写；
      }
      if (typeof (args[key]) == "object") {  // 如果参数的值为json对象
        newArgs[key] = JSON.stringify(args[key])  // 参数string
      }

    })
    var string = ''
    for (var k in newArgs) {
      if (k == "key")
        continue;
      //string += '&' + k + '=' + newArgs[k]
      string += '' + k + '' + newArgs[k]
    }
    //string = string.substr(1)
    return string
  },
  // 随机函数的产生：
  createNonceStr: function () {
    return Math.random().toString(36).substr(2, 15)   // 随机小数，转换36进制，去掉0.，保留余下部分
  },
  // 时间戳产生的函数, 当前时间以证书表达，精确到秒的字符串
  createTimeStamp: function () {
    return parseInt(new Date().getTime() / 1000) + ''
  }

}

export default SignUtil
