//Setting up dependencies
const express = require('express');
const path = require('path');
const passportSetup = require('./config/passportsetup');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const mapRoutes = require('./routes/map-routes');
const aboutRoutes = require('./routes/about-routes');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookeiSession = require('cookie-session');
const app = express();
const passport = require('passport');
const bodyParser = require('body-parser');
//database
const anyDB = require('any-db');
const conn = anyDB.createConnection('sqlite3://density.db');
const engines = require('consolidate');
//using time
const strftime = require('strftime-component');
const file = require('file-system');
const fs = require('fs');
const parse = require('csv-parse');
//To use HTML/CSS/JS files
app.use(express.static("."));
app.set('view engine', 'ejs');
//Setting up cookie session
app.use(cookeiSession({
	maxAge: 24 * 60 * 6 * 1000,
	keys: [keys.session.cookieKey]
}));
//Middleware setup
app.use(passport.initialize());
app.use(passport.session());
//Connecting to MongoDB database
mongoose.connect(keys.mongodb.dbURL, () => {
	console.log('connected to mongodb');
});
//Middleware setup
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/predict', mapRoutes);
app.use('/about', aboutRoutes);

module.exports = app;
// conn.query('CREATE TABLE density (id INTEGER PRIMARY KEY AUTOINCREMENT, location TEXT, day TEXT, time TEXT, population INTEGER)');

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/login.html'));

});

app.listen(8080, () => {
	console.log("Port 8080");
});

//more body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: false }));

//on client side we'll basically have a $.(document).ready(function)... that uses setInterval to make /getDensities request
//every 10 min or hour
//also another post request for future/past times
//both will return an array of 10 locations with density info

// Hard coding in
// -max value of building
// -number of students interviewed
// -max number of people reported in a building

// *****TODO: CHANGE TO JSON ARRAY AND RECREATE DB*****
const maxes = {
"CITm" : 600,
"CITrm" :15,
"ROCKm" : 500,
"ROCKrm" : 6,
"HAYm" : 180,
"HAYrm" : 4,
"FAUNCEm" : 300,
"FAUNCErm" : 6,
"BARUSm" : 300,
"BARUSrm" : 5,
"ANDREWSm" : 180,
"ANDREWSrm" : 4,
"WATSONm" : 60,
"WATSONrm" : 1,
"RATTYm" : 300,
"RATTYrm" : 4,
"SCILIm" : 550,
"SCILIrm" : 11,
"JWWm" : 250,
"JWWrm" : 5,
}
const intv = 40
// var maxes = [andrewsm, barusm, citm, fauncem, haym, jwwm, rattym, rockm, scilim, watsonm];
// var rmaxes = [andrewsrm, barusrm, citrm, fauncerm, hayrm, jwwrm, rattyrm, rockrm, scilirm, watsonrm]; //check value of these

// TRANSFERRING CSV TO DATABASE!!!!!!
// fs.readFile("densities.csv", function(err, fileData){
// 	parse(fileData, function(err, rows) {
//     	if (err){
// 			console.log(err);
// 			console.log("file reading probably didn't work");
// 		}

// 		for (var i = 0; i <= rows.length - 1; i++) {
// 			var pop = rows[i][4];
// 			var loc = rows[i][1]; //*****DO WE NEED TO CHECK IF THESE ARE NOT NULL/PLACEHOLDER?
// 			if(loc != "HOLDER" || loc != null){
// 				var locm = loc + "m";
// 				var locrm = loc + "rm";
// 				var scPop = pop*intv;
// 				console.log(scPop);
// 				var scMax = (0.3 * [maxes.locm]); //********WILL THIS WORK WITH THE JSON ARRAY
// 				console.log(scMax);
// 				var scRMax = (0.7* intv * maxes[locrm]);
// 				console.log(scRMax);
// 				pop =  scPop / (scMax + scRMax);
// 			}
// 			var sql = 'INSERT INTO density VALUES(NULL, $1, $2, $3, $4)';
// 				conn.query(sql, [rows[i][1], rows[i][2], rows[i][3], pop], function(error, result){
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
	var sql = 'SELECT location, population FROM density WHERE day=$1 AND time=$2 ORDER BY location ASC';
	conn.query(sql, [day, time], function(error, result){
		if (error) {
			response.status(500).type('html');
			console.log("no data??");
		}
		var currDens = result.rows;
		console.log(currDens); //check!
		console.log(currDens[0].population);
		// for (var i = 0; i <= currDens.length-1; i++) {
		// 	var currPOP = currDens[i].population;
		// 	var scCurrPOP = (currPOP * intv); //should console log these!
		// 	var scMax = (0.3 * maxes[i]);
		// 	var scRMax = (0.7* intv *rmaxes[i]);
		// 	currDens[i].population =  scCurrPOP / (scMax + scRMax); //should console long this too!

		// };
		response.json({densities: currDens});
	});
});

app.post('/predict/predict', function(request, response){
	var day = request.body.day;
	var t = request.body.t;  //tell client side that this be properly formatted!
	var loc = request.body.loc;

	var sql = 'SELECT location, population FROM density WHERE location=$1 AND day=$2 AND time=$3';
	conn.query(sql, [loc, day, t], function(error, result){
		if (error) {
			response.status(500).type('html');
			console.log("no data??");
		}
		var currDens = result.rows;
		response.json({densities: currDens});
	});
});

app.post('/home/updateDens', function(request, response){
	var loc = request.body.loc;
	console.log(loc);
	var rpDens = request.body.dens;
	console.log(rpDens);
	var day = strftime('%A').toUpperCase();
	var hour = parseInt(strftime('%l'));
	var pm = strftime('%p');
	var time = hour + ":00 " + pm;
	console.log(day);
	console.log(time);
	// var stDens;
	var sql = 'SELECT population FROM density WHERE location=$1 AND day=$2 AND time=$3';
	conn.query(sql, [loc, day, time], function(error, result){

		var stDens = result.rows[0].population;
		var newDens = rpDens*(0.3) + stDens*(0.7);

		console.log(stDens);
		console.log(newDens);

		var sql2 = 'UPDATE density SET population=$1 WHERE location=$2 AND day=$3 AND time=$4';
		conn.query(sql2, [newDens, loc, day, time], function(error, result){
			if (error) {
				console.log("oh no error!");
			}
		});
	});



});
