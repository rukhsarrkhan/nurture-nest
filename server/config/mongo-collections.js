const dbConnection = require('./mongo-connection');

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection.dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

module.exports = {
  users: getCollectionFn('users'),
  child: getCollectionFn('child'),
  parent: getCollectionFn('parent'),
  nanny: getCollectionFn('nanny'),
  job: getCollectionFn('job')
};
