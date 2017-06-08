
'use strict'
var config = require('./config');
var Wechat = require('./wechat/wechat');

var wechatApi = new Wechat(config.wechat);

function* reply(next){
	var message = this.weixin;
	console.log(message)
	if(message.MsgType === 'event'){
		if(message.Event === 'subscribe'){
			if(message.EventKey) {
				console.log('扫描二维码关注：'+ message.EventKey +' '+ message.ticket);
			}
			this.body = '欢迎关注';
		}else if(message.Event === 'unsubscribe'){
			this.body = '';
			console.log(message.FromUserName + ' 取消关注');
		}
	}

	else if(message.MsgType === 'text'){ //处理文本消息
		var content = message.Content;
		var reply = '您好';
		
		if(content === '1'){
			var data1 = yield wechatApi.fetchUserInfo(message.FromUserName);
			console.log('获取用户信息----------');
			console.log(JSON.stringify(data1));
			//批量获取首先要取到所有的openid.
			// var data2 = yield wechatApi.fetchUserInfo([message.FromUserName]); 
			// console.log(JSON.stringify(data2));
		}
        else if (content === '2'){
            console.log('获取所有用户openid ---------\n\n');
            var data1 = yield wechatApi.getUserOpenIds();
			console.log(JSON.stringify(data1));

			console.log('获取所有用户信息 ---------\n\n');
			var allUsers = yield wechatApi.fetchUserInfo(data1.data.openid);
			console.log(JSON.stringify(allUsers));

			console.log('获取当前用户openid ---------\n\n');
			var data2 = yield wechatApi.getUserOpenIds(message.FromUserName);
			console.log(JSON.stringify(data2));

			// TODO: 对于用户信息和用户的openid 存入moogo 数据库
        }
		this.body = reply;
	}
	yield next;
}

exports.reply = reply;
