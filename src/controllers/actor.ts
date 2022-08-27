import { Request, Response } from 'express'
import { movies, actors } from '../../dataForQuestions.js'
import axios from 'axios'

const BASE_URL = 'https://api.themoviedb.org/3/movie'
const API_KEY = 'ac505a02032a33d65dd28b41f72182e1'

export interface ActorService {
    getMoviesPerActor(req: Request, res: Response): void
    getActorsWithMultipleCharacters(req: Request, res: Response): void
}

export const ActorController = (): ActorService => {
    // get all movies cast for api
    const getMoviesCast = async () => {
        const promises = await Promise.all(Object.keys(movies)
            .map((key: string) =>
                axios.get(`${BASE_URL}/${(movies as any)[key]}/credits?api_key=${API_KEY}&language=en-US`)
            ))
        return promises.map((res: any) => res.data)
    }

    const getMoviesPerActor = async (req: Request, res: Response) => {
        const moviesDetails = await getMoviesCast()

        // change movies to [id:movie]
        const reverseMovies = Object.entries(movies).reduce((obj: any, entry: any) => ({ ...obj, [entry[1]]: entry[0]}), {})

        // build initial actor movies list
        const actorMovies: any = {}
        actors.forEach((actor) => { actorMovies[actor] = [] })

        // run over all movies cast and update actor movies
        moviesDetails.forEach((movie: any) => {
            movie.cast.forEach((actor: any) => {
                if (actorMovies.hasOwnProperty(actor.name)) {
                    actorMovies[actor.name].push(reverseMovies[movie.id.toString()])
                }
            })
        })

        res.send(actorMovies)
    }

    const getActorsWithMultipleCharacters = async (req: Request, res: Response) => {
        const moviesDetails = await getMoviesCast()

        // change movies to [id:movie]
        const reverseMovies = Object.entries(movies).reduce((obj: any, entry: any) => ({ ...obj, [entry[1]]: entry[0]}), {})

        // build initial actor movies list
        const actorMovies: any = {}
        actors.forEach((actor) => { actorMovies[actor] = [] })

        // run over all movies cast and update actor movies and character
        moviesDetails.forEach((movie: any) => {
            movie.cast.forEach((actor: any) => {
                if (actorMovies.hasOwnProperty(actor.name)) {
                    const character = actor.character
                        .replace('(uncredited)', '')
                        .replace(/[']/g, '"')
                        .trim()
                    if (!actorMovies[actor.name].find((item: any) => item.characterName === character)) {
                        actorMovies[actor.name].push({
                            movieName: reverseMovies[movie.id.toString()],
                            characterName: character
                        })
                    }
                }
            })
        })

        // get only the actors with multiple characters
        const actorMoviesWithMultiple = Object.keys(actorMovies).reduce((list: any, key) => {
            if (actorMovies[key].length >=2) {
                list[key] = actorMovies[key]
            }
            return list
        }, {})
        res.send(actorMoviesWithMultiple)
    }

    return { getMoviesPerActor, getActorsWithMultipleCharacters }
}
