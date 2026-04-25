import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

const mockAddUser = vi.fn();
let mockLoading = false;
let mockError = null;
vi.mock('@apollo/client/react', () => ({
  useMutation: vi.fn(() => [
    mockAddUser,
    { loading: mockLoading, error: mockError },
  ]),
  useApolloClient: vi.fn(() => ({
    query: vi.fn(),
    resetStore: vi.fn(),
  })),
}));

import Registration from '../components/user/registration.jsx';

describe('Registration component', () => {
  beforeEach(() => {
    mockAddUser.mockReset();
    mockLoading = false;
    mockError = null;
  });

  it('renders the registration form', () => {
    render(
      <MemoryRouter>
        <Registration />
      </MemoryRouter>
    );

    expect(screen.getByText(/Registration Page/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Repeat password/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  it('shows validation error when passwords do not match', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Registration />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/Username/), 'testuser');
    await user.type(screen.getByLabelText(/Email/), 'test@example.com');
    await user.type(screen.getByLabelText(/^Password/), 'password123');
    await user.type(screen.getByLabelText(/Repeat password/), 'differentpassword');

    await user.click(screen.getByRole('button', { name: /Register/i }));

    expect(screen.getByText(/Passwords do not match/)).toBeInTheDocument();
  });

  it('calls addUser mutation on valid form submission', async () => {
    mockAddUser.mockResolvedValue({
      data: { addUser: { id: '1', name: 'testuser', email: 'test@example.com' } },
    });

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Registration />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/Username/), 'testuser');
    await user.type(screen.getByLabelText(/Email/), 'test@example.com');
    await user.type(screen.getByLabelText(/^Password/), 'password123');
    await user.type(screen.getByLabelText(/Repeat password/), 'password123');

    await user.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(mockAddUser).toHaveBeenCalledWith({
        variables: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          passwordRepeat: 'password123',
        },
      });
    });
  });

  it('displays API error when registration fails', () => {
    mockError = { message: 'Email already exists' };

    render(
      <MemoryRouter>
        <Registration />
      </MemoryRouter>
    );

    expect(screen.getByText(/Email already exists/)).toBeInTheDocument();
  });
});
