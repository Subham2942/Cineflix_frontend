import type { Movie, SearchResult } from "../types";

type MovieResultsProps = {
  searchResults: SearchResult[] | null;
  movies: Movie[];
  isLoading: boolean;
};

function SearchLoader() {
  return (
    <section
      className="movie-list movie-list--loading"
      aria-label="Searching for movies"
      aria-busy="true"
    >
      <div className="movie-loader" role="status">
        <span className="movie-loader-reel" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
        <div>
          <strong>Finding your next watch</strong>
          <p>Comparing your description with the movie catalog…</p>
        </div>
      </div>

      {[0, 1, 2].map((item) => (
        <div className="movie-skeleton" aria-hidden="true" key={item}>
          <span className="movie-skeleton-number" />
          <div>
            <span className="movie-skeleton-title" />
            <span className="movie-skeleton-line" />
            <span className="movie-skeleton-line movie-skeleton-line--short" />
          </div>
        </div>
      ))}
    </section>
  );
}

function MovieResults({ searchResults, movies, isLoading }: MovieResultsProps) {
  if (isLoading) {
    return <SearchLoader />;
  }

  if (searchResults && searchResults.length !== 0) {

    return (
      <section className="movie-list" aria-label="Search results">
        {searchResults.map((movie, index) => (
          <article className="movie-row" key={movie.id}>
            <span className="movie-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h2>{movie.metadata?.name ?? "Untitled movie"}</h2>
              <p>{movie.text}</p>
            </div>
          </article>
        ))}
      </section>
    );
  }

  if (movies.length === 0) {
    return <p className="empty-results">No movies available.</p>;
  }

  return (
    <section className="movie-list" aria-label="Movies">
      {movies.map((movie, index) => (
        <article className="movie-row" key={movie.name}>
          <span className="movie-number">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h2>{movie.name}</h2>
            <p>{movie.description}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

export default MovieResults;
gi