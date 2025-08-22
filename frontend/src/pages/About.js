import React from 'react';
import Counter from '../components/Counter';
import './About.css';

// You can add more team members here
const teamMembers = [
  {
    name: 'Sahil Sharma',
    title: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=500'
  },
  {
    name: 'Samantha',
    title: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500'
  },
  {
    name: 'Devang Soni',
    title: 'Lead Engineer',
    image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=500'
  }
];

const About = () => {
  return (
    <div className="about-page-container">
      <section className="about-header">
        <h1>About CarForSale</h1>
        <p>Your trusted partner in buying and selling pre-owned cars.</p>
      </section>
      <section className="about-section vision-section">
        <div className="vision-image">
          <img src="https://tse4.mm.bing.net/th/id/OIP.-wtRKCICcILF5WqJLjODxgHaED?pid=Api&P=0&h=180" alt="Car workshop" />
        </div>
        <div className="vision-text">
          <h2>Our Vision & Focus</h2>
          <p>
            Our vision is to revolutionize the pre-owned car market by creating a transparent and trustworthy ecosystem. We focus on quality, reliability, and customer satisfaction to ensure a seamless experience from start to finish.
          </p>
        </div>
      </section>
      <Counter items={{carsSold:150,happyCustomers:150,citiesServed:10}}/>
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