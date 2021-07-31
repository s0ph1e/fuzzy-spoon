import express from 'express';
import { MongoClient } from 'mongodb';
import createRecordService from './services/recordsService.mjs';
import createRoutes from './routes/index.mjs';
import config from './config.mjs';

async function main() {
	console.log('Staring app with config', config);

	const mongoClient = new MongoClient(config.MONGODB_CONNECTION_URL);
	await mongoClient.connect();
	const db = mongoClient.db();

	const recordsService = createRecordService({db});

	const app = express();
	const routes = createRoutes({recordsService});
	app.use('/', routes);

	const port = config.PORT;
	app.listen(port, () => console.log(`App is listening on port ${port}`));
}

main().catch((err) => {
	console.error('App start failed', err);
});


