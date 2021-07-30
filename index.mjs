import express from 'express';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import createRecordService from './services/recordsService.mjs';

const config = dotenv.config()?.parsed;
const mongoClient = new MongoClient(config.MONGODB_CONNECTION_URL);

async function main() {
	await mongoClient.connect();
	const db = mongoClient.db();

	const recordsService = createRecordService({db});

	const app = express();

	app.post('/', async (req, res) => {
		const records = await recordsService.getRecords({});
		res.json({success: true, records});
	});

	const port = config?.PORT ?? 3000;
	app.listen(port, () => console.log(`App is listening on port ${port}`));
}

main().catch((err) => {
	console.error('App start failed', err);
});


