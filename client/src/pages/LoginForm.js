import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom'

const LoginForm = ({ onLoginSuccess }) => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
  
    const handleLogin = async (e) => {
      e.preventDefault(); // Prevent page reload on form submission
  
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ username, password }),
        });
  



        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('role', data.role); // Store role in localStorage
          setMessage('Login successful.');
          navigate('/'); // Redirect to homepage
        } 
        else {
          setMessage(data.error || 'Login failed. Please try again.');
        }
      }

      catch (error) {
        setMessage('Network error. Please try again later.');
      }
    };
  

   return (
    <div className="flex-1 px-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
    <input
      type="text"
      placeholder="Username"
      className="border border-gray-300 p-2 w-full mb-4 rounded-md"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
    />
    <input
      type="password"
      placeholder="Password"
      className="border border-gray-300 p-2 w-full mb-4 rounded-md"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">
      Login
    </button>
      </form>
      {message && <p className="text-center mt-4">{message}</p>}
  </div>
  )
};

export default LoginForm;