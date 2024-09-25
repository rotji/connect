import React, { useState } from 'react';
import Modal from './Modal';
import ExamplePrivateChat from './ExamplePrivateChat';
import ErrorBoundary from './ErrorBoundary';

const PostList = ({ posts, currentUserEmail }) => { // Change to use email for current user
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
      console.log(`Private chat with ${user.email} initiated`); 
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
          {post.user && post.user.email !== currentUserEmail && ( // Check against email instead of user ID
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
          <Modal 
            show={!!modalContent} 
            onClose={handleCloseModal} 
            profile={modalContent === 'profile' ? selectedUser : null}
          >
            {modalContent === 'profile' && (
              <div>
                <p>Name: {selectedUser.name}</p>
                <p>Email: {selectedUser.email}</p>
                <p>Phone: {selectedUser.phone}</p>
                <p>Category: {selectedUser.category}</p>
                <p>Interest: {selectedUser.interest}</p>
                <p>Expectation: {selectedUser.expectation}</p>
                <p>Country: {selectedUser.country}</p>
                <p>State: {selectedUser.state}</p>
                <p>Town: {selectedUser.town}</p>
                <p>Address: {selectedUser.address}</p>
                <p>Details: {selectedUser.details}</p>
              </div>
            )}
            {modalContent === 'chat' && (
              <ExamplePrivateChat
                currentUserEmail={currentUserEmail}  // Pass current user's email
                chatPartnerEmail={selectedUser.email}  // Pass selected user's email for private chat
              />
            )}
          </Modal>
        </ErrorBoundary>
      )}
    </div>
  );
};

export default PostList;
