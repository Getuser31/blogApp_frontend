import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import Admin from '../components/Admin/admin.jsx';

describe('Admin dashboard', () => {
  it('renders all admin cards', () => {
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    expect(screen.getByText(/Admin Dashboard/)).toBeInTheDocument();
    expect(screen.getByText(/Create Article/)).toBeInTheDocument();
    expect(screen.getByText(/Edit Articles/)).toBeInTheDocument();
    expect(screen.getByText(/Manage Categories/)).toBeInTheDocument();
    expect(screen.getByText(/Manage Users/)).toBeInTheDocument();
  });

  it('navigates to add article on click', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    await user.click(screen.getByText(/Create Article/));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/addArticle');
  });

  it('navigates to articles on edit articles click', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    await user.click(screen.getByText(/Edit Articles/));
    expect(mockNavigate).toHaveBeenCalledWith('/articles');
  });

  it('navigates to categories on manage categories click', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    await user.click(screen.getByText(/Manage Categories/));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/categories');
  });

  it('navigates to user list on manage users click', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    await user.click(screen.getByText(/Manage Users/));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/listOfUsers');
  });
});
