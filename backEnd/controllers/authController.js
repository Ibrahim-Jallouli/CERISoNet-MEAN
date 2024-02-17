const { authenticateUser } = require('../utils/auth');
const { updateUserStatus } = require('../models/authModel');

// Login endpoint for user authentication
exports.login = (req, res) => {
  // retrieve username and password from the form
  const { username, password } = req.body;
  // utilisation du callback
  authenticateUser(username, password, (error, user) => {
    if (error) {
      console.log(`Authentication failed: ${error}`);
      return res.status(200).json({ success: false, error: 'Authentication failed'});
    }
    // If authentication succeeds, user data is available in user variable
    req.session.isConnected = true; // Set the session flags
    req.session.userId = user.id; // Store the user's ID
    req.session.username = user.username; // Store the username
    req.session.status = user.status; // Store the status
    req.session.avatar = user.avatar; // Store the avatar
    
    // j'ai besoin de l'avatar pour le stocker dans localStorge dans le front end :') peu etre c'est pas la bonne methode
    res.json({ success: true, message: 'Login successful from Express',avatar: user.avatar  });
    console.log('Login successful');
  });
};

// j'ai utiliser cette fonciton pour tester si l'utilisateur peut acceder a la page d'acceuil ou pas dans auth-Gard.service.ts
exports.checkAuthentication = (req, res) => {
  console.log('verify the session');
  if (req.session.isConnected) {
    // The user is authenticated
    res.json({ authenticated: true,
    avatar: req.session.avatar,});
  } else {
    updateUserStatus(req.session.userId, 0).then(result => { console.log("user status updated");}) // changement du status a 0
    res.json({ authenticated: false });
  }
};

// Add a new endpoint to log out (disconnect) the user
exports.logout = (req, res) => {
  if (req.session.isConnected) {
    updateUserStatus(req.session.userId, 0).then(result => { console.log("user status updated");})
    // If the user is authenticated, destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.log(`Error while logging out: ${err}`);
        return res.status(500).json({ success: false, error: 'Logout failed' });
      }
      console.log('User logged out');
      res.json({ success: true, message: 'Logout successful'});
    });
  } else {
    res.status(401).json({ success: false, error: 'Not authenticated redirected to login page' });
  }
};

