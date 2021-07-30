import assert from 'assert';

function validateFilters(filters) {

}

function createRecordsRoutes({app, recordsService} = {}) {
	assert(app, 'app should be provided to createRecordsRoutes');
	assert(recordsService, 'recordsService should be provided to createRecordsRoutes');

	app.post('/', async (req, res) => {
		const filters = req.body;

		const records = await recordsService.getRecords({filters});
		res.json({success: true, records});
	});
}

export default createRecordsRoutes;
