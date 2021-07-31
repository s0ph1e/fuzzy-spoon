import express from "express";
import request from 'supertest';
import createRoutes from "../src/routes/index.mjs";

const app = express();
const routes = createRoutes({recordsService: null});
app.use('/', routes);

describe('Testing / route', () => {

	describe('Validation errors', () => {
		it("POST / with wrong startDate, endDate formats - should return error", async () => {
			const { body } = await request(app)
				.post('/')
				.set('Content-type', 'application/json')
				.send({
					startDate: 'wrong date',
					endDate: 'another wrong date'
				});

			expect(body).toEqual({
				code: 1,
				msg: 'Failed to process the request. Reason: request.body.startDate should match format "date", request.body.endDate should match format "date"',
			});
		});

		it("POST / with wrong minCount, maxCount formats - should return error", async () => {
			const { body } = await request(app)
				.post('/')
				.set('Content-type', 'application/json')
				.send({
					minCount: 'wrong count',
					maxCount: 'another wrong count',
				});

			expect(body).toEqual({
				code: 1,
				msg: 'Failed to process the request. Reason: request.body.minCount should be number, request.body.maxCount should be number',
			});
		});

		xit("POST / with wrong startDate > endDate - should return error", async () => {
			const { body } = await request(app)
				.post('/')
				.set('Content-type', 'application/json')
				.send({
					startDate: '2021-07-31',
					endDate: '2020-01-01',
				});

			expect(body).toEqual({
				code: 1,
				msg: 'Failed to process the request. Reason: request.body.minCount should be number, request.body.maxCount should be number',
			});
		});
	});

});

