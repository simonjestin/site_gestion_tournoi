var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Generateur' });
});

/* GET Hello World page. */
router.get('/helloworld', function (req, res) {
  res.render('helloworld', { title: 'Hello, Worlds!' })
});

/* GET creating teams page. */
router.get('/teams', function (req, res) {
  console.log(req.query.idTournament);
  res.render('teams',{
    nameTournament: req.query.nameTournament,
    idTournament: req.query.idTournament
  })
});

/* GET creating tournament page. */
router.get('/tournament', function (req, res) {
  var sportsList = ["Football", "Handball"];
  res.render('createtournament',{
    "sportsList":sportsList
  })
});

/* GET Hello World page. */
router.get('/tournament-tab', function (req, res) {
  res.render('tornamentTab', { title: 'Ton tournois !' })
});

router.post('/addtournament', function (req, res) {
  var db = req.db;
  var dbTournament = db.get('tournament');
 
  var pdf = req.body.pdf == 1 ? true : false; 

  dbTournament.find({},{},function(e,list){
    dbTournament.insert({
      "_id":list.length+1,
      "name":req.body.nametournament,
      "sport":req.body.typetournament,
      "type":req.body.sport,
      "pdf": pdf
    }, function (err, doc) {
      if (err) {
        res.send("Problème lors de la création d'un tournoi");
      }
      else {
        var id = list.length+1;
        var params = "idTournament=" + id + "&nameTournament=" + req.body.nametournament;
        res.redirect("/teams?" + params);
      }
    });
  });
});

router.post('/addteams', function (req, res) {
  var db = req.db;
  var dbTeams = db.get('teams');
  var i = 0;
  var teamsToAdd = [];

  dbTeams.find({},{},function(e,list){
    i = list.length;
    req.body.teams.forEach(element => {
      i++;
      teamsToAdd.push({
        "_id": i,
        "id_tournament": req.body.idtournament,
        "name": element,
        "nb_win": 0,
        "nb_draw": 0,
        "nb_lost": 0
      })
    });

    console.log(teamsToAdd);

    dbTeams.insert(teamsToAdd, function (err, doc) {
      if (err) {
        res.send("Problème lors de l'ajout d'une équipe");
      }
      else {
        res.location("/");
        res.redirect("/");
      }
    });
  });
});

module.exports = router;
