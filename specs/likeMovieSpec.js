import FavoritMovieIdb from '../src/scripts/data/favorite-movie-idb';
import * as TestFactories from './helpers/testFactories'

describe('Liking a movie', () => {
    const addLikeButtonContainer = () => {
        document.body.innerHTML = '<div id="likeButtonContainer"></div>';
    };

    beforeEach(() => {
        addLikeButtonContainer();
    });

    it('should show the like button when the movie has not been liked before', async () => {
        await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

        expect(document.querySelector('[aria-label="like this movie"]')).toBeTruthy();
    });

    it('should not show the unlike button when the movie has not been liked before', async () => {
        await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

        expect(document.querySelector('[aria-label="unlike this movie"]')).toBeFalsy();
    });

    it('should be able to like the movie', () => async () => {
        await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

        document.getElementById('likeButton').dispatchEvent(new Event('click'));
        const movie = await FavoritMovieIdb.getMovie(1);
        expect(movie).toEqual({ id: 1 });

        await FavoritMovieIdb.deleteMovie(1);
    });

    it('should not add the movie again when its already liked', async () => {
        await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

        await FavoritMovieIdb.putMovie({ id: 1 });

        document.getElementById('likeButton').dispatchEvent(new Event('click'));
        expect(await FavoritMovieIdb.getAllMovies()).toEqual([{ id: 1 }]);

        await FavoritMovieIdb.deleteMovie(1);
    });

    it('should not add a movie when it has no id', async () => {
        await TestFactories.createLikeButtonPresenterWithMovie({});

        document.getElementById('likeButton').dispatchEvent(new Event('click'));

        expect(await FavoritMovieIdb.getAllMovies()).toEqual([]);
    });
});