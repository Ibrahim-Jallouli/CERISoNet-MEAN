const crypto = require('crypto');
const { getUserByUsername } = require('../models/authModel');
const { updateUserStatus } = require('../models/authModel');

// fonction de hashage
function hashSHA1(password) {
  const sha1 = crypto.createHash('sha1');
  sha1.update(password);
  return sha1.digest('hex');
}

// fonction d'authentification a partir du nom d'utilisateur et du mot de passe
function authenticateUser(username, password, callback) {
  getUserByUsername(username)
    .then(result => {
      if (result.rows.length === 1) {
        // store user data in userData
        const userData = {
          id: result.rows[0].id,
          username: result.rows[0].identifiant,
          status: result.rows[0].statut_connexion,
          storedPasswordHashSHA1: result.rows[0].motpasse,
          avatar: result.rows[0].avatar,
        };
        // compare the provided password with the stored password
        const providedPasswordHashSHA1 = hashSHA1(password);
        if (providedPasswordHashSHA1 === userData.storedPasswordHashSHA1) {
          // mot de pass correct => mise a jour du status
          updateUserStatus(userData.id, 1).then(result => { console.log("user status updated");});  //changer le status  a 1
          // callback => auth controller
          callback(null, userData);
        } else {
          callback('Authentication failed: Invalid password', null);
        }
      } else {
        callback('Authentication failed: Invalid username', null);
      }
    })
    .catch(err => {
      callback('Internal server error', null);
    });
}

module.exports = {
  authenticateUser,
};
