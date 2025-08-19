import React from 'react';
import { Link } from 'react-router-dom';
import './CarCard.css';

const CarCard = ({ car }) => {
  const imageUrl = car.images && car.images.length > 0 
    ? car.images[0].image_url 
    : 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <div className="car-card">
      <Link to={`/car/${car.id}`} className="car-card-link">
        <div className="car-image-container">
          <img src={imageUrl} alt={`${car.brand} ${car.model}`} className="car-card-img" />
        </div>
      </Link>
      <div className="car-card-body">
        <h3 className="car-card-title">
          <Link to={`/car/${car.id}`}>{car.year} {car.brand} {car.model}</Link>
        </h3>
        <p className="car-card-price">₹ {car.price ? car.price.toLocaleString('en-IN') : 'N/A'}</p>
        
        <div className="car-key-details">
          <span>{car.km_driven ? car.km_driven.toLocaleString('en-IN') : 'N/A'} km</span>
          <span>&bull;</span>
          <span>{car.fuel_type}</span>
          <span>&bull;</span>
          <span>{car.transmission}</span>
        </div>

        <Link to={`/car/${car.id}`} className="view-details-button">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CarCard;