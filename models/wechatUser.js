'use strict';

var userModel = require('../database').models.wechatUser;

var create = function (data, callback){
	var newUser = new userModel(data);
	newUser.save(callback);
};

var findByOpenId = function (openid, callback){
	userModel.findById(openid, callback);
}

module.exports = { 
	create, 
	findByOpenId, 
};
