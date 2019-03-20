"use strict";

var express = require("express");
var passport = require("passport");
// var auth = require("../auth.service");

var router = express.Router();

router.get(
	"/",
	passport.authenticate("strava", {
		scope: ["public"]
	})
);

router.get(
	"/callback",
	passport.authenticate("strava", {
		successRedirect: "/home",
		failureRedirect: "/login",
		session: false
	})
);

module.exports = router;
