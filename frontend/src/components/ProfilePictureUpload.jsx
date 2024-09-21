import { useState } from 'react';
import axios from 'axios';

const ProfilePictureUpload = () => {
  const [file, setFile] = useState(null); // Selected file
  const [preview, setPreview] = useState(null); // Image preview
  const [uploadStatus, setUploadStatus] = useState(null); // Success or error message

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile)); // Create a local URL for preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload-profile-pic', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadStatus('Profile picture uploaded successfully!');
      console.log('Uploaded image URL:', response.data.profilePicUrl);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setUploadStatus('Failed to upload profile picture.');
    }
  };

  return (
    <div>
      <h3>Upload Profile Picture</h3>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && <img src={preview} alt="Profile Preview" width="100" />}
        <button type="submit">Upload</button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default ProfilePictureUpload;
