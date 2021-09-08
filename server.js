const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = 8001;

app.use(express.static(__dirname+'/client'));
app.use(bodyParser.json());

Deaths = require('./models/deaths');

// Connect to Mongoose
//mongoose.connect('mongodb://admin:123oo@xill.tk:27017/death?keepAlive=true&socketTimeoutMS=360000&connectTimeoutMS=360000').catch(error => console.log(error));
mongoose.connect('mongodb+srv://death:123oo@cluster0.jo5jn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
var db = mongoose.connection;
db.on('error', err => {
  console.log(err);
});
app.get('/', (req, res) => {
  res.send('Please use /api/');
  console.log('one connexion');
})


app.get('/api/death', function(req, res){
		let limit = req.query.limit;
		let time = req.query.time;
		//I don't know why its like that, its too weird couldn't find a way to
		//get max and min, before you need a callback function and stuff doesn't
		//exists outsite "Deaths.get...({function(){ HERE }});"
		//I'm pretty sure its not meant to be used like this because this is
		//insanly inconvenient 
		Deaths.getMaxTime(function(err, death){
			if(err){
				console.log(err);
			}
			max = death[0].TIME;
			Deaths.getMinTime(function(err, death){
				min = death[0].TIME;
				Deaths.getDeaths(function(err, death){ 
					if(err){
						console.log(err);
					}
					error = getErrors(min, max, time, limit);
					//error = { error: -1, message: 'Everything is fine !'};
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify({error, death}, null, 2));
					
				},limit, time, max, min);
			});
		});
	console.log("new resquest");
				
});

app.post('/')

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})

function getErrors(min, max, time, limit){
	res = { error: -1, message: 'Everything is fine !'};
	if(parseInt(time) > max )
		res = {error: 0, message: 'Params.time > max in database, time not applied.'};
	if(parseInt(time) <= min)
		res = {error: 1, message: 'Params.time < min in database, time not applied.'};
	if(!(Number.isInteger(parseInt(time, 10))))
		res = {error: 2, message: 'Params.time is not a number, time not applied.'};
	if(res.error != -1){
		tmp = res.message;
		if(limit == undefined){
			tmp = [res.message, 'Parasm.limit is undefined, no limit applied.'];
		}
		else if(!(Number.isInteger(parseInt(limit,10)))){//is a positive integer ?
			if(limit.toLowerCase() == 'all')
			tmp = [res.message, 'Parasm.limit is set to \'all\', no limit applied.'];
			else
			tmp = [res.message, 'Parasm.limit is not a number, default limit applied (150).'];
		}else if(parseInt(limit) < 1){
				tmp = [res.message, 'Parasm.limit < 1, default limit applied (150).'];
		}
		res.message = tmp;
	}
	return res;
}
////// SOME TESTS BECAUSE IT WASN'T WORKING 
/*test();
function test(){
	let x = ["123", 123, "test", "e2ee2e", 1.2, 5.0, 10, 2000, 1/5];
	x.forEach(el => {
		isNumber(el);
	})
}
function isNumber(test){
	test = parseInt(test, 10);
	console.log(!(Number.isInteger(test)) + " " + test);
}*/
//testTimeAPI();
function testTimeAPI(){
			time_ = ["2000", 2000, 2001, "2001", 2010, "2010", 2011, "test", 2002, "2003", "2011", "2test2", "e20", "g200"];
	time_expected = [1,      1,     -1   ,  -1,     -1,     -1,  0,      2,    -1,    -1,    0,     1,        2,       2   ]
	limit = 16;
	min = 2000;
	max = 2010;
	passedTests = 0;
	failed = 0;
	time_.forEach((el, index) => {
		passedTests++;
		let er = getErrors(min, max, el, limit);
		//console.log(er.message);
		if(er.error != time_expected[index] ){
			failed++;
		}
		//just some more styling
		if(er.error >= 0)
			er.error = " " + er.error;
		if(time_expected[index] >= 0)
			time_expected[index] = " " + time_expected[index];
		console.log("   er:\x1b[31m " + er.error + "\x1b[0m expected: " + time_expected[index] + " " + el + " " +  typeof(el) + " failed" + " \x1b[32m" + failed + "/" + passedTests + "\x1b[0m");
	});
	console.log("Total: " + (time_.length) + " failed " + failed + "/" +  passedTests);
}