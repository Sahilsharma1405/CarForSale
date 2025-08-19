import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { Link } from "react-router-dom";
import "./MyCar.css";

const MyCars = () => {
  const [myCars, setMyCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCars = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        // You might want to redirect to login here
        return;
      }

      try {
        const response = await axiosInstance.get("http://127.0.0.1:8000/api/my-cars/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMyCars(response.data);
      } catch (error) {
        console.error("Failed to fetch user's cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCars();
  }, []);

  if (loading) {
    return <div className="loading">Loading your cars...</div>;
  }

  return (
    <div className="my-cars-container">
      <h1>My Listed Cars</h1>
      {myCars.length > 0 ? (
        <div className="my-cars-list">
          {myCars.map((car) => (
            <div className="my-car-item">
              <img
                src={
                  car.images && car.images.length > 0
                    ? car.images[0].image_url
                    : "https://via.placeholder.com/150"
                }
                alt={car.model}
                className="my-car-image"
              />
              <div className="my-car-info">
                <h3>
                  {car.year} {car.model}
                </h3>
                <p className="price">₹ {car.price.toLocaleString("en-IN")}</p>
                <p className="details">
                  {car.km_driven.toLocaleString("en-IN")} km
                </p>
              </div>
              <Link
                to={`/car/${car.id}`}
                key={car.id}
                className="my-car-item-link"
              >
                <button className="view-details-btn">View Details</button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>You have not listed any cars yet.</p>
      )}
    </div>
  );
};

export default MyCars;
