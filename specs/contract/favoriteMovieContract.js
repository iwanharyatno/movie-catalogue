const itActsAsFavoriteMovieModel = (favoriteMovie) => {
  it('should return the movie that has been added', async () => {
    await favoriteMovie.putMovie({ id: 1 });
    await favoriteMovie.putMovie({ id: 2 });

    expect(await favoriteMovie.getMovie(1))
      .toEqual({ id: 1 });
    expect(await favoriteMovie.getMovie(2))
      .toEqual({ id: 2 });
    expect(await favoriteMovie.getMovie(3))
      .toEqual(undefined);
  });

  it('should refuse add a movie if it does not have the correct property', async () => {
    await favoriteMovie.putMovie({ someProperty: 'some value' });

    expect(await favoriteMovie.getAllMovies())
      .toEqual([]);
  });

  it('can return all of the movies that have been added', async () => {
    await favoriteMovie.putMovie({ id: 1 });
    await favoriteMovie.putMovie({ id: 2 });

    expect(await favoriteMovie.getAllMovies())
      .toEqual([
        { id: 1 },
        { id: 2 },
      ]);
  });

  it('should be able to remove a favorite movie', async () => {
    await favoriteMovie.putMovie({ id: 1 });
    await favoriteMovie.putMovie({ id: 2 });
    await favoriteMovie.putMovie({ id: 3 });

    await favoriteMovie.deleteMovie(1);

    expect(await favoriteMovie.getAllMovies())
      .toEqual([
        { id: 2 },
        { id: 3 },
      ]);
  });

  it('should handle a request to remove a movie even though the movie has not been added', async () => {
    await favoriteMovie.putMovie({ id: 1 });
    await favoriteMovie.putMovie({ id: 2 });

    await favoriteMovie.deleteMovie(3);

    expect(await favoriteMovie.getAllMovies())
      .toEqual([
        { id: 1 },
        { id: 2 },
      ]);
  });

  it('should be able to search for movies', async () => {
    favoriteMovie.putMovie({ id: 1, title: 'film a' });
    favoriteMovie.putMovie({ id: 2, title: 'film b' });
    favoriteMovie.putMovie({ id: 3, title: 'film abc' });
    favoriteMovie.putMovie({ id: 4, title: 'ini mah film abcd' });

    expect(await favoriteMovie.searchMovie('film a')).toEqual([
      { id: 1, title: 'film a' },
      { id: 3, title: 'film abc' },
      { id: 4, title: 'ini mah film abcd' },
    ]);
  });
};

// eslint-disable-next-line import/prefer-default-export
export { itActsAsFavoriteMovieModel };
