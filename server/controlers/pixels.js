var Db = require('../conf/db');
var request = require('request');
var db = Db.dbTrackLocal();
var JSPixelInit = true;
var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;
//Pixel CallBack
exports.pixelCallBack = function (namespace, campID, goalName, affID, trackID, implemtype, thisParams, reply) {
    //company name | campaign id | operation id | affiliate id | track id | implementation type | url params | reply
    //Check for goals
    var goalCollection = db.collection('goals_' + namespace);
    goalCollection.find({
        $or: [{
            campaign: ObjectId(campID),
            affid: ((affID.length==12)?ObjectId(affID):""),
            name: goalName
        }, {
            campaign: 'ALL',
            affid: ((affID.length==12)?ObjectId(affID):"")
        }]
    }, function (err, curr) {
        if (!err) {
            if (curr.length > 0) {
                var outputStr = new Array();
                var index = 0;
                preparePixels(curr, reply, implemtype, thisParams, outputStr, index);
            } else {
                outputPixel(reply, implemtype, [], trackID);
                //reply('no pixel').header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
            }
        } else {
            console.error(['pixelcallBack: error to find goals in tha campaign']);
        }
    });
}
exports.adsCallBack = function (namespace, campID, goalName, affID, trackID, implemtype, thisParams, reply) {
    //company name | campaign id | operation id | affiliate id | track id | implementation type | url params | reply
    //Check for goals
    console.log('01');
    prepareAd(reply, 'img', thisParams, "http://mtriks.gomobbi.netdna-cdn.com/transparent.gif");
}
function prepareAd(reply, implemtype, thisParams, outputStr) {
    console.log('02');
    url = "http://mtriks.gomobbi.netdna-cdn.com/transparent.gif";
    implementIMGAd(reply, implemtype, url, 'null', thisParams, outputStr);
    console.error(['Image URL invalid or not insert']);
}
function implementIMGAd(reply, type, data, len, thisParams, outputStr) {
    console.log('03');
    outputStr = [];
    outputStr.push(data);
    outputAd(reply, type, outputStr);
}
function outputAd(reply, implemtype, outputStr) {
    console.log('04');
    outputStr = outputStr.join('');
    var buf = new Buffer([
        0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00,
        0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x2c,
        0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02,
        0x02, 0x44, 0x01, 0x00, 0x3b
    ]);
    reply(buf).type('image/gif').header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
}
//Replace params in url and forward pixel (after for verification) to implementation
function preparePixels(curr, reply, implemtype, thisParams, outputStr, index) {
    var len = curr.length;
    //loop for actions on this goal
    if (len > index) {
        //prepare url fo send
        var url = curr[index].code;
        var strToreplace = url.match(/{{+\w+}}/g);
        //for each action replace params in the url
        if (strToreplace) {
            var k =0;
            for (var r in thisParams) {
                url = url.replace(strToreplace[k], thisParams[r]);
                k++;
            }
        }
        var actiontype = curr[index].type;
        switch (actiontype) {
            case 's2s':
                //SEND VARS TO URL
                var patt = /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-\?&]*)*\/?\S/g;
                var verifyurl = patt.exec(url);
                if (verifyurl !== null) {
                    request.get(url, function (err, httpResponse, body) {
                        patt = /[^2]\d\d/g;
                        if (err) {
                            var statusquo = 'failed: ' + err;
                            implementS2SPixel(reply, implemtype, statusquo, len - 1, curr, thisParams, outputStr, index);
                            //if http status code not successful print code
                        } else if (patt.test(httpResponse.statusCode)) {
                            var statusquo = 'Error code reply in S2S pixel: ' + httpResponse.statusCode;
                            implementS2SPixel(reply, implemtype, statusquo, len - 1, curr, thisParams, outputStr, index);
                        } else {
                            implementS2SPixel(reply, implemtype, body, len - 1, curr, thisParams, outputStr, index);
                        }
                    });
                } else {
                    var statusquo = 'error: S2S URL invalid or not insert';
                    implementS2SPixel(reply, implemtype, statusquo, len - 1, curr, thisParams, outputStr, index);
                }
                break;
            case 'script':
            case 'javascript':
                //OUTPUT JS FILE
                var patt = /<script[\s\w="'\/\\]*?>[\s\S]*?<\/script>/g;
                var verifyurl = patt.test(url);
                if (verifyurl) {
                    url = url.replace(/<[\/]?script>/g, '');
                }
                implementJSPixel(reply, implemtype, url, len - 1, curr, thisParams, outputStr, index);
                break;
            case 'iframe':
                //OUTPUT IFRAME File
                var patt = /<iframe[\s\w="'\/\\]*?>[\s\S]*?<\/iframe>/g;
                var verifyurl = patt.test(url);
                if (verifyurl) {
                    url = url.replace(/<[\/]?iframe>/g, '');
                }
                implementIFPixel(reply, implemtype, url, len - 1, curr, thisParams, outputStr, index);
                break;
            case 'img':
            case 'image':
                //OUTPUT Image File
                var patt = /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/g;
                var verifyurl = patt.test(url);

                if (verifyurl !== false) {
                    implementIMGPixel(reply, implemtype, url, len - 1, curr, thisParams, outputStr, index);
                } else {
                    //url = "http://www.mtriks.com/assets/transparent.gif";
                    url = "http://mtriks.gomobbi.netdna-cdn.com/transparent.gif";
                    implementIMGPixel(reply, implemtype, url, len - 1, curr, thisParams, outputStr, index);
                    console.error(['Image URL invalid or not insert']);
                }
                break;
            case 'redirect':
                var patt = /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-\?&]*)*\/?\S/g;
                var verifyurl = patt.test(url);
                if (verifyurl) {
                    implementRDPixel(reply, implemtype, url, len - 1, curr, thisParams, outputStr, index);
                }
                break;
            default:
                console.log('no code '+actiontype);
        }
    }
}

/*
 Implement type of pixel in type code (var type) in site
 */
function implementIMGPixel(reply, type, data, len, curr, thisParams, outputStr, index) {
    switch (type) {
        case 'img':
            outputStr = [];
            outputStr.push(data);
            break;
        case 'iframe':
            var img = "<iframe src=" + data + "></iframe>";
            outputStr.push(img);
            break;
        case 'script':
            var img = "img[" + index + "] = new Image(1,1); img[" + index + "].src = '" + data + "';document.body.appendChild(img[" + index + "]);";
            outputStr.push(img);
            break;
    }

    if (index == len) {
        outputPixel(reply, type, outputStr, curr);
    } else {
        index++;
        preparePixels(curr, reply, type, thisParams, outputStr, index);
    }
}

function implementIFPixel(reply, type, data, len, curr, thisParams, outputStr, index) {
    switch (type) {
        case 'iframe':
            var iframe = "<iframe src=" + data + "></iframe>"
            outputStr.push(iframe);
            break;
        case 'script':
            var code = "<script type='text/javascript'>" + data + "</script>";
            outputStr.push(code);
            break;
    }

    if (index == len) {
        outputPixel(reply, type, outputStr);
    } else {
        index++;
        preparePixels(curr, reply, type, thisParams, outputStr, index);
    }
}

function implementJSPixel(reply, type, data, len, curr, thisParams, outputStr, index) {
    if (JSPixelInit) {
        init = "var iframe=array();var img=array();var code=array();"
        outputStr.push(init);
        JSPixelInit = false;
    }
    switch (type) {
        case 'script':
            var code = data;
            outputStr.push(code);
            break;
        case 'iframe':
            var iframe = "iframe[" + index + "] = document.createElement( 'iframe' );iframe[" + index + "].width = 1;iframe[" + index + "].scrolling = 'no';iframe[" + index + "].height = 1;iframe[" + index + "].frameBorder = 0;iframe[" + index + "].id = 'iframe_'+" + index + ";iframe[" + index + "].src = '" + data + "'; document.getElementsByTagName('head')[0].appendChild(iframe[" + index + "]);"
            outputStr.push(iframe);
            break;
    }

    if (index == len) {
        outputPixel(reply, type, outputStr);
    } else {
        index++;
        preparePixels(curr, reply, type, thisParams, outputStr, index);
    }
}

function implementS2SPixel(reply, type, data, len, curr, thisParams, outputStr, index) {
    switch (type) {
        case 'iframe':
            var iframe = "<iframe>" + data + "</iframe>";
            outputStr.push(iframe);
            break;
        case 'script':
            var code = 'var response = {status:"ok",message:' + data + '};';
            outputStr.push(code);
            break;
    }
    if (index === len) {
        outputPixel(reply, type, outputStr, curr);
    } else {
        index++;
        preparePixels(curr, reply, type, thisParams, outputStr, index);
    }
}


function implementRDPixel(reply, type, data, len, curr, thisParams, outputStr, index) {
    switch (type) {
        case 'script':
            var code = "window.onload = function(){window.location='" + data + "';}";
            outputStr.push(code);
            break;
        case 'iframe':
            var iframe = "<script type='text/javascript'>window.onload = function(){window.location='" + data + "';}" + "</script>";
            outputStr.push(iframe);
            break;
        case 'redirect':
            outputStr.push(data);
            break;
    }
    if (index == len) {
        outputPixel(reply, type, outputStr);
    } else {
        index++;
        preparePixels(curr, reply, type, thisParams, outputStr, index);
    }
}

/*
 * Reply of all pixels
 */
function outputPixel(reply, implemtype, outputStr, curr) {
    if (typeof outputStr == 'undefined' || outputStr.length == 0) {
        outputStr = 'no pixel';
    } else {
        outputStr = outputStr.join('');
    }
    switch (implemtype) {
        case 'iframe':
            reply("<html><title></title><body>" + outputStr + "</body></html>").header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
            break;
        case 'script':
            reply(outputStr).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
            break;
        case 's2s':
            reply({
                id: curr._id,
                status: 'ok',
                body: outputStr
            }).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
            break;
        case 'img':
        case 'redirect':
            if (outputStr !== 'no pixel') {
                reply().redirect(outputStr);
            }else{
                reply();
            }
            break;
        case 'postback':
            reply({
                status: 'ok',
                type: 'impression',
                transaction_id: curr
            }).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
            break;
        default:
            if (outputStr !== 'no pixel') {
                reply(outputStr).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
            } else {
                var buf = new Buffer([
                    0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00,
                    0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x2c,
                    0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02,
                    0x02, 0x44, 0x01, 0x00, 0x3b
                ]);
                reply(buf).type('image/gif').header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
            }
    }
}
