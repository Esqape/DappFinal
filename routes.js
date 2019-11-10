const routes = require('next-routes')();

routes
  .add('/add', '/add')
  .add('/', '/index')
  .add('/certificates/:address', '/certificates/show')
  .add('/about', '/about')
  .add('addUser', '/addUser')
  .add('/sign/:address', '/certificates/sign')
  .add('/createUser','/createUser')
  .add('/toSign','/toSign')
  .add('/yourCerts','/yourCerts')
  .add('/signed','/signed');

  // .add('/#vows','/');
module.exports = routes;
