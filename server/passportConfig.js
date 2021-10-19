const User = require("./src/models/user");
const bcrypt = require("bcrypt");
const localStrategy = require("passport-local").Strategy;


module.exports = function (passport) {
    passport.use(
        new localStrategy((username, password, done) => {
            User.findOne({ username: username.toLowerCase() }, (err, user) => {
                if (err) throw err;
                if (!user) return done(null, false);
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) throw err;
                    if (result === true) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                });
            });
        })
    );

    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    });
    passport.deserializeUser((id, cb) => {
        User.findOne({ _id: id }, (err, user) => {
            const userInformation = {
                id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName
            };
            cb(err, userInformation);
        });
    });
};