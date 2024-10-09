import React, { useState } from 'react';

const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Placeholder API for demo

const MyFormComponent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email) {
      setError('Please provide both a name and an email.');
      return;
    }

    setLoading(true);
    setError(null);
    setResponseMessage('');

    // Prepare payload to send
    const payload = { name, email };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit data.');
      }

      const result = await response.json();
      setResponseMessage(`Success! Your data was submitted with ID: ${result.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Submit Your Info</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {responseMessage && <p className="success-message">{responseMessage}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default MyFormComponent;
