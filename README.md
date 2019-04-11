### Backend Project of reactmovietime
This is a Node.js x Express project created by express-generator. It's used to build a application server of reactmovietime.


### API
## GET

1. GET /theaters?lat=<lat>&lng=<lng>&dist=<dist>
Retrieve the theaters within predefined distance. (default 5 km)
query parameters: lat, lng, dist; (optional) user


GET /movies
retrieve the movies currently on nearby(distance configurable if is registered)
GET /about
about page.
GET /poster?filmID=
retrieve specific film poster
GET /movie?filmID=

GET /search?partialFilmNameInZH_TW
elasticsearch/sonic ?
## POST

POST /login
check if already, use passport.js?
POST /koremitai/filmID
check if already, add to the movie's fav counter
POST /logout

POST /forgetpwd
send reset mail.
## PATCH

PATCH /user/userID
update user profile

## DELETE

DELETE /koremitai/filmID
check if already
DELETE /user/userID
check if logged in.

## TESTING

1. Use Jest with Babel 7. 
2. The files in jest folder are for JEST configuration use.
3. Since mongo-memory-server need to create temp folder .cache in node_modules, need to run tests with sudo.
