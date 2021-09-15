const mongoose = require('mongoose');

// Death schema
const userSchema = mongoose.Schema({
	_id: {type: mongoose.Schema.Types.ObjectId},
	user:{
		type: String,
		required: true
	},
	password:{
		type: String,
		required: true
	},
	uniqueKey:{
		type: String,
		required: true
	},
	mail:{
		type: String,
		required: true
	}
});

const user_ = module.exports = mongoose.model('deaths', userSchema);

// connect
module.exports.connect = (callback, username, password) => {


}
// REGISTER
module.exports.register = (callback, limit, time, max, min, sex, country) => {


}
