var pixels = require('./pixels');

var Db = require('../conf/db'),
    db = Db.dbTrackLocal(),
    dbData = Db.dbDataServer(),
    mongojs = require('mongojs'),
    fns = [],
    ObjectId = mongojs.ObjectId;
/**
 * Handles a call to /tracker and shows some text with links to login and registration
 */
var getVisitData = function(request, reply, callback) {
    var url = require('url');
    var qs = require('querystring');
    var geoip = require('geoip-lite');
    var crypto = require('crypto');
    req = request;
    res = reply;

    // Check the refere query string
    if (typeof req.headers.referer !== 'undefined') {
        var referURL = req.headers.referer;
        query = referURL.split("?");
        if (typeof query[1] !== 'undefined') {
            query = query[1];
        } else {
            query = '';
        }
    } else {
        query = '';
    }
    var namespace = request.headers.host.split(":")[0].split('.')[0];
    //organic pixe - other
    var affID = "";
    //TODO VER SE ISTO FUNCIONA..
    if (req.params.affid === 'other') {
        affID = 'organic';
    } else if (typeof req.params.affid !== "undefined") {
        affID = ObjectId(req.params.affid);
    } else {
        //TODO HOW TO GET AFILLIATE IF THERE IS NO AFF IN URL aff=55100bb98d865f0893b3ebf1
        //affID = getParameter('aff',request.headers.host)
        // WILL IT GET FROM URL THAT CONTAINS X
        if (req.params.length > 0)
            affID = req.params.param.split('/')[0];
        else
            affID = '';
    }
    setResponse();

    function setResponse() {
        var response = {
            date: new Date(),
            host: req.headers.host,
            cache: qs.parse(req.headers['cache-control']) || {},
            referer: (req.headers.referer || req.headers.referrer || 'direct'),
            referer_query: qs.parse(query),
            campid: ((typeof req.params.campid !== 'undefined' && req.params.campid.length > 12) ? ObjectId(req.params.campid) : ''),
            affid: ((affID.length < 12) ? affID : ObjectId(affID)),
            query: req.url.search,
            params: (req.url.query || {})
        };

        //CALL PIXEL FOR THIS ACTION
        //pixeis2insert= pixels.pixelCallBack(req.params.campid, 'impression', req.params.affid, req.params.id, '', req.query);

        _getAgent(req.headers['user-agent'], 2, function(e, useragent) {
            response.useragent = useragent;
            _getOS(req.headers['user-agent'], 2, function(e, useros) {
                response.useros = useros;
            });
            _getLanguage(function(e, language) {
                response.language = language
                _getRemoteAddress(function(remoteAddress) {
                    var geo = geoip.lookup(remoteAddress);
                    response.ip = remoteAddress;
                    if (geo != null) {
                        response.country = geo.country;
                        response.city = geo.city;
                        response.ll = geo.ll;
                    }
                    _fixHref(req.headers.host, function(e, href) {
                        response.domain = url.parse(href).hostname;
                        /*_flush(extend(response, req.query))*/
                    });
                });
            });
        });

        callback(response);

    }

    function _flush(res) {
        each(fns, function(fn, i, done) {
            fn(null, res);
        });
    }

    function _getLanguage(callback) {
        var lang = req.headers['accept-language'] || '';
        lang = lang.split(';') || '';
        var format = lang[0].split(',');
        format.push(qs.parse(lang[1]));
        callback(null, format);
    }

    function _getRemoteAddress(callback) {
        var rc = req.connection;
        if (req.socket && req.socket.remoteAddress)
            callback(req.socket.remoteAddress);
        else if (rc)
            if (rc.remoteAddress)
                callback(rc.remoteAddress);
            else if (rc.socket && rc.socket.remoteAddress)
            callback(rc.socket.remoteAddress);
        else {
            console.log('ERR: no remoteAddress');
            callback(null);
        }
        callback(request.headers['x-real-ip']);
    }

    function _getUserToken(callback) {
        var md5sum = crypto.createHash('md5');
        var val = String(Math.random());
        md5sum.update(val);
        callback(null, md5sum.digest('hex'));
    }

    function _getDecay(decay, callback) {
        if (typeof decay === 'undefined') {
            callback(null, +new Date() + (1000 * 60 * 5));
        } else {
            callback(null, decay);
        }
    }

    function _getAgent(userAgent, elements, callback) {

        // If userAgent is undefined return browser: false
        if (typeof userAgent === 'undefined')
            return callback({
                browser: false,
                version: ''
            })

        var regexps = {
                'Chrome': [/Chrome\/(\S+)/],
                'Firefox': [/Firefox\/(\S+)/],
                'MSIE': [/MSIE (\S+);/],
                'Trident': [/Trident\/(\S+);/],
                'Safari': [/Safari (\S+);/],
                'Opera': [
                    /Opera\/.*?Version\/(\S+)/, /* Opera 10 */
                    /Opera\/(\S+)/ /* Opera 9 and older */
                ],
                'Safari': [/Version\/(\S+).*?Safari\//]
            },
            re, m, browser, version
        if (typeof elements === 'undefined') {
            elements = 2;
        } else if (elements === 0) {
            elements = 1337;
        }

        for (browser in regexps) {
            while (re = regexps[browser].shift()) {
                if (m = userAgent.match(re)) {
                    version = (m[1].match(new RegExp('[^.]+(?:\.[^.]+){0,' + --elements + '}')))[0];
                    callback(null, {
                        browser: browser,
                        version: version
                    });
                }
            }
        }
    }

    function _getOS(userAgent, elements, callback) {

        // If userAgent is undefined return browser: false
        if (typeof userAgent === 'undefined')
            return callback({
                os: false,
                version: ''
            })

        var regexps = {
                'Windows': [
                    /windows nt (\S+);/,
                    /windows me (\S+);/,
                    /win98/,
                    /win95/
                ],
                'iPad': [/ipad;/],
                'iPod': [/ipod;/],
                'iPhone': [/iphone;/],
                'Macintosh': [/macintosh (\S+)/],
                'Android': [/android (\S+)/],
                'BlackBerry': [/blackberry (\S+)/],
                'Mobile': [/webos (\S+)/],
                'Linux': [/linux/]
            },
            re, m, os, version
        if (typeof elements === 'undefined') {
            elements = 2;
        } else if (elements === 0) {
            elements = 1337;
        }
        for (os in regexps) {
            while (re = regexps[os].shift()) {
                if (m = userAgent.toLowerCase().match(re)) {
                    if (typeof m[1] !== 'undefined') {
                        version = (m[1].match(new RegExp('[^.]+(?:\.[^.]+){0,' + --elements + '}')))[0];
                    } else {
                        version = '';
                    }
                    if (os == "Windows") {
                        if (version == "6.3") {
                            version = "8.1";
                        } else if (version == "6.2") {
                            version = "8";
                        } else if (version == "6.1") {
                            version = "7";
                        } else if (version == "6.0") {
                            version = "Vista";
                        } else if (version == "5.2") {
                            version = "Server 2003/XP x64";
                        } else if (version == "5.1") {
                            version = "XP";
                        } else if (version == "6.1") {
                            version = "Me";
                        }
                    }
                    callback(null, {
                        os: os,
                        version: version
                    });
                }
            }
        }
    }

    function _fixHref(str, callback) {
        if (!str) {
            callback(new Error('fixHref requires a string as the first parameter'));
        } else {
            if (str.match(/^http:\/\//)) str = str.substring(7);
            if (str.match(/^https:\/\//)) str = str.substring(8);
            if (str.match(/^www\./)) str = str.substring(4);
            if (!/http:/.test(str) && !/https:/.test(str)) str = 'http://' + str;
            callback(false, str);
        }
    }

    function extend(d) {
        var callback = Array.prototype.slice.call(arguments).pop(),
            b = arguments,
            c, i = 1
        for (var len = b.length; i < len; i++)
            for (var e in c = b[i]) d[e] = c[e]
        if (typeof callback == 'function') callback(null, d)
        else return d
    }

    // each(array, function (item, i, done) { }, function () { })
    function each(array, iterator, cb) {
        var len = array.length;
        array.forEach(function(item, i) {
            iterator.call(null, item, i, done);
        });

        function done() {
            if (!--len) {
                return cb && cb();
            }
        }
    }

};
///*/////
//// Test Cross
////////////////////*/
exports.cross = {
    handler: function(request, reply) {
        var sesss = request.session.get('testSess');
        if (sesss == "session is OK") {
            reply('window.trackid="' + sesss + '"').header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");

        } else {
            request.session.set('testSess', "session is OK");
            reply('saved track').header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
        }
    }
};
///*/////
//// end test
////////////////////*/
///*/////
//// GET VISITS
////////////////////*/
exports.track = {
    handler: function(request, reply) {

        var namespace = request.headers.host.split(":")[0].split('.')[0];
        //rp is the type of implementation of page
        var rp = request.params.rp;

        getVisitData(request, reply, function(response) {

            //views can have multiple pixeis for each version of page from that campaign, thats why operation is necessary
            response.operation = request.params.operation;

            // TRACK NO SEESION
            if (rp == 's2s') {
                var sesss = "noSession";
                // TRACK WITH SEESION
            } else if (rp == 'img' || rp == 'script' || rp == 'iframe' || rp == 'redirect') {
                var sesss = request.session.get('visitSession');
            }
            // verify if is a valid id
            if (/^(([\da-fA-F]{24})|organic)$/gi.test(response.campid)) {
                db.collection('campaign_' + namespace).find({
                    _id: ObjectId(response.campid)
                }, {
                    _id: 1,
                    affiliates: 1,
                    status: 1
                }, function(err, curr) {

                    if (!err && curr && curr.length === 1 && (curr[0].status === 'enabled' || curr[0].status === 'active')) {
                        if (typeof sesss === "undefined" || sesss == 'noSession' || request.params.sesss == 'all' || sesss.affid !== request.params.affid) {
                            db.collection('visits_' + namespace).insert(response, function(err, curr) {
                                if (!err) {
                                    response.trackID = curr._id;
                                    request.session.set('visitSession', response);
                                    //CALL PIXEL FOR THIS ACTION
                                    pixels.pixelCallBack(namespace, response.campid, response.operation, response.affid, curr._id, rp, response.params, reply);
                                }
                            });
                        } else {
                            pixels.pixelCallBack(namespace, response.campid, response.operation, response.affid, '', rp, response.params, reply);
                        }
                    } else {
                        reply({
                            status: 'NOK'
                        });
                    }
                });
            } else {
                // TRY TO FIND CAMP ID BY TRANSACTION ID
                var transId = response.params.transaction_id;
                if (transId && transId.length == 24) {
                    var visitsDB = db.collection('visits_' + namespace);
                    var visitDTA = dbData.collection('visits_' + namespace);
                    visitsDB.findOne({
                        _id: ObjectId(transId)
                    }, function(err, curr) { // SEARCH TRACK DB
                        if (!err && curr) {
                            processConv(curr);
                        } else {
                            visitDTA.findOne({
                                _id: ObjectId(transId)
                            }, function(errDta, currDta) { // SEARCH DATA DB
                                if (!errDta && currDta) {
                                    processConv(currDta);
                                }
                            });
                        }
                    });
                } else {
                    // FALLBACK
                    reply({
                        status: 'NOK'
                    });
                }
            }


        });

        function processConv(curr) {
            var convsDB = db.collection('conversions_' + namespace);
            var convSave = {
                campid: ObjectId(curr.campid),
                host: curr.host,
                referer: curr.referer,
                referer_query: curr.referer_query,
                data: [],
                affid: ((curr.affid.length < 12) ? curr.affid : ObjectId(curr.affid)),
                params: curr.params,
                useragent: curr.useragent,
                useros: curr.useros,
                language: curr.language,
                city: curr.city,
                country: curr.country,
                ip: curr.ip,
                ll: curr.ll,
                domain: curr.domain,
                trackID: ObjectId(curr._id),
                operation: curr.operation,
                date: new Date()
            };
            //INSERT CONVERSION
            convsDB.insert(convSave, function(err, currDB) {
                if (!err) {
                    pixels.pixelCallBack(namespace, convSave.campid, convSave.operation, convSave.affid, convSave.trackID, rp, curr.params, reply);
                    //replyPixel(rp, reply);
                }
            });
        }

    }
};
///*/////
//// GET CONVERSIONS
////////////////////*/
exports.conv = {
    handler: function(request, reply) {
        var qs = require('querystring');
        var namespace = request.headers.host.split(":")[0].split('.')[0];
        if (request.query) {
            query = request.query;
        }
        var rp = request.params.rp;
        // TRACK WITH NO SEESION
        if (rp == 's2s') {
            var visitSession = request.session.get('visitSession');
            if (typeof visitSession !== 'undefined') {
                var trackID = visitSession.trackID;
            }
        } else if (rp == 'img' || rp == 'script' || rp == 'iframe') {
            var sesss = request.session.get('visitSession');
            if (typeof sesss !== 'undefined') {
                var trackID = sesss.trackID;
            }
        }
        req = request;
        res = reply;
        var visitsDB = db.collection('visits_' + namespace);
        var visitDTA = dbData.collection('visits_' + namespace);
        var operation = req.params.operation;

        function setConvStatus(curr) {
            var curr = curr[0],
                convSave = {
                    campid: ObjectId(req.params.campid),
                    host: curr.host,
                    referer: curr.referer,
                    referer_query: curr.referer_query,
                    data: [],
                    affid: ((curr.affid.length < 12) ? curr.affid : ObjectId(curr.affid)),
                    params: curr.params,
                    useragent: curr.useragent,
                    useros: curr.useros,
                    language: curr.language,
                    city: curr.city,
                    country: curr.country,
                    ip: curr.ip,
                    ll: curr.ll,
                    domain: curr.domain,
                    trackID: ObjectId(trackID),
                    operation: operation,
                    date: new Date()
                };

            setStatus(namespace, convSave, trackID, rp, reply, function(namespace, conversion, trackID, rp, reply) {
                var convsDB = db.collection('conversions_' + namespace);
                //TO DO: query to goals of campaign and if exist goals only count ones otherwise count all the times
                //CHECK IF CONVERSION TABLE FOR CAMPAIGN EXISTS
                convsDB.find({
                    operation: conversion.operation,
                    trackID: ObjectId(trackID)
                }, function(err, curr) {
                    //CHECK IF NO CONVERSION EXISTS
                    if (curr.length > 0) {
                        if (conversion.status === 'accepted') {
                            pixels.pixelCallBack(namespace, conversion.campid, conversion.operation, conversion.affid, curr._id, rp, curr.params, reply);
                        } else {
                            replyPixel(rp, reply);
                        }
                    } else {
                        //INSERT CONVERSION
                        convsDB.insert(convSave, function(err, curr) {
                            if (!err) {
                                //CALL PIXEL FOR THIS ACTION
                                if (conversion.status === 'accepted') {
                                    pixels.pixelCallBack(namespace, conversion.campid, conversion.operation, conversion.affid, trackID, rp, curr.params, reply);
                                } else {
                                    replyPixel(rp, reply);
                                }
                            }
                        });
                    }
                });
            });
        }

        if (typeof trackID !== 'undefined') {
            visitsDB.find({
                _id: ObjectId(trackID)
            }, function(err, curr) {
                if (typeof(curr) != undefined && !err) {
                    if (curr.length == 1) {
                        setConvStatus(curr);
                    } else {
                        // CHECK IF TRACKID EXISTS ON DATA TABLE - CRON JOB DATA MIGATION "ISSUE"
                        visitDTA.find({
                            _id: ObjectId(trackID)
                        }, function(err, currDta) {
                            if (typeof(currDta) != undefined && !err) {
                                if (currDta.length == 1) {
                                    setConvStatus(currDta);
                                } else {
                                    replyPixel(rp, reply);
                                }
                            } else {
                                replyPixel(rp, reply);
                            }
                        });
                    }
                } else {
                    replyPixel(rp, reply);
                }
            });
        } else {
            replyPixel(rp, reply);
        }
    }
};

///*/////
//// GET GLOBAL PIXEL
////////////////////*/

exports.convGlobal = {
    handler: function(request, reply) {
        var qs = require('querystring');

        var namespace = request.headers.host.split(":")[0].split('.')[0];
        var rp = request.params.rp;

        if (request.params.leadid === 'sess') {
            var sesss = request.session.get('visitSession');
            if (typeof sesss !== 'undefined') {
                var trackID = sesss.trackID;
            }
        } else {
            var trackID = request.params.leadid;
        }

        if (request.query) {
            query = request.query;
        }

        req = request;
        res = reply;

        var visitsDB = db.collection('visits_' + namespace);
        var operation = 'GLOBAL PIXEL';

        if (typeof trackID !== 'undefined') {
            //CHECK IF CAMPAIGN EXISTS
            visitsDB.find({
                _id: ObjectId(trackID)
            }, function(err, curr) {
                if (typeof(curr) != undefined && !err) {
                    if (curr.length == 1) {
                        var curr = curr[0],
                            convSave = {
                                campid: ObjectId(curr.campid),
                                host: curr.host,
                                referer: curr.referer,
                                referer_query: curr.referer_query,
                                data: query,
                                affid: ((curr.affid.length < 12) ? curr.affid : ObjectId(curr.affid)),
                                params: curr.params,
                                useragent: curr.useragent,
                                useros: curr.useros,
                                language: curr.language,
                                city: curr.city,
                                country: curr.country,
                                ip: curr.ip,
                                ll: curr.ll,
                                domain: curr.domain,
                                trackID: ObjectId(trackID),
                                operation: operation,
                                date: new Date()
                            };

                        setStatus(namespace, convSave, trackID, rp, reply, function(namespace, conversion, trackID, rp, reply) {
                            var convsDB = db.collection('conversions_' + namespace);
                            //TO DO: query to goals of campaign and if exist goals only count ones otherwise count all the times

                            //CHECK IF CONVERSION TABLE FOR CAMPAIGN EXISTS
                            convsDB.find({
                                operation: conversion.operation,
                                trackID: ObjectId(trackID)
                            }, function(err, curr) {
                                //CHECK IF NO CONVERSION EXISTS
                                if (curr.length > 0) {
                                    if (conversion.status === 'accepted') {
                                        pixels.pixelCallBack(namespace, conversion.campid, conversion.operation, conversion.affid, curr._id, rp, curr.params, reply);
                                    } else {
                                        replyPixel(rp, reply);
                                    }
                                } else {
                                    //INSERT CONVERSION
                                    convsDB.insert(convSave, function(err, curr) {
                                        if (!err) {
                                            //CALL PIXEL FOR THIS ACTION
                                            if (conversion.status === 'accepted') {
                                                pixels.pixelCallBack(namespace, conversion.campid, conversion.operation, conversion.affid, trackID, rp, curr.params, reply);
                                            } else {
                                                replyPixel(rp, reply);
                                            }
                                        }
                                    });
                                }
                            });
                        });
                    } else {
                        replyPixel(rp, reply);
                    }
                } else {
                    replyPixel(rp, reply);
                }
            });
        } else {
            replyPixel(rp, reply);
        }
    }
};

/*///////////
 ///////UNIVERSAL PIXEL
 /////////////////////*/
exports.universal = {
    handler: function(request, reply) {
        console.log("UNIVERSAL PIXEL");
        getVisitData(request, reply, function(response) {
            var namespace = request.headers.host.split(":")[0].split('.')[0];

            if (!namespace) {
                replyPixel(rp, reply);
            } else {
                var rp = 'script';
                response.operation = "";
                var vartoSearch = "local";
                var strreg = "local";
                var goalsDB = db.collection('goals_' + namespace);
                var sesss = request.session.get('visitSession');
                var visitsDB = db.collection('visits_' + namespace);

                //TODO GET CAMPID FROM URL
                //vartoSearch = escapeRegExp(request.headers.host);
                if (typeof request.headers.referer !== 'undefined') {
                    //vartoSearch = escapeRegExp(request.headers.referer);
                    vartoSearch = request.headers.referer.split(/\//g);
                    delete vartoSearch[vartoSearch.length - 1];
                    strreg = vartoSearch.join('/');
                }

                goalsDB.find({
                    url: {
                        $regex: "^" + strreg
                    }
                }, function(err, goalcurr) {
                    if (err && !goalcurr) {
                        console.error(err);
                    } else if (goalcurr.length > 0) {
                        ///////
                        /// VISIT
                        ///////
                        if (typeof sesss === "undefined" || sesss == 'noSession' || request.params.sesss == 'all') {
                            var istoreply = true;
                            for (var i in goalcurr) {
                                var thegoal = request.headers.referer.match(new RegExp("^" + escapeRegExp(goalcurr[i].url), 'g'));
                                if (thegoal) {
                                    istoreply = false;
                                    response.campid = ObjectId(goalcurr[i].campaign);
                                    response.affid = goalcurr[i].affid ? goalcurr[i].affid : 'organic';
                                    response.operation = goalcurr[i].name;
                                    visitsDB.insert(response, function(err, curr) {

                                        if (!err) {
                                            response.trackID = curr._id;
                                            request.session.set('visitSession', response);
                                            //CALL PIXEL FOR THIS ACTION
                                            pixels.pixelCallBack(namespace, response.campid, response.operation, response.affid, curr._id, rp, response.params, reply);
                                        }
                                    });
                                }
                            }

                            if (istoreply) {
                                replyPixel(rp, reply);
                            }
                            ////////
                            /// CONVERSION
                            ///////
                        } else {
                            var trackID = sesss.trackID;

                            if (!trackID) {
                                replyPixel(rp, reply);
                            } else {
                                var foundaff = false,
                                    foundgoal = false;
                                var goal = {};
                                var istoreply = true;
                                for (var index in goalcurr) {
                                    //var thegoal = request.headers.referer.match(new RegExp("^" + escapeRegExp(goalcurr[index].url), 'g'));
                                    if (request.headers.referer == goalcurr[index].url) {
                                        foundgoal = true;
                                        istoreply = false;
                                        var affiliate = goalcurr[index].affid === '' ? 'organic' : goalcurr[index].affid;
                                        if (String(sesss.affid) !== String(affiliate)) {
                                            goal = {
                                                campid: goalcurr[index].campaign,
                                                name: goalcurr[index].name
                                            };
                                        } else {
                                            foundaff = true;
                                            convertUniv(goalcurr[index].name, trackID);
                                            break;
                                        }
                                    }
                                }

                                if (!foundaff && foundgoal) {
                                    response.campid = ObjectId(goal.campaign);
                                    response.affid = affiliate;
                                    response.operation = goal.name;
                                    visitsDB.insert(response, function(err, curr) {
                                        if (!err) {
                                            response.trackID = curr._id;
                                            request.session.set('visitSession', response);
                                            //CALL PIXEL FOR THIS ACTION
                                            pixels.pixelCallBack(namespace, response.campid, response.operation, response.affid, curr._id, rp, response.params, reply);
                                            convertUniv(goalname, response.trackID);
                                        }
                                    });
                                }

                                if (istoreply) {
                                    replyPixel(rp, reply);
                                }

                                function convertUniv(goalname, trackID) {
                                    visitsDB.findOne({
                                        _id: ObjectId(trackID)
                                    }, function(err, curr) {
                                        if (err) {
                                            console.error(err);
                                        } else {
                                            var convsDB = db.collection('conversions_' + namespace);
                                            var convSave = {
                                                campid: ObjectId(curr.campid),
                                                host: curr.host,
                                                referer: curr.referer,
                                                referer_query: curr.referer_query,
                                                data: curr.query,
                                                affid: ((curr.affid.length < 12) ? curr.affid : ObjectId(curr.affid)),
                                                params: curr.params,
                                                useragent: curr.useragent,
                                                useros: curr.useros,
                                                language: curr.language,
                                                city: curr.city,
                                                country: curr.country,
                                                ip: curr.ip,
                                                ll: curr.ll,
                                                domain: curr.domain,
                                                trackID: ObjectId(trackID),
                                                operation: goalname,
                                                date: new Date()
                                            };


                                            //TO DO: query to goals of campaign and if exist goals only count ones otherwise count all the times
                                            setStatus(namespace, convSave, trackID, rp, reply, function(namespace, conversion, trackID, rp, reply) {

                                                //CHECK IF CONVERSION TABLE FOR CAMPAIGN EXISTS
                                                convsDB.find({
                                                    operation: conversion.operation,
                                                    trackID: ObjectId(trackID)
                                                }, function(err, curr) {

                                                    if (err) {

                                                        //CHECK IF NO CONVERSION EXISTS
                                                    } else if (curr.length > 0) {
                                                        if (conversion.status === 'accepted') {
                                                            pixels.pixelCallBack(namespace, conversion.campid, conversion.operation, conversion.affid, curr._id, rp, curr.params, reply);
                                                        } else {
                                                            replyPixel(rp, reply);
                                                        }
                                                    } else {
                                                        //INSERT CONVERSION
                                                        convsDB.insert(convSave, function(err, curr) {
                                                            if (err) {

                                                            } else {
                                                                //CALL PIXEL FOR THIS ACTION
                                                                if (conversion.status === 'accepted') {
                                                                    pixels.pixelCallBack(namespace, conversion.campid, conversion.operation, conversion.affid, trackID, rp, curr.params, reply);
                                                                } else {
                                                                    replyPixel(rp, reply);
                                                                }
                                                            }
                                                        });
                                                    }
                                                });
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    } else {
                        replyPixel(rp, reply);
                    }
                });
            }

        });

    }
};

/**
 *  AFFILIATE TRACKING URL
 */
exports.affiliate = {
    handler: function(request, reply) {
        var rp = 'postback';
        var queryUrl = request.url.query;
        var campid = queryUrl.campid;
        var affid = queryUrl.affid;
        var transaction_id = queryUrl.transaction_id;
        // CHECK TRANSACTION_ID
        if (typeof transaction_id === 'undefined') {
            // NO TRANSACTION_ID => GENERATE TRANSACTION_ID
            getVisitData(request, reply, function(response) {
                var namespace = response.domain.split('.')[0];
                var visitsDB = db.collection('visits_' + namespace);
                response.campid = ObjectId(campid);
                response.affid = affid;
                response.operation = rp;
                visitsDB.insert(response, function(err, curr) {
                    if (!err) {
                        response.trackID = curr._id;
                        request.session.set('visitSession', response);
                        //CALL PIXEL FOR THIS ACTION
                        pixels.pixelCallBack(namespace, response.campid, response.operation, response.affid, curr._id, rp, response.params, reply);
                    } else {
                        replyPixel(rp, reply);
                    }

                });
            });
        } else {
            // WITH TRANSACTION_ID => CONVERSION
            var resp = request.session.get('visitSession'); // COOKIE VERSION
            resp = {
                    trackID: transaction_id
                } // * * * TEST * * * COOKIELESS VERSION
            if (typeof resp != 'undefined') {
                if (resp.trackID == transaction_id) {
                    var namespace = request.headers.host.split(":")[0].split('.')[0];
                    var visitsDB = db.collection('visits_' + namespace);
                    var convsDB = db.collection('conversions_' + namespace);
                    visitsDB.findOne({
                        _id: ObjectId(transaction_id)
                    }, function(err, curr) {
                        if (!err && curr) { // FOUND THE VISIT/IMPRESSION
                            var convSave = {
                                campid: curr.campid,
                                host: curr.host,
                                referer: curr.referer,
                                referer_query: curr.referer_query,
                                data: [],
                                affid: ((curr.affid.length < 12) ? curr.affid : ObjectId(curr.affid)),
                                params: curr.params,
                                useragent: curr.useragent,
                                useros: curr.useros,
                                language: curr.language,
                                city: curr.city,
                                country: curr.country,
                                ip: curr.ip,
                                ll: curr.ll,
                                domain: curr.domain,
                                trackID: ObjectId(transaction_id),
                                operation: curr.operation,
                                date: new Date()
                            };
                            convsDB.insert(convSave, function(err, curIns) {
                                if (!err) {
                                    reply({
                                        status: 'ok',
                                        type: 'conversion',
                                        transaction_id: curIns.trackID
                                    }).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
                                } else {
                                    replyPixel(rp, reply);
                                }
                            });
                        } else {
                            replyPixel(rp, reply);
                        }
                    });
                }
            } else {
                replyPixel(rp, reply);
            }
        }
    }
}

function replyPixel(rp, reply) {
    if (rp == 'img') {
        var buf = new Buffer([
            0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00,
            0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x2c,
            0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02,
            0x02, 0x44, 0x01, 0x00, 0x3b
        ]);
        reply(buf).type('image/gif').header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
    } else if (rp == 'iframe') {
        reply('<html><title></title><body>no session</body></html>').header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
    } else if (rp == 'script') {
        reply("var output = {\
            status: 'nok',\
            message: 'no leadid invalid trackid'\
        }").header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
    } else if (rp == 's2s') {
        reply({
            status: 'nok',
            message: 'no leadid invalid trackid'
        }).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
    } else {
        reply();
    }
}

function setStatus(namespace, conversion, trackID, rp, reply, callback) {
    db.collection('campaign_' + namespace).findOne({_id:ObjectId(conversion.campid)},function(err1, curr2) {
        db.companies.findOne({
            _id: ObjectId(curr2.clients[0])
        }, function(err, curr) {
            if (typeof curr !== 'undefined' && !err) {
                conversion.status = whitelist(curr.whitelist, conversion.ip) ? 'accepted' : 'rejected';
                if(conversion.status = 'accepted'){
                    conversion.status = checkCountry(curr2.country, conversion.language[1]) ? 'accepted' : 'rejected';
                }

                if (typeof callback === 'function') {
                    callback(namespace, conversion, trackID, rp, reply);
                }
            }
        });
    })
}
function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
function checkCountry(countrys,convLang) {
    if (!countrys || countrys.length === 0) {
        return true;
    }
    for (var idx in countrys) {
        if (convLang.toUpperCase() === (countrys[idx].code).toUpperCase()) {
            return true;
        }
    }
    return false;
}

function whitelist(subnets, ip) {
    var range = [];
    if (!subnets || subnets.length === 0 || ip) {
        return true;
    }
    for (var idx in subnets) {
        var pattern = /\//g;
        if (pattern.test(subnets[idx])) {
            var net = subnets[idx].split("/");
            range[0] = (ip2long(net[0])) & ((-1 << (32 - parseInt(net[1]))));
            range[1] = (ip2long(net[0])) | (Math.pow(2, (32 - parseInt(net[1]))) - 1);
            if (range[1] >= ip2long(ip) && ip2long(ip) >= range[0]) {
                return true;
            }
        } else {
            if (ip === subnets[idx]) {
                return true;
            }
        }
    }
    return false;
}

function ip2long(IP) {
    IP = IP.split(".");
    return (+parseInt(IP[0]) << 24) + (+parseInt(IP[1]) << 16) + (+parseInt(IP[2]) << 8) + (+parseInt(IP[3]));
}
