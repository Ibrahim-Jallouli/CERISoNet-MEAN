// monserver.js
const express = require('express');
const app = express();
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');  // pour lire les fichiers
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors'); // Cors is needed to allow cross-origin requests from the frontend
const socketIO = require('socket.io'); 


const { connectToMongoDB } = require('./utils/mongodb'); // Import MongoDB connection logic
connectToMongoDB(); // Call the connection logic

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the MongoDB store
const store = new MongoDBStore({ 
  uri: 'mongodb://127.0.0.1:27017/db-CERI', 
  collection: 'MySession3131', // collection where session data will be stored
});

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: store, 
  cookie: { maxAge: 30 * 60 * 1000 }, // Cookie expires in 30 minutes
}));

const corsOptions = {
  origin: 'https://pedago.univ-avignon.fr:3132', //Angular app's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
  credentials: true, // inclure les cookies et http authentificaitons pour les requetes 
};
app.use(cors(corsOptions));

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};

const server = https.createServer(options, app);

// ********* Gestion des websockets côté serveur
const io = socketIO(server); // creer l'instance
//app.set('io', io);  // enregistre l'instance de Socket.IO
const userController = require('./controllers/userController');
userController.handleWebSocket(io);
const messageController = require('./controllers/messageController');
messageController.handleWebSocket(io);

server.listen(3131, function() {
  console.log('Server is running on port 3131');
});


// Serve static files from the Angular app build directory 
app.use(express.static(path.join(__dirname, '../frontEnd/monAppliMean/dist/mon-appli-mean')));
const routes = require('./routes/route');
app.use('/', routes);
app.get('*', (req, res) => { //renvoyer le fichier HTML principal du frontend apres le build
  res.sendFile(path.join(__dirname, '../frontEnd/monAppliMean/dist/mon-appli-mean/index.html'));
});



