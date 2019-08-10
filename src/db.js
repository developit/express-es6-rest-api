'use strict';

export default ({ config }, next) => {
	// connect to a database if needed, then pass it to callback:
	if (next) next();
};