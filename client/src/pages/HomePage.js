// client/src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { currentUser } = useAuth();

  return (
    <div style={styles.container}>
      <h1>Welcome to the Voting App!</h1>
      {currentUser ? (
        <p>You are logged in as {currentUser.username}. Go to your <Link to="/dashboard" style={styles.link}>Dashboard</Link>.</p>
      ) : (
        <p>Please <Link to="/login" style={styles.link}>Login</Link> or <Link to="/register" style={styles.link}>Register</Link> to create and manage polls.</p>
      )}
      <p>Explore <Link to="/polls" style={styles.link}>Public Polls</Link>.</p> {/* Placeholder for public polls page */}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 100px)', // Adjust for header/footer if present
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#e9eff1',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    maxWidth: '800px',
    margin: '40px auto',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  linkHover: {
    textDecoration: 'underline',
  }
};

export default HomePage;