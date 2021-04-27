"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchAllReviews = fetchAllReviews;
exports.fetchAccessToken = fetchAccessToken;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var axios = require('axios');

var yotpoHelpers = require('./helper');

function fetchAllReviews(_x, _x2) {
  return _fetchAllReviews.apply(this, arguments);
}

function _fetchAllReviews() {
  _fetchAllReviews = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(apiKey, accessToken) {
    var optionalSearchParams,
        url,
        res,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            optionalSearchParams = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            url = yotpoHelpers.constructRetrieveAllReviewsUrl(apiKey, accessToken, optionalSearchParams);
            _context.next = 4;
            return axios.get(url);

          case 4:
            res = _context.sent;
            return _context.abrupt("return", res["data"]);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _fetchAllReviews.apply(this, arguments);
}

function fetchAccessToken(_x3, _x4) {
  return _fetchAccessToken.apply(this, arguments);
}

function _fetchAccessToken() {
  _fetchAccessToken = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(apiKey, apiSecret) {
    var grantType,
        url,
        res,
        data,
        access_token,
        token_type,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            grantType = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : "client_credentials";
            url = 'https://api.yotpo.com/oauth/token';
            _context2.next = 4;
            return axios.get(url, {
              params: {
                "client_id": apiKey,
                "client_secret": apiSecret,
                "grant_type": grantType
              }
            });

          case 4:
            res = _context2.sent;
            data = res["data"];
            access_token = data ? data["access_token"] : null;
            token_type = data ? data["token_type"] : null; // TODO: throw error if access_token and token_type is null

            return _context2.abrupt("return", access_token);

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _fetchAccessToken.apply(this, arguments);
}