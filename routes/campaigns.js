var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../db');

router.get('/', function(req, res, next) {
    db.query("SELECT * FROM campaign", function (err, result) {
        if (err) throw err;
        console.log("Get Campaigns");
        res.status(200);
        res.json(result);
    });
});

router.get('/id/:id', function(req, res) {
    var id = req.params.id;

    db.query("SELECT * FROM campaign WHERE id = '" + id + "'", function (err, result) {
        if (err) throw err;

        if (result.length == 1) {
            console.log("Get Campaign with Id: " + id);
            res.status(200);
            res.json(result);
        } else {
            console.log("Get campaign with ID: " + id + " Not Found ");
            res.status(201);
            res.json({message: "Not Found"});
        }
        
    });
});

router.get('/playerid/:id', function(req, res) {
});

router.post('/create', function(req, res) {
    var post = req.body;
    var playerID = post.playerID;
    var name = post.name;
    var campaign = [name, new Date(), playerID];
    var query = "INSERT INTO campaign (name, date, dungeonmaster) VALUES (?)";
    
    db.query(query, [campaign], (err, result) => {
        if (err) throw err;
        console.log("Create campaign: campaign was succesfully created by user " + playerID);
        res.json(result);
    });
});

router.post('/remove', function(req, res) {
});

router.post('/update', function(req, res) {
});

module.exports = router;