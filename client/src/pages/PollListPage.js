// client/src/pages/PollListPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPolls } from '../api/polls';

const PollListPage = () => {
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setError('');
        setIsLoading(true);
        const data = await getAllPolls();
        setPolls(data);
      } catch (err) {
        setError(err || 'Failed to load polls.');
        console.error('Fetch Polls Error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPolls();
  }, []);

  if (isLoading) {
    return <div style={styles.loading}>Loading polls...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>All Public Polls</h2>
      {error && <p style={styles.errorText}>{error}</p>}
      {polls.length === 0 ? (
        <p>No polls available yet. Be the first to create one!</p>
      ) : (
        <div style={styles.pollsList}>
          {polls.map((poll) => (
            <div key={poll._id} style={styles.pollItem}>
              <Link to={`/poll/${poll._id}`} style={styles.pollQuestionLink}>
                {poll.question}
              </Link>
              <span style={styles.creatorInfo}>
                by {poll.createdBy?.username || 'Anonymous'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f4f7f6',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    margin: '40px auto',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '20px',
  },
  pollsList: {
    marginTop: '20px',
  },
  pollItem: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  pollQuestionLink: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#007bff',
    textDecoration: 'none',
    marginBottom: '5px',
  },
  creatorInfo: {
    fontSize: '14px',
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: '10px',
  }
};

export default PollListPage;