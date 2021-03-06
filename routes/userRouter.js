const express = require('express');
const userRouter = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/users');
const passport = require('passport');
const {getToken,jwtPassport, verifyAdmin,verifyUser} = require('../authenticate');

const  {contentType,applicationJson,statusCode} = require('./utils');
const cors = require('./cors');

userRouter.use(bodyParser.json());
userRouter.get('/',cors.corsWithOptions, verifyUser,verifyAdmin,(req, res, next)=>{
  User.find({})
  .then((users)=>{
    res.statusCode = statusCode.ok;
    res.setHeader(contentType, applicationJson);
    res.json(users);
  })
  .catch(err=>next(err));
});

userRouter.post('/signup',cors.corsWithOptions, (req,res,next)=>{
  User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
    if(err) {
      res.statusCode = statusCode.internelServerError;
      res.setHeader(contentType,applicationJson);
      res.json({error:err});
    } else {
      if(req.body.firstname) {
        user.firstname = req.body.firstname;
      }
      if(req.body.lastname) {
        user.lastname = req.body.lastname;
      }
      user.save((err, user)=>{
        if(err) {
          res.statusCode = statusCode.internelServerError;
          res.setHeader(contentType,applicationJson);
          res.json({success:false,error:err});
        }
        passport.authenticate('local')
        (req,res,()=>{
          res.statusCode = statusCode.ok;
          res.setHeader(contentType,applicationJson);
          res.json({successs:true,status:'Registration Successful !'});
        });
      })
    }
  });
});

userRouter.post('/login',cors.corsWithOptions, passport.authenticate('local'),(req, res)=>{
  const token = getToken({_id:req.user._id});
  res.statusCode = statusCode.ok;
  res.setHeader(contentType,applicationJson);
  res.json({successs:true,token : token ,status:"You are successfully logged in !."});
});

userRouter.get('/logout',cors.cors, (req,res,next)=>{
  console.log(req);
  if(req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.setHeader(contentType,'text/plain');
    res.end('You are logged out');
  } else {
    const err = new Error('You are not logged in');
    err.status = 403;
    next(err);
  }
});

// authentication using facebook

userRouter.get('/facebook/token',passport.authenticate('facebook-token'), (req, res)=>{
  if(req.user) {
    const token = getToken({_id: req.user._id  });
    res.statusCode=statusCode.ok;
    res.setHeader(contentType, applicationJson);
    res.json({successs:true, token : token, status:'You are successfully logged in!'});
  }
})


module.exports = userRouter;
