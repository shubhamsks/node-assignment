const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt  = require('jsonwebtoken');


const User = require('./models/users');

const config = require('./config');




exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.getToken =(user)=>{
    return jwt.sign(user, config.secretKey, {expiresIn:3600})
}
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,(jwtPayload, done)=>{
    // console.log('authenticate.js : 29');
    // console.log('jwt payload',jwtPayload);
    User.findOne({_id:jwtPayload._id},(err, user)=>{
        if(err) {
            return done(err,false);
        } else if(user) {
            return done(null, user);
        } else{
            done(null, false);
        }
    });
}));
exports.verifyAdmin = (req, res, next) =>{
    console.log('authenticate.js');
    if(req.user.admin) {
        console.log(req.user);
        next();
    } else{
        res.statusCode = 403;
        res.setHeader('Content-Type','application/json');
        res.json({error:"You do not have permission to do this operation"})
    }
}
exports.verifyUser = passport.authenticate('jwt',{session:false});