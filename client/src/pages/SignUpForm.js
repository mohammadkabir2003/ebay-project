import React, { useState, useEffect } from 'react';

const SignUpForm = () => {
  // State to capture form inputs
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  // States for human verification
  const [question, setQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [message, setMessage] = useState('');

// Generate a random arithmetic question for human verification
const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    const newQuestion = `${num1} ${operator} ${num2}`;
    const answer = eval(newQuestion); // Calculate the correct answer
    setQuestion(newQuestion);
    setCorrectAnswer(answer);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    
    // Validate human verification
    if (parseInt(userAnswer) !== correctAnswer) {
        setMessage('Verification Failed: Please solve the question correctly.');
        return;
    }
    
      // Create the user object to send to the back-end
    const userData = { name, username, email, password };

    try {
      // Send data to the back-end
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // Handle response from the server
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message); // Display success message
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Error signing up.');
      }
    } catch (error) {
      setMessage('Network error. Please try again later.');
    }
  };

  // Generate the question on component mount
  useEffect(() => {
    generateQuestion();
  }, []);

  return (
    <div className="flex-1 px-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          className="border border-gray-300 p-2 w-full mb-4 rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)} // Update name state
          required
        />
        <input
          type="text"
          placeholder="Username"
          className="border border-gray-300 p-2 w-full mb-4 rounded-md"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Update username state
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 p-2 w-full mb-4 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 p-2 w-full mb-4 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          required
        />
        <p>Solve this to verify you're human: {question}</p>
        <input
          type="number"
          placeholder="Your answer"
          className="border border-gray-300 p-2 w-full mb-4 rounded-md"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          required
        />        
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md"
        >
          Sign Up
        </button>
      </form>
      {message && <p className="text-center mt-4">{message}</p>}
    </div>
  );
};

export default SignUpForm;
