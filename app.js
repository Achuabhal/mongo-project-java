var createError = require('http-errors');
var express = require('express');
var path = require('path');//absolute path kiitan
var cookieParser = require('cookie-parser');
var logger = require('morgan'); 
const { engine } = require('express-handlebars'); 
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var hbs = require('express-handlebars');
const fileUpload = require('express-fileupload');
var db=require('./config/connection')
var session=require('express-session')  //expres session


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', engine({ // Use engine function here
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views', 'layout'),
  partialsDir: path.join(__dirname, 'views', 'headeradminanduser')  // iithh matreme ollu stiramayidd varunne ellathilum
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());  // images elam upload cheyan 
app.use(session({secret:"key",cookie:{maxAge:6000000}}))  //it is creating the session id 
db.connect((err) => {
  if (err) {
    console.log("connection error"+err);
  } else {                                   // this is mongo db insttalation
    console.log('database connected');
  }
});

app.use('/', usersRouter);
app.use('/admin', adminRouter);

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
