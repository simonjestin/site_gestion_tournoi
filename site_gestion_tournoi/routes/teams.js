var express = require('express');
var router = express.Router();

/* GET creating teams page. */
router.get('/', function(req, res) {
    console.log("teams get" + req.query.nameTournament);
    var db = req.db;
    var dbTeams = db.get('teams');
    var isCreated = 0;
    dbTeams.find({ id_tournament: req.query.idTournament }, {}, function(e, teams) {
        if (teams.length != 0) {
            isCreated = 1;
        }
        console.log(isCreated);
        res.render('teams', {
            nameTournament: req.query.nameTournament,
            idTournament: req.query.idTournament,
            isCreated: isCreated,
            teams: JSON.stringify(teams)
        });
    });
});

router.post('/', function(req, res) {
    var db = req.db;
    var dbTeams = db.get('teams');
    var i = 0;
    var teamsToAdd = [];
    console.log("teams post" + req.body.nameTournament);
    dbTeams.find({}, {}, function(e, list) {

        req.body.teams.forEach(element => {
            i++;
            teamsToAdd.push({
                "_id": i + list.length,
                "id_tournament": req.body.idTournament,
                "name": element,
                "nb_win": 0,
                "nb_draw": 0,
                "nb_lost": 0,
                "goals_scored": 0,
                "goals_conceded": 0,
                "group": Math.ceil(i / 4)
            })
        });

        dbTeams.insert(teamsToAdd, function(err, doc) {
            if (err) {
                res.send("Problème lors de l'ajout d'une équipe");
            } else {
                var matchs = createMatch(req, teamsToAdd);
                matchs.then(function(m) {
                    res.render('results', {
                        nameTournament: req.body.nameTournament,
                        idTournament: req.body.idTournament,
                        matchs: JSON.stringify(m),
                        teams: JSON.stringify(teamsToAdd),
                        nbGroup: JSON.stringify(teamsToAdd.length / 4)
                    });
                });
            }
        });
    });
});

async function createMatch(req, teams) {
    var db = req.db;
    var dbMatchs = db.get('matchs');
    var matchToCreate = [];

    for (var i = 1; i <= teams.length / 4; i++) {
        teams.forEach(team1 => {
            if (team1.group == i) {
                teams.forEach(team2 => {
                    if (team2.group == i) {
                        if (team1 != team2) {
                            matchToCreate.push({
                                "id_team1": team1._id,
                                "id_team2": team2._id,
                                "id_tournament": team1.id_tournament,
                                "group": team1.group,
                                "goal_team1": 0,
                                "goal_team2": 0,
                                "finish": false
                            });
                        }
                    }
                });
            }
        });
    }
    matchToCreate.forEach(match1 => {
        matchToCreate.forEach(function(match2, index, object) {
            if (match1.id_team1 == match2.id_team2 && match1.id_team2 == match2.id_team1) {
                object.splice(index, 1);
            }
        });
    });

    dbMatchs.insert(matchToCreate, function(err, doc) {
        if (err) {
            console.log("Problème lors de l'ajout des matchs");
        }
    });
    return matchToCreate;
}

module.exports = router;