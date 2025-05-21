// client/src/components/CreatePoll.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPoll as createPollApi } from '../api/polls'; // Rename import to avoid conflict

const CreatePoll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([{ text: '' }, { text: '' }]); // Start with 2 empty options
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { text: '' }]);
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Filter out empty options
    const validOptions = options.filter(option => option.text.trim() !== '');

    if (!question.trim()) {
      setError('Poll question cannot be empty.');
      return;
    }
    if (validOptions.length < 2) {
      setError('Please provide at least two options for the poll.');
      return;
    }

    try {
      const createdPoll = await createPollApi(question, validOptions);
      setSuccess('Poll created successfully!');
      setQuestion('');
      setOptions([{ text: '' }, { text: '' }]); // Reset form
      navigate(`/poll/${createdPoll._id}`); // Navigate to the new poll's page
    } catch (err) {
      setError(err || 'Failed to create poll. Please try again.');
      console.error('Create Poll Error:', err);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create New Poll</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <div style={styles.formGroup}>
          <label htmlFor="question">Poll Question:</label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.optionsContainer}>
          <label>Options:</label>
          {options.map((option, index) => (
            <div key={index} style={styles.optionRow}>
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required
                style={styles.input}
              />
              {options.length > 2 && ( // Allow removing if more than 2 options
                <button type="button" onClick={() => removeOption(index)} style={styles.removeButton}>
                  X
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addOption} style={styles.addButton}>
            Add Option
          </button>
        </div>

        <button type="submit" style={styles.submitButton}>Create Poll</button>
      </form>
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
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
    flexGrow: 1, // Allow input to grow
  },
  optionsContainer: {
    border: '1px solid #eee',
    padding: '15px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  optionRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  addButton: {
    padding: '8px 12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    alignSelf: 'flex-start',
    transition: 'background-color 0.2s ease-in-out',
  },
  removeButton: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'background-color 0.2s ease-in-out',
  },
  submitButton: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.2s ease-in-out',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '10px',
  },
  success: {
    color: 'green',
    textAlign: 'center',
    marginBottom: '10px',
  }
};

export default CreatePoll;