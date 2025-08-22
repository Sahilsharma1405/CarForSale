import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../api/axios";
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

  const [activeImage, setActiveImage] = useState(0);
  const [sellerDetails, setSellerDetails] = useState(null);
  const [isStaff, setIsStaff] = useState(false);
  const navigate = useNavigate();
  const handleGetSellerDetails = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in to view seller details.");
      navigate("/login");
      return;
    }
    try {
      const response = await axiosInstance.get(
        `http://127.0.0.1:8000/api/seller/${car.seller}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSellerDetails(response.data);
    } catch (error) {
      console.error("Could not retrieve seller details.", error);
      alert("Could not retrieve seller details.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      const token = localStorage.getItem("accessToken");
      try {
        await axiosInstance.delete(`http://127.0.0.1:8000/api/cars/${carId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Car deleted successfully!");
        navigate("/my-cars");
      } catch (error) {
        console.error("Failed to delete car:", error);
        alert("Failed to delete car.");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const userResponse = await axiosInstance.get(
            "http://127.0.0.1:8000/api/current-user/",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setIsStaff(userResponse.data.is_staff);
          setCurrentUser(userResponse.data);
        } catch (error) {
          console.error("Failed to fetch current user:", error);
        }
      }
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

  const handleApprove = async () => {
    if (window.confirm("Are you sure you want to approve this car?")) {
      try {
        await axiosInstance.post(`/admin/approve-car/${carId}/`);
        alert("Car approved successfully!");
        navigate("/admin/dashboard");
      } catch (error) {
        console.error("Failed to approve car:", error);
        alert("Failed to approve car.");
      }
    }
  };

  const handleReject = async () => {
    if (
      window.confirm(
        "Are you sure you want to reject this car? This will hide it from the user."
      )
    ) {
      try {
        await axiosInstance.post(`/admin/reject-car/${carId}/`);
        alert("Car rejected successfully!");
        navigate("/admin/dashboard");
      } catch (error) {
        console.error("Failed to reject car:", error);
        alert("Failed to reject car.");
      }
    }
  };
  if (loading) return <div className="loading">Loading...</div>;
  if (!car) return <div className="error">Car not found.</div>;
  const isOwner = currentUser && currentUser.username === car.seller;

  const carImages =
    car.images && car.images.length > 0
      ? car.images
      : [{ image_url: "https://via.placeholder.com/800x500?text=No+Image" }];

  const renderActionButtons = () => {
    console.log("Checking conditions:", {
      isAdmin: isStaff,
      status: car.status,
    });
    if (isStaff && car.status.toLowerCase() === "pending") {
      return (
        <div className="admin-full-width-btn">
          <button onClick={handleApprove} className="approve-btn">
            Approve This Car
          </button>
          <button onClick={handleReject} className="reject-btn">
            Reject This Car
          </button>
        </div>
      );
    }
    if (isOwner) {
      const isPending = car.status.toLowerCase() === "pending";
      const isRejected = car.status.toLowerCase() === "rejected";
      return (
        <>
          <Link
            to={`/car/${carId}/edit`}
            className={`btn-primary ${
              isPending || isRejected ? "disabled-link" : ""
            }`}
            onClick={(e) => (isPending || isRejected) && e.preventDefault()}
          >
            Update
          </Link>
          <button
            onClick={handleDelete}
            className={`btn-secondary ${isPending?"disabled-link":""}`}
            disabled={false}
          >
            Delete
          </button>
        </>
      );
    }
    return (
      <>
        <a href={`mailto:${sellerDetails?.email}`} className="btn-primary">
          Enquire Now
        </a>
        <button onClick={handleGetSellerDetails} className="btn-secondary">
          Get Seller Details
        </button>
      </>
    );
  };

  return (
    <div className="car-detail-page">
      <div className="detail-layout">
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

        <div className="car-info">
          <h1 className="car-title">
            {car.year} {car.model}
          </h1>
          <p className="car-price">₹ {car.price.toLocaleString("en-IN")}</p>

          <div className="car-specs">
            <h2>Specifications</h2>
            <div className="spec-grid">
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
                  <strong>Km Driven</strong>
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

          <div className="action-buttons">{renderActionButtons()}</div>
          {isOwner && car.status.toLowerCase() === "pending" && (
            <p className="status-notice">Under review. Actions disabled.</p>
          )}
          {isOwner && car.status.toLowerCase() === "rejected" && (
            <p className="status-notice-rejected">
              This listing was rejected. Please delete it or contact support.
            </p>
          )}
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