// Get userDoc by auth.currentUser.uid
const userDocTemplate = (userDocInfo) => {
  const defaultValues = {
    uid: null,
    displayName: null,
    email: null,
    photoURL: null,
    isOnline: false,
    chats: [],
    friends: [],
  };
  return { ...defaultValues, ...userDocInfo };
};

// Individual chat object of ChatList
const selectedChatTemplate = (chatInfo) => {
  const defaultValues = {
    id: null,
    isGroup: false,
    lastMsg: { message: null, createdAt: null },
    name: null,
    photoURL: null,
    unreadMsgs: 0,
  };
  return { ...defaultValues, chatInfo };
};

const messageDocTemplate = (messageDocInfo) => {
  const defaultValues = {
    type: "text",
    id: null,
    uid: null,
    displayName: null,
    photoURL: null,
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

const groupDocTemplate = (groupDocInfo) => {
  const defaultValues = {
    id: null,
    isGroup: true,
    name: null,
    photoURL: null,
    lastMsg: { message: null, createdAt: null },
  };
  return { ...defaultValues, ...groupDocInfo };
};

const directDocTemplate = (directDocInfo) => {
  const defaultValues = {
    id: null,
    isGroup: false,
    name: null,
    photoURL: null,
    lastMsg: { message: null, createdAt: null },
  };
  return { ...defaultValues, ...directDocInfo };
};

export {
  userDocTemplate,
  selectedChatTemplate,
  messageDocTemplate,
  groupDocTemplate,
  directDocTemplate,
};
