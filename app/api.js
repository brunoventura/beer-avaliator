'use strict';

var app = require('express')();
var bodyParser = require('body-parser')
var config = require('./config');
var beerController = require('./beer-controller')(config.mongo);

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api-v1/beer', function (req, res) {
	beerController.random(function(result) {
        res.json(result);
	});
});

app.get('/api-v1/beer/rank/', function (req, res) {
  beerController.rank(10, function(result) {
        res.json(result);
	});
});

app.post('/api-v1/beer/:id/vote', function (req, res) {
	var validVotes = ['like', 'dislike'];

  console.log(req);
	if(!req.body || !req.body.vote || validVotes.indexOf(req.body.vote) < 0)
		res.status(500).json({error: "Invalid Params"});
	var vote = {
		id: req.params.id,
		vote: req.body.vote
	};

	beerController.vote(vote, function(result) {
        res.json(result);
	});
});

var server = app.listen(8000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});
