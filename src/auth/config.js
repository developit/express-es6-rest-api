module.exports = {
	strava: {
		clientID: process.env.STRAVA_CLIENT_ID || 33601,
		clientSecret:
			process.env.STRAVA_CLIENT_SECRET ||
			"6412ca0859845494fa0bb5dacd229d37d709ad1e",
		callbackURL: (process.env.STRAVA_CALLBACK || "") + "/auth/strava/callback"
	}
};
