var express = require('express');
const UserRouter = require('./users');

/**
 * 
 * @param {object} dependencies
 * @param {MongoService} dependencies.mongoService
 * @param {MongoClient} dependencies.client
 */
function createRouter(dependencies) {
  const {mongoService, authRouter} = dependencies;
  
  let router = express.Router();
  router.use('/api/auth', authRouter);
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

  router.get('/api/mongo', (req, res, next) => {
    mongoService.isConnected()
      .then(isConnected => {
        res.json({isConnected});
      })
      .catch(next);
  })
  router.post('/api/echo', function(req, res, next) {
    const body = req.body;
    res.json(body);
  });

  router.get('/theaters',(req,res, next) => {
    res.send('hi');
  });
  router.get('/movies', (req, res, next)=>{

  });

  function middleware1(req, res, next) {
    // 錯誤發生(一)
    //throw new Error('fake error by throw'); 
    
    // 錯誤發生(二)
    //next(new Error('fake error by next()'));
    //return;

    console.log('middleware1');
    // res.send('搶先送出回應'); // 這會引起錯誤，但不中斷： Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client 
    next(); // 引發下一個 middleware
  }
  function middleware2(req, res, next) {
    console.log('middleware2');
    next(); // 引發下一個 middleware
  }
  router.get('/api/middleware', middleware1, middleware2, function (res, res, next) {
    res.send('done');
  });
  router.use('/user', UserRouter);
  return router;
}

module.exports = {
  createRouter
};
