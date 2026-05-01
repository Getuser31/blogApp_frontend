import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

const mockRefetch = vi.fn();
const mockFetchMore = vi.fn();
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

// --- Test data builders ---

const defaultArticlesData = {
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

const defaultCategoriesData = {
  getCategories: [
    { id: '1', name: 'Technology' },
    { id: '2', name: 'Science' },
  ],
};

const queryResultForArticles = (overrides = {}) => ({
  loading: false,
  error: null,
  data: defaultArticlesData,
  fetchMore: mockFetchMore,
  refetch: mockRefetch,
  ...overrides,
});

const queryResultForCategories = (overrides = {}) => ({
  loading: false,
  error: null,
  data: defaultCategoriesData,
  ...overrides,
});

/**
 * Sets up mockUseQuery so that calls alternate between articles and categories.
 * - 1st, 3rd, 5th, ... call → articles query
 * - 2nd, 4th, 6th, ... call → categories query
 * This ensures re-renders (which trigger both queries again) get correct data.
 */
const setupAlternatingMock = (articlesOverrides = {}, categoriesOverrides = {}) => {
  let callCount = 0;
  mockUseQuery.mockImplementation(() => {
    callCount++;
    if (callCount % 2 === 1) {
      return queryResultForArticles(articlesOverrides);
    }
    return queryResultForCategories(categoriesOverrides);
  });
};

// --- Tests ---

describe('Articles component', () => {
  beforeEach(() => {
    mockUseQuery.mockReset();
    mockNavigate.mockReset();
    mockRefetch.mockReset();
    mockFetchMore.mockReset();
  });

  // --- Basic states ---

  it('shows loading state', () => {
    setupAlternatingMock({ loading: true, data: null });

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading articles/)).toBeInTheDocument();
  });

  it('shows error state', () => {
    setupAlternatingMock({ error: { message: 'Network error' }, data: null });

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    expect(screen.getByText(/Error loading articles/)).toBeInTheDocument();
  });

  it('renders list of articles', () => {
    setupAlternatingMock();

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    expect(screen.getByText('First Article')).toBeInTheDocument();
    expect(screen.getByText('Second Article')).toBeInTheDocument();
  });

  it('shows "Load More" button when there are more pages', () => {
    setupAlternatingMock();

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    expect(screen.getByText(/Load More Articles/)).toBeInTheDocument();
  });

  it('does not show "Load More" on last page', () => {
    const noMoreData = {
      publishedArticles: {
        data: [
          { id: '1', title: 'First Article', content: '<p>Content</p>', created_at: '2024-03-15T10:00:00Z', images: [] },
        ],
        paginatorInfo: { currentPage: 1, lastPage: 1, hasMorePages: false, total: 1 },
      },
    };

    setupAlternatingMock({ data: noMoreData });

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    expect(screen.queryByText(/Load More Articles/)).not.toBeInTheDocument();
  });

  it('navigates to article on click', async () => {
    const user = userEvent.setup();
    setupAlternatingMock();

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    await user.click(screen.getByText('Read article →'));

    expect(mockNavigate).toHaveBeenCalledWith('/article/1');
  });

  // --- Filter By Categories: HeroBanner tags ---

  it('renders category filter tags in HeroBanner', () => {
    setupAlternatingMock();

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.map((b) => b.textContent)).toEqual(
      expect.arrayContaining(['All', 'Technology', 'Science'])
    );
  });

  it('applies active styling to the "All" tag by default', () => {
    setupAlternatingMock();

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    const allButton = screen.getAllByRole('button').find((b) => b.textContent === 'All');
    expect(allButton.className).toContain('bg-white');
    expect(allButton.className).toContain('text-neutral-900');
  });

  it('calls refetch with category id when a category tag is clicked', async () => {
    const user = userEvent.setup();
    setupAlternatingMock();

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    const techButton = screen.getAllByRole('button').find((b) => b.textContent === 'Technology');
    await user.click(techButton);

    expect(mockRefetch).toHaveBeenCalledWith({ page: 1, category_id: '1' });
  });

  it('calls refetch without category when "All" tag is clicked', async () => {
    const user = userEvent.setup();
    setupAlternatingMock();

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    const techButton = screen.getAllByRole('button').find((b) => b.textContent === 'Technology');
    await user.click(techButton);
    mockRefetch.mockClear();

    const allButton = screen.getAllByRole('button').find((b) => b.textContent === 'All');
    await user.click(allButton);

    expect(mockRefetch).toHaveBeenCalledWith({ page: 1, category_id: undefined });
  });

  it('updates active tag styling when a category is selected', async () => {
    const user = userEvent.setup();
    setupAlternatingMock();

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    const allBtn = screen.getAllByRole('button').find((b) => b.textContent === 'All');
    const techBtn = screen.getAllByRole('button').find((b) => b.textContent === 'Technology');
    expect(allBtn.className).toContain('bg-white');
    expect(techBtn.className).not.toContain('bg-white');

    await user.click(techBtn);

    const updatedAllBtn = screen.getAllByRole('button').find((b) => b.textContent === 'All');
    const updatedTechBtn = screen.getAllByRole('button').find((b) => b.textContent === 'Technology');
    expect(updatedTechBtn.className).toContain('bg-white');
    expect(updatedAllBtn.className).not.toContain('bg-white');
  });

  it('sets the active tag from the categoryId prop', () => {
    setupAlternatingMock();

    render(
      <MemoryRouter>
        <Articles categoryId="1" />
      </MemoryRouter>
    );

    const techBtn = screen.getAllByRole('button').find((b) => b.textContent === 'Technology');
    const allBtn = screen.getAllByRole('button').find((b) => b.textContent === 'All');
    expect(techBtn.className).toContain('bg-white');
    expect(allBtn.className).not.toContain('bg-white');
  });

  it('sets the active tag from the categoryId prop for Science', () => {
    const spyData = {
      publishedArticles: {
        data: [
          { id: '10', title: 'Science Article', content: '<p>Content</p>', created_at: '2024-03-15T10:00:00Z', images: [] },
        ],
        paginatorInfo: { currentPage: 1, lastPage: 1, hasMorePages: false, total: 1 },
      },
    };

    setupAlternatingMock({ data: spyData });

    render(
      <MemoryRouter>
        <Articles categoryId="2" />
      </MemoryRouter>
    );

    const scienceBtn = screen.getAllByRole('button').find((b) => b.textContent === 'Science');
    const allBtn = screen.getAllByRole('button').find((b) => b.textContent === 'All');
    expect(scienceBtn.className).toContain('bg-white');
    expect(allBtn.className).not.toContain('bg-white');
  });
});
