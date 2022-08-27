import express from 'express'
import router from './router'

// controllers
import  { ActorController, ActorService } from './controllers/actor'

const app = express()
const port = 3000

// services
export interface VIService {
    Actor: ActorService,
}

const VI: VIService = {
    Actor: ActorController(),
}

app.use('/api', router(VI))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
