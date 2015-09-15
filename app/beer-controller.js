'use strict';

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var url; 
var collectionName = "brejas";

var singleton = function(mongoUrl) {
	url = mongoUrl;
	validateConfig();
	
	return singleton;
};

function validateConfig() {
	if (!url) throw new Error("Can't use this until properly initalized");
}

function connect(callback) {
	validateConfig();

	MongoClient.connect(url, function(err, db) {
		if(err) throw err;

		var collection = db.collection(collectionName);
		callback(db, collection);
	});
}

function find(id, callback) {
	connect(function(db, collection) {
		collection.findOne({_id: ObjectID(id)}, function(err, result) {
			if(err) throw err;

	        console.log(result);
	        if (callback) {
		        callback(result);
	        };
	        db.close();
	    });
	});
};

function save(data, callback) {
	connect(function(db, collection) {
		collection.update(
			{ nome: data.nome },
			{ $set: data },
			{ upsert: true }, 
			function(err, result) {
		        if(err) throw err;

		        if (callback) {
			        callback(result);
		        };
		        db.close();   
			}
		);
	});
};

function clean(callback) {
	connect(function(db, collection) {
		collection.remove({}, function(err, result) {
			if(err) throw err;

	        console.log("Brejas cleared");
	        if (callback) {
		        callback(result);
	        };
	        db.close();
	    });
	});
};

function count(callback) {
	connect(function(db, collection) {
		collection.count(function(err, result) {
			if(err) throw err;

	        if (callback) {
		        callback(result);
	        };
	        db.close();
	    });
	});
};

function random(callback) {
	count(function(count) {
		var random = Math.round(Math.random() * (count -1));
		connect(function(db, collection) {
			collection.find().limit(1).skip(random).next(function(err, result) {
    			if(err) throw err;

		        console.log("Got a random beer!!!");
		        if (callback) {
			        callback(result);
		        };
		        db.close();
        	});
		});
	});
};

function vote(vote, callback) {
	connect(function(db, collection) {
		collection.update(
			{_id: ObjectID(vote.id)}, 
			{ $inc: (vote.vote === "up"? {"votes.up": 1}: {"votes.down": 1})},
			null,
			function(err, result) {
				if(err) throw err;

		        if (callback) {
			        callback(result);
		        };
		        db.close();
			}
	    );
	});
};

module.exports = singleton;
module.exports.save = save;
module.exports.clean = clean;
module.exports.count = count;
module.exports.random = random;
module.exports.vote = vote;
module.exports.find = find;