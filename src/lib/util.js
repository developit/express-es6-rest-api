'use strict';

import configLoader from './configLoader';

var config = configLoader();

/**	Creates a callback that proxies node callback style arguments to an Express Response object.
 *	@param {express.Response} res	Express HTTP Response
 *	@param {number} [status=200]	Status code to send on success
 *
 *	@example
 *		list(req, res) {
 *			collection.find({}, toRes(res));
 *		}
 */
export function toRes(res, status=200) {
	return (err, thing) => {
		if (err) return res.status(500).send(err);

		if (thing && typeof thing.toObject==='function') {
			thing = thing.toObject();
		}
		res.status(status).json(thing);
	};
}

export class testDemoClass {
	static isTrue(value){
		return value == true;
	}
}

export class log {
	static debug(msg){
		if (config.logLevel == "debug"){
			console.log("[DEBUG] ", msg);
		}
	}
	static info(msg){
		switch (config.logLevel){
			case "info":
			case "debug":
				console.log("[INFO] ", msg);
				break;
		}
	}
	static warning(msg){
		if (config.logLevel != "error"){
			console.warn("[WARNING] ", msg);
		}
	}
	static error(msg){
		console.error("[ERROR] ", msg);
	}
}