'use strict'

var Koa = require('koa')
var wechat = require('./wechat/g')
var util = require('./libs/util');
var path = require('path')
var wechat_file = path.join(__dirname,'./wechat/wechat.txt');
var config = {
    wechat: {
        appID:'wxaee573c03125bbc1',
        appSecret:'724050aa26b5970d293ba9e575ec60c6',
        token:'weixin',
        getAccessToken:function(){
			return util.readFileAsync(wechat_file);
		},
		saveAccessToken:function(data){
			return util.writeFileAsync(wechat_file,data);
		},
    }
}
var app = new Koa()
app.use(wechat(config.wechat))
app.listen(1234)
console.log('listeing port 1234')