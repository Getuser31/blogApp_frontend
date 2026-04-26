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

    const articleCard = screen.getByText('First Article');
    await user.click(articleCard);

    expect(mockNavigate).toHaveBeenCalledWith('/article/1');
  });

  // --- Filter By Categories: Dropdown (mobile) ---

  it('renders the "Filter By Categories" heading', () => {
    setupAlternatingMock();

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    expect(screen.getByText('Filter By Categories')).toBeInTheDocument();
  });

  it('renders a dropdown with "All Categories" and category options', () => {
    setupAlternatingMock();

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveValue('');

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3); // "All Categories" + Technology + Science
    expect(options[0]).toHaveTextContent('All Categories');
    expect(options[0]).toHaveValue('');
    expect(options[1]).toHaveTextContent('Technology');
    expect(options[1]).toHaveValue('1');
    expect(options[2]).toHaveTextContent('Science');
    expect(options[2]).toHaveValue('2');
  });

  it('calls refetch with the selected category when dropdown changes', async () => {
    const user = userEvent.setup();
    setupAlternatingMock();

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    const dropdown = screen.getByRole('combobox');
    await user.selectOptions(dropdown, '1');

    expect(mockRefetch).toHaveBeenCalledWith({ page: 1, category_id: '1' });
  });

  it('calls refetch without category when "All Categories" is selected in dropdown', async () => {
    const user = userEvent.setup();
    setupAlternatingMock();

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    const dropdown = screen.getByRole('combobox');

    // Select a category first
    await user.selectOptions(dropdown, '1');
    mockRefetch.mockClear();

    // Then switch back to "All Categories"
    await user.selectOptions(dropdown, '');

    expect(mockRefetch).toHaveBeenCalledWith({ page: 1, category_id: undefined });
  });

  // --- Filter By Categories: Pills (desktop) ---

  it('renders category filter pills', () => {
    setupAlternatingMock();

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.map((b) => b.textContent)).toEqual(
      expect.arrayContaining(['All Categories', 'Technology', 'Science'])
    );
  });

  it('applies active styling to the "All Categories" pill by default', () => {
    setupAlternatingMock();

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    // "All Categories" button should be active (indigo)
    const allButton = screen.getAllByRole('button').filter((b) => b.textContent === 'All Categories')[0];
    expect(allButton.className).toContain('bg-indigo-600');
    expect(allButton.className).toContain('text-white');
  });

  it('calls refetch with category id when a category pill is clicked', async () => {
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

  it('calls refetch without category when "All Categories" pill is clicked', async () => {
    const user = userEvent.setup();
    setupAlternatingMock();

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    // First click a category
    const techButton = screen.getAllByRole('button').find((b) => b.textContent === 'Technology');
    await user.click(techButton);
    mockRefetch.mockClear();

    // Then click "All Categories"
    const allButton = screen.getAllByRole('button').filter((b) => b.textContent === 'All Categories')[0];
    await user.click(allButton);

    expect(mockRefetch).toHaveBeenCalledWith({ page: 1, category_id: undefined });
  });

  it('updates active pill styling when a category is selected', async () => {
    const user = userEvent.setup();
    setupAlternatingMock();

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    // Initially "All Categories" is active
    const allBtn = screen.getAllByRole('button').filter((b) => b.textContent === 'All Categories')[0];
    const techBtn = screen.getAllByRole('button').find((b) => b.textContent === 'Technology');
    expect(allBtn.className).toContain('bg-indigo-600');
    expect(techBtn.className).toContain('bg-gray-100');

    // Click Technology — it should become active
    await user.click(techBtn);

    // After re-render, check the updated styling
    const updatedAllBtn = screen.getAllByRole('button').filter((b) => b.textContent === 'All Categories')[0];
    const updatedTechBtn = screen.getAllByRole('button').find((b) => b.textContent === 'Technology');
    expect(updatedTechBtn.className).toContain('bg-indigo-600');
    expect(updatedAllBtn.className).toContain('bg-gray-100');
  });

  // --- Filter By Categories: categoryId prop ---

  it('sets the selected category from the categoryId prop', () => {
    setupAlternatingMock();

    render(
      <MemoryRouter>
        <Articles categoryId="1" />
      </MemoryRouter>
    );

    // When categoryId "1" is passed, the Technology pill should be active
    const techBtn = screen.getAllByRole('button').find((b) => b.textContent === 'Technology');
    const allBtn = screen.getAllByRole('button').filter((b) => b.textContent === 'All Categories')[0];
    expect(techBtn.className).toContain('bg-indigo-600');
    expect(allBtn.className).toContain('bg-gray-100');
  });

  it('passes category_id to the initial query via the categoryId prop', () => {
    const spyData = {
      publishedArticles: {
        data: [
          { id: '10', title: 'Tech Article', content: '<p>Content</p>', created_at: '2024-03-15T10:00:00Z', images: [] },
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

    // The Science pill should be active because categoryId="2"
    const scienceBtn = screen.getAllByRole('button').find((b) => b.textContent === 'Science');
    const allBtn = screen.getAllByRole('button').filter((b) => b.textContent === 'All Categories')[0];
    expect(scienceBtn.className).toContain('bg-indigo-600');
    expect(allBtn.className).toContain('bg-gray-100');
  });
});
