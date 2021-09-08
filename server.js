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
					error = {error: 'Oups', message: 'max'};
					error2 = "[{ error: 'Oups', message: 'max'}]";
					x = json({death, error});//real return
					res.send(x);
					
				},limit, time, max, min);
			});
		});
	console.log("new resquest");
				
});

app.post('/')

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
