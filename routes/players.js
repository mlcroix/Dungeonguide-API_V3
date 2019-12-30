var express = require('express');
var router = express.Router();
var encryption = require('../encryption');
var mysql = require('mysql');
var db = require('../db');

router.get('/', function(req, res, next) {
    db.query("SELECT * FROM player", function (err, result) {
        if (err) throw err;
        console.log(result);
    });

    res.json("hier heb je een lijst van players (die er nog niet zijn)");
});

module.exports = router;