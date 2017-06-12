
'use strict';

var Mongoose 	= require('mongoose');

var UserSchema = new Mongoose.Schema({
    openid: { type:String, required: true ,unique: true},
    nickename: { type: String, required: true},
    province: { type: String, default: null },
    city:  { type: String, default: null}
});

// Create a user model
var userModel = Mongoose.model('wechatUser', UserSchema);

module.exports = userModel;

/*
Schema 所支持的所有类型
 var ExampleSchema = new Schema({
      name:String,
      binary:Buffer,
      living:Boolean,
      updated:Date,
      age:Number,
      mixed:Schema.Types.Mixed, //该混合类型等同于nested
      _id:Schema.Types.ObjectId,  //主键
      _fk:Schema.Types.ObjectId,  //外键
      array:[],
      arrOfString:[String],
      arrOfNumber:[Number],
      arrOfDate:[Date],
      arrOfBuffer:[Buffer],
      arrOfBoolean:[Boolean],
      arrOfMixed:[Schema.Types.Mixed],
      arrOfObjectId:[Schema.Types.ObjectId]
      nested:{
        stuff:String,
      }
    });
*/