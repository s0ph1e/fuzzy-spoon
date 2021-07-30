import express from 'express';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import * as OpenApiValidator from 'express-openapi-validator';
import createRecordService from './services/recordsService.mjs';
import createRecordsRoutes from './routes/recordsRoutes.mjs';
import { getErrorResponse } from './routes/responseUtil.mjs';

const config = dotenv.config()?.parsed;

async function main() {
	const mongoClient = new MongoClient(config.MONGODB_CONNECTION_URL);
	await mongoClient.connect();
	const db = mongoClient.db();

	const recordsService = createRecordService({db});

	const app = express();
	app.use(express.json());
	app.use(
		OpenApiValidator.middleware({
			apiSpec: './specs/openapi.yml',
			validateRequests: true
		}),
	);
	createRecordsRoutes({app, recordsService});

	app.use((err, req, res, next) => {
		// return http status 200 because we have status in res.body according to requirements
		// usually we want to send non-successful http code in case of error (e.g. 400 or 500 instead of 200)
		const message = `Failed to process the request. Reason: ${err.message}`;
		res.status(200).json(getErrorResponse(message));
	});

	const port = config?.PORT ?? 3000;
	app.listen(port, () => console.log(`App is listening on port ${port}`));
}

main().catch((err) => {
	console.error('App start failed', err);
});


