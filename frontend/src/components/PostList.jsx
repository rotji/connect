// src/components/PostList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post'; // Assuming you have a Post component

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
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

    fetchPosts();
  }, []);

  return (
    <div>
      {posts.map(post => (
        <Post key={post._id} post={post} /> // Use Post component to display each post
      ))}
    </div>
  );
};

export default PostList;
