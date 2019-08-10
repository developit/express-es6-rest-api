import fs from 'fs';
import { log } from './lib/util';

// readFileSync function must use __dirname get current directory
// require use ./ refer to current directory.

let httpsOptions = {};
try {
    var sourceDir = `${__dirname}/../configuration/`;
    log.info(`loading https key and cert files from ${sourceDir}`);
    httpsOptions = {
        key: fs.readFileSync(`${sourceDir}server.key`, 'utf8'),
        cert: fs.readFileSync(`${sourceDir}server.cert`, 'utf8')
    };    
} catch (error){
    log.debug('https key and certificate not found in directory below ' + __dirname);
}

export default httpsOptions;