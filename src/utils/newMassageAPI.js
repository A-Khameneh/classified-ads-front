const newStructMessage = (newMessage) => {
  return {
    ...newMessage,
    sender: newMessage.sender._id
  };
};

export { newStructMessage };