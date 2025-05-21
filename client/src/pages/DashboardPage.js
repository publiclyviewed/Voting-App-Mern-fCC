// client/src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import CreatePoll from '../components/CreatePoll'; // Import the CreatePoll component
import { getMyPolls, deletePoll as deletePollApi } from '../api/polls'; // Import poll API functions

const DashboardPage = () => {
  const { currentUser, isLoading, logout } = useAuth();
  const [myPolls, setMyPolls] = useState([]);
  const [pollsLoading, setPollsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPolls = async () => {
      if (currentUser) {
        try {
          setError('');
          setPollsLoading(true);
          const data = await getMyPolls();
          setMyPolls(data);
        } catch (err) {
          setError(err || 'Failed to load your polls.');
          console.error('Fetch My Polls Error:', err);
        } finally {
          setPollsLoading(false);
        }
      }
    };
    fetchMyPolls();
  }, [currentUser]); // Re-fetch when currentUser changes

  if (isLoading || pollsLoading) {
    return <div>Loading dashboard...</div>;
  }

  // Redirect if not logged in
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeletePoll = async (pollId) => {
    if (window.confirm('Are you sure you want to delete this poll?')) {
      try {
        setError('');
        await deletePollApi(pollId);
        // Remove the deleted poll from the state
        setMyPolls(myPolls.filter(poll => poll._id !== pollId));
      } catch (err) {
        setError(err || 'Failed to delete poll.');
        console.error('Delete Poll Error:', err);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>Welcome to your Dashboard, {currentUser.username}!</h2>
      <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>

      <hr style={styles.separator} />

      <CreatePoll /> {/* Integrate the CreatePoll component */}

      <hr style={styles.separator} />

      <h3>Your Polls</h3>
      {error && <p style={styles.errorText}>{error}</p>}
      {myPolls.length === 0 ? (
        <p>You haven't created any polls yet.</p>
      ) : (
        <div style={styles.pollsList}>
          {myPolls.map((poll) => (
            <div key={poll._id} style={styles.pollItem}>
              <Link to={`/poll/${poll._id}`} style={styles.pollQuestionLink}>{poll.question}</Link>
              <button onClick={() => handleDeletePoll(poll._id)} style={styles.deleteButton}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f4f7f6',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    margin: '40px auto',
  },
  logoutButton: {
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
  separator: {
    width: '100%',
    border: '0',
    borderTop: '1px solid #eee',
    margin: '30px 0',
  },
  pollsList: {
    width: '100%',
    marginTop: '20px',
  },
  pollItem: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  pollQuestionLink: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#007bff',
    textDecoration: 'none',
    flexGrow: 1,
    marginRight: '10px',
  },
  deleteButton: {
    padding: '8px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s ease-in-out',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: '10px',
  }
};

export default DashboardPage;