import redis from 'redis';
const client = redis.createClient('redis://172.17.0.2:6379');

export default callback => {
	// connect to a database if needed, then pass it to `callback`:
	callback(client);
}
