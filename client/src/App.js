// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Import useAuth hook

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage'; // Protected route example

// Basic layout/navbar (optional for now, we can add a proper one later)
const Header = () => {
  const { currentUser, logout } = useAuth();
  return (
    <header style={styles.header}>
      <h1 style={styles.logo}><a href="/" style={styles.logoLink}>Voting App</a></h1>
      <nav>
        {currentUser ? (
          <ul style={styles.navList}>
            <li style={styles.navItem}><a href="/dashboard" style={styles.navLink}>Dashboard</a></li>
            <li style={styles.navItem}><button onClick={logout} style={styles.navButton}>Logout</button></li>
          </ul>
        ) : (
          <ul style={styles.navList}>
            <li style={styles.navItem}><a href="/login" style={styles.navLink}>Login</a></li>
            <li style={styles.navItem}><a href="/register" style={styles.navLink}>Register</a></li>
          </ul>
        )}
      </nav>
    </header>
  );
};

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner/loading indicator
  }

  return currentUser ? children : <Navigate to="/login" replace />;
};


function App() {
  return (
    <Router>
      <Header /> {/* Add the header */}
      <main style={styles.mainContent}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Protected Route for Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          {/* Add more routes here for polls, etc. */}
        </Routes>
      </main>
    </Router>
  );
}

const styles = {
  header: {
    backgroundColor: '#333',
    color: 'white',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  logo: {
    margin: 0,
    fontSize: '24px',
  },
  logoLink: {
    color: 'white',
    textDecoration: 'none',
  },
  navList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    gap: '20px',
  },
  navItem: {
    display: 'inline',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
    padding: '5px 10px',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
  },
  navLinkHover: {
    backgroundColor: '#555',
  },
  navButton: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  navButtonHover: {
    backgroundColor: 'white',
    color: '#333',
  },
  mainContent: {
    padding: '20px',
  }
};


export default App;