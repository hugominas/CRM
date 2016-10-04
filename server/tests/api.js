'use strict';
const Code = require('code');
const server = require("../api");
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const suite = lab.suite;
const test = lab.test;
const expect = Code.expect;
let affectedLeadsToDelete = [];

suite('API operations', () => {

    test('Check if can set user', (done)=> {
      var options = {
          method: "GET",
          url: "/api/user",
          payload:{
            data:{
              name:'Hugo Rodrigues',
              email:'hugo.rodrigues@hiperformancesales.com',
              pass:'12345'
            }
          }
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
		test('Check if can read user', (done)=> {
			done();
		})
		test('Check if can put user', (done)=> {
			done();
		})
		test('Check if can delete user', (done)=> {
			done();
		})

    test('Check if server is saving visits with campid and single', (done)=> {
      var options = {
          method: "GET",
          url: "/track/57ebbc827c06bdfb3408800b/save/single/test1/test2"
      };

      //TEST START
      server.inject(options, function (response) {
        let resp = JSON.parse(response.payload);
        expect(resp.status).to.equal('OK');
        expect(/^[0-9a-fA-F]{24}$/.test(resp.data)).to.equal(true);
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

});
