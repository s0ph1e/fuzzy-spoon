import assert from 'assert';
import { getSuccessResponse } from './responseUtil.mjs';

function createRecordsRoutes({app, recordsService} = {}) {
	assert(app, 'app should be provided to createRecordsRoutes');
	assert(recordsService, 'recordsService should be provided to createRecordsRoutes');

	app.post('/', async (req, res, next) => {
		const filters = req.body;
		try {
			const records = await recordsService.getRecords({filters});
			res.json(getSuccessResponse({records}));
		} catch (err) {
			next(err);
		}
	});
}

export default createRecordsRoutes;
