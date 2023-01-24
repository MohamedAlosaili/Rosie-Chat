// Get userDoc by auth.currentUser.uid
const userDocTemplate = (userDocInfo) => {
  const defaultValues = {
    uid: null,
    displayName: null,
    about: "",
    email: null,
    photoURL: null,
    isOnline: true,
    chats: [],
    friends: [],
    joinedOn: null,
  };
  return { ...defaultValues, ...userDocInfo };
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

  const message = { ...defaultValues.message, ...messageDocInfo.message };

  const fullObject = {
    ...defaultValues,
    ...messageDocInfo,
    message,
  };

  return fullObject;
};

const chatDocTemplate = (chatDocInfo) => {
  const defaultValues = {
    id: null,
    isGroup: true,
    name: null,
    photoURL: null,
    lastMsg: {
      uid: null,
      message: null,
      createdAt: null,
    },
    members: [],
  };

  const lastMsg = { ...defaultValues.lastMsg, ...chatDocInfo?.lastMsg };
  return { ...defaultValues, ...chatDocInfo, lastMsg };
};

export { userDocTemplate, messageDocTemplate, chatDocTemplate };
