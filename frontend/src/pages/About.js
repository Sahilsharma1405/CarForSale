import React from 'react';
import Counter from '../components/Counter';
import './About.css';

// You can add more team members here
const teamMembers = [
  {
    name: 'Alex Johnson',
    title: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=500'
  },
  {
    name: 'Samantha Bee',
    title: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500'
  },
  {
    name: 'David Chen',
    title: 'Lead Engineer',
    image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=500'
  }
];

const About = () => {
  return (
    <div className="about-page-container">
      {/* --- NEW Header Section --- */}
      <section className="about-header">
        <h1>About CarForSale</h1>
        <p>Your trusted partner in buying and selling pre-owned cars.</p>
      </section>

      {/* --- Vision & Focus Section --- */}
      <section className="about-section vision-section">
        <div className="vision-image">
          <img src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800" alt="Car workshop" />
        </div>
        <div className="vision-text">
          <h2>Our Vision & Focus</h2>
          <p>
            Our vision is to revolutionize the pre-owned car market by creating a transparent and trustworthy ecosystem. We focus on quality, reliability, and customer satisfaction to ensure a seamless experience from start to finish.
          </p>
        </div>
      </section>

      {/* --- Counter Component --- */}
      <Counter items={{carsSold:1500,happyCustomers:1000,citiesServed:10}}/>

      {/* --- Team Section --- */}
      <section className="about-section team-section">
        <h2>Meet the Team</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member-card">
              <img src={member.image} alt={member.name} />
              <h3>{member.name}</h3>
              <p>{member.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;