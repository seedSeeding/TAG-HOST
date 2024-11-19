import React, { useState } from 'react';
import axios from 'axios';
import apiService from '../services/apiService';

const UpdateImage = ({ pattern_number , setLoad}) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append('image', image);
    formData.append("pattern_number",pattern_number);

    try {
      const response = await apiService.post("patterns/update-image", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(response.data.message);
      setLoad(true);
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setError(err.response.data.errors.image[0]); // Display the first validation error
      } else {
        setError('An error occurred while updating the image.');
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
        <button type="submit" style={{backgroundColor:"black", color:"white"}}>Update Image</button>
          <label htmlFor="image">Image: </label>
          <input type="file" id="image" onChange={handleImageChange} required />
        </div>

      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default UpdateImage;
