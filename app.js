const express = require('express');
const path = require('path');
const passportSetup = require('./config/passportsetup');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookeiSession = require('cookie-session');
const app = express();
const passport = require('passport');

app.use(express.static("."));

app.use(cookeiSession({
	maxAge: 24 * 60 * 6 * 1000,
	keys: [keys.session.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(keys.mongodb.dbURL, () => {
	console.log('connected to mongodb');
});

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/login.html'));

});

app.listen(8080, () => {
	console.log("Port 8080");
});

//body parser
var bodyParser = require('body-parser');
//database
var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://density.db');
//building note and html pages

var engines = require('consolidate');
//using time
var strftime = require('strftime-component');

var file = require('file-system');
var fs = require('fs');
var parse = require('csv-parse');


// app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
// app.set('views', __dirname + '/templates'); // tell Express where to find templates, in this case the '/templates' directory
// app.set('view engine', 'html'); //register .html extension as template engine so we can render .html pages 
// //so we can use js and css files
// app.use(express.static('public'));
//more body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: false }));
//to first create the database:
// conn.query('CREATE TABLE density (id INTEGER PRIMARY KEY AUTOINCREMENT, location TEXT, day TEXT, time TEXT, population INTEGER)');

//on client side we'll basically have a $.(document).ready(function)... that uses setInterval to make /getDensities request 
//every 10 min or hour
//also another post request for future/past times
//both will return an array of 10 locations with density info

// Hard coding in 
// -max value of building
// -number of students interviewed
// -max number of people reported in a building
var citm = 600;
var citrm = 15;
var rockm = 500;
var rockrm = 6;
var haym = 180;
var hayrm = 4;
var fauncem = 300;
var fauncerm = 6;
var barusm = 300;
var barusrm = 5;
var andrewsm = 180;
var andrewsrm = 4;
var watsonm = 60;
var watsonrm = 1;
var rattym = 300;
var rattyrm = 4;
var scilim = 550;
var scilirm = 11;
var jwwm = 250;
var jwwrm = 5;
var intv = 40;

var maxes = [andrewsm, barusm, citm, fauncem, haym, jwwm, rattym, rockm, scilim, watsonm];
var rmaxes = [andrewsrm, barusrm, citrm, fauncerm, hayrm, jwwrm, rattyrm, rockrm, scilirm, watsonrm]; //check value of these

// TRANSFERRING CSV TO DATABASE!!!!!!
// fs.readFile("densities.csv", function(err, fileData){
// 	parse(fileData, function(err, rows) {
//     	if (err){
// 			console.log(err);
// 			console.log("file reading probably didn't work");
// 		}
		
// 		for (var i = 0; i <= rows.length - 1; i++) {
// 			var sql = 'INSERT INTO density VALUES(NULL, $1, $2, $3, $4)';
// 				conn.query(sql, [rows[i][1], rows[i][2], rows[i][3], rows[i][4]], function(error, result){
// 				if (error) {
// 					console.log(error);
// 				}
// 			}); 


// 		};
// 		var sql2 = 'SELECT location, population FROM density WHERE location=$1 AND population=$2 ORDER BY location ASC';
// 		conn.query(sql2, ["CIT", 15], function(error, result){
// 			if (error){
// 				console.log("we got an error");
// 			}
// 			console.log(result.rows);
// 		});
//     // Your CSV data is in an array of arrys passed to this callback as rows.
//   });
// });


app.get('/getDensities', function(request, response){
	var day = strftime('%A').toUpperCase();
	var hour = parseInt(strftime('%l'));
	var pm = strftime('%p');
	var time = hour + ":00 " + pm;
	console.log(day); //ensure these work
	console.log(time);
	var sql = 'SELECT location, population FROM density WHERE day=$1 AND time=$2 ORDER BY location ASC';
	conn.query(sql, [day, time], function(error, result){
		if (error) {
			response.status(500).type('html');
			console.log("no data??");
		}
		var currDens = result.rows;
		console.log(currDens); //check!
		console.log(currDens[0].population);
		for (var i = 0; i <= currDens.length-1; i++) {
			var currPOP = currDens[i].population;
			var scCurrPOP = (currPOP * intv); //should console log these!
			var scMax = (0.3 * maxes[i]);
			var scRMax = (0.7* intv *rmaxes[i]);
			currDens[i].population =  scCurrPOP / (scMax + scRMax); //should console long this too!

		};
		response.json({densities: currDens});
	});
});

app.post('/home/queryTime', function(request, response){
	var day = request.body.day;
	var time = request.body.hour; //tell client side that this be properly formatted!
	console.log(day);
	console.log(time);
	var sql = 'SELECT location, population FROM density WHERE day=$1 AND time=$2 ORDER BY location ASC';
	conn.query(sql, [day, time], function(error, result){
		if (error) {
			response.status(500).type('html');
			console.log("no data??");
		}
		var currDens = result.rows;
		console.log(currDens);
		for (var i = 0; i <= currDens.length-1; i++) {
			var currPOP = currDens[i].population;
			var scCurrPOP = (currPOP * intv); //should console log these!
			var scMax = (0.3 * maxes[i]);
			var scRMax = (0.7* intv *rmaxes[i]);
			currDens[i].population =  scCurrPOP / (scMax + scRMax); //should console long this too!

		};
		response.json({densities: currDens});
	});
});

