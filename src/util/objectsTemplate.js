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

/*
  If user change his info (name or photoURL) I should update those documents 👇
    - Update Messages
      query(
        collectionGroup(db, "messages"),
        where("senderId", "==", "aorSuwulTIVjHfaCZog2rvDKjoo1"),
        where("isGroupMessage", "==", true)
      );
    - Update Chats
      query(
        collection(db, "chats"),
        where("members", "array-contains", currentUser.uid),
        where("isGroup", "==", "false"),
      )


*/

const chatDocTemplate = (chatDocInfo) => {
  // Root collection(chats) will contain a chat document like this:
  const defaultValues = {
    id: null,
    isGroup: false,
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

  /* 
    chatInfo: { # group chats will have chat info
      name: null, // In End-To-End chats will be null
      photoURL: null, // In End-To-End chats will be null
    }
    'uid': { # memberOne will be just in End-To-End chats
      name: null,
      photoURL: null,
    },
    'uid': { # memberTwo will be just in End-To-End chats
      name: null,
      photoURL: null,
    },
    Mebmer info will updated on each user info updates 
  */

  return { ...defaultValues, ...chatDocInfo };
};

const messageDocTemplate = (messageDocInfo) => {
  // Subcollection(messages) of a chat document will contain documents of these properties:
  const defaultValues = {
    type: "text",
    id: null,
    isGroupMessage: false,
    /* Sender info will updated on each user info updates */
    senderId: null,
    // senderName: null, // Just in group messages
    // senderPhotoURL: null, // Just in group messages
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
