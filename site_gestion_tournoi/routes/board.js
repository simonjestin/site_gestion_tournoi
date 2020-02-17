var express = require('express');
var router = express.Router();

/* GET Hello World page. */
router.get('/', function(req, res) {
    console.log("get board");
    res.render('board', {
        title: 'Ton tournois !',
        nameTournament: req.query.nameTournament,
        idTournament: req.query.idTournament,
    });
});

module.exports = router;