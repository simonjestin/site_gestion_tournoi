var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Generateur' });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, Worlds!' })
});

/* GET creating teams page. */
router.get('/teams', function(req, res) {
    res.render('teams', {
        nameTournament: req.query.nameTournament,
        idTournament: req.query.idTournament
    })
});

/* GET creating teams page. */
router.get('/results', function(req, res) {
    var db = req.db;
    var dbTeams = db.get("teams");
    var dbMatchs = db.get("matchs");

    dbTeams.find({ id_tournament: req.query.idTournament }, {}, function(e, teams) {
        console.log("teams = " + teams);
        dbMatchs.find({ id_tournament: req.query.idTournament }, {}, function(e, matchs) {
            res.render('results', {
                nameTournament: req.query.nameTournament,
                idTournament: req.query.idTournament,
                nbGroup: teams.length / 4,
                matchs: JSON.stringify(matchs),
                teams: JSON.stringify(teams)
            });
        });
    });
});

/* GET creating tournament page. */
router.get('/tournament', function(req, res) {
    var sportsList = ["Football", "Handball"];
    res.render('createtournament', {
        "sportsList": sportsList
    })
});

/* GET Hello World page. */
router.get('/tournament-tab', function(req, res) {
    res.render('tornamentTab', { title: 'Ton tournois !' })
});

router.post('/addtournament', function(req, res) {
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
            }
        });
    });
});

router.post('/addteams', function(req, res) {
    var db = req.db;
    var dbTeams = db.get('teams');
    var i = 0,
        groupe = 1;
    var teamsToAdd = [];

    dbTeams.find({}, {}, function(e, list) {

        req.body.teams.forEach(element => {
            i++;
            teamsToAdd.push({
                "_id": i + list.length,
                "id_tournament": req.body.idtournament,
                "name": element,
                "nb_win": 0,
                "nb_draw": 0,
                "nb_lost": 0,
                "points": 0,
                "group": Math.ceil(i / 4)
            })
        });

        dbTeams.insert(teamsToAdd, function(err, doc) {
            if (err) {
                res.send("Problème lors de l'ajout d'une équipe");
            } else {
                createMatch(req, teamsToAdd);
                res.location("/");
                res.redirect("/");
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
                                "goal_team2": 0
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
}

module.exports = router;