import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UpdateProfile from './UpdateProfile';
import CreatePost from './CreatePost';
import Chat from './Chat';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState([]);


  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Log the token
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/users/profile', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('Profile Response:', res.data); 

          setProfile(res.data);
          } catch (err) {
          const errorMsg = err.response ? err.response.data.msg : err.message;
          setError(`Failed to fetch profile data: ${errorMsg}`);
          console.error(err);
        }
      } else {
        setError('No token found');
      }
    };

    const fetchPosts = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/posts', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setPosts(res.data);
        } catch (err) {
          console.error('Error fetching posts:', err);
        }
      }
    };

    fetchProfile();
    fetchPosts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload(); 
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
  };
  
  const handleCreatePost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>
      <p>Category: {profile.category}</p>
      <p>Details: {profile.details}</p>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={() => setIsEditing(true)}>Edit Profile</button> {/* Add this line */}
      {isEditing && ( // Add this block
        <UpdateProfile 
          profile={profile} 
          setProfile={setProfile} 
          setIsEditing={setIsEditing} 
        />
      )}
      <h2>Posts</h2>
      <CreatePost onCreatePost={handleCreatePost} />
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <button onClick={() => alert(post.content)}>{post.content}</button>
          </li>
        ))}
      </ul>
      <Chat />
    </div>
  );
};

export default Profile;