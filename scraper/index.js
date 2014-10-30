var request = require('request');
var async = require('async');
var flatten = require('flat');
var d3 = require('d3');

var uri = 'https://api.sfmoma.org/';
var paths = {
  artists: uri + 'collection/artists/',
  artworks: uri + 'collection/artworks/'
};

var auth = require('./auth.json');


getAPIObject(paths.artists + 'Robert_Arneson', function(err, obj) {
  async.map(obj.artworks, function(artwork, cb) {
    getAPIObject(paths.artworks + artwork.artwork_id, cb);
  }, function(err, works) {
    if (err) throw err;
    console.log(d3.csv.format(works.map(flatten)));
  });
});

function getAPIObject(path, cb) {
  request.get({ url: path, auth: auth, json: true }, function(err, res, body) {
    if (err) throw err;
    if (!body || !res.statusCode === 200) {
      throw new Error('bad request status');
    }
    cb(null, body);
  });
}
