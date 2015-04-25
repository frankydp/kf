/**
 * Created by Frank on 1/30/2015.
 */
var express = require('express');
var router = express.Router();
var coll = ['scores']
var db = require('mongojs').connect("local", coll);


//router.get('/:mos/:type', function(req, res) {
//
//console.log(req.params.type)
//
//    scores.find({mos: parseInt(req.params.mos), type: req.params.type}).toArray(function (err, docs) {
//        //console.log(docs[1].score.toString());
//        res.json(docs);
//        //console.log(docs)
//    })
//});
router.get('/date/:year/:month/', function(req, res) {

    console.log(parseInt(req.params.year))
    //console.log()
    //var start = new Date(req.params.year, (req.params.month-1), 1)
    //start = new Date(start.toISOString());
    //console.log(start.toString())
    //var end = new Date(req.params.year, (req.params.month-1), 28)
    //end = new Date(end.toISOString());
    var yrmonT = req.params.month+"-"+req.params.year;
    db.scores.find({yrmon: yrmonT}).sort({mos: 1}).toArray(function (err, docs) {
        //console.log(docs[1].score.toString());mon
        res.json(docs);
        //console.log(docs)
    })
});
router.get('/exact/:year/:month/:type', function(req, res) {

    console.log(parseInt(req.params.year))
    //console.log()
    //var start = new Date(req.params.year, (req.params.month-1), 1)
    //start = new Date(start.toISOString());
    //console.log(start.toString())
    //var end = new Date(req.params.year, (req.params.month-1), 28)
    //end = new Date(end.toISOString());
    var yrmonT = req.params.month+"-"+req.params.year;
    db.scores.find({yrmon: yrmonT, type: req.params.type}).toArray(function (err, docs) {
        //console.log(docs[1].score.toString());mon
        res.json(docs);
        //console.log(docs)
    })
});

router.get('/history/:mos', function(req, res) {
    db.scores.find({mos: req.params.mos})
        //.sort({yrmon: 1})
        .toArray(function (err, docs) {
            //console.log(docs[1].score.toString());
            res.json(docs);
        });

});

module.exports = router;