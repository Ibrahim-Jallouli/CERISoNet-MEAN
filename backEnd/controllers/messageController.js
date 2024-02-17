const messageModel  = require('../models/messageModel');


// ajouter la logique de pagination dans tout les api qui vont retourner une liste de messages


exports.getAllMessages = (req, res) => {
  // :') String => int les parametres de la requete sont des strings il faut les convertir en int
  const page = parseInt(req.query.page) || 1;   // recuperer le numero de la page depuis la requete 
  const pageSize = parseInt(req.query.pageSize) || 10;  // recuperer la taille de la page depuis la requete
  const skip = (page - 1) * pageSize;  // calculer le nombre de messages a sauter

  messageModel.getMessages()
    .then(messages => {
      const paginatedMessages = messages.slice(skip, skip + pageSize); // recuperer les messages de la page courante
      res.status(200).json({ // les envoyer au front end 
        messages: paginatedMessages,
        totalItems: messages.length,
        totalPages: Math.ceil(messages.length / pageSize),
        currentPage: page,
        pageSize: pageSize
      });
    })
    .catch(error => {
      console.error('Error getting messages:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
};



exports.searchMessagesByHashtag = (req, res) => {
  const { hashtag } = req.params;   // recuperer le hashtag depuis la requete
  // conversion
  const page = parseInt(req.query.page) || 1;  // recuperer le numero de la page depuis la requete
  const pageSize = parseInt(req.query.pageSize) || 10;  // recuperer la taille de la page depuis la requete
  const skip = (page - 1) * pageSize;

  messageModel.searchMessagesByHashtag(hashtag)
    .then(messages => {
      const paginatedMessages = messages.slice(skip, skip + pageSize); // recuperer les messages
      res.status(200).json({ // les envoyer au front end
        messages: paginatedMessages,
        totalItems: messages.length,
        totalPages: Math.ceil(messages.length / pageSize),
        currentPage: page,
        pageSize: pageSize
      });
    })
    .catch(error => {
      console.error('Error searching messages by hashtag:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
};

// meme chose
exports.searchMessagesByCreator = (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const skip = (page - 1) * pageSize;
  let userIdInt = parseInt(userId); 
  messageModel.searchMessagesByCreator(userIdInt)
    .then(messages => {
      console.log("messages",messages);
      const paginatedMessages = messages.slice(skip, skip + pageSize);
      res.status(200).json({
        messages: paginatedMessages,
        totalItems: messages.length,
        totalPages: Math.ceil(messages.length / pageSize),
        currentPage: page,
        pageSize: pageSize
      });
    })
    .catch(error => {
      console.error('Error searching messages by creator:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
}


exports.addCommentToMessage = (req, res) => {
  let { id } = req.params;
  id = parseInt(id); // j'ai passer 3 heurs pour trouver cette erreur :') 
  console.log("req.params",req.params);
  const { userId } = req.session;  
  const { comment } = req.body;
  console.log('req.body', req.body);
  console.log('comment', comment);
  console.log('userId', userId);
  console.log('id', id);  

  messageModel.addCommentToMessage(id, userId, comment)
    .then(result => {
      if (result.matchedCount === 0) {
        res.status(404).json({ error: 'Message not found' });
      } else if (result.modifiedCount === 1) {
        res.status(200).json({ message: 'Comment added successfully' });
      } else {
        res.status(500).json({ error: 'Unexpected result from database operation' });
      }
    })
    .catch(error => {
      console.error('Error adding comment to message:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
};



async function sendAddUpdatedLikes(io, messageId, event) {
  try {
    const updatedMessage= await messageModel.addLikeToMessage(messageId);
    console.log(`Emitting event ${event} add like to  message ${messageId}`);
    io.emit('update-message', updatedMessage);
  }
  catch (error) {
    console.error(`Error getting updated message: ${error}`);
  }
}

async function sendRemUpdatedLikes(io, messageId, event) {
  try {
    const updatedMessage= await messageModel.removeLikeFromMessage(messageId);
    console.log(`Emitting event ${event} remove like from message ${messageId}`);
    io.emit('update-message', updatedMessage);
  }
  catch (error) {
    console.error(`Error getting updated message: ${error}`);
  }
}

exports.handleWebSocket = (io) => {
  io.on('connection', (socket) => {
    const userIpAddress = socket.handshake.address;
    const currentUrl = socket.handshake.headers.referer;

    console.log(`WebSocket connection initialized from ${userIpAddress} on ${currentUrl}`);

    socket.on('add-like', (messageId) => {
      console.log(`User from ${userIpAddress} added a like to message ${messageId}`);
      sendAddUpdatedLikes(io, messageId,'add-like');
    });

    socket.on('remove-like', (messageId) => {
      console.log(`User from ${userIpAddress} removed a like from message ${messageId}`);
      sendRemUpdatedLikes(io, messageId,'remove-like');
    });

    socket.on('disconnect', () => {
      console.log(`WebSocket connection closed from ${userIpAddress}`);
    });
  });
};




