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

app.listen(3000, () => {
	console.log("now 3000");
});