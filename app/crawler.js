'use strict';

var Promise = require('bluebird');
var request = require('request');
var requestGet = Promise.promisify(request.get);
var fs = require('fs');
var cheerio = require('cheerio');
var config = require('./config');
var beerController = require('./beer-controller')(config.mongo);

console.log('Crawling!');

var baseUrl = 'http://www.brejas.com.br';
var page = 1;
var pageMax = 5;
var requestQueue = [];
var crawlerResult = {
    read: 0,
    updated: 0,
    inserted: 0
};

console.time("Crawler time");
while (true) {
    if (page > pageMax)
        break;

    page++;

    requestQueue.push(requestGet(baseUrl + '/cerveja?order=rhits&page=' + page)
        .then(function(html) {
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
        })
        .map(function(breja) {  // This each is from bluebird, you cna use .map, but each is serial, and map is parallel
            return requestGet(breja.url).then(function(html) {
                var $ = cheerio.load(html[1]);
                breja.img = $('meta[property="og:image"]').attr("content");
                breja.estilo = $('.jrEstilo > .jrFieldValue a:first-child').text();
                beerController.save(breja, function(data) {
                    if (data.result.nModified) crawlerResult.updated++;
                    if (data.result.upserted) crawlerResult.inserted++;
                });
                crawlerResult.read++;
                console.log(crawlerResult.read, breja.nome);
            });
        }, 10)
    );
}

Promise.all(requestQueue).then(function() {
    console.timeEnd("Crawler time");
    beerController.count(function(data) {
        console.log("Total: %s brejas", data);
        console.log(crawlerResult);
    });

});
