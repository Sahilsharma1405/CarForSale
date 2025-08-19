import React, { useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import './SellCar.css'; // New styles for this page

const SellCar = () => {
  const [carDetails, setCarDetails] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    km_driven: '',
    fuel_type: 'Petrol',
    transmission: 'Manual',
    owner_type: '1st',
    city: '',
    body_type: '',
    description: ''
  });
  const [imageFiles, setImageFiles] = useState([null]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCarDetails({ ...carDetails, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, file) => {
    const newFiles = [...imageFiles];
    newFiles[index] = file;
    setImageFiles(newFiles);
  };

  const addImageField = () => {
    setImageFiles([...imageFiles, '']);
  };

  const removeImageField = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert("Please log in to sell a car.");
      navigate('/login');
      return;
    }

    try {
      const carResponse = await axiosInstance.post('http://127.0.0.1:8000/api/cars/', carDetails, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const carId = carResponse.data.id;
      alert('Car details saved! Now adding images...');
      
      const uploadPromises = imageFiles.map(file => {
        if (file) {
          const formData = new FormData();
          formData.append('image_url', file); // Use 'image_url' to match the backend model field
          
          return axiosInstance.post(`http://127.0.0.1:8000/api/cars/${carId}/images/`, formData, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
        }
        return Promise.resolve();
      });

      await Promise.all(uploadPromises); // Wait for all images to upload

      alert('Car listed successfully with all images!');
      navigate(`/car/${carId}`);
    } catch (error) {
      console.error('Failed to create car:', error.response?.data || error.message);
      alert('Failed to list your car. Please check the details and try again.');
    }
  };

  return (
    <div className="sell-car-container">
      <h1>List Your Car for Sale</h1>
      <p>Please fill out the details below to put your car up for sale.</p>
      <form onSubmit={handleSubmit} className="sell-car-form">
        <div className="form-section">
          <h3>Car Details</h3>
          <div className="form-grid">
            <input name="brand" value={carDetails.brand} onChange={handleChange} placeholder="Brand (e.g., Maruti Suzuki)" required />
            <input name="model" value={carDetails.model} onChange={handleChange} placeholder="Model (e.g., Baleno)" required />
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
            <input name="body_type" value={carDetails.body_type} onChange={handleChange} placeholder="Body Type (e.g., Sedan)" required />
          </div>
          <textarea name="description" value={carDetails.description} onChange={handleChange} placeholder="Add a description..." />
        </div>

        <div className="form-section">
          <h3>Upload Photos</h3>
          {imageFiles.map((url, index) => (
            <div key={index} className="image-input-group">
              <input 
              type='file'
                // value={url} 
                onChange={(e) => handleImageChange(index, e.target.files[0])} 
                placeholder={`Image URL ${index + 1}`} 
                required 
              />
              {imageFiles.length > 1 && (
                <button type="button" onClick={() => removeImageField(index)} className="remove-image-btn">-</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addImageField} className="add-image-btn">+ Add Another Image</button>
        </div>
        
        <button type="submit" className="submit-car-btn">Submit Car</button>
      </form>
    </div>
  );
};

export default SellCar;