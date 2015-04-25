var express = require('express');
var app = express();
var expressHbs = require('express3-handlebars');
var MongoClient = require('mongodb').MongoClient;
var coll = ['scores']
var db = require('mongojs').connect("local", coll)
//var bootstrap = require('bootstrap');

var todos = require('./routes/api');
//var scrape = require('./scrape/scraper')


app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'main.hbs'}));
app.set('view engine', 'hbs');
var days = [];
//var db = MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
//    if (err) throw err;
//    console.log("Connected to Database");
//    var collection = db.collection('compiledscores1');
//    var fresh;
//    collection.find().sort({date: -1}).limit(1).toArray(function(err, docs){fresh = docs[0].date;console.log(fresh);
//
//    collection.find({ date: fresh} ).toArray(function(err, docs) {
//            //console.log(docs[1].score.toString());
//            docs.forEach(function(obj) {days.push(obj);
//        //if (typeof(obj.date)!='object') { //check if is not already a ISODate
//        //    var datePt = obj.date.split('/'); //split the string dd/mm/YYYY
//        //    var dateEn = datePt[2] + '-' + datePt[1] + '-' + datePt[0]; // reorganize to YYYY-mm-dd
//        //
//        //    obj.date = new Date(dateEn); // convert in ISODate
//        //    collection.save(obj, function(err, result) {
//        //        console.log(err);
//        //    }); //save and thats all
//        //    console.log(obj.mos+" Updated");
//        //}
//            });
//        });
//    });
//
//});





app.use(express.static(__dirname + '/images'));
app.use(express.static(__dirname + '/bower_components'));

app.get('/', function(req, res){
    res.render('index');
});

app.get('/simple', function(req, res){
    var data = {name: 'Gorilla'};
    res.render('simple', data);
});

app.get('/complex', function(req, res){
    var data = {
        name: 'Gorilla',
        address: {
            streetName: 'Broadway',
            streetNumber: '721',
            floor: 4,
            addressType: {
                typeName: 'residential'
            }
        }
    };
    res.render('complex', data);
});
scoresAval=[];
var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var avalMorph = []
function availabilityCheck() {
    db.scores.find({mos: '0311'})
        //.sort({yrmon: 1})
        .toArray(function (err, docs) {
            //console.log(docs[1].score.toString());
            //scoresAval = docs;
            //console.log(docs)
            scoresAval = docs;
            scoresAval.forEach(function (item, idx) {
                avalMorph.push(item.yrmon);
            });
            avalMorph = uniq(avalMorph)
            currentScores()
        });

}
function currentScores () {

    var dateT = new Date();
    var yrT = dateT.getFullYear();
    var monT = months[(dateT.getMonth()+ 1)];
    var fresh = monT+"-"+yrT;
    //console.log(fresh)
    //console.log(avalMorph)
    if(avalMorph.indexOf(fresh) == -1) {
        var dateT = new Date();
        var yrT = dateT.getFullYear();
        var monT = months[dateT.getMonth()];
        fresh = monT+"-"+yrT;
        //console.log('unavailable')
    }

    //console.log(fresh);
    db.scores.find({yrmon: fresh})
        .sort({mos:1})
        .toArray(function (err, docs) {
            //console.log(docs[1].score.toString());

            docs.forEach(function (obj) {
                days.push(obj);
            });
        });
    db.scores.distinct('yrmon', function (err, list) {
        yrmonlist = list;
    });




}
function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}
availabilityCheck()

function uniq(a) {
    var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

    return a.filter(function(item) {
        var type = typeof item;
        if(type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
}
var yrmonlist = [];
app.get('/historical', function(req, res){

    //console.log(scoresAval)
    var yrsort = [];



    avalMorph.forEach(function(item, idx) {
        yrsort.push(new Date(avalMorph[idx].split('-')[1], months.indexOf(avalMorph[idx].split('-')[0])));
    })
    yrsort.sort(function(a,b){return b-a});
    yrsort.forEach(function (item, idx) {
        var yrT = item.getFullYear();
        var monT = months[item.getMonth() ];
        yrsort[idx] = monT+"-"+yrT;

    })

    //console.log(avalMorph)

    //yrsort.forEach(function(item) {
    //    //console.log(item)
    //    if (avalMorph.indexOf(item) === -1) {
    //        console.log(item)
    //    }
    //})


    //for (item in yrsort) {
    //    if (scoresAval.indexOf(yrsort[item]) == -1) {console.log(yrsort[item])}
    //}


    //console.log(yrmonlist);
    //console.log(yrsort);
var data ={
    days: days,
    yrmons: yrmonlist,
    yrsort: yrsort
};

    res.render('loop', data);
});



var moshist = [];
app.get('/mosHistory', function(req, res){



    //console.log(yrmonlist);
    var data ={

        yrmons: yrmonlist

    };

    res.render('mosHistory', data);
});

app.get('/logic', function(req, res){
    var data = {
        upIsUp: true,
        downIsUp: false,
        skyIsBlue: "yes"
    };



    res.render('logic', data);
});




app.use('/api', todos);
//app.use('/scrape', scrape);

function poptest() {
    var fresh;
    db.scores.find().sort({date: -1}).limit(1).toArray(function(err, docs) {
        fresh = "Dec-2013";
        console.log(fresh);
        db.scores.find({yrmon: fresh}).toArray(function (err, docs) {
            //console.log(docs[1].score.toString());

            docs.forEach(function (obj) {
                days.push(obj);
            });
        });
    })
}


app.listen(80);
console.log("Server started on port 80");

