// Login.js
import React from 'react';

const Login = ({ onBackClick }) => {
  return (
    <div>
      <h2>Login Page</h2>
      <button onClick={onBackClick}>Back to Home</button>
    </div>
  );
};

export default Login;

