const getMovies = require('../utils/getMoviesTask');
var express = require('express');

/**
 * 
 * @param {object} dependencies
 * @param {MongoService} dependencies.mongoService
 * @param {MongoClient} dependencies.client
 */
function createRouter(dependencies) {
  const {mongoService, authRouter, moviesDao} = dependencies;
  
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

  router.get('/utils/movies', async (req, res, next) => {
    //TODO:Only privileged admin can call this endpoint.
    try{
      await getMovies(moviesDao);
      res.send('done');
    }catch(err) {
      next(err);
    }
  });
  return router;
}

module.exports = {
  createRouter
};
