import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import user from './user';
import createPaymentIntent from './createPaymentIntent';
import mock from './mock';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));
	// User API
	api.use('/user/pay', createPaymentIntent({config, db}));
	api.use('/user', user({config, db}));
	// Mock API
	api.use('/mock', mock({config, db}));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
