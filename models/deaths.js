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
module.exports.getDeaths = (callback, limit, time, max, min, sex, country) => {
	sex = checkSex(sex);
	time =  checkTime(time, parseInt(max), parseInt(min));
	console.log("inside death: limit = " + limit + " " + "time = " + 	time);
	if(limit == undefined){//no limit applied
		if(time == undefined){
			Deaths_.find(callback).find({SEX: sex});
		}
		else{
			Deaths_.find(callback).find({"$and": [{TIME: time}, sex]});
		}
	}else if(limit.toLowerCase() == "all"){//noLimit
		if(time == undefined){
			Deaths_.find(callback).find(sex);
		}
		else{
			Deaths_.find(callback).find({"$and": [{TIME: time}, sex]});
		}
	}
	else {//search is limited
		if(limit == undefined || Number.isNaN(parseInt(limit)))
			limit = 150;
	
		if(time == undefined){
			Deaths_.find(callback).find( sex  ).limit(parseInt(limit));
		}
		else{
			Deaths_.find(callback).find({"$and": [{TIME: time}, sex, {"$search": [{GEO: "Denmark"}]}]}).limit(parseInt(limit));
			console.log("searched in this else");
		}
	}
}
function checkCountry(country){
	if(country == undefined){
		return {};
	}
	else return {"$search": [{GEO: country}]}
}
function checkSex(sex){
	if(sex == undefined){
		sex = {"$or": [{SEX: "Total"}, {SEX: "Males"}, {SEX: "Females"}]};
	}
	else{
		if(sex.toLowerCase() != "males" && sex.toLowerCase() != "females" && sex.toLowerCase() != "total"
		&& sex.toLowerCase() != "male" && sex.toLowerCase() != "female"){
			sex = {"$or": [{SEX: "Total"}, {SEX: "Males"}, {SEX: "Females"}]};//ANY
		}
		else{
			if(sex.toLowerCase() == "males" || sex.toLowerCase() == "male"){//male or males
				sex = {SEX: "Males"};
			}else if(sex.toLowerCase() == "females" || sex.toLowerCase() == "female"){//females or females
				sex = {SEX: "Females"};
			}
			else if(sex.toLowerCase() == "total"){
				sex = {SEX: "Total"};
			}
		}
	}
	console.log(sex);
	return sex;
}
function checkTime(time, max, min){
	//console.log("time before checktime = " + time);
	if(time != undefined && (Number.isInteger(parseInt(time)))){//time exists and is a number
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
module.exports.getByOrder = (callback, limit, time, order, sex, country) =>{
	sex = checkSex(sex);
	if(checkOrder(order)){
		if(order.toLowerCase() == 'acs' ){
			if(limit == undefined){
				Deaths_.find(callback).find(sex).sort({TIME: {$gt: time}});
			}
			else if(checkLimitParmam(limit) != 'all'){
				Deaths_.find(callback).find(sex).sort({TIME: {$gt: time}}).find({ SEX: sex}).limit(checkLimitParmam(limit));
			}
			else {
				Deaths_.find(callback).find(sex).sort({TIME: {$gt: time}}).find({ SEX: sex});
			}
		}
		else if(order.toLowerCase() == 'desc'){
			if(limit == undefined){
				Deaths_.find(callback).find(sex).sort({TIME: {$lt: time}}).find({ SEX: sex});
			}
			else if(checkLimitParmam(limit) != 'all'){
				Deaths_.find(callback).find(sex).sort({TIME: {$lt: time}}).find({ SEX: sex}).limit(checkLimitParmam(limit));
			}
			else {
				Deaths_.find(callback).find(sex).sort({TIME: {$lt: time}}).find({ SEX: sex});
			}
		}
	}
	else{//ORDER IS UNDEFINED
		Deaths_.find(callback).find(sex).limit(150);
	}

};
function checkLimitParmam(limit){
	console.log(limit);
	if(limit != undefined){
		if(limit.toLowerCase() == "all")
			return "all";
		if(!isNaN(limit) &&  parseInt(limit) > 0){
			return limit;
		}
		else
			return "all";
	}
	else return "all";
}
function checkOrder(order){
	if(order == undefined){
		return false;
	}
	console.log("ORDER IS NOT UNDEFINED BUT");

}