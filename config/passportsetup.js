const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/usermodel');

//To keep information about user available during session.
passport.serializeUser((user, done) => {
	done(null, user.id);
});
passport.deserializeUser((id, done) => {
	User.findById(id).then((user) => {
		done(null, user);
	});
});


//Passport setup, callback and validation function. 
passport.use(
	new GoogleStrategy({
		callbackURL: '/auth/google/redirect',
		clientID: keys.google.clientID,
		clientSecret: keys.google.clientSecret,
	}, (token, tokenSecret, profile, done) => {
		if(profile._json.domain === "brown.edu"){
			User.findOne({googleId: profile.id}).then((currentUser) => {
				if(currentUser){
					console.log('curr' + currentUser);
					done(null, currentUser);
				} else{
					new User({
						username: profile.displayName,
						googleId: profile.id
					}).save().then((newUser) => {
						console.log('created' + newUser);
						done(null, newUser);
					});
				}
			});
		} else{
			done(new Error("Invalid host domain"));
		}
	})
)
