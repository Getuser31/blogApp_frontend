import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import CategoryDropdown from '../components/Admin/Articles/CategoryDropdown.jsx';

const mockCategories = [
  { id: '1', name: 'Technology' },
  { id: '2', name: 'Science' },
  { id: '3', name: 'Art' },
];

describe('CategoryDropdown component', () => {
  it('renders with placeholder text', () => {
    render(
      <CategoryDropdown
        categories={mockCategories}
        selectedCategories={[]}
        onCategoryChange={vi.fn()}
      />
    );

    expect(screen.getByText(/Select categories/)).toBeInTheDocument();
  });

  it('shows selected category names', () => {
    render(
      <CategoryDropdown
        categories={mockCategories}
        selectedCategories={['1']}
        onCategoryChange={vi.fn()}
      />
    );

    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('shows multiple selected category names', () => {
    render(
      <CategoryDropdown
        categories={mockCategories}
        selectedCategories={['1', '3']}
        onCategoryChange={vi.fn()}
      />
    );

    expect(screen.getByText(/Technology, Art/)).toBeInTheDocument();
  });

  it('opens dropdown on click', async () => {
    const user = userEvent.setup();
    render(
      <CategoryDropdown
        categories={mockCategories}
        selectedCategories={[]}
        onCategoryChange={vi.fn()}
      />
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(screen.getByText('Science')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Art')).toBeInTheDocument();
  });

  it('calls onCategoryChange when a category is selected', async () => {
    const onCategoryChange = vi.fn();
    const user = userEvent.setup();

    render(
      <CategoryDropdown
        categories={mockCategories}
        selectedCategories={[]}
        onCategoryChange={onCategoryChange}
      />
    );

    // Open dropdown
    await user.click(screen.getByRole('button'));

    // Click the Technology checkbox
    const techCheckbox = screen.getByLabelText('Technology');
    await user.click(techCheckbox);

    expect(onCategoryChange).toHaveBeenCalledWith(['1']);
  });

  it('deselects a category when checked again', async () => {
    const onCategoryChange = vi.fn();
    const user = userEvent.setup();

    render(
      <CategoryDropdown
        categories={mockCategories}
        selectedCategories={['1', '2']}
        onCategoryChange={onCategoryChange}
      />
    );

    // Open dropdown
    await user.click(screen.getByRole('button'));

    // Uncheck Technology
    const techCheckbox = screen.getByLabelText('Technology');
    await user.click(techCheckbox);

    expect(onCategoryChange).toHaveBeenCalledWith(['2']);
  });
});
