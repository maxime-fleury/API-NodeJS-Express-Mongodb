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
  res.send('<body class="bg-dark text-white">  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">  Please use /api/death/<br><a class="btn btn-primary m-2" href="/doc">Documentation</a><br><a class="btn btn-primary m-2" href="/connexion">Connect/register</a></body>');
  console.log('one connexion');
})
app.get('/doc', function(req, res) {
    res.sendFile(__dirname + '/documentation.html');
});
app.get('/connexion', function(req, res) {
    res.sendFile(__dirname + '/connexion.html');
});
app.post('/connexion', function(req, res){
	body = ""
	req.on("data", function (chuck){
		body += chuck;
	});
	let login = req.query.login;
	let passw = req.query.passw;
	if(login != "" && login != undefined && login != null){
		//login OK
		if(passw != "" && passw != undefined && passw != null){
			//password OK
			console.log(login + " " + passw);
			res.send("test");
		}
	}
	json = JSON.stringify(body);
	res.send("rip" + json +  " ");
})
app.get('/api/death', function(req, res){
		let limit = req.query.limit;
		let time = req.query.time;
		let order = req.query.order; 
		let sex = req.query.sex;
		let country = req.query.country;
		//I don't know why its like that, its too weird couldn't find a way to
		//get max and min, before you need a callback function and stuff doesn't
		//exists outsite "Deaths.get...({function(){ HERE }});"
		//I'm pretty sure its not meant to be used like this because this is
		//insanly inconvenient 
		if(!(limit == undefined && time == undefined && order == undefined))
		Deaths.getMaxTime(function(err, death){
			if(err){
				console.log(err);
			}
			max = death[0].TIME;
			Deaths.getMinTime(function(err, death){
				min = death[0].TIME;
				if(order == undefined){
					Deaths.getDeaths(function(err, death){ 
						if(err){
							console.log(err);
						}
						error = getErrors(min, max, time, limit, null, sex, country);
						//error = { error: -1, message: 'Everything is fine !'};
						res.setHeader('Content-Type', 'application/json');
						res.end(JSON.stringify({error, death}, null, 2));
						
					},limit, time, max, min, sex, country);
				}
				else{
					console.log(order);
					Deaths.getByOrder(function(err, death){ 
						if(err){
							console.log(err);
						}
						error = getErrors(min, max, time, limit, order, sex, country);
						//error = { error: -1, message: 'Everything is fine !'};
						res.setHeader('Content-Type', 'application/json');
						res.end(JSON.stringify({error, death}, null, 2));
						
					},limit, time, order, sex, country);
				}
			});
		});
		else{
			
			res.send(JSON.stringify({error: 0, message: 'Params.time && Params.limit && Params.order = undefined, no query executed.'}, null, 2));
		}
				
});

app.post('/')

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})

function getErrors(min, max, time, limit, order, sex, country){
	res = { error: -1, message: ['Everything is fine !']};
	if(parseInt(time) > max )
		res = {error: 0, message: ['Params.time > max in database, time not applied.']};
	if(parseInt(time) < min)
		res = {error: 1, message: ['Params.time < min in database, time not applied.']};
	if(!(Number.isInteger(parseInt(time, 10))))
		res = {error: 2, message: ['Params.time is not not a number, time not applied.']};
	if(time == undefined)
		res = {error: 2, message: ['Params.time is not defined, time not applied.']};

	if(limit == undefined){
		res.message.push('Params.limit is undefined, no limit applied.');
	}
	else if(!(Number.isInteger(parseInt(limit,10)))){//is a positive integer ?
		if(limit.toLowerCase() == 'all')
			res.message.push('Params.limit is set to \'all\', no limit applied.');
		else
		res.message.push('Params.limit is not a number, default limit applied (150).');
	}else if(parseInt(limit) < 1){
		res.message.push('Params.limit < 1, default limit applied (150).');
	}
	if(order != null){
		if(order == undefined){
			res.message.push('Params.order is not defined, order query not applied.');
		}
		else if(order.toLowerCase() != "asc" && order.toLowerCase() != "desc"){
			res.message.push('Params.order is neither equal to "ASC" nor "DESC", order query not applied.');
		}
	}
	if(sex != undefined)
		if(sex.toLowerCase() != "males" && sex.toLowerCase() != "females" && sex.toLowerCase() != "female" && sex.toLowerCase() != "male" && sex.toLowerCase() != "total"
		&& sex.toLowerCase() != "1" && sex.toLowerCase() != "0" && sex.toLowerCase() != "2" && sex.toLowerCase() != "3"){
			res.message.push("Params.sex is not one of those value ['males', 'females', 'male', 'female', 'total', 0, 1, 2, 3], sex query not applied, any sex will be searched.");
		}
	//res.message = tmp;
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

setTimeout( function() {require('./testapi')},3000);