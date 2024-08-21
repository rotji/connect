import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreatePost = ({ onCreatePost, user }) => {
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState(user || '');

  useEffect(() => {
    if (!userId) {
      // Attempt to fetch the user ID if not provided
      const fetchUserId = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/users/profile');
          setUserId(res.data._id);
        } catch (err) {
          console.error('Failed to fetch user ID:', err);
        }
      };

      fetchUserId();
    }
  }, [userId]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      console.error('User ID is required to create a post.');
      return;
    }

    try {
      // Log the data being sent
      console.log('Sending data:', { userId, content: content.trim() });

      const res = await axios.post('http://localhost:5000/api/posts', {
        userId,
        content: content.trim(),
      });

      // If the post creation was successful, add the new post to the list
      onCreatePost(res.data);

      // Clear the textarea after successful post creation
      setContent('');
    } catch (err) {
      // Log detailed error information
      console.error('Failed to create post:', err.response?.data || err.message);
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
