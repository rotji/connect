import React from 'react';
import Chat from './Chat';

const ExamplePrivateChat = ({ currentUserId, chatPartnerId }) => (
  <Chat currentUserId={currentUserId} chatPartnerId={chatPartnerId} />
);

export default ExamplePrivateChat;
