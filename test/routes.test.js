import express from 'express';
import request from 'supertest';
import mockgo from 'mockgo';
import createRoutes from '../src/routes/index.mjs';
import createRecordService from '../src/services/recordsService.mjs';

const app = express();
const db = await mockgo.getConnection();
const routes = createRoutes({recordsService: createRecordService({db})});
app.use('/', routes);

describe('Testing / route', () => {
	beforeAll(async () => {
		await db.collection('records').insertMany([
			{
				key:'ektIqjpb',
				value:'gAzGrAxHsyGP',
				createdAt: new Date('2015-06-03'),
				counts: [711, 758, 743, 389, 349, 291]
			},
			{
				key:'knsjfkjfre',
				value:'nkJKnKnmmjgyhfgc',
				createdAt: new Date('2020-07-08'),
				counts: [6, 18, 55]
			},
			{
				key:'mdkrmdwmke',
				value:'lmknPIOJKrfct',
				createdAt: new Date('2020-11-08'),
				counts: [227, 145]
			}
		]);
	});
	afterAll(() => mockgo.shutDown())

	describe('Validation errors', () => {
		it('POST / with wrong startDate, endDate formats - should return error', async () => {
			const { body } = await request(app)
				.post('/')
				.set('Content-type', 'application/json')
				.send({
					startDate: 'wrong date',
					endDate: 'another wrong date'
				});

			expect(body).toEqual({
				code: 2,
				msg: 'request.body.startDate should match format "date", request.body.endDate should match format "date"',
			});
		});

		it('POST / with wrong minCount, maxCount formats - should return error', async () => {
			const { body } = await request(app)
				.post('/')
				.set('Content-type', 'application/json')
				.send({
					minCount: 'wrong count',
					maxCount: 'another wrong count',
				});

			expect(body).toEqual({
				code: 2,
				msg: 'request.body.minCount should be number, request.body.maxCount should be number',
			});
		});

		it('POST / with startDate > endDate - should return error', async () => {
			const { body } = await request(app)
				.post('/')
				.set('Content-type', 'application/json')
				.send({
					startDate: '2021-07-31',
					endDate: '2020-01-01',
				});

			expect(body).toEqual({
				code: 3,
				msg: 'startDate should be less than endDate',
			});
		});

		it('POST / with wrong minCount > maxCount - should return error', async () => {
			const { body } = await request(app)
				.post('/')
				.set('Content-type', 'application/json')
				.send({
					minCount: 100,
					maxCount: 2,
				});

			expect(body).toEqual({
				code: 4,
				msg: 'minCount should be less that maxCount',
			});
		});
	});

	describe('Happy path - return records list', () => {
		it('POST / without filters - return all records', async () => {
			const { body } = await request(app)
				.post('/')
				.set('Content-type', 'application/json')
				.send({});

			expect(body).toEqual({
				code: 0,
				msg: 'success',
				records: [
					{
						createdAt: '2015-06-03T00:00:00.000Z',
						key: 'ektIqjpb',
						totalCount: 3241
					},
					{
						createdAt: '2020-07-08T00:00:00.000Z',
						key: 'knsjfkjfre',
						totalCount: 79
					},
					{
						createdAt: '2020-11-08T00:00:00.000Z',
						key: 'mdkrmdwmke',
						totalCount: 372
					}
				]
			});
		});

		it('POST / with all filters - return filtered records', async () => {
			const { body } = await request(app)
				.post('/')
				.set('Content-type', 'application/json')
				.send({
					startDate: '2020-01-01',
					endDate: '2021-01-01',
					minCount: 0,
					maxCount: 100
				});

			expect(body).toEqual({
				code: 0,
				msg: 'success',
				records: [
					{
						createdAt: '2020-07-08T00:00:00.000Z',
						key: 'knsjfkjfre',
						totalCount: 79
					}
				]
			});
		});
	});
});

