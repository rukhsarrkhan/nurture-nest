const mongoCollections = require("../config/mongo-collections");
const nannys = mongoCollections.nanny;

const createNanny = async () => {};

const getNannyById = async () => {};

const updateNanny = async () => {};

const removeNanny = async () => {
  const moviesCollection = await movies();
  const deleted = await moviesCollection.findOne({ _id: ObjectId(movieId) });
  const deletionInfo = await moviesCollection.deleteOne({
    _id: ObjectId(movieId),
  });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete nanny with id of ${id}`;
  }
  return deleted["title"] + " has been successfully deleted!";
};

module.exports = {
  createNanny,
  getNannyById,
  updateNanny,
  removeNanny,
};
