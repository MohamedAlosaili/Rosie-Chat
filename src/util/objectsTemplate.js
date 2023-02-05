const userDocTemplate = (userDocInfo) => {
  // Root collection(users) will contain a user document like this:
  const defaultValues = {
    uid: null,
    displayName: null,
    about: "",
    email: null,
    photoURL: null,
    isOnline: true,
    joinedOn: null,
    friends: [],
  };

  return { ...defaultValues, ...userDocInfo };
};

const chatDocTemplate = (chatDocInfo) => {
  // Root collection(chats) will contain a chat document like this:
  const defaultValues = {
    id: null,
    isGroup: false,
    chatName: null, // In End-To-End chats will be null
    chatPhotoURL: null, // In End-To-End chats will be null
    lastMsg: {
      uid: null,
      message: null,
      createdAt: null,
    },
    members: [],
    // admin: null, End-To-End chats won't have admin
  };
  /*
    Subcollections
    - path: chats/chatId/messages
  */

  return { ...defaultValues, ...chatDocInfo };
};

const messageDocTemplate = (messageDocInfo) => {
  // Subcollection(messages) of a chat document will contain documents of these properties:
  const defaultValues = {
    type: "text",
    id: null,
    senderId: null,
    senderName: null,
    senderPhotoURL: null,
    message: {
      text: "",
      file: {
        type: null,
        name: null,
        url: null,
      },
    },
    createdAt: null,
  };

  return { ...defaultValues, ...messageDocInfo };
};

export { userDocTemplate, messageDocTemplate, chatDocTemplate };
