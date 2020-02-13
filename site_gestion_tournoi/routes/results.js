var express = require('express');
var mongodb = require('mongodb');
var router = express.Router();

/* GET creating teams page. */
router.get('/', function(req, res) {
    console.log("result" + req.query.nameTournament);
    var db = req.db;
    var dbTeams = db.get("teams");
    var dbMatchs = db.get("matchs");

    dbTeams.find({ id_tournament: req.query.idTournament }, {}, function(e, teams) {
        dbMatchs.find({ id_tournament: req.query.idTournament }, {}, function(e, matchs) {
            res.render('results', {
                nameTournament: req.query.nameTournament,
                idTournament: req.query.idTournament,
                nbGroup: JSON.stringify(teams.length / 4),
                matchs: JSON.stringify(matchs),
                teams: JSON.stringify(teams)
            });
        });
    });
});

router.post('/', function(req, res) {
    var db = req.db;
    var dbTeams = db.get("teams");
    var dbMatchs = db.get("matchs");

    try {
        //Update db matchs --------------------------------
        var query = { "_id": mongodb.ObjectId(req.body.id_match) };
        var newValue = { $set: { "finish": true } };

        dbMatchs.update(query, newValue, function(err, results) {
            if (err) {
                throw err;
            }
        });

        //--------------------------------------------------
        dbMatchs.find({ "_id": mongodb.ObjectId(req.body.id_match) }, {}, function(e, match) {
            //Get team 1 ----------------------------------
            dbTeams.find({ "_id": match[0].id_team1 }, {}, function(e, team1) {
                //Get team 2 ----------------------------------
                dbTeams.find({ _id: match[0].id_team2 }, {}, function(e, team2) {
                    //If team 1 win -------------------------------------
                    if (match[0].goal_team1 > match[0].goal_team2) {
                        query = { "_id": match[0].id_team1 };
                        newValue = {
                            $set: {
                                "nb_win": team1[0].nb_win + 1,
                                "goals_scored": team1[0].goals_scored + parseInt(match[0].goal_team1),
                                "goals_conceded": team1[0].goals_conceded + parseInt(match[0].goal_team2)
                            }
                        };
                        dbTeams.update(query, newValue, function(err, results) {
                            if (err) throw err;
                        });

                        query = { "_id": match[0].id_team2 };
                        newValue = {
                            $set: {
                                "nb_lost": team2[0].nb_lost + 1,
                                "goals_scored": team2[0].goals_scored + parseInt(match[0].goal_team2),
                                "goals_conceded": team2[0].goals_conceded + parseInt(match[0].goal_team1)
                            }
                        };
                        dbTeams.update(query, newValue, function(err, results) {
                            if (err) throw err;
                        });
                    }
                    //---------------------------------------------------

                    //If team 2 win -------------------------------------
                    if (match[0].goal_team1 < match[0].goal_team2) {
                        query = { "_id": match[0].id_team2 };
                        newValue = {
                            $set: {
                                "nb_win": team2[0].nb_win + 1,
                                "goals_scored": team2[0].goals_scored + parseInt(match[0].goal_team2),
                                "goals_conceded": team2[0].goals_conceded + parseInt(match[0].goal_team1)
                            }
                        };
                        dbTeams.update(query, newValue, function(err, results) {
                            if (err) throw err;
                        });

                        query = { "_id": match[0].id_team1 };
                        newValue = {
                            $set: {
                                "nb_lost": team1[0].nb_lost + 1,
                                "goals_scored": team1[0].goals_scored + parseInt(match[0].goal_team1),
                                "goals_conceded": team1[0].goals_conceded + parseInt(match[0].goal_team2)
                            }
                        };
                        dbTeams.update(query, newValue, function(err, results) {
                            if (err) throw err;
                        });
                    }
                    //---------------------------------------------------

                    //If equality ---------------------------------------
                    if (match[0].goal_team1 == match[0].goal_team2) {
                        query = { "_id": match[0].id_team2 };
                        newValue = {
                            $set: {
                                "nb_draw": team2[0].nb_draw + 1,
                                "goals_scored": team2[0].goals_scored + parseInt(match[0].goal_team2),
                                "goals_conceded": team2[0].goals_conceded + parseInt(match[0].goal_team1)
                            }
                        };
                        dbTeams.update(query, newValue, function(err, results) {
                            if (err) throw err;
                        });

                        query = { "_id": match[0].id_team1 };
                        newValue = {
                            $set: {
                                "nb_draw": team1[0].nb_draw + 1,
                                "goals_scored": team1[0].goals_scored + parseInt(match[0].goal_team1),
                                "goals_conceded": team1[0].goals_conceded + parseInt(match[0].goal_team2)
                            }
                        };
                        dbTeams.update(query, newValue, function(err, results) {
                            if (err) throw err;
                        });
                    }
                    //--------------------------------------------------
                });
            });
        });
        //--------------------------------------------------

        dbTeams.find({ id_tournament: req.body.idTournament }, {}, function(e, teams) {
            dbMatchs.find({ id_tournament: req.body.idTournament }, {}, function(e, matchs) {
                res.render('results', {
                    nameTournament: req.body.nameTournament,
                    idTournament: req.body.idTournament,
                    nbGroup: JSON.stringify(teams.length / 4),
                    matchs: JSON.stringify(matchs),
                    teams: JSON.stringify(teams)
                });
            });
        });
    } catch (error) {
        console.error(error);
    }
});

router.put('/', function(req, res) {
    var db = req.db;
    var dbTeams = db.get("teams");
    var dbMatchs = db.get("matchs");

    try {
        var id = mongodb.ObjectId(req.body.id.split("*")[0]);
        var team = req.body.id.split("*")[1];

        var query = { "_id": id };
        var newValue;

        if (team == "team1") newValue = { $set: { "goal_team1": req.body.value } };
        if (team == "team2") newValue = { $set: { "goal_team2": req.body.value } };

        dbMatchs.update(query, newValue, function(err, resp) {
            if (err) {
                throw err;
            }
            console.log("1 matchs updated");
        });

        dbTeams.find({ id_tournament: req.body.idTournament }, {}, function(e, teams) {
            dbMatchs.find({ id_tournament: req.body.idTournament }, {}, function(e, matchs) {
                res.render('results', {
                    nameTournament: req.body.nameTournament,
                    idTournament: req.body.idTournament,
                    nbGroup: JSON.stringify(teams.length / 4),
                    matchs: JSON.stringify(matchs),
                    teams: JSON.stringify(teams)
                });
            });
        });
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;