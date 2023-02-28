DROP TABLE IF EXISTS favMovies;

CREATE TABLE IF NOT EXISTS favMovies(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    releaseDate DATE,
    posterPath VARCHAR(500),
    overview VARCHAR(10000)
);