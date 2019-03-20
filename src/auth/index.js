"use strict";

var express = require("express");
var config = require("./config");
var User = require("../api/user/user.model");
var router = express.Router();

// Passport Configuration
require("./strava/passport").setup(User, config);

router.use("/strava", require("./strava"));

module.exports = router;
