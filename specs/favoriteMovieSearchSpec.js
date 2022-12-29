import FavoriteMovieSearchPresenter from '../src/scripts/views/pages/liked-movies/favorite-movie-search-presenter';
import FavoriteMovieIdb from '../src/scripts/data/favorite-movie-idb';
import FavoriteMovieSearchView from '../src/scripts/views/pages/liked-movies/favorite-movie-search-view';

describe('searching a movie', () => {
  let presenter;
  let favoriteMovies;
  let view;

  const searchMovie = (query) => {
    const queryElement = document.querySelector('#query');
    queryElement.value = query;
    queryElement.dispatchEvent(new Event('change'));
  };

  const setMovieSearchContainer = () => {
    view = new FavoriteMovieSearchView();
    document.body.innerHTML = view.getTemplate();
  };

  const constructPresenter = () => {
    favoriteMovies = spyOnAllFunctions(FavoriteMovieIdb);
    presenter = new FavoriteMovieSearchPresenter({ favoriteMovies, view });
  };

  beforeEach(() => {
    setMovieSearchContainer();
    constructPresenter();
  });

  describe('when query is not empty', () => {
    it('should be able to capture the query typed by the user', () => {
      searchMovie('film a');

      expect(presenter.latestQuery)
        .toEqual('film a');
    });

    it('should ask the model to search the liked movies', () => {
      searchMovie('film a');

      expect(favoriteMovies.searchMovie)
        .toHaveBeenCalledWith('film a');
    });

    it('should show the movies found by Favorite Movies', (done) => {
      document.getElementById('movies')
        .addEventListener('movies:updated', () => {
          expect(document.querySelectorAll('.movie-item').length).toEqual(3);
          done();
        });

      favoriteMovies.searchMovie.withArgs('film a').and.returnValues([
        { id: 111, title: 'film abc' },
        { id: 222, title: 'ada juga film abcde' },
        { id: 333, title: 'ini juga boleh film a' },
      ]);

      searchMovie('film a');
    });

    it('should show the name of the movies found by Favorite Movies', (done) => {
      document.getElementById('movies')
        .addEventListener('movies:updated', () => {
          expect(document.querySelectorAll('.movie__title').item(0).textContent).toEqual('film abc');
          expect(document.querySelectorAll('.movie__title').item(1).textContent).toEqual('ada juga film abcde');
          expect(document.querySelectorAll('.movie__title').item(2).textContent).toEqual('ini juga boleh film a');
          done();
        });

      favoriteMovies.searchMovie.withArgs('film a').and.returnValues([
        { id: 111, title: 'film abc' },
        { id: 222, title: 'ada juga film abcde' },
        { id: 333, title: 'ini juga boleh film a' },
      ]);

      searchMovie('film a');
    });

    it('should show - if the name of the movie returned does not have title', (done) => {
      document.getElementById('movies')
        .addEventListener('movies:updated', () => {
          const movieTitles = document.querySelectorAll('.movie__title');
          expect(movieTitles.item(0).textContent).toEqual('-');

          done();
        });

      favoriteMovies.searchMovie.withArgs('film a').and.returnValues([
        { id: 444 },
      ]);

      searchMovie('film a');
    });
  });

  describe('when query is empty', () => {
    it('should capture the query as empty', () => {
      searchMovie(' ');
      expect(presenter.latestQuery.length).toEqual(0);

      searchMovie('    ');
      expect(presenter.latestQuery.length).toEqual(0);

      searchMovie('');
      expect(presenter.latestQuery.length).toEqual(0);

      searchMovie('\t');
      expect(presenter.latestQuery.length).toEqual(0);
    });

    it('should show all favorite movies', () => {
      searchMovie(' ');

      expect(favoriteMovies.getAllMovies).toHaveBeenCalled();
    });
  });

  describe('when no favorite movies found', () => {
    it('should show empty message', (done) => {
      document.getElementById('movies')
        .addEventListener('movies:updated', () => {
          expect(document.querySelectorAll('.movie-item__not__found').length).toEqual(1);
          done();
        });

      favoriteMovies.searchMovie.withArgs('film a').and.returnValues([]);

      searchMovie('film a');
    });

    it('should not show any movie', (done) => {
      document.getElementById('movies')
        .addEventListener('movies:updated', () => {
          expect(document.querySelectorAll('.movie-item').length).toEqual(0);
          done();
        });

      favoriteMovies.searchMovie.withArgs('film a').and.returnValues([]);

      searchMovie('film a');
    });
  });
});
