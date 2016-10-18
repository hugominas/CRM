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

    test('Check if can put user', (done)=> {
      var options = {
          method: "POST",
          url: "/api/users",
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
        expect(resp.data.insertedCount).to.be.equal(1);
        //to delete
        affectedLeadsToDelete.push(resp.data.insertedIds[1])
        done();
      })
    });
		test('Check if can read user', (done)=> {
      var options = {
          method: "GET",
          url: "/api/users/"+encodeURIComponent('hugo.rodrigues@hiperformancesales.com')
      };
      server.inject(options, function (response) {
        let resp = JSON.parse(response.payload);
        expect(resp.status).to.equal('OK');
        //to delete
        done();
      })
		})
		test('Check if can update user', (done)=> {
      var options = {
          method: "PUT",
          url: "/api/users/"+encodeURIComponent('hugo.rodrigues@hiperformancesales.com'),
          payload:{
            data:{
              name:'Rodrigues',
              email:'hugo.teste@hiperformancesales.com',
              pass:'1234665'
            }
          }
      };
      server.inject(options, function (response) {

        let resp = JSON.parse(response.payload);
        expect(resp.status).to.equal('OK');
        expect(resp.data.ok).to.equal(1);
        //to delete
        done();
      })
		})
		test('Check if can delete user', (done)=> {
      var options = {
          method: "DEL",
          url: "/api/users/"+encodeURIComponent('hugo.rodrigues@hiperformancesales.com')
      };
      server.inject(options, function (response) {
        let resp = JSON.parse(response.payload);

        //expect(resp.status).to.equal('OK');
        //expect(resp.data.ok).to.equal(1);
        //to delete
        done();
      })
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
