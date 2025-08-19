import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import './SellCar.css'; // We can reuse the styles from the Sell Car page

const EditCar = () => {
  const { carId } = useParams();
  const [carDetails, setCarDetails] = useState(null);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const navigate = useNavigate();

  // 1. Fetch the car's current data when the page loads
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axiosInstance.get(`http://127.0.0.1:8000/api/cars/${carId}/`);
        setCarDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch car data for editing:", error);
        alert("Could not load car data.");
      }
    };
    fetchCar();
  }, [carId]);

  const handleNewImageChange = (e) => {
    if (e.target.files) {
      setNewImageFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveNewImage = (indexToRemove) => {
    setNewImageFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      const token = localStorage.getItem('accessToken');
      try {
        await axiosInstance.delete(`http://127.0.0.1:8000/api/images/${imageId}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // Refresh the car details to show the image has been removed
        setCarDetails(prev => ({
          ...prev,
          images: prev.images.filter(img => img.id !== imageId)
        }));
      } catch (error) {
        console.error("Failed to delete image", error);
        alert("Failed to delete image.");
      }
    }
  };

  // 2. Handler to update the form state as the user types
  const handleChange = (e) => {
    setCarDetails({ ...carDetails, [e.target.name]: e.target.value });
  };

  // 3. Handler to send the updated data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    try {
        if (newImageFiles.length > 0) {
        const uploadPromises = newImageFiles.map(file => {
          const formData = new FormData();
          formData.append('image_url', file);
          return axiosInstance.post(`http://127.0.0.1:8000/api/cars/${carId}/images/`, formData, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
        });
        await Promise.all(uploadPromises);
      }
      // Use axiosInstance.put() to send the update request
      await axiosInstance.put(`http://127.0.0.1:8000/api/cars/${carId}/`, carDetails, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Car updated successfully!');
      navigate(`/car/${carId}`); // Redirect back to the detail page
    } catch (error) {
      console.error('Failed to update car:', error.response?.data);
      alert('Failed to update car. Please check the details and try again.');
    }
  };

  // Show a loading message while the initial data is being fetched
  if (!carDetails) {
    return <p>Loading car data...</p>;
  }

  return (
    <div className="sell-car-container">
      <h1>Edit Your Car Listing</h1>
      <form onSubmit={handleSubmit} className="sell-car-form">
        <div className="form-section">
          <h3>Car Details</h3>
          <div className="form-grid">
            <input name="brand" value={carDetails.brand} onChange={handleChange} placeholder="Brand" required />
            <input name="model" value={carDetails.model} onChange={handleChange} placeholder="Model" required />
            <input name="year" type="number" value={carDetails.year} onChange={handleChange} placeholder="Year" required />
            <input name="price" type="number" value={carDetails.price} onChange={handleChange} placeholder="Price (₹)" required />
            <input name="km_driven" type="number" value={carDetails.km_driven} onChange={handleChange} placeholder="Kilometers Driven" required />
            <select name="fuel_type" value={carDetails.fuel_type} onChange={handleChange}>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="CNG">CNG</option>
            </select>
            <select name="transmission" value={carDetails.transmission} onChange={handleChange}>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
            <select name="owner_type" value={carDetails.owner_type} onChange={handleChange}>
              <option value="1st">1st Owner</option>
              <option value="2nd">2nd Owner</option>
              <option value="3rd">3rd Owner</option>
            </select>
            <input name="city" value={carDetails.city} onChange={handleChange} placeholder="City" required />
            <input name="body_type" value={carDetails.body_type} onChange={handleChange} placeholder="Body Type" required />
          </div>
          <textarea name="description" value={carDetails.description} onChange={handleChange} placeholder="Add a description..." />
        </div>
        <div className="form-section">
          <h3>Manage Photos</h3>
          <div className="existing-images-grid">
            {carDetails.images.map(image => (
              <div key={image.id} className="existing-image-item">
                <img src={image.image_url} alt="Existing car view" />
                <button type="button" onClick={() => handleDeleteImage(image.id)}>Delete</button>
              </div>
            ))}
          </div>
          <div className="image-input-group" style={{marginTop: '1rem'}}>
            <label>Upload New Photos</label>
            <input 
              type="file"
              multiple // Allow selecting multiple files
              onChange={handleNewImageChange} 
            />
          </div>
          {newImageFiles.length > 0 && (
            <div className="new-images-preview">
              <h4>Staged for Upload</h4>
              {newImageFiles.map((file, index) => (
                <div key={index} className="new-image-item">
                  <span>{file.name}</span>
                  <button type="button" onClick={() => handleRemoveNewImage(index)}>Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button type="submit" className="submit-car-btn">Save Changes</button>
      </form>
    </div>
  );
};

export default EditCar;