class FavoriteMovieSearchPresenter {
  constructor({ favoriteMovies, view }) {
    this._favoriteMovies = favoriteMovies;
    this._view = view;
    this._listenToChangeInUserInput();
  }

  _listenToChangeInUserInput() {
    this._view.runWhenUserIsSearching((latestQuery) => {
      this._searchMovie(latestQuery);
    });
  }

  async _searchMovie(query) {
    this._latestQuery = query.trim();

    let foundMovies;
    if (this.latestQuery.length > 0) {
      foundMovies = await this._favoriteMovies.searchMovie(this._latestQuery);
    } else {
      foundMovies = await this._favoriteMovies.getAllMovies();
    }

    this._showFoundMovies(foundMovies);
  }

  _showFoundMovies(movies) {
    this._view.showFavoriteMovies(movies);
  }

  get latestQuery() {
    return this._latestQuery;
  }
}

export default FavoriteMovieSearchPresenter;
