import React from 'react';
import './AdvancedFilter.css';

const AdvancedFilter = ({ filters, onFilterChange }) => {
  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    onFilterChange(name, value, checked);
  };

  return (
    <aside className="advanced-filter-sidebar">
      <h3>Filters</h3>
      
      <div className="filter-group">
        <h4>Fuel Type</h4>
        {['Petrol', 'Diesel', 'CNG', 'Electric'].map(fuel => (
          <label key={fuel}>
            <input 
              type="checkbox" 
              name="fuel_type"
              value={fuel}
              checked={filters.fuel_type.includes(fuel)}
              onChange={handleCheckboxChange} 
            /> {fuel}
          </label>
        ))}
      </div>
      
      <div className="filter-group">
        <h4>Transmission</h4>
        {['Manual', 'Automatic'].map(type => (
          <label key={type}>
            <input 
              type="checkbox" 
              name="transmission"
              value={type}
              checked={filters.transmission.includes(type)}
              onChange={handleCheckboxChange}
            /> {type}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Car Type</h4>
        {['Sedan', 'SUV', 'Hatchback'].map(type => (
          <label key={type}>
            <input 
              type="checkbox" 
              name="body_type"
              value={type}
              checked={filters.body_type.includes(type)}
              onChange={handleCheckboxChange}
            /> {type}
          </label>
        ))}
      </div>
    </aside>
  );
};

export default AdvancedFilter;