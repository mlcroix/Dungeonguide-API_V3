var express = require('express');
var router = express.Router();
var encryption = require('../encryption');
var mysql = require('mysql');
var db = require('../db');

router.get('/', function(req, res, next) {
    db.query("SELECT * FROM player", function (err, result) {
        if (err) throw err;
        console.log("Get Players");
        res.status(200);
        res.json(result);
    });
});

router.get('/username/:username', function(req, res) {
    var username = req.params.username.toLowerCase();

    db.query("SELECT * FROM player WHERE username = '" + username + "'", function (err, result) {
        if (err) throw err;

        if (result.length == 1) {
            console.log("Get username: Found " + req.params.username.toLowerCase());
            res.status(200);
            res.json(result);
        } else {
            console.log("Get username: Not Found " + req.params.username.toLowerCase());
            res.status(201);
            res.json({message: "Not Found"});
        }
        
    });
});

router.post('/login', function(req, res) {
   var post = req.body;
   var username = post.username.toLowerCase();
   var password = post.password;
   var query = "SELECT * FROM `player` WHERE username = '" + username + "'";
   try { 
       db.query(query, function(err, result) {      
                if (result.length == 1){
                    var dbpassword = encryption.decrypt(result[0].password);

                    if (dbpassword == password) {
                        console.log("Login succesfull for user : " + username);
                        delete result[0].password;
                        res.json(result[0])
                    } else {
                        console.log("Login error: User " + username + " login failed duo worng password");
                        res.status(201);
                        res.json({message: "Not Found"});
                    }
                }
                else {
                    console.log("Login error: User " + username + " not found");
                    res.status(201);
                    res.json({message: "Not Found"});
                }
       });
   } catch(err) {
        res.status(404);
        res.json({message: err});
   }
});

router.post('/signup', function(req, res) {
    var post = req.body;
    var lowerEmail = post.email.toLowerCase();
    var lowerUsername = post.username.toLowerCase();
    var query = "SELECT * FROM `player` WHERE email = '" + lowerEmail + "' OR username = '" + lowerUsername + "'";
    try {
        db.query(query, function(err, result) {
            if (err) throw new Error(err);
            if (result.length == 0) {
                var player = [
                    post.firstname, 
                    post.lastname, 
                    lowerEmail, 
                    lowerUsername, 
                    encryption.encrypt(post.password)
                ];
                var insertQuery = "INSERT INTO player (firstname, lastname, email, username, password) VALUES (?)";
                db.query(insertQuery, [player], (err, result) => {
                    if (err) throw err;
                    res.json(player);
                });
            } else {
                if (result[0].username == lowerUsername) {
                    res.status(201);
                    res.json({message: "user with the same name already exists"});
                }
                else if (result[0].email == lowerEmail) {
                    res.status(201);
                    res.json({message: "user with the same email adres already exists"});
                }
                else {
                    res.status(201);
                    res.json({message: "user already exists"});
                }
            }
        });
    } catch(err) {
        res.status(404);
        res.json({message: err});
    }
});

router.post('/validate', function(req, res) {
});

router.post('/remove', function(req, res) {
});

router.post('/update', function(req, res) {
});

module.exports = router;