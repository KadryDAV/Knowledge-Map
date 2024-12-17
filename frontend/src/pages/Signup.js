import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Signup 
function Signup() {
  const { signup } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(userInfo);
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Sign Up</h2>
      <input
        type="text"
        value={userInfo.username}
        onChange={(e) =>
          setUserInfo({ ...userInfo, username: e.target.value })
        }
        placeholder="Username"
        required
      />
      <input
        type="email"
        value={userInfo.email}
        onChange={(e) =>
          setUserInfo({ ...userInfo, email: e.target.value })
        }
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={userInfo.password}
        onChange={(e) =>
          setUserInfo({ ...userInfo, password: e.target.value })
        }
        placeholder="Password"
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default Signup;
