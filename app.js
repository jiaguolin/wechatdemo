'use strict'

var Koa = require('koa');
var config = require('./config');
var weixin = require('./weixin');
var wechat = require('./wechat/g');
// var router = require('koa-route');

// var wechatApi = new Wechat(config.wechat);

// router.get('/sendMessage', sendMessage); 

// function *sendMessage(next) {
//     // console.log(this.request.body);
//     var message = this.request.body;
//     // user.createTime = new Date;
//     // user.lastLogin = new Date;
//     // var id = users.push(user)
//     // users.id = id - 1;
//     // this.redirect('/users');
//     console.log(message);
//     // wechatApi.customReply(message.FromUserName,'请问有什么需要帮助您?');
// }

var app = new Koa();

app.use(wechat(config.wechat,weixin.reply)); //handler

app.listen(8001);



console.log('Listening 8080...')