import express from "express";
import request from 'supertest';
import createRoutes from "../src/routes/index.mjs";

const app = express();
const routes = createRoutes({recordsService: null});
app.use('/', routes);

describe('Testing route', () => {
	it("POST / - error", async () => {
		const { body } = await request(app).post('/').set('Content-type', 'application/json')
		expect(body).toEqual([
			{
				state: "NJ",
				capital: "Trenton",
				governor: "Phil Murphy",
			},
			{
				state: "CT",
				capital: "Hartford",
				governor: "Ned Lamont",
			},
			{
				state: "NY",
				capital: "Albany",
				governor: "Andrew Cuomo",
			},
		]);
	});
});

