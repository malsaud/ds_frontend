const express = require('express');
const router = require('express').Router();
const path = require('path');
router.use(express.static("."));

const authCheck = (req, res, next) => {
	if(!req.user){
		res.redirect('/auth/login');
	} else{
		next();
	}

};



router.get('/', authCheck, (req, res) => {
	res.sendFile(path.join(__dirname,  '..', '/home.html'));
});

module.exports = router;