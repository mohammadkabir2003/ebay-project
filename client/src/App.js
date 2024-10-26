import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import SignUp from './components/SignUp';

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');

  const goToLogin = () => setCurrentPage('login');
  const goToSignUp = () => setCurrentPage('signup');
  const goToLanding = () => setCurrentPage('landing');

  return (
    <div>
      {currentPage === 'landing' && <LandingPage onLoginClick={goToLogin} onSignUpClick={goToSignUp} />}
      {currentPage === 'login' && <Login onBackClick={goToLanding} />}
      {currentPage === 'signup' && <SignUp onBackClick={goToLanding} />}
    </div>
  );
};

export default App;


