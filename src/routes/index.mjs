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
		// return http status 200 because we have status property in res.body according to requirements
		// usually we want to send non-successful http code in case of error (e.g. 400 or 500 instead of 200)
		const message = `Failed to process the request. Reason: ${err.message}`;
		res.status(200).json(getErrorResponse(message));
	});

	return router;
}

export default createRoutes;
