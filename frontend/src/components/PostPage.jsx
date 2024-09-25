import React, { useState, useEffect } from 'react';
import CreatePost from './CreatePost';
import PostList from './PostList';
import axios from 'axios';
import ErrorBoundary from './ErrorBoundary';

const PostPage = () => {
  const [posts, setPosts] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);  // Track the logged-in user's email

  // Fetch existing posts and the current user's details when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts from backend
        const postsRes = await axios.get('http://localhost:5000/api/posts');
        setPosts(postsRes.data);

        // Fetch current user info from backend (replace with the actual API endpoint)
        const userRes = await axios.get('http://localhost:5000/api/auth/currentUser'); // Assuming this endpoint provides current user info
        setCurrentUserEmail(userRes.data.email);  // Set the current user's email

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const addNewPost = (newPost) => {
    setPosts([newPost, ...posts]);  // Add new post to the list of posts
  };

  return (
    <div>
      <ErrorBoundary>
        {/* Pass currentUserEmail to PostList and CreatePost */}
        <CreatePost onCreatePost={addNewPost} currentUserEmail={currentUserEmail} />
        {/* Pass currentUserEmail to PostList for identification */}
        {currentUserEmail && <PostList posts={posts} currentUserEmail={currentUserEmail} />}
      </ErrorBoundary>
    </div>
  );
};

export default PostPage;
