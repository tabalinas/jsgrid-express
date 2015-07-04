var express = require('express');
var router = express.Router();

var clientsData = require('../db/clients.json');
var Datastore = require('nedb');
var db = new Datastore();
db.insert(clientsData);

var getClientFilter = function(query) {
    var result = {
        Name: new RegExp(query.Name, "i"),
        Address: new RegExp(query.Address, "i")
    };

    if(query.Married) {
        result.Married = query.Married === 'true' ? true : false;
    }

    if(query.Country !== '0') {
        result.Country = parseInt(query.Country, 10);
    }

    return result;
};

var prepareItem = function(source) {
    var result = source;
    result.Married = source.Married === 'true' ? true : false;
    result.Country = parseInt(source.Country, 10);
    return result;
};

router.get('/', function(req, res, next) {
    db.find(getClientFilter(req.query), function(err, items) {
        res.json(items);
    });
});

router.post('/', function(req, res, next) {
    db.insert(prepareItem(req.body), function(err, item) {
        res.json(item);
    });
});

router.put('/', function(req, res, next) {
    var item = prepareItem(req.body);

    db.update({ _id: item._id }, item, {}, function(err) {
        res.json(item);
    });
});

router.delete('/', function(req, res, next) {
    var item = prepareItem(req.body);

    db.remove({ _id: item._id }, {}, function(err) {
        res.json(item);
    });
});


module.exports = router;
