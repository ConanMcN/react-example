import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock the fetch function
global.fetch = jest.fn();

describe('App component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders loading state initially', () => {
    render(<App />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders data when API call is successful', async () => {
    const mockData = [{ id: 1, title: 'Espresso', description: 'Strong coffee' }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(<App />);

    await waitFor(() => {
      const preElement = screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === 'pre' && 
               content.includes('Espresso') && 
               content.includes('Strong coffee');
      });
      expect(preElement).toBeInTheDocument();
    });
  });

  it('renders error message when API call fails', async () => {
    fetch.mockRejectedValueOnce(new Error('API error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Error: API error')).toBeInTheDocument();
    });
  });

  it('uses correct API URL and headers', async () => {
    render(<App />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://api.sampleapis.com/coffee/hot",
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-bearer-token',
          },
        })
      );
    });
  });
});