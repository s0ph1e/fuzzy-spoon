import dotenv from 'dotenv';

const DEFAULT_PORT = 3000;
const DEFAULT_MONGODB_CONNECTION_URL = 'mongodb://localhost:27017';

dotenv.config();
const config = {
	PORT: process.env.PORT || DEFAULT_PORT,
	MONGODB_CONNECTION_URL: process.env.MONGODB_CONNECTION_URL || DEFAULT_MONGODB_CONNECTION_URL
};

export default config;
