const UserModel = require('../models/userModel');

// pour recuperer les noms dans les messages et les commentaires : peut etre je dois changer ca pour renvoyer que le identifiant
exports.getUserById = (req, res) => {
  const { id } = req.params;  // recuperer l'id depuis la requete
  UserModel.getUserById(id)
    .then(result => {
      if (result.rowCount === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(200).json(result.rows);
      }
    })
    .catch(error => {
      console.error('Error executing query:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    });
};


// pour faire le recherche par identifiant
exports.getUserByIdentifiant = (req, res) => {
  const { identifiant } = req.params;  // c'est mal envoyer depuis le front end !! voir ca plus tard
  UserModel.getUserByIdentifiant(identifiant)
    .then(user => {
      if (user) {
        res.status(200).json({ userId: user.id });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      console.error('Error fetching user by identifiant:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
}



// socket things

async function sendUpdatedUserList(io, event) {
  console.log(`Sending updated user list for event: ${event}`);
  try {
    const users = await UserModel.getAllUsers();
    console.log(`Emitting ${event} event`);
    io.emit(event, users);
  } catch (error) {
    console.error(`Error getting all users: ${error}`);
  }
}

exports.handleWebSocket = (io) => {
  io.on('connection', (socket) => { // This event is triggered whenever a client establishes a new WebSocket connection to the server
    const userIpAddress = socket.handshake.address; // Get user IP address
    const currentUrl = socket.handshake.headers.referer; // Get the current URL

      console.log(`WebSocket connection initialized from ${userIpAddress} on ${currentUrl}`);
      sendUpdatedUserList(io,'connection');

      socket.on('initialize', () => { //used for handling custom events "initialize"
        console.log(`Initializing user data for ${userIpAddress}`);
        sendUpdatedUserList(io, 'initialize');
      });

      socket.on('login', () => { //used for handling custom events "login"
        console.log(`User logged in from ${userIpAddress}`);
        sendUpdatedUserList(io,'login');
      });

      socket.on('logout', () => { //used for handling custom events "logout"
        console.log(`User logged out from ${userIpAddress}`);
        sendUpdatedUserList(io,'logout');
      });

      socket.on('disconnect', () => { //used for handling custom events "disconnect"
        console.log(`WebSocket connection closed from ${userIpAddress}`);
        sendUpdatedUserList(io,'logout');
      });
  });
};