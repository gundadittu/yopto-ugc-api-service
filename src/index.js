const express = require('express');
const apiClient = require('./yotpo-api/apiClient'); 
const child_process = require('child_process'); 
require("babel-register");
require("babel-polyfill");
require("dotenv").config(); 
// const path = require('path')
const PORT = process.env.PORT || 5000;

const API_KEY = process.env.API_KEY; 
const API_SECRET = process.env.API_SECRET;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const ACCESS_TOKEN_CREATED_AT = process.env.ACCESS_TOKEN_CREATED_AT; 

var app = express(); 

// app.use(express.static(path.join(__dirname, 'public'))); 

// TODO: add logging + send logs over to destination we can access
// TODO: handle heroku timeout/memory exceeded errors
// TODO: handle heroku errors where free tier quota is exceeded 
// - https://devcenter.heroku.com/articles/free-dyno-hours#determining-your-free-dyno-hours
// TODO: yotpo handle rate limiting errors
// TODO: handle yotpo access token expired error 
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
    var accessTokenCreatedAt = ACCESS_TOKEN_CREATED_AT;
    
    // Check if access token has expired (older than 14 days)
    var two_weeks_ago_utc_ms = Math.floor(new Date(new Date().getTime() - (14 * 24 * 60 * 60 * 1000)).getTime() / 100);
    var accessTokenExpired = accessTokenCreatedAt ? two_weeks_ago_utc_ms >=  accessTokenCreatedAt : true; 
    
    // Create access token if invalid
    if (ACCESS_TOKEN == null || accessTokenExpired == true) { 
      accessToken = await apiClient.fetchAccessToken(API_KEY, API_SECRET);
      // TODO: test below line

      // User Heroku CLI to save access token as env variable
      const cmd = "heroku config:set ACCESS_TOKEN=" + accessToken;
      child_process.exec(cmd); 
      
      // Use Heroku CLI to save time when access token was created as env variable
      accessTokenCreatedAt = Math.floor(new Date().getTime() / 1000); 
      const cmd2 = "heroku config:set ACCESS_TOKEN_CREATED_AT=" + accessTokenCreatedAt;
      child_process.exec(cmd2); 
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
