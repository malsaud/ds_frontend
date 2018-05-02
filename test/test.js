var assert = require('assert');
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

var expect = chai.expect;

var app = require('../app.js');


describe('App', function() {

  describe('getDensities', function() {
    it('should return array of current populations', function(done) {
      chai.request(app)
  		.get('/getDensities')
  		.end(function(err, res) {
    		expect(res).to.have.status(200);
    		expect(res.body.densities).to.have.lengthOf(10);
    		done();                            
  		});
    });
  });

  describe('queryTime', function(){
  	it('should return array of population at requested time/day', function(done){
  		chai.request(app)
  		  .post('/home/queryTime')
  		  .send({day: 'MONDAY', time: '6:00 PM'})
  		  .end(function(err, res) {
    		expect(res).to.have.status(200);
    		// console.log(res.body.densities);
    		expect(res.body.densities).to.have.lengthOf(10);
    		expect(res.body.densities[2].population).to.equal(0.8);
    		expect(res.body.densities[5].population).to.equal(0);
    		done();                            
  		});
  	});
  });

});