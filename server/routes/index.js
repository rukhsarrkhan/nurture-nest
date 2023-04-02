const users = require('./users');
const child = require('./child');

const constructorMethod = (app) => {
  app.use('/users', users);
  app.use('/child', child);
  app.use('*', (req, res) => { res.sendStatus(404); });
};

module.exports = constructorMethod;