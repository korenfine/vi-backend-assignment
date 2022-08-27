import { Router } from 'express'
import { VIService } from '../'

export default ({ Actor }: VIService) => {
    const router = Router()

    router.get('/moviesPerActor', Actor.getMoviesPerActor)

    router.get('/actorsWithMultipleCharacters', Actor.getActorsWithMultipleCharacters)

    return router
}
