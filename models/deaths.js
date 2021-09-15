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
	country = checkCountry(country);
	if(country == undefined){
		country = {};
	}
	console.log("inside death: limit = " + limit + " " + "time = " + 	time);
	if(limit == undefined){//no limit applied
		if(time == undefined){
			Deaths_.find(callback).find({ "$and": [sex, country]});
		}
		else{
			Deaths_.find(callback).find({"$and": [{TIME: time}, sex, country]});
		}
	}else if(limit.toLowerCase() == "all"){//noLimit
		if(time == undefined){
			Deaths_.find(callback).find({"$and": [ sex, country]});
		}
		else{
			Deaths_.find(callback).find({"$and": [{TIME: time}, sex, country]});
		}
	}
	else {//search is limited
		if(limit == undefined || Number.isNaN(parseInt(limit)))
			limit = 150;
	
		if(time == undefined){
			Deaths_.find(callback).find( {"$and": [sex,country]}  ).limit(parseInt(limit));
		}
		else{
			Deaths_.find(callback).find({"$and": [{TIME: time}, sex, country]}).limit(parseInt(limit));
			console.log("searched in this else");
		}
	}
}
function checkCountry(country){
	if(country == undefined){
		return undefined;//dark magic when you give {} (empty object) it doesn't count in the query
	}
	else return {GEO: {$regex: country+'*', $options: 'i' } }
}
function checkSex(sex){
	if(sex == undefined){
		sex = {"$or": [{SEX: "Total"}, {SEX: "Males"}, {SEX: "Females"}]};
	}
	else{
		if(sex.toLowerCase() != "males" && sex.toLowerCase() != "females" && sex.toLowerCase() != "total"
		&& sex.toLowerCase() != "male" && sex.toLowerCase() != "female" && sex.toLowerCase() != "0" &&
		 sex.toLowerCase() != "1" && sex.toLowerCase() != "2" && sex.toLowerCase() != "3"){
			sex = {"$or": [{SEX: "Total"}, {SEX: "Males"}, {SEX: "Females"}]};//ANY
		}
		else{
			if(sex.toLowerCase() == "males" || sex.toLowerCase() == "male" || sex.toLowerCase() == "1"){//male or males or 1
				sex = {SEX: "Males"};
			}else if(sex.toLowerCase() == "females" || sex.toLowerCase() == "female" || sex.toLowerCase() == "2"){//females or females or 2
				sex = {SEX: "Females"};
			}
			else if(sex.toLowerCase() == "total" || sex.toLowerCase() == "3"){ // or 3
				sex = {SEX: "Total"};
			}
			else if(sex.toLowerCase() == "0"){
				sex = {};
			}
		}
	}
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
module.exports.getMaxTime = (callback) => {//get max year in collection (time is year)
	Deaths_.find(callback).sort({TIME:-1}).limit(1)
}
module.exports.getMinTime = (callback) => {//get min year in collection
	Deaths_.find(callback).sort({TIME:+1}).limit(1)
}
module.exports.getByOrder = (callback, limit, time, order, sex, country) =>{
	sex = checkSex(sex);
	country = checkCountry(country);
	if(country == undefined){
		country = {};
	}
	time =  checkTime(time, parseInt(max), parseInt(min));
	if(time == undefined){
		time = {};
	}
	console.log(JSON.stringify(country));
	if(checkOrder(order)){
		if(order.toLowerCase() == 'asc' ){
			if(limit == undefined){
				Deaths_.find(callback).find({"$and": [sex, country]}).sort({TIME: {$gt: time}});
			}
			else if(checkLimitParmam(limit) == 'all'){
				Deaths_.find(callback).find({"$and": [sex, country]}).sort({TIME: {$gt: time}});
			}
			else {
				Deaths_.find(callback).find({"$and": [sex, country]}).sort({TIME: {$gt: time}}).limit(checkLimitParmam(limit));
			}
		}
		else if(order.toLowerCase() == 'desc'){
			if(limit == undefined){
				Deaths_.find(callback).find({"$and": [sex, country]}).sort({TIME: {$lt: time}});
			}
			else if(checkLimitParmam(limit) == 'all'){
				Deaths_.find(callback).find({"$and": [sex, country]}).sort({TIME: {$lt: time}});
			}
			else {
				Deaths_.find(callback).find({"$and": [sex, country]}).sort({TIME: {$lt: time}}).limit(checkLimitParmam(limit));
			}
		}
	}
	else{//ORDER IS UNDEFINED OR NOT ONE OF THE EXPECTED VALUE
		Deaths_.find(callback).find({"$and": [sex, country]}).limit(checkLimitParmam(limit));
	}

};
function checkLimitParmam(limit){
	console.log(limit);
	if(limit != undefined){
		if(limit.toLowerCase() == "all")
			return "all";
		if(!isNaN(limit) &&  parseInt(limit) >= 0){
			return limit;
		}
		else
			return "all";
	}
	else return "all";
}
function checkOrder(order){
	if(order == undefined || (order.toLowerCase() != "asc" || order.toLowerCase() != "desc")){//if undefined or not one of the two possible values return false
		return false;
	}
	else return true;


}