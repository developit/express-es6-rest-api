"use strict";

var User = require("./user.model");
import strava from "strava-v3";
function validationError(res, statusCode) {
	statusCode = statusCode || 422;
	return function(err) {
		res.status(statusCode).json(err);
	};
}

function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function(err) {
		res.status(statusCode).send(err);
	};
}

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
	return User.find({}, "-salt -password")
		.exec()
		.then(users => {
			res.status(200).json(users);
		})
		.catch(handleError(res));
};

/**
 * Creates a new user
 */
exports.create = function(req, res, next) {
	var newUser = new User(req.body);
	newUser.provider = "local";
	newUser.role = "user";
	newUser
		.save()
		.then(function(user) {
			console.log(user);
			// var token = jwt.sign(
			// 	{
			// 		_id: user._id
			// 	},
			// 	config.secrets.session,
			// 	{
			// 		expiresIn: 60 * 60 * 5
			// 	}
			// );
			// res.json({
			// 	token
			// });
		})
		.catch(validationError(res));
};

/**
 * Get a single user
 */
exports.show = function(req, res, next) {
	var userId = req.params.id;

	return User.findById(userId)
		.exec()
		.then(user => {
			if (!user) {
				return res.status(404).end();
			}
			//sample get only for recent activities
			var t = new Date();
			t.setDate(20);
			//list activities of the user
			strava.athlete.listActivities(
				{
					access_token: user.strava.accessToken,
					id: user.externalid,
					after: Math.floor(t.getTime() / 1000)
				},
				(err, payload, limits) => {
					if (!err) {
						res.json(payload);
					} else {
						console.error(err);
					}
				}
			);

			// res.json(user.profile);
		})
		.catch(err => next(err));
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
	return User.findByIdAndRemove(req.params.id)
		.exec()
		.then(function() {
			res.status(204).end();
		})
		.catch(handleError(res));
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
	var userId = req.user._id;
	var oldPass = String(req.body.oldPassword);
	var newPass = String(req.body.newPassword);

	return User.findById(userId)
		.exec()
		.then(user => {
			if (user.authenticate(oldPass)) {
				user.password = newPass;
				return user
					.save()
					.then(() => {
						res.status(204).end();
					})
					.catch(validationError(res));
			} else {
				return res.status(403).end();
			}
		});
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
	var userId = req.user._id;

	return User.findOne(
		{
			_id: userId
		},
		"-salt -password"
	)
		.exec()
		.then(user => {
			// don't ever give out the password or salt
			if (!user) {
				return res.status(401).end();
			}
			res.json(user);
		})
		.catch(err => next(err));
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
	res.redirect("/");
};
