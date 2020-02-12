var express = require('express');
var mongodb = require('mongodb');
var router = express.Router();

/* GET creating teams page. */
router.get('/', function(req, res) {
    var db = req.db;
    var dbTeams = db.get("teams");
    var dbMatchs = db.get("matchs");

    dbTeams.find({ id_tournament: req.query.idTournament }, {}, function(e, teams) {
        dbMatchs.find({ id_tournament: req.query.idTournament }, {}, function(e, matchs) {
            res.render('results', {
                nameTournament: JSON.stringify(req.query.nameTournament),
                idTournament: JSON.stringify(req.query.idTournament),
                nbGroup: JSON.stringify(teams.length / 4),
                teams: JSON.stringify(teams)
            });
        });
    });
});

module.exports = router;