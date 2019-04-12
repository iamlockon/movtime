import {getFilmID, removeOld} from '../utils/getPostersTask';

test('getFilmID should return filmID', async () => {
    const res = await getFilmID();
    console.log(res);
    expect(res.length).toBeGreaterThan(0);
    res.forEach(movie => {
        expect(movie.filmID).toBeDefined();
    });
});
test('removeOld should delete old files', async () => {
    const res = await getFilmID();
    expect(res.length).toBeGreaterThan(0);
    const mockremoveOld = jest.mock;
    //TODO: Create mock.
})
