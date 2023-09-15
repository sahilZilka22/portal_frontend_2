export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
// returns if the sender of the messages in the message list are same
// messages -> all messages, m -> new message , i -> new message id, userId -> logged in user
export const isSameSender = (messages, newMessage, newMessage_index, userId) => {
  return (
    // this line check if the message is actully the last message in the list 
    newMessage_index < messages.length - 1 &&
    (messages[newMessage_index + 1].sender._id !== newMessage.sender._id || // checks if the current message and the new message are sent by the same sender
      messages[newMessage_index + 1].sender._id === undefined) && //  messages[newMessage_index + 1].sender._id => message ki list main naya message jo hai plus uske baad wala uski id
    messages[newMessage_index].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};