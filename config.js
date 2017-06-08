'use strict'

var path = require('path');
var util = require('./libs/util');

var wechat_file = path.join(__dirname,'./wechat/access_token.txt');

var config = {
	wechat:{
		appID:'wxaee573c03125bbc1', //wxa58995f69272a3e7
		// appID:'wxa58995f69272a3e7',
		// appSecret:'1670fa80c67a98abca0fcb8b6a530509',
		appSecret:'724050aa26b5970d293ba9e575ec60c6', //1670fa80c67a98abca0fcb8b6a530509
		token:'weixin',
		getAccessToken:function(){
			return util.readFileAsync(wechat_file);
		},
		saveAccessToken:function(data){
			return util.writeFileAsync(wechat_file,data);
		},
	}
};

module.exports = config;