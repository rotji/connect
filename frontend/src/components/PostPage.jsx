import React, { useState, useEffect } from 'react';
import CreatePost from './CreatePost';
import PostList from './PostList';
import axios from 'axios';

const PostPage = () => {
  const [posts, setPosts] = useState([]);

  // Fetch existing posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/posts');
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, []);

  const addNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div>
      <CreatePost onCreatePost={addNewPost} />
      <PostList posts={posts} />
    </div>
  );
};

export default PostPage;
