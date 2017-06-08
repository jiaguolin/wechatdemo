
'use strict'
var sha1 = require('sha1');
var rawBody = require('raw-body');
var Wechat = require('./wechat');
var util = require('./util');

//需要了解promise 和generate 的知识
module.exports = function(opts,handler) {  
    var wechat = new Wechat(opts)  
    return function *(next){
        console.log(this.query) 
		//签名验证
        var token = opts.token
        var signature = this.query.signature
        var nonce = this.query.nonce
        var timestamp = this.query.timestamp
        var echostr = this.query.echostr

        var str = [token,timestamp,nonce].sort().join('')
        var sha = sha1(str)
        // if(sha === signature){
        //     this.body = echostr + ''
        // }else{
        //     this.body = 'wrong'
        // }

		if(this.method === 'GET') {
			this.body = (sha === signature) ? echostr + '' : '签名验证不匹配';
		}else if(this.method === 'POST'){
			if(sha !== signature){
				this.body = '不是微信的消息';
				return false;
			}
			var data = yield rawBody(this.req,{length:this.length,limit:'1mb',encoding:this.charset});

			var content = yield util.parseXMLAsync(data);   //xml数据解析成xml对象

			var message = util.formatMessage(content.xml);
			
			this.weixin = message;  //挂载消息

			yield handler.call(this,next);   //转到外层逻辑

			wechat.replay.call(this);  //真正回复
		}
    }
}



