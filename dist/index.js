"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var express = require('express');

var apiClient = require('./yotpo-api/apiClient'); // const child_process = require('child_process'); 


require("babel-register");

require("babel-polyfill");

require("dotenv").config(); // const path = require('path')


var PORT = process.env.PORT || 5000;
var API_KEY = process.env.API_KEY;
var API_SECRET = process.env.API_SECRET;
var ACCESS_TOKEN = process.env.ACCESS_TOKEN;
var ACCESS_TOKEN_CREATED_AT = process.env.ACCESS_TOKEN_CREATED_AT;
var app = express(); // app.use(express.static(path.join(__dirname, 'public'))); 
// TODO: add logging + send logs over to destination we can access
// TODO: handle heroku timeout/memory exceeded errors
// TODO: handle heroku errors where free tier quota is exceeded 
// - https://devcenter.heroku.com/articles/free-dyno-hours#determining-your-free-dyno-hours
// TODO: yotpo handle rate limiting errors
// TODO: handle yotpo access token expired error 
// TODO: create ping endpoint that tests all necessary setup, env variables, and dependencies

app.use('/', function (_1, _2, next) {
  if (API_KEY == null || API_SECRET == null) {
    var err = new Error("Missing API_KEY and/or API_SECRET"); // TODO: add env var values here

    next(err);
    return;
  } // TODO: check our db for access token + generate access token if not exist or EXPIRED


  next();
});
app.get('/get-all-yotpo-reviews', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    var accessToken, data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            accessToken = ACCESS_TOKEN; // var accessTokenCreatedAt = ACCESS_TOKEN_CREATED_AT;
            // Check if access token has expired (older than 14 days)
            // var two_weeks_ago_utc_ms = Math.floor(new Date(new Date().getTime() - (14 * 24 * 60 * 60 * 1000)).getTime() / 100);
            // var accessTokenExpired = accessTokenCreatedAt ? two_weeks_ago_utc_ms >=  accessTokenCreatedAt : true; 
            // Create access token if invalid

            if (!(ACCESS_TOKEN == null)) {
              _context.next = 6;
              break;
            }

            _context.next = 5;
            return apiClient.fetchAccessToken(API_KEY, API_SECRET);

          case 5:
            accessToken = _context.sent;

          case 6:
            _context.next = 8;
            return apiClient.fetchAllReviews(API_KEY, accessToken, {});

          case 8:
            data = _context.sent;
            res.status(200).send(data);
            _context.next = 15;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 12]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
app.use(function (err, _, res) {
  res.status(500).send(err.message);
});
app.listen(PORT, function () {
  return console.log("Listening on ".concat(PORT));
});