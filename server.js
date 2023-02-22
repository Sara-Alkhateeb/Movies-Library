'use strict';

const express = require('express');

const cors = require('cors');

const server = express();

const allData = require('./Movie Data/data.json');
// console.log(allData);

server.use(cors());

const PORT = 3000;


function ImportedData (title, posterPath, overview) {
    this.title = title;
    this.poster_path = posterPath;
    this.overview = overview;
  }



server.get('/',(req,res)=>{
    let formatedData =new ImportedData (allData.title, allData.poster_path,allData.overview);
    // console.log(ImportedData );
    res.send(formatedData );
})

server.get('/favorite',(req,res)=>{
    res.send("Welcome to Favorite Page");
})
// it's mean page doesn't exist 
server.get('*',(req,res)=>{
    res.status(404).send(
'"status": 404 page not found error!');
})

server.use((err, req, res) => {
    res.status(500).send('{"status": 500, "responseText": "Sorry, something went wrong" }');
  });

server.listen(PORT, () =>{
    console.log(`listening on ${PORT} : I am ready`);
})