import React, { useState, useEffect, useCallback, useMemo } from 'react';

const API_URL = "https://api.sampleapis.com/coffee/hot";

const MyComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = 'your-bearer-token'; // Consider moving this to a custom hook or context

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const coffeeList = useMemo(() => {
    return data?.map(coffee => (
      <div key={coffee.id} className="coffee-card">
        <h2>{coffee.title}</h2>
        <p>{coffee.description}</p>
      </div>
    ));
  }, [data]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="container">
      <h1>Coffee List</h1>
      {coffeeList}
    </div>
  );
};

export default MyComponent;
