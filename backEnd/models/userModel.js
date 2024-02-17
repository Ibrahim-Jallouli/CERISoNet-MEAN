const { pool } = require('../utils/db');
//USER structor: id;identifiant;motpasse;nom;prenom;statut_connexion;avatar

//get all users used in socket logique
function getAllUsers() {
  console.log("getting all users");
  const query = 'SELECT id, identifiant, statut_connexion, avatar FROM fredouil.users WHERE LENGTH(avatar) > 4';
  return pool.query(query)
    .then(result => result.rows)
    .catch(error => {
      console.error(`Error getting users: ${error}`);
      throw error;
    });
}

// get user by id
function getUserById(id) {
  const query = {
    text: 'SELECT * FROM fredouil.users WHERE id = $1', 
    values: [id], 
  };
  return pool.query(query);
} 


//get user by identifiant " am using this to search for messages by user identifiant"
function getUserByIdentifiant(identifiant) {
  const query = {
    text: 'SELECT * FROM fredouil.users WHERE identifiant = $1',
    values: [identifiant], 
  };
  return pool.query(query)
    .then(result => result.rows[0])  // bon l'identifiant dans la base peut etre duplique mais on va prendre le premier
    .catch(error => {
      console.error(`Error getting user by identifiant: ${error}`);
      throw error;
    });
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByIdentifiant
};

