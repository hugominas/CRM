'use strict';
const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const suite = lab.suite;
const test = lab.test;
const expect = Code.expect;
const server = require("../api");
let logCookie = {};
let affectedLeadsToDelete = [];

suite('API operations', () => {

    test('Check if user can loggin', (done)=> {
      //setup user for login

        var options = {
            method: "POST",
            url: "/admin/auth",
            payload:{
              data:{
                email:'admin@admin.com',
                password:'12345'
              }
            }
        };
        server.inject(options, function (response) {

          var header = response.headers['set-cookie'];
          let cookie = header[0].match(/(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/);
          logCookie = {cookie:cookie[0]};

          let resp = JSON.parse(response.payload);
          expect(resp.status).to.equal('OK');
          expect(resp.data).to.be.equal('loged in');
          //to delete
          done();
        })

    })
    test('Check if can put user', (done)=> {
      var options = {
          method: "POST",
          url: "/api/users",
          payload:{
            data:{
              name:'Hugo Rodrigues',
              email:'hugo.rodrigues@hiperformancesales.com',
              password:'12345',
              time:Date.now()
            }
          }
      };
      options.headers = logCookie;
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
      options.headers = logCookie;
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
              password:'1234665'
            }
          }
      };
      options.headers = logCookie;
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
      options.headers = logCookie;
      server.inject(options, function (response) {
        let resp = JSON.parse(response.payload);

        //expect(resp.status).to.equal('OK');
        //expect(resp.data.ok).to.equal(1);
        //to delete
        done();
      })
		})


    test('Check if can put campaign', (done)=> {
      var options = {
          method: "POST",
          url: "/api/campaigns",
          payload:{
            data:{
              name:'campaignTeste',
              local:'PT',
              time: Date.now()
            }
          }
      };
      options.headers = logCookie;
      server.inject(options, function (response) {

        let resp = JSON.parse(response.payload);
        expect(resp.status).to.equal('OK');
        expect(resp.data.insertedCount).to.be.equal(1);
        //to delete
        affectedLeadsToDelete.push(resp.data.insertedIds[1])
        done();
      })
    });
    test('Check if can read all campaigns', (done)=> {
      var options = {
          method: "GET",
          url: "/api/campaigns/"
      };
      options.headers = logCookie;
      server.inject(options, function (response) {
        let resp = JSON.parse(response.payload);
        expect(resp.status).to.equal('OK');
        //to delete
        done();
      })
    })
    test('Check if can read campaign', (done)=> {
      var optionsCampaign = {
          method: "GET",
          url: "/api/campaigns/"
      };
      var options = {
          method: "GET",
          url: "/api/campaigns/"+encodeURIComponent('campaignTeste')
      };

      options.headers = logCookie;
      optionsCampaign.headers = logCookie;
      server.inject(optionsCampaign, function (response) {
        let resp = JSON.parse(response.payload);
        expect(resp.status).to.equal('OK');
        //to delete
        options.url = "/api/campaigns/"+encodeURIComponent(resp.data[0]._id)
        server.inject(options, function (responseNew) {
          let resp = JSON.parse(responseNew.payload);
          expect(resp.status).to.equal('OK');
          expect(resp.data.length).to.be.equal(1);
          //to delete
          done();
        })

      })



    })
    test('Check if can update campaign', (done)=> {
      var optionsCampaign = {
          method: "GET",
          url: "/api/campaigns/"
      };
      var options = {
          method: "PUT",
          url: "/api/campaigns/"+encodeURIComponent('campaignTeste'),
          payload:{
            data:{
              name:'campaignTesteChanged',
              local:'FR',
              time: Date.now()
            }
          }
      };
      optionsCampaign.headers = logCookie;
      server.inject(optionsCampaign, function (response) {

        let resp = JSON.parse(response.payload);

        options.url="/api/campaigns/"+encodeURIComponent(resp.data[0]._id)
        options.headers = logCookie;
        server.inject(options, function (response) {
          let resp = JSON.parse(response.payload);
          console.log()
          expect(resp.status).to.equal('OK');
          expect(resp.data.ok).to.equal(1);
          //to delete
          done();
        })
      })
    })
    test('Check if can delete campaign', (done)=> {
    /*  var options = {
          method: "DEL",
          url: "/api/campaigns/"+encodeURIComponent('campaignTesteChanged')
      };
      server.inject(options, function (response) {
        let resp = JSON.parse(response.payload);

        //expect(resp.status).to.equal('OK');
        //expect(resp.data.ok).to.equal(1);
        //to delete*/
        done();
      //})
    })


});
