'use strict';

const express = require('express');

const cors = require('cors');

const server = express();

const allData = require('./Movie Data/data.json');
// console.log(allData);

const axios = require('axios');
require('dotenv').config();
const pg = require('pg');

const client = new pg.Client(process.env.dbURL);
// console.log(client);
server.use(cors());
server.use(express.json());
const PORT = process.env.PORT || 3002 ;
const APIKey = process.env.APIKey;

function moviesStorge(id, title, posterPath, releaseDate, overview) {
    this.id = id;
    this.title = title;
    this.releaseDate = releaseDate;
    this.posterPath = posterPath;
    this.overview = overview;
}



server.get('/', homeHandler)
server.get('/favorite', favorite)
server.get('/trending', trending)
server.get('/search', search)
server.get('/upcoming', upComing)
server.get('/popular', popular)
server.get('/recommendations', recommendations)
server.get('/getMovies', getFavmoviesHandler)
server.get('/getMovieById/:id', getmovieId)
server.post('/addMovie', addFavmoviesHandler)
server.delete('/delete/:id', deleteFavMovie)
server.put('/update/:id', updateFavMovie)
server.get('*', defaultpages)
server.use(errorHandler)



function homeHandler(req, res) {
    res.send("Hello from the HOME route");
}

function favorite(req, res) {
    res.send("Welcome to Favorite Page");
}

// it's mean page doesn't exist 
function defaultpages(req, res) {
    res.status(404).send('"status": 404 page not found error!');
}

function recommendations(req, res) {
    try {


        const url = `https://api.themoviedb.org/3/movie/{movie_id}/recommendations?api_key=${APIKey}&language=en-US&page=1`;
        axios.get(url)
            .then((moviesList) => {
                // console.log(result);
                let mapResult = moviesList.data.results.map((item) => {
                    let eachMovie = new moviesStorge(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return eachMovie;
                })
                res.send(mapResult);
            })
            .catch((err) => {
                console.log("sorry", err);
                res.status(500).send(err);
            })
    }
    catch (erorr) {
        errorHandler(error, req, res);
    }
}


function trending(req, res) {
    try {


        const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKey}&language=en-US`;
        axios.get(url)
            .then((moviesList) => {
                // console.log(result);
                let mapResult = moviesList.data.results.map((item) => {
                    let eachMovie = new moviesStorge(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return eachMovie;
                })
                res.send(mapResult);
            })
            .catch((err) => {
                console.log("sorry", err);
                res.status(500).send(err);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }
}


function search(req, res) {
    try {


        const url = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&language=en-US&query=The&page=2`
        axios.get(url)
            .then((moviesSearch) => {
                // console.log(result);
                let mapSearch = moviesSearch.data.results.map((item) => {
                    let singleMovie = new moviesStorge(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return singleMovie;
                })
                res.send(mapSearch);
            })
            .catch((err) => {
                console.log("sorry", err);
                res.status(500).send(err);
            })
    }
    catch (erorr) {
        errorHandler(error, req, res);
    }
}

function upComing(req, res) {
    try {


        const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${APIKey}&language=en-US&page=1`
        axios.get(url)
            .then((moviesUpComing) => {
                // console.log(result);
                let mapUpComing = moviesUpComing.data.results.map((item) => {
                    let oncMovie = new moviesStorge(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return oncMovie;
                })
                res.send(mapUpComing);
            })
            .catch((err) => {
                console.log("sorry", err);
                res.status(500).send(err);
            })
    }
    catch (erorr) {
        errorHandler(error, req, res);
    }
}


function popular(req, res) {
    try {
        const url = `
        https://api.themoviedb.org/3/movie/popular?api_key=${APIKey}&language=en-US`
        axios.get(url)
            .then((popularMovies) => {
                // console.log(result);
                let mapPopular = popularMovies.data.results.map((item) => {
                    let movieList = new moviesStorge(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return movieList;
                })
                res.send(mapPopular);
            })
            .catch((err) => {
                console.log("sorry", err);
                res.status(500).send(err);
            })
    }
    catch (erorr) {
        errorHandler(error, req, res);
    }
}

function getFavmoviesHandler(req, res) {
    const sql = `SELECT * FROM favmovies`;
    client.query(sql)
        .then((data) => {
            res.send(data.rows);
        })
        .catch((err) => {
            errorHandler(err, req, res);
        })
}

function addFavmoviesHandler(req, res) {
    const moviedetails = req.body; //by default we cant see the body content
    console.log(moviedetails);

    const sql = `INSERT INTO favmovies (title, posterPath,releaseDate, overview, Comment) VALUES ($1,$2,$3,$4,$5) RETURNING *;`
    const values = [moviedetails.title, moviedetails.posterPath, moviedetails.releaseDate, moviedetails.overview, moviedetails.Comment];

    console.log(sql);

    client.query(sql, values)
        .then((data) => {
            res.send("your data was added !");
        })
        .catch((error) => {
            // console.log(error);
            errorHandler(error, req, res);
        });
}

function errorHandler(error, req, res) {
    const err = {
        status: 500,
        massage: error
    }
    res.status(500).send(err);
}


function deleteFavMovie(req, res) {
    const id = req.params.id;
    const sql = `DELETE FROM favMovies WHERE id=${id}`;
    client.query(sql)
        .then((data) => {
            res.status(204).json({});
        })
        .catch((err) => {
            errorHandler(err, req, res);
        })
}


function updateFavMovie(req, res) {
    const id = req.params.id;
    console.log(id);
    console.log(req.body);
    const sql = `UPDATE favMovies SET title=$1 WHERE id=${id} RETURNING *`;
    const values = [req.body.title];
    client.query(sql, values)
        .then((data) => {
            res.status(200).send("data updated");
        })
        .catch((err) => {
            errorHandler(err, req, res);
        })
}

function getmovieId(req, res) {
    const id = req.params.id;
    const sql = `SELECT * FROM favMovies WHERE id=${id}`;
    client.query(sql)
        .then((data) => {
            res.status(200).send(data.rows);
        })
        .catch((err) => {
            errorHandler(err, req, res);
        })
}

client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`listening on ${PORT} : I am ready`);
        })
    })
    .catch((err) => {
        console.log("sorry", err);
        // res.status(500).send(err);
    })
