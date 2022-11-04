const { MongoClient } = require("mongodb");

// Connection URL
const url = "mongodb://root:rootpwd@localhost:27017";
const client = new MongoClient(url);

// Database Name
const dbName = "ufcweb2022";

var user_collection;
var car_collection;
async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to Mongo server");
  const db = client.db(dbName);
  user_collection = db.collection("user");
  car_collection = db.collection("car");

  // the following code examples can be pasted here...

  return "done.";
}

main().then(console.log).catch(console.error);
//   .finally(() => client.close());

async function getUsers(email, password) {
  const findResult = await user_collection
    .find({ email: email, password: password })
    .toArray();
  console.log("Found documents =>", findResult);
  return findResult;
}
async function setUsers(user) {
  const result = await user_collection.insertOne(user);
  return result;
}
async function getAllCars() {
  const findResult = await car_collection.find().toArray();
  return findResult;
}

exports.getUsers = getUsers;
exports.getAllCars = getAllCars;
exports.setUsers = setUsers;
