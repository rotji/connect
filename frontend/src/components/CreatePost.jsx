// src/components/CreatePost.jsx
import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = ({ onCreatePost }) => {
  const [content, setContent] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post('http://localhost:5000/api/posts', { content }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onCreatePost(res.data);
      setContent('');
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        required
      ></textarea>
      <button type="submit">Post</button>
    </form>
  );
};

export default CreatePost;
