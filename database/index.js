'use strict';
var Mongoose 	= require('mongoose');

// Connect to the database
// construct the database URI and encode username and password.
// Mongoose.connect("mongodb:/service:123456@10.0.0.39:27017/online_service");

Mongoose.connect("mongodb://service:123456@123.56.45.82:27017/online_service");
//mongodb://127.0.0.1:27017
//mongodb://jiaguolin:123456@ds157641.mlab.com:57641/chatio
// Throw an error if the connection fails
Mongoose.connection.on('error', function(err) {
	if(err) throw err;
});

// mpromise (mongoose's default promise library) is deprecated, 
// Plug-in your own promise library instead.
// Use native promises
Mongoose.Promise = global.Promise;

module.exports = { 
	Mongoose, 
	models: {
		wechatUser: require('./schemas/wechatUser.js'),
		message: require('./schemas/message.js')
	}
};