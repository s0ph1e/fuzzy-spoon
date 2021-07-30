import express from 'express';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

const config = dotenv.config()?.parsed;


const app = express();

app.post('/', (req, res) => {
	res.json({success: true});
});

const port = config?.PORT ?? 3000;
app.listen(port, () => {
	console.log(`App is listening on port ${port}`);
});
