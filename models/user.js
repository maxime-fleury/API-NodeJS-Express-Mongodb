const mongoose = require('mongoose');
var crypto = require('crypto');
var base64url = require('base64url');
// Death schema
const userSchema = mongoose.Schema({
	login:{
		type: String,
		required: true
	},
	password:{
		type: String,
		required: true
	},
	token:{
		type: String,
		required: true
	},
	mail:{
		type: String,
		required: true
	},
    callAllowed:{
        type: Number,
        required: false, default:10000
    },
    callMade:{
        type: Number,
        required: false, default: 0
    }
});

const user_ = module.exports = mongoose.model('users', userSchema);

// connect
module.exports.connect = (callback, login, password) => {
    username = { login: login };
    password = { password: password };
    user_.find(callback).find( {"$and": [username, password]}  );
}
// REGISTER
module.exports.register = (callback, login, password) => {
    //TMP TMP
        mail = "tmp@gmail.com";
        token = generateUniqueToken(15);
        username = { login: login };
    //TMP TMP
    if(login != undefined && login != "" && password != undefined && password != ""){
        tmp_user = new user_({login: login, password: password, token: token, mail: mail, callAllowed: 10000, callMade: 0});
        tmp_user.save();
        user_.find(callback).find( {"$and": [username]}  );
    }

}
module.exports.newToken = (callback, login) => {
    token = generateUniqueToken(15);
    user_.findOneAndUpdate({"login": login}, {$set:  {"token": token}}, {}, callback);
   // console.log(token);
}
module.exports.getToken = (callback, login) => {
        user_.find(callback).find({login: login}).select({'token': 1, "_id": 0});
}
module.exports.findByToken = (callback, token) => {
    if(token != undefined && token != "")
        user_.find(callback).find({token: token});
}
module.exports.findByLogin = (callback, login) => {
    if(login != undefined && login != "")
        user_.find(callback).find({login: login}).count();
}
module.exports.addCall = (callback, token) => {
    if(token != undefined && token != "")
    user_.findOneAndUpdate({"token": token}, {$inc:  {"callMade": 1}}, {}, callback);
}
/** Sync */
function generateUniqueToken(size) {
  return base64url(crypto.randomBytes(size));
}