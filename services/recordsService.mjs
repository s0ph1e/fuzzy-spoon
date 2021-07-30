import assert from 'assert';

const COLLECTION_NAME = 'records';

function getRecordsFromDb({db, filters = {}} = {}) {
	/*
	 If we have large amount of records - .toArray() is not an optimal solution
	 because it may create performance problems
	 For large amount of data better to use stream and pipe it to response
	 */
	return db.collection(COLLECTION_NAME).find(filters).toArray();
}

function createRecordService({db} = {}) {
	assert(db, 'DB should be provided to createRecordService');

	return {
		getRecords: ({filters}) => getRecordsFromDb({db, filters})
	}
}

export default createRecordService;
