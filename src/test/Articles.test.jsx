import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import Articles from '../components/articles/articles.jsx';

const mockArticlesData = {
  publishedArticles: {
    data: [
      {
        id: '1',
        title: 'First Article',
        content: '<p>Content of first article</p>',
        created_at: '2024-03-15T10:00:00Z',
        images: [{ id: '1', path: '/images/first.jpg' }],
      },
      {
        id: '2',
        title: 'Second Article',
        content: '<p>Content of second article</p>',
        created_at: '2024-03-14T10:00:00Z',
        images: [],
      },
    ],
    paginatorInfo: {
      currentPage: 1,
      lastPage: 2,
      hasMorePages: true,
      total: 5,
    },
  },
};

const mockCategoriesData = {
  getCategories: [
    { id: '1', name: 'Technology' },
    { id: '2', name: 'Science' },
  ],
};

describe('Articles component', () => {
  beforeEach(() => {
    mockUseQuery.mockReset();
    mockNavigate.mockReset();
  });

  it('shows loading state', () => {
    mockUseQuery.mockReturnValueOnce({ loading: true, error: null, data: null })
      .mockReturnValueOnce({ loading: false, error: null, data: mockCategoriesData });

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading articles/)).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseQuery.mockReturnValueOnce({
      loading: false,
      error: { message: 'Network error' },
      data: null,
    }).mockReturnValueOnce({
      loading: false,
      error: null,
      data: mockCategoriesData,
    });

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    expect(screen.getByText(/Error loading articles/)).toBeInTheDocument();
  });

  it('renders list of articles', () => {
    mockUseQuery.mockReturnValueOnce({
      loading: false,
      error: null,
      data: mockArticlesData,
    }).mockReturnValueOnce({
      loading: false,
      error: null,
      data: mockCategoriesData,
    });

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    expect(screen.getByText('First Article')).toBeInTheDocument();
    expect(screen.getByText('Second Article')).toBeInTheDocument();
  });

  it('shows "Load More" button when there are more pages', () => {
    mockUseQuery.mockReturnValueOnce({
      loading: false,
      error: null,
      data: mockArticlesData,
    }).mockReturnValueOnce({
      loading: false,
      error: null,
      data: mockCategoriesData,
    });

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    expect(screen.getByText(/Load More Articles/)).toBeInTheDocument();
  });

  it('does not show "Load More" on last page', () => {
    const lastPageData = {
      ...mockArticlesData,
      publishedArticles: {
        ...mockArticlesData.publishedArticles,
        paginatorInfo: {
          ...mockArticlesData.publishedArticles.paginatorInfo,
          hasMorePages: false,
        },
      },
    };

    mockUseQuery.mockReturnValueOnce({
      loading: false,
      error: null,
      data: lastPageData,
    }).mockReturnValueOnce({
      loading: false,
      error: null,
      data: mockCategoriesData,
    });

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    expect(screen.queryByText(/Load More Articles/)).not.toBeInTheDocument();
  });

  it('navigates to article on click', async () => {
    const user = userEvent.setup();

    mockUseQuery.mockReturnValueOnce({
      loading: false,
      error: null,
      data: mockArticlesData,
    }).mockReturnValueOnce({
      loading: false,
      error: null,
      data: mockCategoriesData,
    });

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    const articleCard = screen.getByText('First Article');
    await user.click(articleCard);

    expect(mockNavigate).toHaveBeenCalledWith('/article/1');
  });
});
