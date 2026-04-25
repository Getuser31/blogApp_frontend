import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '../AuthContext.jsx';

// Setup mock query that returns a proper Promise
let mockQueryResolve = null;
let mockQueryReject = null;
const mockQuery = vi.fn(() => new Promise((resolve, reject) => {
  mockQueryResolve = resolve;
  mockQueryReject = reject;
}));

vi.mock('@apollo/client/react', () => ({
  useApolloClient: vi.fn(() => ({
    query: mockQuery,
    resetStore: vi.fn(),
  })),
}));

// Helper component to test the context
const TestConsumer = () => {
  const { user, loading, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{loading ? 'loading' : 'not-loading'}</span>
      <span data-testid="user">{user ? JSON.stringify(user) : 'no-user'}</span>
      <button data-testid="login-btn" onClick={() => login({ token: 'test-token', user: { id: 1, name: 'TestUser', role: { name: 'User' } } })}>
        Login
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    mockQuery.mockClear();
    mockQueryResolve = null;
    mockQueryReject = null;
  });

  it('shows no user and not-loading when no token is stored', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('not-loading');
    });
    expect(screen.getByTestId('user').textContent).toBe('no-user');
  });

  it('validates token on mount and sets user', async () => {
    localStorage.setItem('userToken', 'valid-token');

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    // Initially loading
    expect(screen.getByTestId('loading').textContent).toBe('loading');

    // Resolve the query
    await act(async () => {
      mockQueryResolve({
        data: {
          me: { id: '1', name: 'John', role: { name: 'Admin' } },
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('not-loading');
    });

    const userText = screen.getByTestId('user').textContent;
    expect(userText).toContain('John');
    expect(userText).toContain('Admin');
  });

  it('logs out user if token validation fails', async () => {
    localStorage.setItem('userToken', 'expired-token');

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    // Reject the query
    await act(async () => {
      mockQueryReject(new Error('Unauthenticated'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('not-loading');
    });

    expect(screen.getByTestId('user').textContent).toBe('no-user');
  });

  it('login sets user and stores token', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    // Wait for initial loading to finish
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('not-loading');
    });

    await act(async () => {
      screen.getByTestId('login-btn').click();
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('userToken', 'test-token');
    const userText = screen.getByTestId('user').textContent;
    expect(userText).toContain('TestUser');
  });

  it('logout clears user', async () => {
    localStorage.setItem('userToken', 'existing-token');

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    // Wait for the query to start
    await waitFor(() => {
      expect(mockQuery).toHaveBeenCalled();
    });

    // Resolve the query to set user
    await act(async () => {
      mockQueryResolve({
        data: {
          me: { id: '1', name: 'John', role: { name: 'User' } },
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('not-loading');
    });

    // Now click logout
    await act(async () => {
      screen.getByTestId('logout-btn').click();
    });

    expect(screen.getByTestId('user').textContent).toBe('no-user');
  });
});
