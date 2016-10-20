'use strict';
const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const suite = lab.suite;
const test = lab.test;
const expect = Code.expect;
const server = require("../api");
let affectedLeadsToDelete = [];

suite('Tracking GET/POST operations', () => {

    test('Check if server is saving visits data', (done)=> {
      var options = {
          method: "GET",
          url: "/track/57ebbc827c06bdfb3408800b/start/57ebbc827c06bdfb3408800b"
      };
      server.inject(options, function (response) {
        let resp = JSON.parse(response.payload);
        expect(resp.status).to.equal('OK');
        expect(/^[0-9a-fA-F]{24}$/.test(resp.data)).to.be.true();
        //to delete
        affectedLeadsToDelete.push(resp.data)
        done();
      })
    });

    test('Check if server is saving visits with campid and multi', (done)=> {
      var options = {
          method: "GET",
          url: "/track/57ebbc827c06bdfb3408800b/save/57ebbc827c06bdfb3408800b/test1/test2"
      };
      server.inject(options, function (response) {
        let resp = JSON.parse(response.payload);
        expect(resp.status).to.equal('OK');
        expect(/^[0-9a-fA-F]{24}$/.test(resp.data)).to.be.true();
        //to delete
        affectedLeadsToDelete.push(resp.data)
        done();
      })
    });

    test('Check if server is saving visits with campid and single', (done)=> {
      var options = {
          method: "GET",
          url: "/track/57ebbc827c06bdfb3408800b/save/single/test1/test2"
      };

      //TEST START
      server.inject(options, function (response) {
        let resp = JSON.parse(response.payload);
        expect(resp.status).to.equal('OK');
        expect(/^[0-9a-fA-F]{24}$/.test(resp.data)).to.be.true();
        affectedLeadsToDelete.push(resp.data)
        //GET COOKIE
        var header = response.headers['set-cookie'];
        let cookie = header[0].match(/(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/);
        options.headers = {cookie:cookie[0]};

        server.inject(options, function (response1) {
          // you can only save one lead
          let resp1 = JSON.parse(response1.payload);
          expect(resp1.status).to.equal('NOK');
          expect(resp1.data).to.equal('you can only save one lead');
          done()
        })

        //TEST INSERT CONV
      })
    });

    test('Check if I can save multiple leads without partner key', (done)=> {
      var options = {
          method: "GET",
          url: "/track/57ebbc827c06bdfb3408800b/save/stuff/test1/test2"
      };

      //TEST START
      server.inject(options, function (response) {
        let resp = JSON.parse(response.payload);
        expect(resp.statusCode).to.equal(400);
        expect(resp.error).to.equal('Bad Request');
        done();
      })
    })

    test('Check if server is duplicating conversions', (done)=> {
      var options = {
          method: "GET",
          url: "/track/57ebbc827c06bdfb3408800b/save/57ebbc827c06bdfb3408800b/test1/test2"
      };

      //TEST START
      server.inject(options, function (response) {
        let resp = JSON.parse(response.payload);
        expect(resp.status).to.equal('OK');
        expect(/^[0-9a-fA-F]{24}$/.test(resp.data)).to.be.true();
        affectedLeadsToDelete.push(resp.data)
        //GET COOKIE
        var header = response.headers['set-cookie'];
        let cookie = header[0].match(/(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/);
        options.headers = {cookie:cookie[0]};

        server.inject(options, function (response1) {
          // you can only save one lead
          let resp1 = JSON.parse(response1.payload);
          expect(resp1.status).to.equal('NOK');
          done()
        })

        //TEST INSERT CONV
      })
    });


    test('Check if server is can save conversions with different data', (done)=> {
      var options = {
          method: "GET",
          url: "/track/57ebbc827c06bdfb3408800b/save/57ebbc827c06bdfb3408800b/same/data"
      };

      //TEST START
      server.inject(options, function (response) {
        let resp = JSON.parse(response.payload);
        expect(resp.status).to.equal('OK');
        expect(/^[0-9a-fA-F]{24}$/.test(resp.data)).to.be.true();
        affectedLeadsToDelete.push(resp.data)
        //GET COOKIE
        var header = response.headers['set-cookie'];
        let cookie = header[0].match(/(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/);
        options.headers = {cookie:cookie[0]};
        options.url = "/track/57ebbc827c06bdfb3408800b/save/57ebbc827c06bdfb3408800b/other/data"
        server.inject(options, function (response1) {
          // you can only save one lead
          let resp1 = JSON.parse(response1.payload);
          expect(resp1.status).to.equal('OK');
          expect(/^[0-9a-fA-F]{24}$/.test(resp1.data)).to.be.true();
          done()
        })

        //TEST INSERT CONV
      })
    });


    test('Check if data is saved in post', (done)=> {
      var options = {
          method: "POST",
          url: "/track/57ebbc827c06bdfb3408800b/save/57ebbc827c06bdfb3408800b/same/data",
          payload: {
            data:{
              other: 'data1',
              data: 'data2'
            }
          }
      };

      //TEST START
      server.inject(options, function (response) {
        let resp = JSON.parse(response.payload);
        expect(resp.status).to.equal('OK');
        expect(/^[0-9a-fA-F]{24}$/.test(resp.data)).to.be.true();
        affectedLeadsToDelete.push(resp.data)
        done();

        //TEST INSERT CONV
      })
    });

    test('Check if refused post with same data', (done)=> {
      var options = {
          method: "POST",
          url: "/track/57ebbc827c06bdfb3408800b/save/57ebbc827c06bdfb3408800b/same/data",
          payload: {
            data:{
              other: 'data1',
              data: 'data2'
            }
          }
      };

      //TEST START
      server.inject(options, function (response) {
        let resp = JSON.parse(response.payload);
        expect(resp.status).to.equal('OK');
        expect(/^[0-9a-fA-F]{24}$/.test(resp.data)).to.be.true();
        affectedLeadsToDelete.push(resp.data)
        //GET COOKIE
        var header = response.headers['set-cookie'];
        let cookie = header[0].match(/(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/);
        options.headers = {cookie:cookie[0]};
        server.inject(options, function (response1) {
          // you can only save one lead
          let resp1 = JSON.parse(response1.payload);
          expect(resp1.status).to.equal('NOK');
          done()
        })

        //TEST INSERT CONV
      })
    });

    test('Check accepted post with diferent data', (done)=> {
      var options = {
          method: "POST",
          url: "/track/57ebbc827c06bdfb3408800b/save/57ebbc827c06bdfb3408800b/same/data",
          payload: {
            data:{
              other: 'data1',
              data: 'data2'
            }
          }
      };

      //TEST START
      server.inject(options, function (response) {
        let resp = JSON.parse(response.payload);
        expect(resp.status).to.equal('OK');
        expect(/^[0-9a-fA-F]{24}$/.test(resp.data)).to.be.true();
        affectedLeadsToDelete.push(resp.data)
        //GET COOKIE
        var header = response.headers['set-cookie'];
        let cookie = header[0].match(/(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/);
        options.headers = {cookie:cookie[0]};
        options.payload = {
          data:{
            other: 'different data1',
            data: 'different data2'
          }
        }
        server.inject(options, function (response1) {
          // you can only save one lead
          let resp1 = JSON.parse(response1.payload);
          expect(resp1.status).to.equal('OK');
          expect(/^[0-9a-fA-F]{24}$/.test(resp1.data)).to.be.true();
          done()
        })

        //TEST INSERT CONV
      })
    });
});


const conv = require("../controlers/conv").track;

suite('Tracking class', () => {

    test('Check conversion method is working', (done)=> {
        let requestExtraParts ={'0':'data teste 1'};

        conv.convSave({campid:'57ebbc827c06bdfb3408800b', action:'start'}, requestExtraParts).then((curr)=>{
            requestExtraParts.leadId=curr;
            conv.convSave({campid:'57ebbc827c06bdfb3408800b', action:'savefromclass'}, requestExtraParts).then((curr1)=>{
              done();
            })
        })
      })
    test('Check if to object is working', (done)=> {
        expect(conv.toObject(['this', 'is', 'an', 'object'])).to.be.an.object();
        done();
      })
    test('Check deep compare', (done)=> {
        expect(conv.deepCompare({'a':'this','b':'is','c':{'d':'the','e':'same'}},{'a':'this','b':'is','c':{'d':'the','e':'same'}})).to.be.true();
        done();
      })
  })
