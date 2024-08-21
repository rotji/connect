import React from 'react';

const PostList = ({ posts }) => {
  return (
    <div>
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
            <p>{post.content}</p>
            <small>Posted by {post.authorName} on {new Date(post.createdAt).toLocaleString()}</small>
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default PostList;
