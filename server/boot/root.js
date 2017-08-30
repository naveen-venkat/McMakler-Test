'use strict';

module.exports = function(server) {
  // Install a `/` route that returns server status
  let router = server.loopback.Router();
  router.get('/', (req, res) => {
    res.send({hello: 'world!'});
  });
  server.use(router);
};
