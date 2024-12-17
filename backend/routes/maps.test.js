const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const Map = require('../models/Map');
const mapsRouter = require('./maps');

const app = express();
app.use(express.json());
app.use(session({ secret: 'test', resave: false, saveUninitialized: true }));
app.use('/maps', mapsRouter);

describe('Maps API', () => {
    beforeAll(async () => {
        const url = `mongodb://127.0.0.1/maps_test_db`;
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    let testMap;
    let testUserId = new mongoose.Types.ObjectId();

    beforeEach(async () => {
        testMap = new Map({
            creatorId: testUserId,
            name: 'Test Map',
            description: 'Test Description',
            bubbles: [],
            connections: [],
            public: true,
        });
        await testMap.save();
    });

    afterEach(async () => {
        await Map.deleteMany({});
    });

    test('GET /maps should return all public maps', async () => {
        const res = await request(app).get('/maps');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].name).toBe('Test Map');
    });

    test('GET /maps/:id should return a map by ID', async () => {
        const res = await request(app).get(`/maps/${testMap._id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Test Map');
    });

    test('POST /maps should create a new map', async () => {
        const newMap = {
            name: 'New Map',
            description: 'New Description',
            bubbles: [],
            connections: [],
        };

        const agent = request.agent(app);
        await agent.post('/maps').send(newMap).expect(401);

        agent.jar.setCookie(`connect.sid=${testUserId}`);
        const res = await agent.post('/maps').send(newMap);
        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('New Map');
    });

    test('PUT /maps/:id should update a map', async () => {
        const updatedMap = {
            name: 'Updated Map',
            description: 'Updated Description',
        };

        const agent = request.agent(app);
        await agent.put(`/maps/${testMap._id}`).send(updatedMap).expect(401);

        agent.jar.setCookie(`connect.sid=${testUserId}`);
        const res = await agent.put(`/maps/${testMap._id}`).send(updatedMap);
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Updated Map');
    });

    test('DELETE /maps/:id should delete a map', async () => {
        const agent = request.agent(app);
        await agent.delete(`/maps/${testMap._id}`).expect(401);

        agent.jar.setCookie(`connect.sid=${testUserId}`);
        const res = await agent.delete(`/maps/${testMap._id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Map deleted successfully.');
    });
});