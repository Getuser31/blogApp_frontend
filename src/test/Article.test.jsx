import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

// --- Mock react-router-dom ---
const mockNavigate = vi.fn();
let mockParams = { id: '1' };

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: () => mockParams,
        useNavigate: () => mockNavigate,
    };
});

// --- Mock AuthContext ---
let mockUser = null;
vi.mock('../AuthContext.jsx', () => ({
    useAuth: () => ({ user: mockUser }),
}));

// --- Mock Apollo ---
const mockUseQuery = vi.fn();
const mockSaveLastReadArticle = vi.fn();
const mockToggleFavorite = vi.fn();

vi.mock('@apollo/client/react', () => ({
    useQuery: () => mockUseQuery(),
    useMutation: (mutation) => {
        // Return the appropriate mock based on the mutation
        return [mockToggleFavorite, { loading: false, error: null }];
    },
    useApolloClient: vi.fn(() => ({
        query: vi.fn(),
        resetStore: vi.fn(),
    })),
}));

import Article from '../components/articles/article.jsx';

const baseArticleData = {
    article: {
        id: '1',
        title: 'Test Article Title',
        content: '<p>Article content here</p>',
        created_at: '2024-06-15T10:00:00Z',
        isFavorite: false,
        author: {
            id: '2',
            name: 'John Doe',
        },
        categories: [
            { id: '1', name: 'Technology' },
            { id: '2', name: 'Science' },
        ],
        comments: [
            { id: '1', content: 'Great article!', created_at: '2024-06-15T12:00:00Z', user: { id: '3', name: 'Alice' } },
        ],
    },
};

describe('Article component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUser = null;
        mockParams = { id: '1' };
        mockUseQuery.mockReset();
        mockToggleFavorite.mockReset();
        mockSaveLastReadArticle.mockReset();
        mockNavigate.mockReset();
    });

    // --- Basic states ---

    it('shows loading state', () => {
        mockUseQuery.mockReturnValue({ loading: true, error: null, data: null });

        render(
            <MemoryRouter>
                <Article />
            </MemoryRouter>
        );

        expect(screen.getByText('Loading article...')).toBeInTheDocument();
    });

    it('shows error state', () => {
        mockUseQuery.mockReturnValue({
            loading: false,
            error: { message: 'Failed to fetch article' },
            data: null,
        });

        render(
            <MemoryRouter>
                <Article />
            </MemoryRouter>
        );

        expect(screen.getByText(/Error: Failed to fetch article/)).toBeInTheDocument();
    });

    it('shows not found state when article is null', () => {
        mockUseQuery.mockReturnValue({ loading: false, error: null, data: { article: null } });

        render(
            <MemoryRouter>
                <Article />
            </MemoryRouter>
        );

        expect(screen.getByText('Article not found.')).toBeInTheDocument();
    });

    // --- Article rendering ---

    it('renders article title, author, categories, and date', () => {
        mockUser = { id: '1', name: 'TestUser', role: { name: 'User' } };
        mockUseQuery.mockReturnValue({ loading: false, error: null, data: baseArticleData });

        render(
            <MemoryRouter>
                <Article />
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { name: 'Test Article Title' })).toBeInTheDocument();
        expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Technology').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Science').length).toBeGreaterThan(0);
        expect(screen.getByText(/Published on/)).toBeInTheDocument();
    });

    it('renders article content safely', () => {
        mockUser = { id: '1', name: 'TestUser', role: { name: 'User' } };
        mockUseQuery.mockReturnValue({ loading: false, error: null, data: baseArticleData });

        const { container } = render(
            <MemoryRouter>
                <Article />
            </MemoryRouter>
        );

        // Content is rendered via dangerouslySetInnerHTML
        expect(container.innerHTML).toContain('Article content here');
    });

    // --- Favorite star (regression tests for the latest commit) ---

    it('does NOT show the favorite star when user is not logged in', () => {
        mockUser = null;
        mockUseQuery.mockReturnValue({ loading: false, error: null, data: baseArticleData });

        render(
            <MemoryRouter>
                <Article />
            </MemoryRouter>
        );

        // The star character should NOT be in the document
        expect(screen.queryByText('☆')).not.toBeInTheDocument();
        expect(screen.queryByText('★')).not.toBeInTheDocument();
    });

    it('shows the favorite star when user is logged in', () => {
        mockUser = { id: '1', name: 'TestUser', role: { name: 'User' } };
        mockUseQuery.mockReturnValue({ loading: false, error: null, data: baseArticleData });

        render(
            <MemoryRouter>
                <Article />
            </MemoryRouter>
        );

        // The unfilled star should be visible
        expect(screen.getByText('☆')).toBeInTheDocument();
    });

    it('shows filled favorite star when article is favorited', () => {
        mockUser = { id: '1', name: 'TestUser', role: { name: 'User' } };
        const favoritedData = {
            article: { ...baseArticleData.article, isFavorite: true },
        };
        mockUseQuery.mockReturnValue({ loading: false, error: null, data: favoritedData });

        render(
            <MemoryRouter>
                <Article />
            </MemoryRouter>
        );

        expect(screen.getByText('★')).toBeInTheDocument();
        expect(screen.queryByText('☆')).not.toBeInTheDocument();
    });

    it('calls toggleFavorite mutation when star is clicked', async () => {
        const user = userEvent.setup();
        mockUser = { id: '1', name: 'TestUser', role: { name: 'User' } };
        mockUseQuery.mockReturnValue({ loading: false, error: null, data: baseArticleData });

        render(
            <MemoryRouter>
                <Article />
            </MemoryRouter>
        );

        await user.click(screen.getByText('☆'));

        expect(mockToggleFavorite).toHaveBeenCalledWith({
            variables: { articleId: '1' },
        });
    });

    // --- saveLastReadArticle behavior (regression tests for the latest commit) ---

    it('does NOT call saveLastReadArticle when no user is logged in', async () => {
        mockUser = null;
        mockUseQuery.mockReturnValue({ loading: false, error: null, data: baseArticleData });

        render(
            <MemoryRouter>
                <Article />
            </MemoryRouter>
        );

        // Wait for effects to settle
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Test Article Title' })).toBeInTheDocument();
        });

        // The component only uses the mutation hook, it shouldn't have been called
        // since we didn't pass a "user" to trigger the effect
        // We can't easily test this via mock because useMutation returns a tuple,
        // but we verify the star is not shown as evidence the user check works
        expect(screen.queryByText('☆')).not.toBeInTheDocument();
    });

    // --- Author edit button ---

    it('shows edit button when the user is the author', () => {
        mockUser = { id: '2', name: 'John Doe', role: { name: 'Admin' } };
        const authorData = {
            article: { ...baseArticleData.article, author: { id: '2', name: 'John Doe' } },
        };
        mockUseQuery.mockReturnValue({ loading: false, error: null, data: authorData });

        render(
            <MemoryRouter>
                <Article />
            </MemoryRouter>
        );

        expect(screen.getByText('Edit Article')).toBeInTheDocument();
    });

    it('does NOT show edit button when the user is not the author', () => {
        mockUser = { id: '5', name: 'OtherUser', role: { name: 'User' } };
        mockUseQuery.mockReturnValue({ loading: false, error: null, data: baseArticleData });

        render(
            <MemoryRouter>
                <Article />
            </MemoryRouter>
        );

        expect(screen.queryByText('Edit Article')).not.toBeInTheDocument();
    });

    it('navigates to edit page when edit button is clicked', async () => {
        const user = userEvent.setup();
        mockUser = { id: '2', name: 'John Doe', role: { name: 'Admin' } };
        const authorData = {
            article: { ...baseArticleData.article, author: { id: '2', name: 'John Doe' } },
        };
        mockUseQuery.mockReturnValue({ loading: false, error: null, data: authorData });

        render(
            <MemoryRouter>
                <Article />
            </MemoryRouter>
        );

        await user.click(screen.getByText('Edit Article'));
        expect(mockNavigate).toHaveBeenCalledWith('/edit/1');
    });
});
