// monserver.js
const express = require('express');
const app = express();
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors'); // Cors is needed to allow cross-origin requests from the frontend

const { authenticateUser } = require('./utils/auth'); // Import authentication logic
const { connectToMongoDB } = require('./utils/mongodb'); // Import MongoDB connection logic

app.use(express.static(path.join(__dirname, '../frontEnd/monAppliMean/dist/mon-appli-mean')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const store = new MongoDBStore({
  uri: 'mongodb://127.0.0.1:27017/db-CERI', 
  collection: 'MySession3131', //  collection where session data will be stored
});

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: store, // Use the MongoDB store
  cookie: { maxAge: 300000 *2 }, // Cookie expires after 5 minutes

}));

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};

const corsOptions = {
  origin: 'https://pedago.univ-avignon.fr:3132', // Replace with your Angular app's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
  credentials: true, // Include this line
};
app.use(cors(corsOptions));

const server = https.createServer(options, app);

server.listen(3131, function() {
  console.log('Server is running on port 3131');
});

// Import and use your route handlers from a separate route file
const routes = require('./routes/route');
app.use('/', routes);
app.use('/login', routes);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontEnd/monAppliMean/dist/mon-appli-mean/index.html'));
});



