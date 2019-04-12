import {getFilmID, getMovieData, getMovies} from '../utils/getMoviesTask';
import MoviesDAO from '../daos/MoviesDAO';
import {MongoClient} from 'mongodb';

let mongoClient;
let db;

beforeAll(async () => {
    mongoClient = await MongoClient.connect(global.__MONGO_URI__, { useNewUrlParser: true });
    db = await mongoClient.db(global.__MONGO_DB_NAME__);
});

afterAll(async () => {
    await mongoClient.close();

});

test('getFilmID should return a non-empty array with filmID property in each element', async () => {
    const res = await getFilmID();
    expect(res).toBeDefined();
    expect(res instanceof Array).toBeTruthy();
    expect(res.length).toBeGreaterThan(0);

    //check filmID exists in each element.
    res.forEach(ele => {
        expect(ele).toHaveProperty('filmID');
    });
});

test('getMovieData should return a non-empty array with movie data', async () => {
    const arr = await getFilmID();
    
    const data = await getMovieData(arr.slice(0,5));
    //data should be a non-empty array
    expect(data.length).toBe(5);
    //All titles and film ID should be defined.
    data.forEach(ele => {
        expect(ele.title).toBeDefined();
        expect(ele.filmID).toBeDefined();
    });
});

test('getMovies should update & delete old movies', async () => {
    const moviesDAO = new MoviesDAO({mongoClient});
    //insert an old movie
    
    const m = await moviesDAO.insertOne({
    title: 'Example',
    filmID : 'ddd',
    overview: 'asdfadf',
    length: 123,
    teaser_uri: 'https://www',
    classing: 'fff',
    lastModified: new Date(new Date().setDate(new Date().getDate()-2)),
    });
    expect(m.result.ok).toBe(1);
    expect(await moviesDAO.findOld()).not.toBeNull();
    try{
        await getMovies(moviesDAO);
    }catch(e) {
        console.log(e);
    }
    //now all movies should be latest, so movies should be null
    const movCount = await moviesDAO.docCount();
    const movies = await moviesDAO.findOld();
    expect(movies).toBeNull();
});


