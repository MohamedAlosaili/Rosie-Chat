// Get userDoc by auth.currentUser.uid
const userDoc = {
  displayName: "string",
  email: "string",
  photoURL: "string",
  chats: "Array",
};

// Individual chat object of ChatList
export const selectedChatObj = {
  id: null, // "string"
  isGroup: false, // "boolean"
  lastMsg: {
    message: null, // "string"
    createdAt: null // "timestamp"
  },
  name: null, // "string"
  photoURL: null, // "string"
  unreadMsgs: 0, // "number"
};

const groupDoc = {};

const directDoc = {};
