'use strict'

var Koa = require('koa');
var config = require('./config');
var weixin = require('./weixin');
var wechat = require('./wechat/g');

var app = new Koa();

app.use(wechat(config.wechat,weixin.reply)); //handler

app.listen(8001);

console.log('Listening 8001...')