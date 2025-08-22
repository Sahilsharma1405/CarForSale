import React, { useState } from 'react';
import {axiosInstance} from '../api/axios';
import './Form.css';

const PredictPrice = () => {
  const [carDetails, setCarDetails] = useState({
    brand: 'suzuki',
    model: 'baleno',
    year: '2017',
    km_driven: '70000',
    transmission: 'Manual',
    owner: 'First Owner', 
    fuel_type: 'Petrol'
  });
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCarDetails({ ...carDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPredictedPrice(null);
    try {
      const response = await axiosInstance.post('http://127.0.0.1:8000/api/predict-price/', carDetails);
      setPredictedPrice(response.data.predicted_price);
    } catch (error) {
      console.error("Failed to get prediction:", error.response?.data || error.message);
      alert("Could not get a price prediction. Please check the input fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <h2>Predict Your Car's Price</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Brand</label>
            <input name="brand" value={carDetails.brand} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Model</label>
            <input name="model" value={carDetails.model} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Year</label>
            <input name="year" type="number" value={carDetails.year} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Kilometers Driven</label>
            <input name="km_driven" type="number" value={carDetails.km_driven} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Transmission</label>
            <select name="transmission" value={carDetails.transmission} onChange={handleChange}>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>
          <div className="form-group">
            <label>Fuel Type</label>
            <select name="fuel_type" value={carDetails.fuel_type} onChange={handleChange}>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
            </select>
          </div>
          <div className="form-group">
            <label>Owner</label>
            <select name="owner" value={carDetails.owner} onChange={handleChange}>
              <option value="First Owner">First Owner</option>
              <option value="Second Owner">Second Owner</option>
              <option value="Third Owner">Third Owner</option>
            </select>
          </div>
        </div>
        
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict Price'}
        </button>

        {predictedPrice && (
          <div className="prediction-result">
            <h3>Estimated Price:</h3>
            <p>₹ {Math.round(predictedPrice).toLocaleString('en-IN')}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default PredictPrice;