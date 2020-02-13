var express = require('express');
var mongodb = require('mongodb');
var router = express.Router();

/* GET creating teams page. */
router.get('/', function(req, res) {
    var db = req.db;
    var dbTeams = db.get("teams");
    console.log("ranking" + req.query.nameTournament);

    dbTeams.find({ id_tournament: req.query.idTournament }, {}, function(e, teams) {
        res.render('ranking', {
            nameTournament: req.query.nameTournament,
            idTournament: req.query.idTournament,
            nbGroup: JSON.stringify(teams.length / 4),
            teams: JSON.stringify(teams)
        });
    });
});

module.exports = router;