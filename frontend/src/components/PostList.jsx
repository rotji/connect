import React, { useState } from 'react';
import Modal from './Modal';
import ExamplePrivateChat from './ExamplePrivateChat';
import ErrorBoundary from './ErrorBoundary';

const PostList = ({ posts }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalContent, setModalContent] = useState(null);

  const handleCloseModal = () => {
    setSelectedUser(null);
    setModalContent(null);
  };

  const handleSeeProfile = (user) => {
    if (user) {
      setSelectedUser(user);
      setModalContent('profile');
    }
  };

  const handlePrivateChat = (user) => {
    if (user) {
      setSelectedUser(user);
      setModalContent('chat');
    }
  };

  return (
    <div>
      {posts.map((post) => (
        <div key={post._id} className="post">
          <p>Posted by {post.user ? post.user.name : 'Unknown'} on {new Date(post.date).toLocaleString()}</p>
          <p>{post.content}</p>
          {post.user && (
            <div>
              <button onClick={() => handleSeeProfile(post.user)}>
                See Profile
              </button>
              <button onClick={() => handlePrivateChat(post.user)}>
                Private Chat
              </button>
            </div>
          )}
        </div>
      ))}

      {modalContent && selectedUser && (
        <ErrorBoundary>
          <Modal show={!!modalContent} onClose={handleCloseModal} profile={modalContent === 'profile' ? selectedUser : null}>
            {modalContent === 'chat' && (
              <ExamplePrivateChat
                currentUserId="currentUserId" // Replace this with the actual current user ID
                chatPartnerId={selectedUser._id} // Use the selected user's ID as the chat partner
              />
            )}
          </Modal>
        </ErrorBoundary>
      )}
    </div>
  );
};

export default PostList;
