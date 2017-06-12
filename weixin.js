
'use strict'
var config = require('./config');
var Wechat = require('./wechat/wechat');
var WechatUser = require('./models/wechatUser');
var Message = require('./models/message');

var wechatApi = new Wechat(config.wechat);

function* reply(next){
	var message = this.weixin;
	console.log(message)
	// 消息存入数据库
	/*
	   ToUserName: { type: String, required: true}, //微信公众号 微信号
    FromUserName: { type: String, required: true}, //wechat user openid
    CreateTime: { type: Number, required: true},
    MsgType: { type: String, required: true},
    Content: { type: String, required: true},
    MsgId: { type:String, required: true ,unique: true}
	*/
	// var tmp = {'ToUserName':data1.nickname, 
	// 			'FromUserName':data1.openid, 
	// 			'province':data1.province, 
	// 			'city':data1.city };
	// console.log(this.weixin)
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
			Message.create(message, function(err, newMessage){
				if(err) throw err;
				console.log('存入消息成功:' + message.MsgId);
			});
			var data1 = yield wechatApi.fetchUserInfo(message.FromUserName);
			console.log('获取用户信息----------');
			console.log(JSON.stringify(data1));

			var tmp = {'nickename':data1.nickname, 'openid':data1.openid, 'province':data1.province, 'city':data1.city };
			console.log(tmp);
			// WechatUser.create(tmp, function(err, newUser){
			// 	if(err) throw err;
			// 	console.log('存入微信用户成功!!');
			// });
			//批量获取首先要取到所有的openid.
			// var data2 = yield wechatApi.fetchUserInfo([message.FromUserName]); 
			// console.log(JSON.stringify(data2));
		}
        else if (content === '2'){
            console.log('获取所有用户openid ---------\n');
            var data1 = yield wechatApi.getUserOpenIds();
			console.log(JSON.stringify(data1));

			console.log('获取所有用户信息 ---------\n');
			var allUsers = yield wechatApi.fetchUserInfo(data1.data.openid);
			console.log(JSON.stringify(allUsers));

			console.log('获取当前用户openid ---------\n');
			var data2 = yield wechatApi.getUserOpenIds(message.FromUserName);
			console.log(JSON.stringify(data2));

			// TODO: 对于用户信息和用户的openid 存入moogo 数据库
        }
		else if (content === '3'){
			console.log('异步回复消息');
			reply = '客服正在接入:请稍后...';
			console.log('用户id:' + message.FromUserName);
			var oneSecond = 1000 * 3; // one second = 1000 x 1 ms
			setTimeout(function() {
				 wechatApi.customReply(message.FromUserName,'请问有什么需要帮助您?');
			}, oneSecond);
		}
		this.body = reply;
	}
	yield next;
}

exports.reply = reply;
