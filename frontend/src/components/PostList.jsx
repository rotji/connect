import React, { useState } from 'react';
import Modal from './Modal';
import ExamplePrivateChat from './ExamplePrivateChat';

const PostList = ({ posts }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalContent, setModalContent] = useState(null);

  const handleCloseModal = () => {
    setSelectedUser(null);
    setModalContent(null);
  };

  const handleSeeProfile = (user) => {
    setSelectedUser(user);
    setModalContent('profile');
  };

  const handlePrivateChat = (user) => {
    setSelectedUser(user);
    setModalContent('chat');
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
        <Modal show={!!modalContent} onClose={handleCloseModal}>
          {modalContent === 'profile' ? (
            <div>
              <h2>{selectedUser.name}'s Profile</h2>
              <p>Email: {selectedUser.email}</p>
              <p>Phone: {selectedUser.phone}</p>
              <p>Category: {selectedUser.category}</p>
              <p>Details: {selectedUser.details}</p>
              {selectedUser.profilePicture && (
                <img
                  src={`http://localhost:5000/uploads/${selectedUser.profilePicture}`}
                  alt="Profile"
                  className="profile-picture"
                />
              )}
            </div>
          ) : (
            <ExamplePrivateChat
              currentUserId="currentUserId" // Replace this with the actual current user ID
              chatPartnerId={selectedUser._id} // Use the selected user's ID as the chat partner
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default PostList;
