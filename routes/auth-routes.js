const router = require('express').Router();
const passport = require('passport');
const path = require('path');

router.get('/google', passport.authenticate('google', {
	hd: 'brown.edu',
    prompt: 'select_account',
    scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.profile.emails.read'
    ]

}));


router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
	res.redirect('/profile/');
});

module.exports = router;
