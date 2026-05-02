import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

const mockUseQuery = vi.fn();

// Capture (query, options) so we can assert on variables
vi.mock('@apollo/client/react', () => ({
  useQuery: (query, options) => mockUseQuery(query, options),
  useMutation: vi.fn(() => [vi.fn(), { loading: false, error: null }]),
  useApolloClient: vi.fn(() => ({ query: vi.fn(), resetStore: vi.fn() })),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

import HomePage from '../components/articles/HomePage.jsx';
import { GET_LAST_ARTICLES } from '../graphql/queries.js';

// --- Fixtures ---

const CATEGORIES = [
  { id: '1', name: 'Technology' },
  { id: '2', name: 'Science' },
];

const articlesResult = (articles = [], hasMore = false) => ({
  loading: false,
  error: null,
  data: { publishedLastArticles: { articles, hasMore } },
});

const categoriesResult = {
  loading: false,
  error: null,
  data: { getCategories: CATEGORIES },
};

const ALL_ARTICLES = [
  { id: '1', title: 'Tech Article', content: '<p>tech</p>', created_at: '2024-03-15T10:00:00Z', images: [] },
  { id: '2', title: 'Science Article', content: '<p>sci</p>', created_at: '2024-03-14T10:00:00Z', images: [] },
];

// Return the right result based on the query being made
const setupMock = (getArticlesResult = articlesResult(ALL_ARTICLES)) => {
  mockUseQuery.mockImplementation((query) => {
    if (query === GET_LAST_ARTICLES) return getArticlesResult;
    return categoriesResult;
  });
};

// Dynamic mock: returns articles filtered by category_id in variables
const setupDynamicMock = () => {
  mockUseQuery.mockImplementation((query, options) => {
    if (query !== GET_LAST_ARTICLES) return categoriesResult;
    const catId = options?.variables?.category_id;
    if (catId === '1') return articlesResult([{ id: '10', title: 'Tech Only', content: '', created_at: '2024-03-15T10:00:00Z', images: [] }]);
    if (catId === '2') return articlesResult([{ id: '20', title: 'Science Only', content: '', created_at: '2024-03-15T10:00:00Z', images: [] }]);
    return articlesResult(ALL_ARTICLES);
  });
};

// --- Tests ---

describe('HomePage category filtering', () => {
  beforeEach(() => {
    mockUseQuery.mockReset();
    mockNavigate.mockReset();
  });

  it('queries GET_LAST_ARTICLES with no category_id on initial render', () => {
    setupMock();
    render(<MemoryRouter><HomePage /></MemoryRouter>);

    expect(mockUseQuery).toHaveBeenCalledWith(
      GET_LAST_ARTICLES,
      expect.objectContaining({ variables: { category_id: undefined } })
    );
  });

  it('queries with the selected category_id after clicking a category tag', async () => {
    const user = userEvent.setup();
    setupMock();
    render(<MemoryRouter><HomePage /></MemoryRouter>);

    await user.click(screen.getAllByRole('button').find((b) => b.textContent === 'Technology'));

    expect(mockUseQuery).toHaveBeenCalledWith(
      GET_LAST_ARTICLES,
      expect.objectContaining({ variables: { category_id: '1' } })
    );
  });

  it('queries with Science category_id when Science tag is clicked', async () => {
    const user = userEvent.setup();
    setupMock();
    render(<MemoryRouter><HomePage /></MemoryRouter>);

    await user.click(screen.getAllByRole('button').find((b) => b.textContent === 'Science'));

    expect(mockUseQuery).toHaveBeenCalledWith(
      GET_LAST_ARTICLES,
      expect.objectContaining({ variables: { category_id: '2' } })
    );
  });

  it('queries with undefined category_id after clicking All', async () => {
    const user = userEvent.setup();
    setupMock();
    render(<MemoryRouter><HomePage /></MemoryRouter>);

    // Select a category first, then go back to All
    await user.click(screen.getAllByRole('button').find((b) => b.textContent === 'Technology'));
    mockUseQuery.mockClear();
    setupMock();

    await user.click(screen.getAllByRole('button').find((b) => b.textContent === 'All'));

    expect(mockUseQuery).toHaveBeenCalledWith(
      GET_LAST_ARTICLES,
      expect.objectContaining({ variables: { category_id: undefined } })
    );
  });

  it('shows articles that match the selected category', async () => {
    const user = userEvent.setup();
    setupDynamicMock();
    render(<MemoryRouter><HomePage /></MemoryRouter>);

    // Initially both articles visible
    expect(screen.getByText('Tech Article')).toBeInTheDocument();

    await user.click(screen.getAllByRole('button').find((b) => b.textContent === 'Science'));
    expect(screen.getByText('Science Only')).toBeInTheDocument();
    expect(screen.queryByText('Tech Only')).not.toBeInTheDocument();
  });

  it('shows all articles again after switching back to All', async () => {
    const user = userEvent.setup();
    setupDynamicMock();
    render(<MemoryRouter><HomePage /></MemoryRouter>);

    await user.click(screen.getAllByRole('button').find((b) => b.textContent === 'Technology'));
    await user.click(screen.getAllByRole('button').find((b) => b.textContent === 'All'));

    expect(screen.getByText('Tech Article')).toBeInTheDocument();
    expect(screen.getByText('Science Article')).toBeInTheDocument();
  });

  it('passes the categoryId prop as the initial category_id variable', () => {
    setupMock();
    render(<MemoryRouter><HomePage categoryId="2" /></MemoryRouter>);

    expect(mockUseQuery).toHaveBeenCalledWith(
      GET_LAST_ARTICLES,
      expect.objectContaining({ variables: { category_id: '2' } })
    );
  });
});