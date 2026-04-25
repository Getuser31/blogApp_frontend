import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

const mockUseQuery = vi.fn();
vi.mock('@apollo/client/react', () => ({
  useQuery: () => mockUseQuery(),
  useMutation: vi.fn(() => [vi.fn(), { loading: false, error: null }]),
  useApolloClient: vi.fn(() => ({
    query: vi.fn(),
    resetStore: vi.fn(),
  })),
}));

import FavoriteArticles from '../components/user/favoriteArticles.jsx';

describe('FavoriteArticles component', () => {
  it('shows loading state', () => {
    mockUseQuery.mockReturnValue({
      loading: true,
      error: null,
      data: null,
    });

    render(
      <MemoryRouter>
        <FavoriteArticles />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading favorite articles/)).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseQuery.mockReturnValue({
      loading: false,
      error: { message: 'Failed to fetch' },
      data: null,
    });

    render(
      <MemoryRouter>
        <FavoriteArticles />
      </MemoryRouter>
    );

    expect(screen.getByText(/Error: Failed to fetch/)).toBeInTheDocument();
  });

  it('shows empty state when no favorites', () => {
    mockUseQuery.mockReturnValue({
      loading: false,
      error: null,
      data: {
        getFavoriteArticles: {
          favoriteArticles: [],
        },
      },
    });

    render(
      <MemoryRouter>
        <FavoriteArticles />
      </MemoryRouter>
    );

    expect(screen.getByText(/No favorite articles yet/)).toBeInTheDocument();
  });

  it('renders a list of favorite articles', () => {
    mockUseQuery.mockReturnValue({
      loading: false,
      error: null,
      data: {
        getFavoriteArticles: {
          favoriteArticles: [
            { id: '1', title: 'First Article' },
            { id: '2', title: 'Second Article' },
          ],
        },
      },
    });

    render(
      <MemoryRouter>
        <FavoriteArticles />
      </MemoryRouter>
    );

    expect(screen.getByText('First Article')).toBeInTheDocument();
    expect(screen.getByText('Second Article')).toBeInTheDocument();
    expect(screen.getByText(/Your Favorite Articles/)).toBeInTheDocument();
  });

  it('provides links to individual articles', () => {
    mockUseQuery.mockReturnValue({
      loading: false,
      error: null,
      data: {
        getFavoriteArticles: {
          favoriteArticles: [
            { id: '42', title: 'Interesting Article' },
          ],
        },
      },
    });

    render(
      <MemoryRouter>
        <FavoriteArticles />
      </MemoryRouter>
    );

    const link = screen.getByText('Interesting Article').closest('a');
    expect(link).toHaveAttribute('href', '/article/42');
  });
});
