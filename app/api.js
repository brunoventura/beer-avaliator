'use strict';

var app = require('express')();
var bodyParser = require('body-parser')
var beerController = require('./beer-controller')('mongodb://localhost:27017/brejas-crawler');

app.use(bodyParser.json());

app.get('/api-v1/beer', function (req, res) {
	beerController.random(function(result) {
        res.json(result);
	});
});

app.post('/api-v1/beer/:id/vote', function (req, res) {
	var validVotes = ['up', 'down'];

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

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});