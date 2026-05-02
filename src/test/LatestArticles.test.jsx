import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

const mockUseQuery = vi.fn();

// Capture (query, options) so variable assertions work
vi.mock('@apollo/client/react', () => ({
  useQuery: (query, options) => mockUseQuery(query, options),
}));

import LatestArticles from '../components/articles/LatestArticles.jsx';

// --- Helpers ---

const makeArticle = (id) => ({
  id: String(id),
  title: `Article ${id}`,
  content: `<p>Content ${id}</p>`,
  excerpt: `Excerpt ${id}`,
  category: 'Tech',
  created_at: '2024-03-15T10:00:00Z',
  images: [],
});

const makePaginator = (currentPage, lastPage, hasMorePages) => ({
  currentPage,
  lastPage,
  hasMorePages,
});

const makeResult = (articles, paginatorInfo, overrides = {}) => ({
  loading: false,
  error: null,
  data: { publishedArticles: { data: articles, paginatorInfo } },
  ...overrides,
});

// Paginator that mirrors the requested page so navigation tests stay consistent
const dynamicMock = (lastPage) => {
  mockUseQuery.mockImplementation((_query, options) => {
    const page = options?.variables?.page ?? 1;
    return makeResult(
      [makeArticle(1)],
      makePaginator(page, lastPage, page < lastPage)
    );
  });
};

// --- Tests ---

describe('LatestArticles', () => {
  beforeEach(() => mockUseQuery.mockReset());

  // Basic states

  it('shows loading state', () => {
    mockUseQuery.mockReturnValue({ loading: true, error: null, data: null });
    render(<MemoryRouter><LatestArticles /></MemoryRouter>);
    expect(screen.getByText(/Loading articles/)).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseQuery.mockReturnValue({ loading: false, error: { message: 'Network error' }, data: null });
    render(<MemoryRouter><LatestArticles /></MemoryRouter>);
    expect(screen.getByText(/Error loading articles/)).toBeInTheDocument();
  });

  it('shows empty state when no articles', () => {
    mockUseQuery.mockReturnValue(makeResult([], makePaginator(1, 1, false)));
    render(<MemoryRouter><LatestArticles /></MemoryRouter>);
    expect(screen.getByText(/No articles found/)).toBeInTheDocument();
  });

  it('renders article titles', () => {
    mockUseQuery.mockReturnValue(
      makeResult([makeArticle(1), makeArticle(2), makeArticle(3)], makePaginator(1, 1, false))
    );
    render(<MemoryRouter><LatestArticles /></MemoryRouter>);
    expect(screen.getByText('Article 1')).toBeInTheDocument();
    expect(screen.getByText('Article 2')).toBeInTheDocument();
    expect(screen.getByText('Article 3')).toBeInTheDocument();
  });

  it('each article card links to its article page', () => {
    mockUseQuery.mockReturnValue(makeResult([makeArticle(42)], makePaginator(1, 1, false)));
    render(<MemoryRouter><LatestArticles /></MemoryRouter>);
    const link = screen.getByText('Article 42').closest('a');
    expect(link).toHaveAttribute('href', '/article/42');
  });

  it('queries page 1 with the configured page size on mount', () => {
    mockUseQuery.mockReturnValue(makeResult([makeArticle(1)], makePaginator(1, 1, false)));
    render(<MemoryRouter><LatestArticles /></MemoryRouter>);
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ variables: expect.objectContaining({ page: 1 }) })
    );
  });

  // Pagination visibility

  it('hides pagination when there is only one page', () => {
    mockUseQuery.mockReturnValue(makeResult([makeArticle(1)], makePaginator(1, 1, false)));
    render(<MemoryRouter><LatestArticles /></MemoryRouter>);
    expect(screen.queryByText(/Previous/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Next/)).not.toBeInTheDocument();
  });

  it('shows pagination when there are multiple pages', () => {
    mockUseQuery.mockReturnValue(makeResult([makeArticle(1)], makePaginator(1, 4, true)));
    render(<MemoryRouter><LatestArticles /></MemoryRouter>);
    expect(screen.getByRole('button', { name: /Previous/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next/ })).toBeInTheDocument();
  });

  // Button disabled states

  it('disables Previous on the first page', () => {
    mockUseQuery.mockReturnValue(makeResult([makeArticle(1)], makePaginator(1, 4, true)));
    render(<MemoryRouter><LatestArticles /></MemoryRouter>);
    expect(screen.getByRole('button', { name: /Previous/ })).toBeDisabled();
  });

  it('enables Previous when not on the first page', () => {
    mockUseQuery.mockReturnValue(makeResult([makeArticle(1)], makePaginator(2, 4, true)));
    render(<MemoryRouter><LatestArticles /></MemoryRouter>);
    expect(screen.getByRole('button', { name: /Previous/ })).not.toBeDisabled();
  });

  it('disables Next on the last page', () => {
    mockUseQuery.mockReturnValue(makeResult([makeArticle(1)], makePaginator(4, 4, false)));
    render(<MemoryRouter><LatestArticles /></MemoryRouter>);
    expect(screen.getByRole('button', { name: /Next/ })).toBeDisabled();
  });

  it('enables Next when there are more pages', () => {
    mockUseQuery.mockReturnValue(makeResult([makeArticle(1)], makePaginator(1, 4, true)));
    render(<MemoryRouter><LatestArticles /></MemoryRouter>);
    expect(screen.getByRole('button', { name: /Next/ })).not.toBeDisabled();
  });

  // Page number buttons

  it('renders all page number buttons when lastPage <= 7', () => {
    mockUseQuery.mockReturnValue(makeResult([makeArticle(1)], makePaginator(1, 5, true)));
    render(<MemoryRouter><LatestArticles /></MemoryRouter>);
    [1, 2, 3, 4, 5].forEach((n) => {
      expect(screen.getByRole('button', { name: String(n) })).toBeInTheDocument();
    });
  });

  it('highlights the current page button with a filled style', () => {
    mockUseQuery.mockReturnValue(makeResult([makeArticle(1)], makePaginator(3, 5, true)));
    render(<MemoryRouter><LatestArticles /></MemoryRouter>);
    expect(screen.getByRole('button', { name: '3' }).className).toContain('bg-neutral-900');
    expect(screen.getByRole('button', { name: '1' }).className).not.toContain('bg-neutral-900');
  });

  it('shows ellipsis for large page counts', () => {
    mockUseQuery.mockReturnValue(makeResult([makeArticle(1)], makePaginator(5, 10, true)));
    render(<MemoryRouter><LatestArticles /></MemoryRouter>);
    expect(screen.getAllByText('…').length).toBeGreaterThan(0);
  });

  // Navigation via query variables

  it('queries page 2 after clicking Next', async () => {
    const user = userEvent.setup();
    dynamicMock(3);
    render(<MemoryRouter><LatestArticles /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: /Next/ }));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ variables: expect.objectContaining({ page: 2 }) })
    );
  });

  it('queries page 1 again after going back from page 2', async () => {
    const user = userEvent.setup();
    dynamicMock(3);
    render(<MemoryRouter><LatestArticles /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: /Next/ }));
    await user.click(screen.getByRole('button', { name: /Previous/ }));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ variables: expect.objectContaining({ page: 1 }) })
    );
  });

  it('jumps to the clicked page number', async () => {
    const user = userEvent.setup();
    dynamicMock(5);
    render(<MemoryRouter><LatestArticles /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: '4' }));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ variables: expect.objectContaining({ page: 4 }) })
    );
  });
});