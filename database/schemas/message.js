'use strict';

var Mongoose 	= require('mongoose');

var MessageSchema = new Mongoose.Schema({
    ToUserName: { type: String, required: true}, //微信公众号 微信号
    FromUserName: { type: String, required: true}, //wechat user openid
    CreateTime: { type: Number, required: true},
    MsgType: { type: String, required: true},
    Content: { type: String, required: true},
    MsgId: { type:String, required: true ,unique: true} 


    //消息类型
    //平台
    //消息状态
    //消息的处理状态.
});

// Create a message model
var messageModle = Mongoose.model('message', MessageSchema);

module.exports = messageModle;