// routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const messageController = require('../controllers/messageController');
const userController = require('../controllers/userController');

router.post('/login', authController.login);
router.get('/check-authentication', authController.checkAuthentication);
router.post('/logout', authController.logout);
router.get('/messages', messageController.getAllMessages);
router.get('/user/:id', userController.getUserById);
router.get('/user-by-identifiant/:identifiant', userController.getUserByIdentifiant);
router.get('/messages-by-hashtag/:hashtag', messageController.searchMessagesByHashtag);
router.get('/messages-by-creator/:userId', messageController.searchMessagesByCreator);
router.post('/messages/:id/addcomment', messageController.addCommentToMessage);


module.exports = router;
