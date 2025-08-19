import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import "./CarDetail.css";
import {
  BsFillCalendarFill,
  BsSpeedometer2,
  BsFuelPumpFill,
  BsGearFill,
} from "react-icons/bs";

const CarDetail = () => {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  // State to track which image is currently displayed
  const [activeImage, setActiveImage] = useState(0);
  const [sellerDetails, setSellerDetails] = useState(null);

  const navigate = useNavigate();
  const handleGetSellerDetails = async () => {
    // 1. Check for the access token first
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in to view seller details.");
      navigate("/login"); // Redirect to login page
      return; // Stop the function here
    }

    // 2. If token exists, proceed with the API call
    try {
      const response = await axiosInstance.get(
        `http://127.0.0.1:8000/api/seller/${car.seller}/`,
        {
          // We also need to send the token to the backend
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSellerDetails(response.data);
    } catch (error) {
      console.error("Could not retrieve seller details.", error);
      alert("Could not retrieve seller details.");
    }
  };

  // For "Enquire Now", the simplest method is a 'mailto' link
  const handleEnquire = () => {
    // This function will now work as intended
    if (sellerDetails && sellerDetails.email) {
      window.location.href = `mailto:${sellerDetails.email}?subject=Enquiry about your ${car.year} ${car.model}`;
    } else {
      alert("Please get seller details first to reveal their email.");
    }
  };

  const handleDelete = async () => {
    // Ask for confirmation before deleting
    if (window.confirm("Are you sure you want to delete this listing?")) {
      const token = localStorage.getItem("accessToken");
      try {
        await axiosInstance.delete(`http://127.0.0.1:8000/api/cars/${carId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Car deleted successfully!");
        navigate("/my-cars"); // Redirect to my-cars page
      } catch (error) {
        console.error("Failed to delete car:", error);
        alert("Failed to delete car.");
      }
    }
  };

  useEffect(() => {
    // Function to fetch both car details and current user info
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      // Fetch current user if logged in
      if (token) {
        try {
          const userResponse = await axiosInstance.get(
            "http://127.0.0.1:8000/api/current-user/",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setCurrentUser(userResponse.data);
        } catch (error) {
          console.error("Failed to fetch current user:", error);
        }
      }

      // Fetch car details
      try {
        const carResponse = await axiosInstance.get(
          `http://127.0.0.1:8000/api/cars/${carId}/`
        );
        setCar(carResponse.data);
      } catch (error) {
        console.error("Failed to fetch car details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [carId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!car) return <div className="error">Car not found.</div>;
  const isOwner = currentUser && currentUser.username === car.seller;

  const carImages =
    car.images && car.images.length > 0
      ? car.images
      : [{ image_url: "https://via.placeholder.com/800x500?text=No+Image" }];

  return (
    <div className="car-detail-page">
      <div className="detail-layout">
        {/* --- Image Gallery (Left Side) --- */}
        <div className="image-gallery">
          <div className="main-image-container">
            <img
              src={carImages[activeImage].image_url}
              alt="Main car view"
              className="main-image"
            />
          </div>
          <div className="thumbnail-container">
            {carImages.map((image, index) => (
              <img
                key={index}
                src={image.image_url}
                alt={`Thumbnail ${index + 1}`}
                className={
                  index === activeImage ? "thumbnail active" : "thumbnail"
                }
                onClick={() => setActiveImage(index)}
              />
            ))}
          </div>
        </div>

        {/* --- Car Info (Right Side) --- */}
        <div className="car-info">
          <h1 className="car-title">
            {car.year} {car.model}
          </h1>
          <p className="car-price">₹ {car.price.toLocaleString("en-IN")}</p>

          <div className="car-specs">
            <h2>Specifications</h2>
            <div className="spec-grid">
              {/* 2. Add the imported icons next to the text */}
              <div className="spec-item">
                <BsFillCalendarFill className="spec-icon" />
                <div>
                  <strong>Model Year</strong>
                  <span>{car.year}</span>
                </div>
              </div>
              <div className="spec-item">
                <BsSpeedometer2 className="spec-icon" />
                <div>
                  <strong>Mileage</strong>
                  <span>{car.km_driven.toLocaleString("en-IN")} km</span>
                </div>
              </div>
              <div className="spec-item">
                <BsFuelPumpFill className="spec-icon" />
                <div>
                  <strong>Fuel Type</strong>
                  <span>{car.fuel_type}</span>
                </div>
              </div>
              <div className="spec-item">
                <BsGearFill className="spec-icon" />
                <div>
                  <strong>Transmission</strong>
                  <span>{car.transmission}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            {isOwner ? (
              <>
                {/* The Update button now links to an edit page */}
                <Link to={`/car/${carId}/edit`} className="btn-primary">
                  Update
                </Link>
                {/* The Delete button now calls handleDelete */}
                <button onClick={handleDelete} className="btn-secondary">
                  Delete
                </button>
              </>
            ) : (
              <>
                <a href="#!" onClick={handleEnquire} className="btn-primary">
                  Enquire Now
                </a>
                <button
                  onClick={handleGetSellerDetails}
                  className="btn-primary"
                >
                  Get Seller Details
                </button>
              </>
            )}
          </div>
          {sellerDetails && (
            <div className="seller-details-box">
              <h3>Seller Contact</h3>
              <p>
                <strong>Username:</strong> {sellerDetails.username}
              </p>
              <p>
                <strong>Email:</strong> {sellerDetails.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
