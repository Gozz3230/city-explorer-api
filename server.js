'use strict';

console.log('server works');

// require
const express = require('express');
require('dotenv').config();
const cors = require ('cors');

// data json to use
let data = require('./data/weather.json')

// creating express server
// app === my server
const app = express();

// middleware
app.use(cors());


// define server port
const PORT = process.env.PORT || 3002;

app.listen(PORT, ()=> console.log(`We are running ${PORT}!`));

//endpoints
// URL listed as a string ''/
// callback function that will handle request and respond

app.get('/', (request, response)=>{
  response.status(200).send('welcome to my server');
});

app.get('/weather', (request, response, next)=> {

  try {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let searchQuery = request.query.searchQuery;
    let foundQuery = data.find(city => city.city_name === searchQuery);
    if (foundQuery) {
      let cityWeather = foundQuery.data.map((date) => {
        return new Forecast(date);
      });
      response.status(200).send(cityWeather);
    } else {
      response.status(500).send('City not found');
    }

  } catch (error) {
    next(error);
  }
});

class Forecast {
  constructor(cityObj) {
    this.date = cityObj.datetime;
    this.description = cityObj.weather.description;
  }
}

// catch all endpoint- should live at the bottom
app.get('*', (request, response)=> {
  response.status(404).send('sorry, page not found');
});

// error handling - plug and play code from express docs
app.use((error, request,response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});





