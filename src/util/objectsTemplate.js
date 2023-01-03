// Get userDoc by auth.currentUser.uid
const userDoc = {
  displayName: null, // string
  email: null, // string
  photoURL: null, // string
  isOnline: false, // boolean
  chats: [], // array
  friends: [], // array
};

// Individual chat object of ChatList
const selectedChatObj = {
  id: null, // "string"
  isGroup: false, // "boolean"
  lastMsg: {
    message: null, // "string"
    createdAt: null, // "timestamp"
  },
  name: null, // "string"
  photoURL: null, // "string"
  unreadMsgs: 0, // "number"
};

const messageDoc = {
  id: null, // string
  uid: null, // string
  displayName: null, // string
  photoURL: null, // string
  message: null, // string
  createdAt: null, // timestamp
};

const groupDoc = {
  id: null, // string
  isGroup: true, // boolean
  name: null, // string
  photoURL: null, // string
  lastMsg: {
    message: null, // string
    createdAt: null, // timestamp
  },
};

const directDoc = {
  id: null, // string
  isGroup: false, // boolean
  name: null, // string
  photoURL: null, // string
  lastMsg: {
    message: null, // string
    createdAt: null, // timestamp
  },
};

export { userDoc, selectedChatObj, messageDoc, groupDoc, directDoc };
