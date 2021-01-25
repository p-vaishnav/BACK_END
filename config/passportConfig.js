const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const mongoose = require('mongoose');
const Employee = mongoose.model('employees');
const secretOrKey = require('./keys').secretOrKey;

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretOrKey
};

module.exports = (passport) => {
    passport.use(
        new jwtStrategy(opts, (jwtPayload, done) => {
            Employee.findById(jwtPayload.id)
                .then(emp => {
                if(emp) {
                    return done(null, emp);
                } else {
                    return done(null, false);
                }
                })
                .catch(e => {
                    console.error(e);
                });
        })
    );
};