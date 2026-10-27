import { useEffect, useState } from "react";
import { FaMagnifyingGlass, FaWandMagicSparkles } from "react-icons/fa6";
import "./App.css";
import MovieResults from "./components/MovieResults";
import type { Movie, SearchResult } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);

  const searchByDescription = async () => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      setError("Enter a description to search for movies.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const query = new URLSearchParams({ userQuery: trimmedQuery });
      const response = await fetch(`${API_BASE_URL}/movies/search?${query}`);

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data: SearchResult[] = await response.json();
      setSearchResults(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not load movies"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function loadMovies() {
      try {
        const response = await fetch(`${API_BASE_URL}/movies`);

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const data: Movie[] = await response.json();
        setMovies(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Could not load movies"
        );
      }
    }

    loadMovies();
  }, []);

  const displayedMovieCount = searchResults && searchResults.length > 0
    ? searchResults.length
    : movies.length;
  const movieCountLabel = displayedMovieCount === 1 ? "movie" : "movies";
  const resultsSummary = isLoading
    ? "Searching the catalog…"
    : `${displayedMovieCount} ${movieCountLabel}`;

  return (
    <main className="catalog">
      <header className="catalog-header">
        <p className="catalog-eyebrow">Your next favorite film</p>
        <h1>CINEFLIX</h1>
        <p className="catalog-description">Find a story worth watching.</p>
      </header>

      {error && <p className="catalog-error">{error}</p>}

      <form
        className="movie-search"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          searchByDescription();
        }}
      >
        <FaWandMagicSparkles className="search-wand" aria-hidden="true" />
        <input
          type="search"
          aria-label="Search movies by description"
          placeholder="Search movie descriptions"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        <button type="submit" aria-label="Search movies" disabled={isLoading}>
          <FaMagnifyingGlass aria-hidden="true" />
          <span>Search</span>
        </button>
        <button type="button" aria-label="Reset search" onClick={() => {
          setSearchQuery("");
          setSearchResults([]);
        }}>
          Reset
        </button>
      </form>

      <p className="results-count" aria-live="polite">
        {resultsSummary}
      </p>

      <MovieResults
        searchResults={searchResults}
        movies={movies}
        isLoading={isLoading}
      />
    </main>
  );
}

export default App;
