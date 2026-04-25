import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

// --- Utility components ---
import ErrorComponent from '../utils/error.jsx';
import LoadingComponent from '../utils/loading.jsx';

// --- Simple components ---
import ProtectedRoute from '../ProtectedRoute.jsx';

// --- Mock Apollo Client ---
vi.mock('@apollo/client/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(() => [vi.fn(), { loading: false, error: null }]),
  useApolloClient: vi.fn(() => ({
    query: vi.fn(),
    resetStore: vi.fn(),
  })),
}));

// --- Mock react-icons ---
vi.mock('react-icons/fa', () => ({
  FaFacebook: () => <span>FaFacebook</span>,
  FaTwitter: () => <span>FaTwitter</span>,
  FaInstagram: () => <span>FaInstagram</span>,
  FaLinkedin: () => <span>FaLinkedin</span>,
  FaUser: () => <span>FaUser</span>,
  FaEdit: () => <span>FaEdit</span>,
  FaBars: () => <span>FaBars</span>,
  FaTimes: () => <span>FaTimes</span>,
  FaPen: () => <span>FaPen</span>,
}));

describe('Error component', () => {
  it('renders the error message', () => {
    render(<ErrorComponent message="Something broke" />);
    expect(screen.getByText(/Something broke/)).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
  });
});

describe('Loading component', () => {
  it('renders loading text', () => {
    render(<LoadingComponent />);
    expect(screen.getByText(/Loading data from the API/)).toBeInTheDocument();
  });
});

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('redirects to login when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    localStorage.setItem('userToken', 'valid-token');
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
