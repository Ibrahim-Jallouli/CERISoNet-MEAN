const { MongoClient } = require('mongodb');

const mongoURI = "mongodb://127.0.0.1:27017/db-CERI";
const client = new MongoClient(mongoURI);

let mongoDB;

function connectToMongoDB() {
  return new Promise((resolve, reject) => {
    client.connect()
      .then(() => {
        console.log('Connected to MongoDB');
        mongoDB = client.db(); // Get a reference to your database
        resolve();
      })
      .catch(error => {
        console.error('Error connecting to MongoDB:', error);
        reject(error);
      });
  });
}

module.exports = {
  connectToMongoDB, // call this in monserver.js pour la connexion
  getMongoDB: () => mongoDB, // call this in models fonction qui retourne la reference de la base de donnees
};


