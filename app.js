var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require('multer')


/**
 * Anadimos informacion necesaria para la conexion con el servidor
 */
var mongo = require('mongodb');
var monk = require('monk');

var mongodb_url = '127.0.0.1:27017/giftask';
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  mongodb_url = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

var db = monk(mongodb_url);


/**
 * Indicamos donde se localiza el routing
 * @type {router|exports|module.exports}
 */
var routes = require('./routes/index');
var users = require('./routes/users');
var gifts = require('./routes/gifts');

var app = express();


/**
 * Indica al servidor donde se enceuntran las vistas y cual es el motor de generacion de HTML
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(multer({ dest: './uploads/tmp/'}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// Hacemos nuestra base de datos accesible por los siguientes enrutamientos
// Ahora, cualquier peticion HTTP tiene acceso al objeto db
app.use(function(req,res,next){
    req.db = db;
    next();
});
app.use('/', routes);
app.use('/users', users);
app.use('/gifts', gifts);

/**
 * Handlesrs para errores
 */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('No existe dicha pagina');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/**
 * Todos los modulos que hemos exportado en app lo asignamos a module.exports que sera accesible por cualquier
 * parte del servidor
 */
module.exports = app;
