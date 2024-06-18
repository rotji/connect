// src/components/PostList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/posts', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(res.data);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Posts</h2>
      {posts.map(post => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
