'use strict';

const express = require('express');

const cors = require('cors');

const server = express();

const allData = require('./Movie Data/data.json');
// console.log(allData);

server.use(cors());

const axios = require('axios');
// explain this more:????
// roaa said that .secret not standered .env is standered to put it inside the host ?
require('dotenv').config();

const PORT = 3000;


function moviesStorge(id,title, posterPath,releaseDate, overview) {
    this.id = id;
    this.title = title;
    this.releaseDate = releaseDate;
    this.posterPath = posterPath;
    this.overview = overview;
}


const APIKey = process.env.APIKey;
console.log(APIKey)


server.get('/', homeHandler)
server.get('/favorite', favorite)
server.get('/trending', trending)
server.get('/search', search)
server.get('/upcoming', upComing)
server.get('/popular', popular)
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

function errorHandler(erorr, req, res) {
    const err = {
        status: 500,
        massage: erorr
    }
    res.status(500).send(err);
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
    catch (erorr) {
        errorHandler(error, req, res);
    }
}


function search(req, res) {
    try {


        const url = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&language=en-US&query=The&page=2`
        axios.get(url)
            .then((moviesSearch) => {
                // console.log(result);
                let mapSearch= moviesSearch.data.results.map((item) => {
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
                    return movieList ;
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



server.listen(PORT, () => {
    console.log(`listening on ${PORT} : I am ready`);
})