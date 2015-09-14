'use strict';

var Promise = require('bluebird');
var request = require('request');
var requestGet = Promise.promisify(request.get);
var fs = require('fs');
var cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient;


console.log('runned');

var mongoUrl = 'mongodb://floripajs:floripajs123@ds029297.mongolab.com:29297/brejas';
var baseUrl = 'http://www.brejas.com.br';

var page = 1;
var pageMax = 1;
var itemsPerPage = 10;
var brejas = [];
var requestQueue = [];
console.time("crawler time");
while (true) {
    if (page > pageMax)
        break;

    page++;

    requestQueue.push(requestGet(baseUrl + '/cerveja?page=' + page).then(function(html) {
        var result = [];
        var $ = cheerio.load(html[1]);
        var items = $('.jrRow').not('.jrDataListHeader');

        items.each(function() {
            var breja = {};
            breja.nome = $(this).find('.jrContentTitle a').text();
            breja.url = baseUrl + $(this).find('.jrContentTitle a').attr('href');

            result.push(breja);
        });

        return result;
    }).map(function(breja) {  // This each is from bluebird, you cna use .map, but each is serial, and map is parallel
        return requestGet(breja.url).then(function(html) {
            var $ = cheerio.load(html[1]);
            breja.img = $('.jrListingMainImage img').attr('src');
            brejas.push(breja);
            console.log(brejas.length, breja.nome);
        });
    }, 10));
}

Promise.all(requestQueue).then(function() {
    console.timeEnd("crawler time");
    

    MongoClient.connect(url, function(err, db) {
        console.log("Connected correctly to server");
     
        var collection = db.collection('brejas');
        collection.insert(brejas, function(err, result) {
            console.log("Brejas inserted correctly");
            db.close();
        });
    });

});