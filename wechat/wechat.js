
'use strict'
var fs = require('fs');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var util = require('./util');

var base = 'https://api.weixin.qq.com/cgi-bin/';
var api = {
    	accessToken:base +'token?grant_type=client_credential',
        user:{
            getUserInfo:base +'user/info?',
            batchGetUserInfo:base +'user/info/batchget?',  //access_token=ACCESS_TOKEN，POST请求
		    getUserOpenIds:base +'user/get?',  //access_token=ACCESS_TOKEN&next_openid=NEXT_OPENID，GET请求
        },
		//https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=ACCESS_TOKEN
		customReply:base + 'message/custom/send?'
}

function Wechat(opts){     //构造函数
	var that = this;
	this.appID = opts.appID;
	this.appSecret = opts.appSecret;
	this.getAccessToken = opts.getAccessToken;
	this.saveAccessToken = opts.saveAccessToken;
	this.fetchAccessToken();
}

Wechat.prototype.replay = function(){
	var content = this.body;
	var message = this.weixin;
	var xml = util.tpl(content,message); //拼接xml
	this.status = 200;
	this.type = 'application/xml';
	this.body = xml;
}

Wechat.prototype.fetchAccessToken = function(){
	var that = this;

	// 如果this上已经存在有效的access_token，直接返回this对象
	if(this.access_token && this.expires_in){
		if(this.isvalidAccessToken(this)){
			return Promise.resolve(this);
		}
	}

	this.getAccessToken().then(function(data){
		try{
			data = JSON.parse(data);
		}catch(e){
            console.log('从本地文件获取token失败,需要从微信api重新获取')
			return that.updateAccessToken();
		}
		if(that.isvalidAccessToken(data)){
            console.log('sucess !! 从本地文件取出可用的token')
			return Promise.resolve(data);
		}else{
			console.log('access_token 过期,需要去微信api重新获取');
			return that.updateAccessToken();
		}
	}).then(function(data){
		that.access_token = data.access_token;
		that.expires_in = data.expires_in;
		that.saveAccessToken(JSON.stringify(data));
		return Promise.resolve(data);
	});
}

Wechat.prototype.isvalidAccessToken = function(data){
	if(!data || !data.access_token || !data.expires_in) return false;
	var access_token = data.access_token;
	var expires_in = data.expires_in;
	var now = new Date().getTime();
	return (now < expires_in) ? true : false;
}

// 获取最新的aceess_token
Wechat.prototype.updateAccessToken = function(){
	var appID = this.appID;
	var appSecret = this.appSecret;
	var url = api.accessToken + '&appid='+ appID +'&secret='+ appSecret;

	return new Promise(function(resolve,reject){
		request({url:url,json:true}).then(function(response){
			var data = response.body;
			var now = new Date().getTime();
			var expires_in = now + (data.expires_in - 20) * 1000;   //考虑到网络延迟、服务器计算时间,故提前20秒发起请求
			data.expires_in = expires_in;
			resolve(data);
		});
	});
}

//获取单个或一批用户信息
Wechat.prototype.fetchUserInfo = function(open_id,lang){
	var that = this;
	var lang = lang || 'zh_CN';
	var url = '';
	var opts = {}
	return new Promise(function(resolve,reject){
		that.fetchAccessToken().then(function(data){

			if(open_id && !Array.isArray(open_id)){   //单个获取
				url = api.user.getUserInfo + 'access_token=' + data.access_token +'&openid='+ open_id +'&lang=' +lang;
				opts = {
					url:url,
					json:true
				}
			}else if(open_id && Array.isArray(open_id)){
				url = api.user.batchGetUserInfo + 'access_token=' + data.access_token;
				var user_list = [];
				for(var i=0;i<open_id.length;i++){
					user_list.push({
						openid:open_id[i],
						lang:lang
					});
				}
				opts = {
					method:'POST',
					url:url,
					body:{
						user_list:user_list
					},
					json:true
				}
			}
			request(opts).then(function(response){
				var _data = response.body;
				if(!_data.errcode){
					resolve(_data);
				}else{
					throw new Error('fetch user info failed: ' + _data.errmsg);
				}
			}).catch(function(err){
				reject(err);
			});
		});
	});
}

Wechat.prototype.getUserOpenIds = function(next_openid){
	var that = this;
	return new Promise(function(resolve,reject){
		that.fetchAccessToken().then(function(data){
			var url = api.user.getUserOpenIds + 'access_token=' + data.access_token;
			if(next_openid) url += '&next_openid=' + next_openid;
			request({url:url,json:true}).then(function(response){
				var _data = response.body;
				if(!_data.errcode){
					resolve(_data);
				}else{
					throw new Error('get user openIds failed: ' + _data.errmsg);
				}
			}).catch(function(err){
				reject(err);
			});
		});
	});
}

Wechat.prototype.customReply = function(touser,text){
	var that = this;
	return new Promise(function(resolve,reject){

		that.fetchAccessToken().then(function(data){
			var url = api.customReply + 'access_token=' + data.access_token;
			var opts = {
				method:'POST',
				url:url,
				body:{
					"touser":touser,
					"msgtype":"text",
					"text":
					{
						"content":text
					}
				},
				json:true
			}
			request(opts).then(function(response){
				var _data = response.body;
				if(!_data.errcode){
					resolve(_data);
				}else{
					throw new Error('customReply message failed: ' + _data.errmsg);
				}
			}).catch(function(err){
					reject(err);
				});
		})
	
	})

}


module.exports = Wechat;