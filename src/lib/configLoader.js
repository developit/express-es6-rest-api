'use strict';

import config from '../../configuration/config.json';

export default () => {
    config.environment = process.env.NODE_ENV || config.environment;
    config.port = process.env.PORT || config.port;
    config.logLevel = process.env.LOG_LEVEL || config.logLevel;

    return config;
}