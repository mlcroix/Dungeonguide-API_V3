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
    var post = req.body;
    var id = post.id;
    var query = "DELETE FROM `campaign` WHERE id = '" + id + "'";
    try { 
        db.query(query, function(err, result) { 
            if (err) throw new Error(err);
            console.log("Remove campaign: Succesfully removed campaign: " + id);
            res.status(200);
            res.json({message: "succes"});
        });   
    } catch(err) {
        console.log("Remove campaign error: Failed to removed campaign: " + id);
        res.status(404);
        res.json({message: err});
    }
});

router.post('/update', function(req, res) {
    var post = req.body;
    var id = post.id;
    var name = post.name;
    var dungeonMaster = post.dungeonmaster;
    
    var query = "UPDATE campaign SET name = ?, dungeonmaster = ? WHERE id = " + id;

    var campaign = [
        name, 
        dungeonMaster
    ];
    try {
        db.query(query, campaign, function(err, result) {
            if (err) throw new Error(err);
            console.log("Update campaign: Succesfully updated campaign: " + name + " with ID: " + id);
            res.status(200);
            res.json({message: "succes"});
        });
    } catch (err) {
        console.log("Update campaign: Failed to updated campaign: " + name + " with ID: " + id);
        res.status(404);
        res.json({message: err});
    }
});

router.get('/party/:id', function(req, res) {
    var id = req.params.id;

    //get all campaigns this player is part of.
});

router.post('/party/invite', function(req, res) {
    var post = req.body;
    var id = post.id;
    var players = post.players;
    var query = "INSERT INTO campaign_pendingplayer (player_id, campaign_id) VALUES (?)";
    var values = [];

    players.forEach(player => {
        values.push([player, id])
    });
    
    values.forEach(value => {
        db.query(query, [value], function(err, result) {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log("Campaign ERROR: Failed to invite player with id: " + value[0] + " to campaign: " + id + ". Player already exist in campaign");
                } else {
                    console.log("Campaign ERROR: Failed to invite player with id: " + value[0] + " to campaign: " + id);
                }
            } else {
                console.log("Campaign: player " + value[0] + " has been succesfully invited to campaign: " + id);
            }
        });
    });
    res.status(200);
    res.json(values);

    //TODO create bulk insert function
});

router.post('/party/join', function(req, res) {
    var post = req.body;
    var id = post.id;
    var playerID = post.playerID;

    var query = "DELETE FROM campaign_pendingplayer WHERE player_id = '" + playerID + "' AND campaign_id = '" + id + "'";
    try { 
        db.query(query, function(err, result) { 
            console.log("Campaign join: Succesfully removed User: " + playerID + " from campaign " + id + " pending players");
            
            var insertQuery = "INSERT INTO campaign_player (campaign_id, player_id) VALUES (?)";
            var value = [id, playerID]
            db.query(insertQuery, [value], function(err, result) {
                
                if (err && err.code === 'ER_DUP_ENTRY') {
                    console.log("Campaign join: User: " + playerID + " is already an member of campaign " + id);
                    res.status(200);
                    res.json({message: "succes"});
                } else {
                    console.log("Campaign join: User: " + playerID + " succesfully joined campaign " + id);
                    res.status(200);
                    res.json({message: "succes"});
                }
            });
        });   
    } catch(err) {
        console.log("Campaign ERROR: Failed to join campaign players of campaign: " + id);
        res.status(404);
        res.json({message: err});
    }
});

router.post('/party/leave', function(req, res) {
    var post = req.body;
    var id = post.id;
    var playerID = post.playerID;

    //leave campaign
    // remove player from active campaign and pending players
});

module.exports = router;