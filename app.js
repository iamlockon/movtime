//PWD ALERT!!!
const config = require('./configs/config');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var app = express();
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const MongoClient = require('mongodb').MongoClient;
const {createRouter: createRootRouter} = require('./routes/index.js');
const {createRouter: createAuthRouter} = require('./routes/AuthRouter.js');
const {createContainer, asClass, asValue, asFunction, Lifetime} = require('awilix');
const container = createContainer();

/**
 * 
 * @param {object} config
 * @returns {MongoClient}
 */
function createMongoClient({config}) {
  const uri = config.mongodb.uri;
  const client = new MongoClient(uri, {useNewUrlParser: true});

  
  client.connect()
    .then((connectedClient) => {
      console.log('Connected to MongoDB..');
    })
    .catch(e => {
      console.error('Error while connecting MongoDB, uri: ',uri,' , e: ', e  );
    });
  return client;
}
//register dependencies
container.register({
  mongoClient: asFunction(createMongoClient, {
    lifetime: Lifetime.SINGLETON,
  }),
  indexRouter: asFunction(createRootRouter, {
    lifetime: Lifetime.SINGLETON
  }),
  authRouter: asFunction(createAuthRouter, {
    lifetime: Lifetime.SINGLETON
  }),
  config: asValue(config, {lifetime: Lifetime.SINGLETON}),
})

container.loadModules([
  'daos/*.js',
  'services/*.js',
], {
  formatName: 'camelCase',
  resolverOptions: {
    lifetime: Lifetime.SINGLETON,
    register: asClass
  }
});

const indexRouter = container.resolve('indexRouter');

app.use('/', indexRouter);

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
