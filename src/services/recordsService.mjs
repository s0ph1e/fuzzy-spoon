import assert from 'assert';
import {InvalidMinCountError, InvalidStartDateError} from '../errors.js';

const COLLECTION_NAME = 'records';

function validateFilters({startDate, endDate, minCount, maxCount} = {}) {
	if (startDate && endDate && startDate >= endDate) {
		throw new InvalidStartDateError('startDate should be less than endDate');
	}
	if (minCount && maxCount && minCount >= maxCount) {
		throw new InvalidMinCountError('minCount should be less that maxCount');
	}
}

/*
In this function I assume that all filters are optional
If all of them (startDate, endDate, minCount, maxCount) are required - we can simplify the code
*/
function getAggregateSteps(filters) {
	const dateQuery = {};
	if (filters.startDate) {
		dateQuery.createdAt = dateQuery.createdAt || {};
		dateQuery.createdAt.$gt = new Date(filters.startDate);
	}
	if (filters.endDate) {
		dateQuery.createdAt = dateQuery.createdAt || {};
		dateQuery.createdAt.$lt = new Date(filters.endDate);
	}

	const countQuery = {};
	if (filters.minCount) {
		countQuery.totalCount = countQuery.totalCount || {};
		countQuery.totalCount.$gt = filters.minCount
	}
	if (filters.maxCount) {
		countQuery.totalCount = countQuery.totalCount || {};
		countQuery.totalCount.$lt = filters.maxCount
	}

	return [
		{$match: dateQuery},
		{$project: {
				_id: 0,
				key: 1,
				createdAt: 1,
				totalCount: {$sum: '$counts'}
			}},
		{$match: countQuery}
	];
}

function getRecordsFromDb({db, filters = {}} = {}) {
	validateFilters(filters);

	const aggregateStages = getAggregateSteps(filters)
	/*
	 If we have large amount of records - .toArray() may be not an optimal solution
	 because it may create performance problems
	 For large amount of data better to use stream and pipe it to response
	 */
	return db.collection(COLLECTION_NAME).aggregate(aggregateStages).toArray();
}

function createRecordService({db} = {}) {
	assert(db, 'DB should be provided to createRecordService');

	return {
		getRecords: ({filters}) => getRecordsFromDb({db, filters})
	}
}

export default createRecordService;
// we can export this functions to allow easy unit-testing
export {
	getAggregateSteps,
	validateFilters
}
