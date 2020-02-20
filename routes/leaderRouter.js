const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();
const Leaders = require('../models/leaders');
const {verifyUser,verifyAdmin} = require('../authenticate');
leaderRouter.route('/')
.get((req,res,next)=>{
    Leaders.find({})
    .then((leaders)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    })
    .catch((err)=>{
        next(err);
    })
})
.post(verifyUser,verifyAdmin,(req,res,next)=>{
    Leaders.create(req.body)
    .then((leader)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    })
    .catch((err)=>{
        next(err);
    })
})
.put(verifyUser,verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
    res.end('Put operation not supported');
})
.delete(verifyUser,verifyAdmin,(req,res,next)=>{
    Leaders.remove({})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    })
    .catch((err)=>{
        next(err);
    });
});

leaderRouter.route('/:leaderId')
.get((req,res,next)=>{
    Leaders.findById(req.params.leaderId)
    .then((leader)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    })
    .catch((err)=>{
        next(err);
    });
})
.post(verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end('Post operation not supported here');
})
.put(verifyUser,verifyAdmin,(req,res,next)=>{
    Leaders.findByIdAndUpdate(req.params.leaderId,{
        $set:req.body,
    },{new:true})
    .then((leader)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    })
    .catch((err)=>{
        next(err);
    })
})
.delete(verifyUser,verifyAdmin,(req,res,next)=>{
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    })
    .catch((err)=>{
        next(err);
    })
});
module.exports=leaderRouter;