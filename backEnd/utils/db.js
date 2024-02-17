const { Pool, Client } = require('pg');

const dbConfig = {
  user: 'uapv2400431',
  host: 'localhost',
  database: 'etd',
  password: 'QAo4uX',
  port: 5432,
};

const pool = new Pool(dbConfig);

// juste pour tester la connection si non on va utiliser le pool dans les models 
const individualClient = new Client(dbConfig);

individualClient.connect((err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL server:', err);
  } else {
    console.log('Individual testing connection established to PostgreSQL server');
  }
});

module.exports = {
  pool,
  //individualClient,
};
