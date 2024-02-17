const { pool } = require('../utils/db');


//get user by username
function getUserByUsername(username) {
  const query = {
    text: 'SELECT * FROM fredouil.users WHERE identifiant = $1',
    values: [username], // am getting this: id;identifiant;motpasse;nom;prenom;statut_connexion;avatar
  };
  return pool.query(query);
}


// update the user's status
function updateUserStatus(userId, newStatus) {
  const query = {
    text: 'UPDATE fredouil.users SET statut_connexion = $2 WHERE id = $1',
    values: [userId, newStatus],
  };
  return pool.query(query);
}

module.exports = {
  getUserByUsername,
  updateUserStatus
};