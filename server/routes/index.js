const users = require('./users');
const child = require('./child');
const nanny = require('./nanny');
const job = require('./job');

const constructorMethod = (app) => {
  app.use('/users', users);
  app.use('/child', child);
  app.use('/job', job);
  app.use('/nanny', nanny);
  app.use('*', (req, res) => { res.sendStatus(404); });
};

module.exports = constructorMethod;