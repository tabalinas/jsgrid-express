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

router.get('/', function(req, res, next) {
    db.find(getClientFilter(req.query), function(err, items) {
        res.json(items);
    });
});

module.exports = router;
