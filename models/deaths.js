const mongoose = require('mongoose');

// Death schema
const deathSchema = mongoose.Schema({
	_id: {type: mongoose.Schema.Types.ObjectId},
	TIME:{
		type: Number,
		required: true
	},
	GEO:{
		type: String,
		required: true
	},
	UNIT:{
		type: String,
		required: true
	},
	SEX:{
		type: String,
		required: true
	},
	AGE:{
		type: String,
		require: true
	},
	ICD10:{
		type: String,
		required: true
	},
	VALUE:{
		type: String,
		required: true
	},
	FLAGS:{
		type: String}
});

const Deaths_ = module.exports = mongoose.model('deaths', deathSchema);

// Get Death
module.exports.getDeaths = (callback, limit, time, max, min) => {
	time =  checkTime(time, parseInt(max), parseInt(min));
	console.log("inside death: limit = " + limit + " " + "time = " + 	time);
	if(limit == "All"){//noLimit
		if(time == undefined){
			Deaths_.find(callback);
		}
		else{
			Deaths_.find(callback).find({TIME: time});
		}
	}
	else {//search is limited
		if(limit == undefined || Number.isNaN(parseInt(limit)))
			limit = 150;
	
		if(time == undefined){
			Deaths_.find(callback).limit(parseInt(limit));
		}
		else{
			Deaths_.find(callback).limit(parseInt(limit)).find({TIME: time});
		}
	}
}
function checkTime(time, max, min){
	//console.log("time before checktime = " + time);
	if(time != undefined && !Number.isNaN(parseInt(time))){//time exists and is a number
		time = parseInt(time);//make sure its casted
//let res = (time > max) ? undefined : (time < min) ? undefined : time;
		//console.log("time after checktime = " + res + " max: " + max + " min: " + min );
		return (time > max) ? undefined : (time < min) ? undefined : time; // time must be between min max else undefined
	}else return undefined;//either not a number or not exists
}
module.exports.getMaxTime = (callback) => {
	Deaths_.find(callback).sort({TIME:-1}).limit(1)

}
module.exports.getMinTime = (callback) => {
	Deaths_.find(callback).sort({TIME:+1}).limit(1)

}