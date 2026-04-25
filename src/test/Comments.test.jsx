import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock useAuth with a mutable value so we can change it per test
let mockUser = { id: '1', name: 'TestUser', role: 'User' };
vi.mock('../AuthContext.jsx', () => ({
  useAuth: () => ({ user: mockUser }),
}));

// Mock ADD_COMMENT mutation
const mockAddComment = vi.fn();
let mockMutationLoading = false;
let mockMutationError = null;
vi.mock('@apollo/client/react', () => ({
  useMutation: vi.fn(() => [
    mockAddComment,
    { loading: mockMutationLoading, error: mockMutationError },
  ]),
  useApolloClient: vi.fn(() => ({
    query: vi.fn(),
    resetStore: vi.fn(),
  })),
}));

import CommentsOnArticle from '../components/comments/commentsOnArticle.jsx';
import CommentForm from '../components/comments/commentForm.jsx';

describe('CommentsOnArticle component', () => {
  const mockComments = [
    {
      id: '1',
      content: 'Great article!',
      created_at: '2024-03-15T10:00:00Z',
      user: { id: '1', name: 'Alice' },
    },
    {
      id: '2',
      content: 'Very informative',
      created_at: '2024-03-16T14:30:00Z',
      user: { id: '2', name: 'Bob' },
    },
  ];

  it('renders "Comment" for a single comment', () => {
    render(
      <CommentsOnArticle comments={[mockComments[0]]} articleId="123" />
    );
    expect(screen.getByText('Comment')).toBeInTheDocument();
  });

  it('renders "Comments" for multiple comments', () => {
    render(
      <CommentsOnArticle comments={mockComments} articleId="123" />
    );
    expect(screen.getByText('Comments')).toBeInTheDocument();
  });

  it('displays comment content and user names', () => {
    render(
      <CommentsOnArticle comments={mockComments} articleId="123" />
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Great article!')).toBeInTheDocument();
    expect(screen.getByText('Very informative')).toBeInTheDocument();
  });

  it('shows empty state when no comments', () => {
    render(
      <CommentsOnArticle comments={[]} articleId="123" />
    );
    expect(screen.getByText(/No comments yet/)).toBeInTheDocument();
  });

  it('shows comment form button when user is logged in', () => {
    mockUser = { id: '1', name: 'TestUser', role: 'User' };

    render(
      <CommentsOnArticle comments={[]} articleId="123" />
    );

    // The "Leave a comment" button is present
    expect(screen.getByText(/Leave a comment/)).toBeInTheDocument();
  });

  it('shows login prompt when user is not logged in', () => {
    mockUser = null;

    render(
      <CommentsOnArticle comments={[]} articleId="123" />
    );

    expect(screen.getByText(/log in/)).toBeInTheDocument();
  });
});

describe('CommentForm component', () => {
  beforeEach(() => {
    mockAddComment.mockReset();
  });

  it('renders the comment form', () => {
    render(<CommentForm articleId="123" />);
    expect(screen.getByText(/Leave a Comment/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Write your comment here/)).toBeInTheDocument();
    expect(screen.getByText(/Post Comment/)).toBeInTheDocument();
  });

  it('calls addComment mutation on submit', async () => {
    mockAddComment.mockResolvedValue({
      data: { addComment: { id: '1', content: 'Nice post!' } },
    });

    const user = userEvent.setup();
    render(<CommentForm articleId="123" />);

    const textarea = screen.getByPlaceholderText(/Write your comment here/);
    await user.type(textarea, 'Nice post!');
    await user.click(screen.getByText(/Post Comment/));

    expect(mockAddComment).toHaveBeenCalledWith({
      variables: { articleId: '123', content: 'Nice post!' },
    });
  });

  it('shows error message when submission fails', () => {
    // Mock error by using mutation error
    mockMutationError = { message: 'Network error' };

    // Re-render with new mock
    render(<CommentForm articleId="456" />);
    expect(screen.getByText(/Could not submit your comment/)).toBeInTheDocument();
  });
});
