import React, { useState } from "react";
// 1. Import both instances
import { axiosInstance, axiosUploadInstance } from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./SellCar.css";

const SellCar = () => {
  const [carDetails, setCarDetails] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    km_driven: "",
    fuel_type: "Petrol",
    transmission: "Manual",
    owner_type: "1st",
    city: "",
    body_type: "",
    description: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCarDetails({ ...carDetails, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImageFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
    e.target.value = null;
  };

  const removeImageFile = (indexToRemove) => {
    setImageFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const carResponse = await axiosInstance.post("/cars/", carDetails);
      const carId = carResponse.data.id;

      alert("Car details saved! Now uploading images...");

      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map((file) => {
          const formData = new FormData();
          formData.append("image_url", file);
          return axiosUploadInstance.post(`/cars/${carId}/images/`, formData);
        });
        await Promise.all(uploadPromises);
      }

      alert("Car listed successfully with all images!");
      navigate(`/car/${carId}`);
    } catch (error) {
      console.error(
        "Failed to create car:",
        error.response?.data || error.message
      );
      alert("Failed to list your car. Please check the details and try again.");
    }
  };

  return (
    <div className="sell-car-container">
      <h1>List Your Car for Sale</h1>
      <form onSubmit={handleSubmit} className="sell-car-form">
        <div className="form-section">
          <h3>Car Details</h3>
          <div className="form-grid">
            <input
              name="brand"
              value={carDetails.brand}
              onChange={handleChange}
              placeholder="Brand"
              required
            />
            <input
              name="model"
              value={carDetails.model}
              onChange={handleChange}
              placeholder="Model"
              required
            />
            <input
              name="year"
              type="number"
              value={carDetails.year}
              onChange={handleChange}
              placeholder="Year"
              required
            />
            <input
              name="price"
              type="number"
              value={carDetails.price}
              onChange={handleChange}
              placeholder="Price (₹)"
              required
            />
            <input
              name="km_driven"
              type="number"
              value={carDetails.km_driven}
              onChange={handleChange}
              placeholder="Kilometers"
              required
            />
            <select
              name="fuel_type"
              value={carDetails.fuel_type}
              onChange={handleChange}
            >
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Electric</option>
              <option>CNG</option>
            </select>
            <select
              name="transmission"
              value={carDetails.transmission}
              onChange={handleChange}
            >
              <option>Manual</option>
              <option>Automatic</option>
            </select>
            <select
              name="owner_type"
              value={carDetails.owner_type}
              onChange={handleChange}
            >
              <option value="1st">1st owner</option>
              <option value="2nd">2nd owner</option>
              <option value="3rd">3rd owner</option>
            </select>
            <input
              name="city"
              value={carDetails.city}
              onChange={handleChange}
              placeholder="City"
              required
            />
            <input
              name="body_type"
              value={carDetails.body_type}
              onChange={handleChange}
              placeholder="Body Type"
              required
            />
          </div>
          <textarea
            style={{marginTop:"10px"}}
            name="description"
            value={carDetails.description}
            onChange={handleChange}
            placeholder="Add a description..."
          />
        </div>

        <div className="form-section">
          <h3>Upload Photos</h3>
          <div className="image-input-group">
            <label htmlFor="file-upload" className="custom-file-upload">
              Add Photos
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
          {imageFiles.length === 0 ? (
            <p>No files chosen</p>
          ) : (
            <div className="file-list">
              <p>{imageFiles.length} file(s) selected:</p>
              <ul>
                {imageFiles.map((file, index) => (
                  <li key={index}>
                    {file.name}{" "}
                    <button
                      type="button"
                      onClick={() => removeImageFile(index)}
                      style={{ marginLeft: "10px" }}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button type="submit" className="submit-car-btn">
          Submit Car
        </button>
      </form>
    </div>
  );
};

export default SellCar;