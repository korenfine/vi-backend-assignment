import router from '../'
import supertest from 'supertest'
import express from 'express'

// controllers
import  { ActorController } from '../../controllers/actor'

const VI = {
    Actor: ActorController(),
}

const app = express()
app.use('/', router(VI))
const request = supertest(app)

describe('Test routers', function () {
    test('check /moviesPerActor', async () => {
        const res = await request.get('/moviesPerActor')
        expect(Object.keys(res.body).length).toBeGreaterThan(0);
    });

    test('check /actorsWithMultipleCharacters', async () => {
        const res = await request.get('/actorsWithMultipleCharacters')
        expect(Object.keys(res.body).length).toBeGreaterThan(0);
    });
});
