const { getMongoDB } = require('../utils/mongodb');


// Get all messages
function getMessages() {
  const collectionName = 'CERISoNet';
  const db = getMongoDB();
  return db.collection(collectionName).find({}).toArray()
    .then(messages => messages)
    .catch(error => {
      console.error('Error fetching messages:', error);
      throw error;
    });
}


// Search messages by hashtag
function searchMessagesByHashtag(hashtag) {
  const collectionName = 'CERISoNet';
  const db = getMongoDB();

  // Use a regex to perform a case-insensitive search for the specified hashtag
  const hashtagRegex = new RegExp(hashtag, 'i');

  return db.collection(collectionName)
    .find({ hashtags: hashtagRegex })
    .toArray()
    .then(messages => messages)
    .catch(error => {
      console.error('Error searching messages by hashtag:', error);
      throw error;
    });
}

// Search messages by creator
function searchMessagesByCreator(userId) {
  const collectionName = 'CERISoNet';
  const db = getMongoDB();
  
  return db.collection(collectionName)
    .find({ createdBy: userId })
    .toArray()
    .then(messages => messages)
    .catch(error => {
      console.error('Error searching messages by creator:', error);
      throw error;
    });
}


// ajout d'un commentaire a un message
function addCommentToMessage(messageId, userId, commentText) {
  const collectionName = 'CERISoNet';
  const db = getMongoDB();

  // Get the current system date and time
  const currentDate = new Date().toISOString().split('T')[0];
  const currentHour = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit'});

  // Construct the comment object 
  const comment = {
    text: commentText,
    commentedBy: userId,
    date: currentDate,
    hour: currentHour,
  };
  console.log('comment', comment);

  return db.collection(collectionName)
    .updateOne(
      { _id: messageId },
      { $push: { comments: comment } }
    )
    .then(result => {
      if (result.matchedCount === 0) {
        console.log('Message not found');
      }
      return result;
    })
    .catch(error => {
      console.error('Error adding comment to message:', error);
      throw error;
    });
}



// Increment likes for a message
function addLikeToMessage(messageId) {
  const collectionName = 'CERISoNet';
  const db = getMongoDB();

  return db.collection(collectionName)
    .updateOne(
      { _id: messageId },
      { $inc: { likes: 1 } }
    )
    .then(result => {
      if (result.matchedCount === 0) {
        console.log('Message not found');
      }
      return result;
    })
    .catch(error => {
      console.error('Error adding like to message:', error);
      throw error;
    });
}

function removeLikeFromMessage(messageId) {
  const collectionName = 'CERISoNet';
  const db = getMongoDB();

  return db.collection(collectionName)
    .updateOne(
      { _id: messageId, likes: { $gt: 0 } }, // Ensure likes are greater than 0
      { $inc: { likes: -1 } }
    )
    .then(result => {
      if (result.matchedCount === 0) {
        console.log('Message not found or likes already at 0');
      }
      return result;
    })
    .catch(error => {
      console.error('Error removing like from message:', error);
      throw error;
    });
}

module.exports = {
  getMessages,
  searchMessagesByHashtag,
  addCommentToMessage,
  searchMessagesByCreator,
  addLikeToMessage,
  removeLikeFromMessage
};
