import React from 'react';

const LandingPage = ({ onLoginClick, onSignUpClick }) => {
  return (
    <div className="landing-page">
      <h1>Welcome to Team H's E-Bidding</h1>
      <p>Your online platform for auctions and bidding.</p>
      <button onClick={onLoginClick}>Log In</button>
      <button onClick={onSignUpClick}>Sign Up</button>
    </div>
  );
};

export default LandingPage;
