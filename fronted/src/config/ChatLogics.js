// export const getSender = (loggedUser, users) => {
//   return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
// }


// ==========================================
// GET OTHER USER NAME
// Used for one-to-one chat
// ==========================================

export const getSender = (loggedUser, users = []) => {
  // ------------------------------------------
  // Safety checks
  // ------------------------------------------
  if (!loggedUser || !Array.isArray(users)) {
    return "";
  }

  if (users.length === 0) {
    return "";
  }

  // ------------------------------------------
  // If only one user exists
  // ------------------------------------------
  if (users.length === 1) {
    return users[0]?.name || "";
  }

  // ------------------------------------------
  // Find the user who is NOT logged-in user
  // ------------------------------------------
  const otherUser = users.find(
    (user) => user?._id !== loggedUser?._id
  );

  // ------------------------------------------
  // Return other user's name
  // ------------------------------------------
  return otherUser?.name || "";
};


// ==========================================
// GET OTHER USER OBJECT
// Useful when you need name, email, pic, etc.
// ==========================================

export const getSenderFull = (
  loggedUser,
  users = []
) => {
  if (!loggedUser || !Array.isArray(users)) {
    return null;
  }

  if (users.length === 0) {
    return null;
  }

  const otherUser = users.find(
    (user) => user?._id !== loggedUser?._id
  );

  return otherUser || null;
};


// ==========================================
// GET SENDER PROFILE PICTURE
// ==========================================

export const getSenderPic = (
  loggedUser,
  users = []
) => {
  const otherUser = getSenderFull(
    loggedUser,
    users
  );

  return otherUser?.pic || "";
};


// ==========================================
// GET SENDER EMAIL
// ==========================================

export const getSenderEmail = (
  loggedUser,
  users = []
) => {
  const otherUser = getSenderFull(
    loggedUser,
    users
  );

  return otherUser?.email || "";
};

const getMessageSenderId = (message) => {
  const sender = message?.sender;
  return typeof sender === "object" ? sender?._id : sender;
};

export const isSameSender = (
  messages = [],
  message,
  index,
  userId
) => {
  if (!Array.isArray(messages) || index < 0 || index >= messages.length - 1) {
    return false;
  }

  const senderId = getMessageSenderId(message);
  const nextSenderId = getMessageSenderId(messages[index + 1]);

  return (
    (nextSenderId !== senderId || nextSenderId === undefined) &&
    senderId !== userId
  );
};

export const isLastMessage = (messages = [], index, userId) => {
  if (!Array.isArray(messages) || index !== messages.length - 1) {
    return false;
  }

  const senderId = getMessageSenderId(messages[index]);
  return Boolean(senderId && senderId !== userId);
};

export const isSameSenderMargin = (
  messages = [],
  message,
  index,
  userId
) => {
  if (!Array.isArray(messages) || index < 0 || index >= messages.length) {
    return "0px";
  }

  const senderId = getMessageSenderId(message);

  if (!senderId) {
    return "0px";
  }

  if (senderId === userId) {
    return "auto";
  }

  const nextSenderId = getMessageSenderId(messages[index + 1]);
  return nextSenderId === senderId ? "32px" : "0px";
};

export const isSameUser = (messages = [], message, index) => {
  if (!Array.isArray(messages) || index <= 0 || index >= messages.length) {
    return false;
  }

  const senderId = getMessageSenderId(message);
  return Boolean(senderId && getMessageSenderId(messages[index - 1]) === senderId);
};

