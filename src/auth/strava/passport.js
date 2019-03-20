const passport = require("passport");
const StravaStrategy = require("passport-strava-oauth2").Strategy;

exports.setup = function(User, config) {
	passport.use(
		new StravaStrategy(
			{
				clientID: config.strava.clientID,
				clientSecret: config.strava.clientSecret,
				callbackURL: config.strava.callbackURL
			},
			function(accessToken, refreshToken, profile, done) {
				User.findOne({
					externalid: profile.id
				})
					.exec()
					.then(user => {
						var responseData = {
							externalid: profile.id,
							name: profile.displayName,
							email: profile.emails[0].value,
							role: "user",
							username: profile._json.username,
							provider: "strava",
							strava: {
								profile: profile._json,
								accessToken: accessToken,
								refreshToken: refreshToken
							},
							photos: profile.photos
						};
						//existing user?
						if (user) {
							//merge with our copy
							user = user.set(responseData);
						} else {
							user = new User(responseData);
						}
						//save
						user
							.save()
							.then(user => done(null, user))
							.catch(err => done(err));
					})
					.catch(err => done(err));
			}
		)
	);
};
