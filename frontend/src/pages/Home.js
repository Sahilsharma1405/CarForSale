import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { Link } from 'react-router-dom';
import HeroSearch from '../components/HeroSearch';
import './Home.css';
import Counter from '../components/Counter';
import CarCard from '../components/CarCard';

const Home = () => {
  const [cars, setFeaturedCars] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchInitialCars = async () => {
      try {
        const response = await axiosInstance.get('http://127.0.0.1:8000/api/cars/');
        setFeaturedCars(response.data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch featured cars:", error);
      }
    };
    fetchInitialCars();
  }, []);
  
  // 2. New function to handle the search from the Hero component
  const handleSearch = async (searchTerm) => {
    if (!searchTerm) return;
    
    setHasSearched(true);
    setIsSearching(true);
    try {
      const response = await axiosInstance.get(`http://127.0.0.1:8000/api/cars/?model=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Failed to perform search:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // 2. useEffect to fetch the car data when the page loads
  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        // Change the URL to the new, specific endpoint
        const response = await axiosInstance.get('http://127.0.0.1:8000/api/featured-cars/');
        setFeaturedCars(response.data); // You can rename the state if you like
      } catch (error) {
        console.error("Failed to fetch featured cars:", error);
      }
    };
    fetchFeaturedCars();
  }, [])

  // 3. Get just the first 3 cars to display in the featured section
  const featuredCars = cars.slice(0, 3);
  return (
    <div className="home-container">
      <HeroSearch  onSearch={handleSearch}/>
      {hasSearched && (
        <section className="page-section search-results-section">
          <h2>Search Results</h2>
          {isSearching ? (
            <p>Searching...</p>
          ) : searchResults.length > 0 ? (
            <div className="home-car-grid">
              {searchResults.map(car => <CarCard key={car.id} car={car} />)}
            </div>
          ) : (
            <p>No cars found matching your search.</p>
          )}
        </section>
      )}
      <Counter items={{carsSold:1500,happyCustomers:1000,citiesServed:10}}/>

      <section className="page-section">
        <h2>Featured Cars</h2>
        <div className="view-all-link">
            <Link to="/buy">View All Cars &rarr;</Link>
        </div>
        <div className="home-car-grid">
          {featuredCars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      <section className="why-choose-us">
        <h2>Why Choose CarForSale?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h3>Quality Assured</h3>
            <p>Every car is thoroughly inspected to ensure the highest quality standards.</p>
          </div>
          <div className="feature-item">
            <h3>Transparent Pricing</h3>
            <p>No hidden fees. We provide clear, upfront pricing for all our vehicles.</p>
          </div>
          <div className="feature-item">
            <h3>Easy Financing</h3>
            <p>We offer flexible financing options to make your purchase easier.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;