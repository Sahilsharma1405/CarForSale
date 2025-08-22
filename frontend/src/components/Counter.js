import React, { useState, useEffect } from 'react';
import './Counter.css';


const StatItem = ({ endValue, label, duration = 2000 }) => {
  // State to hold the current number being displayed
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(endValue);
    // Calculate the increment for each step of the animation
    const increment = end / (duration / 16); // 16ms is roughly one frame

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        // When the count reaches the end, clear the interval and set the final value
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    // Cleanup function to clear the interval if the component is unmounted
    return () => clearInterval(timer);
  }, [endValue, duration]); // Rerun effect if these props change

  return (
    <div className="stat-item">
      <span className="stat-number">{count.toLocaleString()}+</span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

// The main Counter section component
const Counter = (props) => {
  return (
    <div className="stats-section">
      <StatItem endValue={props.items.carsSold} label="Cars Sold" />
      <StatItem endValue={props.items.happyCustomers} label="Happy Customers" />
      <StatItem endValue={props.items.citiesServed} label="Cities Served" />
    </div>
  );
};

export default Counter;