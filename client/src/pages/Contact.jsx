// Contact.js
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
  const teamMembers = [
    {
      name: "John Doe",
      role: "Developer",
      photoUrl: "https://via.placeholder.com/100", // Replace with actual image URL
      linkedinUrl: "https://linkedin.com/in/johndoe",
    },
    {
      name: "Jane Smith",
      role: "Designer",
      photoUrl: "https://via.placeholder.com/100", // Replace with actual image URL
      linkedinUrl: "https://linkedin.com/in/janesmith",
    },
    // Add more members as needed
  ];

  return (
    <div>
      <Navbar />
      <div className="w-full h-screen bg-gradient-to-r from-[#CADCFC] to-[#89ABE3] py-16 px-4 flex flex-col items-center">

        <h1 className="text-3xl font-bold mb-8">Our Team</h1>
        
        <div className="flex flex-wrap justify-center gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6 w-64 flex flex-col items-center">
              <img
                src={member.photoUrl}
                alt={`${member.name}'s profile`}
                className="w-24 h-24 rounded-full mb-4 object-cover"
              />
              <h2 className="text-xl font-semibold">{member.name}</h2>
              <p className="text-gray-600">{member.role}</p>
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 mt-4 hover:underline"
              >
                LinkedIn Profile
              </a>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
