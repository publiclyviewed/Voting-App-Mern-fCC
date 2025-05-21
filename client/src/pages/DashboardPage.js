// client/src/pages/DashboardPage.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { currentUser, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  // Redirect if not logged in
  if (!currentUser) {
    navigate('/login');
    return null; // Don't render anything if redirecting
  }

  const handleLogout = () => {
    logout();
    navigate('/'); // Go back to home page after logout
  };

  return (
    <div style={styles.container}>
      <h2>Welcome to your Dashboard, {currentUser.username}!</h2>
      <p>Here you can manage your polls.</p>
      <button onClick={handleLogout} style={styles.button}>Logout</button>
      {/* More dashboard content will go here */}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 100px)',
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#e9eff1',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    maxWidth: '800px',
    margin: '40px auto',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
    transition: 'background-color 0.2s ease-in-out',
  },
  buttonHover: {
    backgroundColor: '#c82333',
  }
};

export default DashboardPage;