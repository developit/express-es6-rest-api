const mongoose = require("mongoose");

export default callback => {
	let connectionString = {
		uri:
			process.env.MONGODB_URI ||
			process.env.MONGOHQ_URL ||
			process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME ||
			"mongodb://192.168.99.101:32770/spotingify-dev"
	};
	// connect to a database if needed, then pass it to `callback`:
	callback(mongoose.connect(connectionString.uri, { useNewUrlParser: true }));
};
