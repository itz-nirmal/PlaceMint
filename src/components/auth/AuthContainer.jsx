import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthContainer = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      await onLogin(credentials);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      await onSignup(userData);
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchToSignup = () => {
    setIsLogin(false);
    setError(null);
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setError(null);
  };

  return (
    <AuthLayout>
      {isLogin ? (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToSignup={switchToSignup}
          loading={loading}
          error={error}
        />
      ) : (
        <SignupForm
          onSignup={handleSignup}
          onSwitchToLogin={switchToLogin}
          loading={loading}
          error={error}
        />
      )}
    </AuthLayout>
  );
};

export default AuthContainer;