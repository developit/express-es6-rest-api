'use strict';

import api from './api';
import bodyParser from 'body-parser';
import configLoader from './lib/configLoader';
import cors from 'cors';
import express from 'express';
import http from 'http';
import https from 'https';
import httpsOptions from './httpsOptions';
import initializeDb from './db';
import { log } from './lib/util';
import middleware from './middleware';
import morgan from 'morgan';

var config = configLoader();

console.log(`server starting in ${config.environment} mode on port ${config.port}`);
console.log(`logging level set to '${config.logLevel}'`);

// self-signed certificates must be located in root directory
// otherwise regular http server will be created
let app = express();
if (httpsOptions.key && httpsOptions.cert){
	log.info('starting secure http server');
	app.server = https.createServer(httpsOptions, app);
} else {
	log.warning('starting unsecured http server');
	app.server = http.createServer(app);
}

/*
	this is a good time to set up a websocket server if needed.
 	websocket endpoint will be ws:// or wss:// depending on
	whether http or https server is used
	eg.
		import * as WebSocket from 'ws';
		var websocketServer = new WebSocket.Server({ app.server });
*/

// http requestlogger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

// initialize db connection and call runServer when ready
initializeDb({ config }, (db) => {
	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api', api({ config, db }));

	app.server.listen(config.port, () => {
		log.info(`server listening for connections`);
	});
});

// simple memory check
const checkMemoryUsage = () => {
    const usage = process.memoryUsage();
    usage.available = usage.heapTotal - usage.heapUsed;
    usage.difference = usage.available - lastAvailableMemory;
	lastAvailableMemory = usage.available;
	if (config.logLevel != "error") {
		// TODO detect trajectory to error and warn if necessary
	}
	log.debug(usage);
};

let lastAvailableMemory = 0;
if (config.logLevel == 'debug' && config.memoryCheckInterval > 0){
	log.info(`checking memory at intervals of ${config.memoryCheckInterval}ms`);
	setInterval(checkMemoryUsage, config.memoryCheckInterval);
}

export default app;
