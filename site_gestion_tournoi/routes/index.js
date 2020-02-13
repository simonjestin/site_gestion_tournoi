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

/* GET Hello World page. */
router.get('/tournament-tab', function(req, res) {
    res.render('tornamentTab', { title: 'Ton tournois !' })
});

module.exports = router;