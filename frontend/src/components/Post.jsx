// src/components/Post.jsx
import React from 'react';

const Post = ({ post }) => (
  <div>
    <h3>{post.title}</h3>
    <p>{post.content}</p>
    <p>Posted by: {post.user}</p>
  </div>
);

export default Post;
