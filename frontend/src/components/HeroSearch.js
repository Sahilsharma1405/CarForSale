import React, { useState } from 'react';
import './HeroSearch.css';

// It now accepts an 'onSearch' function as a prop
const HeroSearch = ({ onSearch }) => {
  // State to hold the text from the search input
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchClick = () => {
    // Call the function passed from the Home page with the search term
    onSearch(searchTerm);
  };

  return (
    <section className="hero-search-container">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>The Most Trusted Way to Buy and Sell a Car</h1>
        <p>Find your next car from thousands of certified listings.</p>
        <div className="search-wrapper">
          <input 
            type="text" 
            placeholder="Search for a car (e.g. Swift)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearchClick}>Search</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;