import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MyFormComponent from './MyFormComponent';

// Mock the global fetch API
global.fetch = jest.fn();

describe('MyFormComponent', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders form fields and submit button', () => {
    render(<MyFormComponent />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('shows error when form is submitted without name or email', async () => {
    render(<MyFormComponent />);

    // Submit the form without filling out fields
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/please provide both a name and an email/i)).toBeInTheDocument();
  });

  test('submits form data successfully and shows success message', async () => {
    // Mock a successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1 }),
    });

    render(<MyFormComponent />);

    // Fill out form fields
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Wait for the success message to appear
    await screen.findByText(/your data was submitted with id: 1/i);

    // Verify the API request payload
    expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
      }),
    });
  });

  test('shows error message when API request fails', async () => {
    // Mock a failed API response
    fetch.mockRejectedValueOnce(new Error('Failed to submit data.'));

    render(<MyFormComponent />);

    // Fill out form fields
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Wait for the error message to appear
    await screen.findByText(/failed to submit data/i);
  });

  test('shows loading state during API request', async () => {
    // Mock a delay in the API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1 }),
    });

    render(<MyFormComponent />);

    // Fill out form fields
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Check that the loading state is shown
    expect(screen.getByText(/submitting.../i)).toBeInTheDocument();

    // Wait for the loading state to disappear
    await waitFor(() => expect(screen.queryByText(/submitting.../i)).not.toBeInTheDocument());
  });
});
