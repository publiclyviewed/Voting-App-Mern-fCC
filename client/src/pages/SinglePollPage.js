// client/src/pages/SinglePollPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPollById, voteOnPoll as voteOnPollApi, addOptionToPoll as addOptionToPollApi } from '../api/polls';
import { useAuth } from '../context/AuthContext';

// Import Chart.js components
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SinglePollPage = () => {
  const { id } = useParams(); // Get poll ID from URL
  const { currentUser, isLoading: authLoading } = useAuth(); // Get current user
  const [poll, setPoll] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [voteSuccess, setVoteSuccess] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [newOptionText, setNewOptionText] = useState('');
  const [addOptionError, setAddOptionError] = useState('');
  const [addOptionSuccess, setAddOptionSuccess] = useState('');

  const isCreator = currentUser && poll && currentUser._id === poll.createdBy._id;

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setError('');
        setIsLoading(true);
        const data = await getPollById(id);
        setPoll(data);
        // If there are votes already, show results by default or if user previously voted (more complex)
        // For simplicity, let's check if poll has any votes initially to show results
        const hasVotes = data.options.some(option => option.votes > 0);
        setShowResults(hasVotes); // Show results if there are existing votes
      } catch (err) {
        setError(err || 'Failed to load poll.');
        console.error('Fetch Single Poll Error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPoll();
  }, [id, voteSuccess, addOptionSuccess]); // Re-fetch when ID changes or after vote/add option

  const handleVote = async () => {
    if (selectedOptionIndex === null) {
      setError('Please select an option to vote.');
      return;
    }

    try {
      setError('');
      setVoteSuccess('');
      const response = await voteOnPollApi(id, selectedOptionIndex);
      setPoll(response.poll); // Update poll data with new votes
      setVoteSuccess('Vote recorded successfully!');
      setShowResults(true); // Show results after voting
      setSelectedOptionIndex(null); // Reset selection
    } catch (err) {
      setError(err || 'Failed to record vote. Please try again.');
      console.error('Vote Error:', err);
    }
  };

  const handleAddOption = async (e) => {
    e.preventDefault();
    setAddOptionError('');
    setAddOptionSuccess('');
    if (!newOptionText.trim()) {
      setAddOptionError('Option text cannot be empty.');
      return;
    }
    try {
      const updatedPoll = await addOptionToPollApi(id, newOptionText);
      setPoll(updatedPoll);
      setNewOptionText('');
      setAddOptionSuccess('New option added!');
    } catch (err) {
      setAddOptionError(err || 'Failed to add new option.');
      console.error('Add Option Error:', err);
    }
  };

  if (isLoading || authLoading) {
    return <div style={styles.loading}>Loading poll...</div>;
  }

  if (error && !poll) {
    return <div style={styles.errorContainer}>Error: {error}</div>;
  }

  if (!poll) {
    return <div style={styles.notFound}>Poll not found.</div>;
  }

  // Calculate total votes for results
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  // Prepare data for Chart.js
  const chartData = {
    labels: poll.options.map(option => option.text),
    datasets: [
      {
        label: 'Votes',
        data: poll.options.map(option => option.votes),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // We usually don't need a legend for a single dataset bar chart
      },
      title: {
        display: true,
        text: 'Poll Results',
        font: {
          size: 18,
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Ensure y-axis shows whole numbers for votes
        }
      },
    },
  };

  return (
    <div style={styles.container}>
      <h2>{poll.question}</h2>
      <p style={styles.creatorInfo}>Created by: {poll.createdBy?.username || 'Anonymous'}</p>

      {error && <p style={styles.errorText}>{error}</p>}
      {voteSuccess && <p style={styles.successText}>{voteSuccess}</p>}

      {!showResults ? (
        <div style={styles.optionsContainer}>
          {poll.options.map((option, index) => (
            <div key={index} style={styles.optionItem}>
              <input
                type="radio"
                id={`option-${index}`}
                name="pollOption"
                value={index}
                checked={selectedOptionIndex === index}
                onChange={() => setSelectedOptionIndex(index)}
                style={styles.radioInput}
              />
              <label htmlFor={`option-${index}`} style={styles.radioLabel}>{option.text}</label>
            </div>
          ))}
          <button onClick={handleVote} style={styles.voteButton}>Vote</button>
          <button onClick={() => setShowResults(true)} style={styles.showResultsButton}>Show Results</button>
        </div>
      ) : (
        <div style={styles.resultsContainer}>
          <h3>Results:</h3>
          {/* Bar Chart Component */}
          <div style={styles.chartContainer}>
            <Bar data={chartData} options={chartOptions} />
          </div>

          {/* Textual results for accessibility/detail */}
          <div style={styles.textualResults}>
            {poll.options.map((option, index) => (
              <div key={index} style={styles.resultItem}>
                <span style={styles.resultText}>{option.text}:</span>
                <span style={styles.resultVotes}>{option.votes} votes</span>
                {totalVotes > 0 && (
                  <span style={styles.resultPercentage}>
                    ({((option.votes / totalVotes) * 100).toFixed(1)}%)
                  </span>
                )}
              </div>
            ))}
          </div>
          <button onClick={() => setShowResults(false)} style={styles.backToVoteButton}>Back to Vote</button>
        </div>
      )}

      {/* Add New Option Section (only for creator) */}
      {isCreator && (
        <div style={styles.addOptionSection}>
          <hr style={styles.separator} />
          <h3>Add New Option to Poll</h3>
          {addOptionError && <p style={styles.errorText}>{addOptionError}</p>}
          {addOptionSuccess && <p style={styles.successText}>{addOptionSuccess}</p>}
          <form onSubmit={handleAddOption} style={styles.addOptionForm}>
            <input
              type="text"
              placeholder="New option text"
              value={newOptionText}
              onChange={(e) => setNewOptionText(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.addOptionButton}>Add Option</button>
          </form>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '40px auto',
    textAlign: 'center',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '20px',
  },
  errorContainer: {
    color: 'red',
    textAlign: 'center',
    padding: '50px',
    fontSize: '20px',
  },
  notFound: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '20px',
    color: '#888',
  },
  creatorInfo: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px',
  },
  optionItem: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #eee',
  },
  radioInput: {
    marginRight: '10px',
    cursor: 'pointer',
  },
  radioLabel: {
    fontSize: '16px',
    cursor: 'pointer',
  },
  voteButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '18px',
    marginTop: '10px',
    transition: 'background-color 0.2s ease-in-out',
  },
  showResultsButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '18px',
    marginTop: '10px',
    marginLeft: '10px',
    transition: 'background-color 0.2s ease-in-out',
  },
  resultsContainer: {
    marginTop: '20px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  chartContainer: {
    width: '100%',
    height: 'auto', // Or a fixed height like '300px'
    marginBottom: '20px',
  },
  textualResults: { // Added for the textual representation below the chart
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px dashed #ddd',
  },
  resultItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    fontSize: '16px',
  },
  resultText: {
    fontWeight: 'bold',
    flexBasis: '60%',
    textAlign: 'left',
  },
  resultVotes: {
    flexBasis: '20%',
    textAlign: 'right',
  },
  resultPercentage: {
    flexBasis: '20%',
    textAlign: 'right',
    color: '#555',
  },
  backToVoteButton: {
    padding: '8px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '15px',
    transition: 'background-color 0.2s ease-in-out',
  },
  addOptionSection: {
    marginTop: '30px',
    width: '100%',
  },
  separator: {
    width: '80%',
    border: '0',
    borderTop: '1px solid #eee',
    margin: '20px auto',
  },
  addOptionForm: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
  },
  input: {
    flexGrow: 1,
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  addOptionButton: {
    padding: '10px 15px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.2s ease-in-out',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: '10px',
  },
  successText: {
    color: 'green',
    textAlign: 'center',
    marginTop: '10px',
  }
};


export default SinglePollPage;