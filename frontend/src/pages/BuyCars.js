import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import CarCard from "../components/CarCard";
import AdvancedFilter from "../components/AdvancedFilter";
import "./BuyCar.css";
import banglore from "../assests/images/bangalore.png";
import ahmedabad from "../assests/images/landmark.png";
import chennai from "../assests/images/monument.png";
import delhi from "../assests/images/india-gate.png";
import mumbai from "../assests/images/gate-of-india.png";
import pune from "../assests/images/pune.png";
import kolkata from "../assests/images/kolkata.png";
import hyderabad from "../assests/images/hyderabad-charminar.png";
import toyota from "../assests/logos/toyota.png";
import tata from "../assests/logos/tata.jpg";
import hyundai from "../assests/logos/hyundai.png";
import suzuki from "../assests/logos/suzuki.jpg";
import mahindra from "../assests/logos/mahindra.jpg";
import honda from "../assests/logos/honda.jpg";
import kia from "../assests/logos/kia.png";
import renault from "../assests/logos/renault.png";
import mg from "../assests/logos/mg.jpg";
import ford from "../assests/logos/ford.png";

const cities = [
  { name: "Mumbai", icon: mumbai },
  { name: "Delhi", icon: delhi },
  { name: "Bangalore", icon: banglore },
  { name: "Chennai", icon: chennai },
  { name: "Hyderabad", icon: hyderabad },
  { name: "Kolkata", icon: kolkata },
  { name: "Pune", icon: pune },
  { name: "Ahmedabad", icon: ahmedabad },
];

const brands = [
  { name: "Maruti Suzuki", logo: suzuki },
  { name: "Hyundai", logo: hyundai },
  { name: "Tata", logo: tata },
  { name: "Mahindra", logo: mahindra },
  { name: "Kia", logo: kia },
  { name: "Toyota", logo: toyota },
  { name: "Honda", logo: honda },
  { name: "Renault", logo: renault },
  { name: "Ford", logo: ford },
  { name: "MG", logo: mg },
];

const transmissions = ["Automatic", "Manual"];
const fuelTypes = ["Petrol", "Diesel", "Electric", "CNG"];
const BRANDS_PER_PAGE = 8;

const BuyCars = () => {
  // --- STATE MANAGEMENT ---
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [filters, setFilters] = useState({
  //   city: "",
  //   brand: "",
  //   model_search: "",
  // });
  const [activeFilter, setActiveFilter] = useState({ key: '', value: '' });
  const [activeTab, setActiveTab] = useState("Brands");
  const [brandPage, setBrandPage] = useState(0);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        let url = 'http://127.0.0.1:8000/api/cars/';
        
        // If there's an active filter, add it to the API request URL
        if (activeFilter.key && activeFilter.value) {
          const paramKey = activeFilter.key === 'model_search' ? 'model' : activeFilter.key;
          url += `?${paramKey}=${activeFilter.value}`;
        }
        
        const response = await axiosInstance.get(url);
        setCars(response.data);
      } catch (error) {
        console.error("Failed to fetch cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [activeFilter]);

  // --- EVENT HANDLERS ---
  const handleFilterChange = (key, value) => {
    setActiveFilter({ key, value });
  };

  const totalBrandPages = Math.ceil(brands.length / BRANDS_PER_PAGE);

  const handleNextBrand = () => {
    setBrandPage((prevPage) => (prevPage + 1) % totalBrandPages);
  };

  const handlePrevBrand = () => {
    setBrandPage(
      (prevPage) => (prevPage - 1 + totalBrandPages) % totalBrandPages
    );
  };

  const displayedBrands = brands.slice(
    brandPage * BRANDS_PER_PAGE,
    brandPage * BRANDS_PER_PAGE + BRANDS_PER_PAGE
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "Brands":
        return (
          <div className="brand-slider-container">
            <button onClick={handlePrevBrand} className="slider-btn prev-btn">
              &lt;
            </button>
            <div className="brand-grid">
              {displayedBrands.map((brand) => (
                <div key={brand.name} className="brand-item" onClick={() => handleFilterChange('brand', brand.name)}>
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="brand-logo"
                  />
                  <span>{brand.name}</span>
                </div>
              ))}
            </div>
            <button onClick={handleNextBrand} className="slider-btn next-btn">
              &gt;
            </button>
          </div>
        );
      case "Transmission":
        return (
          <div className="choice-grid">
            {transmissions.map((type) => (
              <div key={type} className="choice-item" onClick={() => handleFilterChange('transmission', type)}>
                {type}
              </div>
            ))}
          </div>
        )
      case "Fuel Type":
        return (
          <div className="choice-grid">
            {fuelTypes.map((type) => (
              <div key={type} className="choice-item" onClick={() => handleFilterChange('fuel_type', type)}>
                {type}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="buy-car-page">
      <div className="search-banner">
        <h1>Find Used Cars in India</h1>
        <div className="search-box">
          <select name="city" onChange={(e)=>{handleFilterChange('city',e.target.value)}} className="city-select">
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="model_search"
            placeholder="Search by model..."
            onChange={(e)=>{handleFilterChange('model_search',e.target.value)}}
            className="search-input-main"
          />
        </div>
      </div>

      <div className="page-section">
        <h2>Used Cars By City</h2>
        <div className="city-grid">
          {cities.map((city) => (
            <div key={city.name} className="city-item" onClick={() => handleFilterChange('city', city.name)}>
              <img
                src={city.icon}
                alt={`${city.name} icon`}
                className="city-icon"
              />
              <span>{city.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="page-section">
        <h2>Second Hand Cars Of Your Choice</h2>
        <div className="choice-tabs">
          <button
            onClick={() => setActiveTab("Brands")}
            className={
              activeTab === "Brands" ? "tab-button active" : "tab-button"
            }>
            Brands
          </button>
          <button
            onClick={() => setActiveTab("Transmission")}
            className={
              activeTab === "Transmission" ? "tab-button active" : "tab-button"
            }
          >
            Transmission
          </button>
          <button
            onClick={() => setActiveTab("Fuel Type")}
            className={
              activeTab === "Fuel Type" ? "tab-button active" : "tab-button"
            }
          >
            Fuel Type
          </button>
        </div>
        {renderTabContent()}
      </div>

      <div className="page-section">
        <h2>Popular Pre-Owned Cars</h2>
        <div className="car-grid">
          {loading ? (
            <p>Loading cars...</p>
          ) : cars.length > 0 ? (
            cars.map((car) => <CarCard key={car.id} car={car} />)
          ) : (
            <p>No cars found matching your criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyCars;