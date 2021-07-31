import express from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import {getErrorResponse, getSuccessResponse} from './responseUtil.mjs';

function createRoutes({recordsService}) {
	const router = express.Router();
	router.use(express.json());

	/*
	 * I've used openapi to validate request body
	 * I assumed all filters (startDate, endDate, minCount, maxCount) are optional
	 * If we want to make all of them required - we just need to uncomment 'required' in schema
	 */
	router.use(
		OpenApiValidator.middleware({
			apiSpec: './src/specs/openapi.yml',
			validateRequests: true
		})
	);

	router.post('/', async (req, res, next) => {
		const filters = req.body;
		try {
			const records = await recordsService.getRecords({filters});
			res.json(getSuccessResponse({records}));
		} catch (err) {
			next(err);
		}
	});

	router.use((err, req, res, next) => {
		res.status(err.status || 500).json(getErrorResponse(err));
	});

	return router;
}

export default createRoutes;
