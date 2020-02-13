var express = require('express');
var mongodb = require('mongodb');
var router = express.Router();

/* GET creating tournament page. */
router.get('/', function(req, res) {
    var sportsList = ["Football", "Handball"];
    res.render('tournament', {
        "sportsList": sportsList
    })
});

router.post('/', function(req, res) {
    var db = req.db;
    var dbTournament = db.get('tournament');

    var pdf = req.body.pdf == 1 ? true : false;

    dbTournament.find({}, {}, function(e, list) {
        dbTournament.insert({
            "_id": list.length + 1,
            "name": req.body.nametournament,
            "sport": req.body.typetournament,
            "type": req.body.sport,
            "pdf": pdf
        }, function(err, doc) {
            if (err) {
                res.send("Problème lors de la création d'un tournoi");
            } else {
                var id = list.length + 1;
                var params = "idTournament=" + id + "&nameTournament=" + req.body.nametournament;
                res.redirect("/teams?" + params);
                /*res.render('teams', {
                    nameTournament: req.body.nametournament,
                    idTournament: id
                });*/
            }
        });
    });
});

module.exports = router;