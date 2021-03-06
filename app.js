//  modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const bodyParser = require('body-parser');
// Routers 
const indexRouter = require('./routes/index');
const userRouter = require('./routes/userRouter');
const dishRouter = require('./routes/dishesRouter');
const promoRouter = require('./routes/promotionRouter');
const leaderRouter = require('./routes/leaderRouter');
const uploadRouter = require('./routes/uploadRouter');


// Files
const authenticate = require('./authenticate');
const {mongoUrl,secretKey} = require('./config');

// Models
const Dishes = require('./models/dishes');


// database url
const url = mongoUrl;

// Database configuration
const connect = mongoose.connect(url);
connect
.then((db)=>{
  console.log('Connected to the server');
})
.catch((err)=>{
  console.log('Error: \n',err);
})


const app = express();
app.use(bodyParser.json({limit:'50mb'})); 
app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}));
app.all('*',(req, res, next)=>{
  if(req.secure) {
    return next();
  } else {
    res.redirect(307,`https://${req.hostname}:${app.get('secPort')}${req.url}`);
  }
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(passport.initialize());


app.use('/', indexRouter);
app.use('/users', userRouter);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);
app.use('/imageUpload',uploadRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
