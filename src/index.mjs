import express from 'express';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import createRecordService from './services/recordsService.mjs';
import createRoutes from './routes/index.mjs';

const config = dotenv.config()?.parsed;

async function main() {
	const mongoClient = new MongoClient(config.MONGODB_CONNECTION_URL);
	await mongoClient.connect();
	const db = mongoClient.db();

	const recordsService = createRecordService({db});

	const app = express();
	const routes = createRoutes({recordsService});
	app.use('/', routes);

	const port = config?.PORT ?? 3000;
	app.listen(port, () => console.log(`App is listening on port ${port}`));
}

main().catch((err) => {
	console.error('App start failed', err);
});


