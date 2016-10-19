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
      server.inject(options, function (response) {

        let resp = JSON.parse(response.payload);
        expect(resp.status).to.equal('OK');
        expect(resp.data.ok).to.equal(1);
        //to delete
        done();
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
