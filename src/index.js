const express = require('express');
const apiClient = require('./yotpo-api/apiClient'); 
require("babel-register");
require("babel-polyfill");
require("dotenv").config(); 
// const path = require('path')
const PORT = process.env.PORT || 5000;

const API_KEY = process.env.API_KEY; 
const API_SECRET = process.env.API_SECRET;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN; 

var app = express(); 

// app.use(express.static(path.join(__dirname, 'public'))); 

// TODO: add logging + send logs over to destination we can access
// TODO: handle heroku timeout errors
// TODO: handle heroku errors where free tier quota is exceeded
// TODO: yotpo handle rate limiting errors
// TODO: create ping endpoint that tests all necessary setup, env variables, and dependencies

app.use('/', function(_1, _2, next) { 
  if (API_KEY == null || API_SECRET == null) { 
    let err = new Error("Missing API_KEY and/or API_SECRET"); // TODO: add env var values here
    next(err); 
    return 
  }
  // TODO: check our db for access token + generate access token if not exist or EXPIRED

  next(); 
});

app.get('/get-all-yotpo-reviews', async function(req, res, next){ 
  try { 
    var accessToken = ACCESS_TOKEN; 
    if (ACCESS_TOKEN == null) { 
      accessToken = await apiClient.fetchAccessToken(API_KEY, API_SECRET);
      process.env['ACCESS_TOKEN'] = accessToken
    }

    const data = await apiClient.fetchAllReviews(API_KEY, accessToken, {}); 
    res.status(200).send(data);
  } catch (e) { 
    next(e); 
  }
});

app.use(function(err, _, res) { 
  res.status(500).send(err.message); 
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
