'use strict';

var messageModle = require('../database').models.message;

var create = function (data, callback){
	var newMessage = new messageModle(data);
	newMessage.save(callback);
};

var findByOpenId = function (messageid, callback){
	userModel.findById(messageid, callback);
}

module.exports = { 
	create, 
	findByOpenId, 
};