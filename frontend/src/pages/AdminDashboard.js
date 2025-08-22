import React, { useState, useEffect } from "react";
import { axiosInstance } from "../api/axios";
import CarCard from "../components/CarCard";
import "./BuyCar.css";
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [pendingCars, setPendingCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingCars = async () => {
      try {
        const response = await axiosInstance.get("/admin/pending-cars/");
        setPendingCars(response.data);
      } catch (error) {
        console.error("Failed to fetch pending cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingCars();
  }, []);

  if (loading) {
    return <h2>Loading pending approvals...</h2>;
  }

  return (
    <div className="buy-car-page">
      <h1>Admin Dashboard: Pending Approvals</h1>
      {pendingCars.length > 0 ? (
        <div className="car-grid">
          {pendingCars.map((car) => (
            <Link to={`/car/${car.id}`} key={car.id} style={{textDecoration:"none"}}>
              <CarCard car={car} />
            </Link>
          ))}
        </div>
      ) : (
        <p>There are no cars awaiting approval.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
