"use strict";

var express = require("express");
var router = express.Router();
var controller = require("./user.controller");

router.get("/", controller.index);
router.delete("/:id", controller.destroy);
router.get("/me", controller.me);
router.put("/:id/password", controller.changePassword);
router.get("/:id", controller.show);
router.post("/", controller.create);

module.exports = router;
