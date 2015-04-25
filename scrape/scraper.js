//var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
//var router = express.Router();

var coll = ['scores']
var db = require('mongojs').connect("local", coll);
//var scores = db.collection('scores');

//var mon = Dec;
//var yr = "2013";
var scoreType = {
    1: "ACTIVE CORPORAL",
    2: "ACTIVE RESERVE CORPORAL",
    9: "ACTIVE RESERVE SERGEANT",
    8: "ACTIVE SERGEANT",
    3: "DRILLING RESERVE (SMCR)/IRR Cpl",
    10: "DRILLING RESERVE (SMCR)/IRR Sgt"
}
var itypes = ['1', '2', '9', '8', '3', '10'];
var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];
var years = ["2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"];


var linkList = []
function monthsinyear(year) {
    var curYear = year;
    //console.log(year);
    for (var im in months) {
        //console.log(months[im]);
        for (var itype in itypes) {
            //console.log('http://www.manpower.usmc.mil/cutting_score_portlets/cutting_score/showScores.jsp?dutyid='+itypes[itype]+'&month='+months[im]+'-'+curYear);
            linkList.push({
                url: 'http://www.manpower.usmc.mil/cutting_score_portlets/cutting_score/showScores.jsp?dutyid=' + itypes[itype] + '&month=' + months[im] + '-' + curYear,
                component: itypes[itype],
                month: months[im],
                year: curYear
            });
        }
    }
}


//years.forEach(function (item) {
//    monthsinyear(item)
//});
//console.log(linkList)
//console.log(linkList)
function getScores(pass) {
    request(pass.url, function (err, resp, body) {
        var arrayScore;
        if (!err) {
            //console.log("no error")
            var $ = cheerio.load(body);
            $(".DataGridRow").each(function (item, ele) {
                if (item > 0) {
                    var mos = $(ele).children('td').first().text().replace(/\s+/g, ' ');
                    var sc = $(ele).children('td').last().text();
                    var addingprep = {
                        score: sc,
                        mos: mos.trim(),
                        //date: new Date(pass.year, pass.month),
                        yrmon: pass.month + "-" + pass.year,
                        type: scoreType[pass.component],
                        typecode: pass.component

                    };

                    // console.log(addingprep);
                    db.scores.save(addingprep, function (err, saved) {
                        if (err || !saved) {
                            //console.log("NOT SAVED")
                        } else {
                            //console.log("SAVED")
                        }
                    })
                }
            });
            $(".DataGridAltRow").each(function (item, ele) {
                var mos = $(ele).children('td').first().text().replace(/\s+/g, ' ');
                var sc = $(ele).children('td').last().text();
                var addingprep = {
                    score: sc,
                    mos: mos.trim(),
                    //date: new Date(pass.year, pass.month),
                    yrmon: pass.month + "-" + pass.year,
                    type: scoreType[pass.component],
                    typecode: pass.component
                };


                db.scores.save(addingprep, function (err, saved) {
                    if (err || !saved) {
                        //console.log("NOT SAVED")
                    } else {
                        //console.log("SAVED")
                    }
                })

            })
            console.log(pass.month + '-' + pass.year + " " + scoreType[pass.component] + " Saved.")
        } else {
            console.log("request ERROR")
        }
        //console.log(arrayScore)
    })
}

function getFresh() {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dateT = new Date();
    var yrT = dateT.getFullYear();
    var monT = months[dateT.getMonth()+1];
    fresh = monT + "-" + yrT;

    for (var itype in itypes) {
        //console.log('http://www.manpower.usmc.mil/cutting_score_portlets/cutting_score/showScores.jsp?dutyid='+itypes[itype]+'&month='+months[im]+'-'+curYear);
        linkList.push({
            url: 'http://www.manpower.usmc.mil/cutting_score_portlets/cutting_score/showScores.jsp?dutyid=' + itypes[itype] + '&month=' + fresh,
            component: itypes[itype],
            month: monT,
            year: yrT
        });
    }
    console.log(linkList);
    for (item in linkList) {
        getScores(linkList[item])
    }
}
getFresh()


var randomTime = [10000, 20000, 18000, 31000];
//function rotator(arr) {
//    var iterator = function (index) {
//        if (index >= arr.length) {
//            return;
//        }
//        //console.log(arr[index].year);
//        //console.log(arr.length);
//        //console.log(index)
//        getScores(arr[index]);
//        setTimeout(function () {
//            iterator(++index);
//        }, Math.floor(Math.random() * (12000 - 3000)) + 3000);
//    };
//
//    iterator(0);
//};
//
//rotator(linkList);

//router.get('/',function(req, res){

//})
//
//module.exports = router;