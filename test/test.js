(function() {


process.env.NODE_ENV = "testing";
var expect = require("chai").expect;
var assert = require('chai').assert;
var superagent = require('superagent');

describe('server', function() {
    
    it('should return open login /', function( done ) {
        superagent.get('http://localhost:5000/').end(function(err, res) {
            if (err) { return done(err); }
            assert.equal(res.status, 200);
            done();
        });
        
    });
    
    it('should return a 200 at /indexLogin', function( done ) {
        superagent.get('http://localhost:5000/indexLogin').end(function(err, res) {
            if (err) { return done(err); }
            assert.equal(res.status, 200);
            done();
        });
        
    });

    it('should return a 200 at /register', function( done ) {
        superagent.get('http://localhost:5000/register').end(function(err, res) {
            if (err) { return done(err); }
            assert.equal(res.status, 200);
            done();
        });
    });

    it('should return a 200 at /register', function( done ) {
        superagent.post('http://localhost:5000/register')
            .send({ password: 'password', 
                    repassword: 'password', 
                    email: 'mail@gmail.com',
                    firstname: 'Mujo',
                    lastname:'Mujic'}) // sends a JSON post body
            .set('X-API-Key', 'foobar')
            .set('accept', 'json')
            .end(function(err, res) {
                if (err) { return done(err); }
                assert.equal(res.status, 200);
                done();
            });
    });

    it('should return a 200 at /indexLogin', function( done ) {
        superagent.post('http://localhost:5000/indexLogin')
            .send({ password: 'password', 
                    user: 'mail@gmail.com'}) // sends a JSON post body
            .set('X-API-Key', 'foobar')
            .set('accept', 'json')
            .end(function(err, res) {
                if (err) { return done(err); }
                assert.equal(res.status, 200);
                done();
            });
    });

});
}).call(this);