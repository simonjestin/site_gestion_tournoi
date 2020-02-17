var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Generateur' });
});

router.post('/', function(req, res, next) {
    var db = req.db;
    var dbTournament = db.get('tournament');
    var query;

    if (req.body.idTournament != "" && req.body.nameTournament == "") query = { _id: parseInt(req.body.idTournament) };
    if (req.body.nameTournament != "" && req.body.idTournament == "") query = { name: req.body.nameTournament };
    if (req.body.nameTournament != "" && req.body.idTournament != "") query = {
        _id: parseInt(req.body.idTournament),
        name: req.body.nameTournament
    };

    dbTournament.find(query, {}, function(e, tournament) {
        var params = "idTournament=" + tournament[0]._id + "&nameTournament=" + tournament[0].name;
        res.redirect("/teams?" + params);
    });
});

module.exports = router;