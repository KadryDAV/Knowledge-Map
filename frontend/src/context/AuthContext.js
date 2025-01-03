import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

const MAX_ATTEMPTS = 5;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    // Check for logged-in user
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/user');
        setUser(response.data);
        setErrorMessage(null); // Clear any error messages
      } catch (error) {
        setUser(null);
        setErrorMessage(
          error.response?.data?.message || 
          'Failed to fetch user information. Please check your connection or try again later.'
        );
      }
    };
    fetchUser();
  }, []);

  const login = async (credentials) => {
    const { email } = credentials;

    // Check if email is locked out
    const lockoutData = JSON.parse(localStorage.getItem('lockout')) || {};
    if (lockoutData[email]?.locked) {
      return {
        success: false,
        message: `This email has been locked due to too many failed login attempts.`,
      };
    }

    try {
      // Attempt login via API
      const response = await api.post('/auth/login', credentials);
      setUser(response.data.user);

      // Clear lockout data for this email on successful login
      if (lockoutData[email]) {
        delete lockoutData[email];
        localStorage.setItem('lockout', JSON.stringify(lockoutData));
      }

      return { success: true };
    } catch (error) {
      // Increment attempts for failed login
      const emailAttempts = lockoutData[email]?.attempts || 0;
      const updatedAttempts = emailAttempts + 1;

      if (updatedAttempts >= MAX_ATTEMPTS) {
        // Lock out the email
        lockoutData[email] = { locked: true, attempts: updatedAttempts };
        localStorage.setItem('lockout', JSON.stringify(lockoutData));

        return {
          success: false,
          message: `This email has been locked due to too many failed login attempts.`,
        };
      }

      // Update attempts for the email
      lockoutData[email] = { attempts: updatedAttempts, locked: false };
      localStorage.setItem('lockout', JSON.stringify(lockoutData));

      return {
        success: false,
        message: `Invalid credentials. You have ${MAX_ATTEMPTS - updatedAttempts} attempt(s) left.`,
      };
    }
  };

  const signup = async (userInfo) => {
    try {
      const response = await api.post('/auth/signup', userInfo);
      setUser(response.data.user);
      alert('Signup successful!');
    } catch (error) {
      if (error.response && error.response.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('An error occurred during signup. Please try again later.');
      }
    }
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, errorMessage }}>
      {children}
    </AuthContext.Provider>
  );
};
