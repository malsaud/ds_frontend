const router = require('express').Router();
const passport = require('passport');
const path = require('path');


router.get('/login', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'login.html'));
});

router.get('/logout', (req, res) => {
	res.send('logging out');
});
//HERE added email
router.get('/google', passport.authenticate('google', {
	hd: 'brown.edu',
    prompt: 'select_account',
    scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.profile.emails.read'
    ]

	//scope: ['profile', 'email']
}));


router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
	res.redirect('/profile/');
});

module.exports = router;