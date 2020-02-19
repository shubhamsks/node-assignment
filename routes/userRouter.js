const express = require('express');
const userRouter = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/users');
const passport = require('passport');


const {contentType,applicationJson,statusCode} = require('./utils');


userRouter.use(bodyParser.json());
userRouter.get('/',(req, res)=>{
  res.send('respond with a source');
});

userRouter.post('/signup',(req,res,next)=>{
  User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
    if(err) {
      res.statusCode = statusCode.internelServerError;
      res.setHeader(contentType,applicationJson);
      res.json({error:err});
    } else {
      passport.authenticate('local')
      (req,res,()=>{
        res.statusCode = statusCode.ok;
        res.setHeader(contentType,applicationJson);
        res.json({successs:true,status:'Registration Successful !'});
      });
    }
  });
});

userRouter.post('/login',passport.authenticate('local'),(req, res)=>{
  res.statusCode = statusCode.ok;
  res.setHeader(contentType,applicationJson);
  res.json({successs:true,status:"You are successfully logged in !."});
});

userRouter.get('/logout',(req,res)=>{
  if(req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.setHeader(contentType,'text/plain');
    res.end('You are logged out');
  } else {
    const error = new Error('You are not logged in');
    err.status = 403;
    next(err);
  }
})

module.exports = userRouter;
