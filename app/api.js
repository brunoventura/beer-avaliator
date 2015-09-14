'use strict';

var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var app = express();

var mongoUrl = 'mongodb://localhost:27017/brejas-crawler';

app.get('/beer', function (req, res) {
	MongoClient.connect(mongoUrl, function(err, db) {
        var collection = db.collection('brejas');
		collection.count(function(err, count) {
			var random = Math.round(Math.random() * (10 -1));
			console.log(random);
	        collection.find().limit(1).skip(random).next(function(err, result) {
	            res.json(result);
	            db.close();
	        });
		});
    });
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});