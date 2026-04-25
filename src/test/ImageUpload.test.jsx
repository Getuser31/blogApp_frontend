import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import ImageUpload from '../components/Admin/Articles/ImageUpload.jsx';

const createMockFile = (name, size = 1024, type = 'image/jpeg') => {
  const file = new File(['a'.repeat(size)], name, { type });
  return file;
};

describe('ImageUpload component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the file input with correct label', () => {
    render(<ImageUpload onUpload={vi.fn()} />);
    expect(screen.getByLabelText(/Images/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Images/)).toHaveAttribute('type', 'file');
  });

  it('calls onUpload when files are selected', async () => {
    const onUpload = vi.fn();
    const user = userEvent.setup();

    render(<ImageUpload onUpload={onUpload} />);

    const fileInput = screen.getByLabelText(/Images/);
    const file1 = createMockFile('test1.jpg');
    const file2 = createMockFile('test2.png', 2048, 'image/png');

    await user.upload(fileInput, [file1, file2]);

    expect(onUpload).toHaveBeenCalledTimes(1);
    const uploadedFiles = onUpload.mock.calls[0][0];
    expect(uploadedFiles).toHaveLength(2);
    expect(uploadedFiles[0].name).toBe('test1.jpg');
    expect(uploadedFiles[1].name).toBe('test2.png');
  });

  it('displays image previews after upload', async () => {
    const user = userEvent.setup();
    render(<ImageUpload onUpload={vi.fn()} />);

    const fileInput = screen.getByLabelText(/Images/);
    const file = createMockFile('test.jpg', 1024, 'image/jpeg');

    await user.upload(fileInput, file);

    const imgs = screen.getAllByRole('img');
    expect(imgs.length).toBeGreaterThanOrEqual(1);
  });

  it('calls onInsertImage when insert button is clicked', async () => {
    const onInsertImage = vi.fn();
    const user = userEvent.setup();

    render(<ImageUpload onUpload={vi.fn()} onInsertImage={onInsertImage} />);

    const fileInput = screen.getByLabelText(/Images/);
    const file = createMockFile('test.jpg', 1024, 'image/jpeg');

    await user.upload(fileInput, file);

    // Find all "Insert in text" buttons - there's one overlay per image
    const insertButtons = screen.getAllByText(/Insert in text/);
    // Click the first actual button (not the <strong> in the help text)
    const actualButton = insertButtons.find(el => el.tagName === 'SPAN') || insertButtons[0];
    await user.click(actualButton.closest('button') || actualButton);

    expect(onInsertImage).toHaveBeenCalledTimes(1);
    expect(onInsertImage).toHaveBeenCalledWith('blob:mock-url', file);
  });

  it('renders with required attribute when specified', () => {
    render(<ImageUpload onUpload={vi.fn()} required={true} />);
    const input = screen.getByLabelText(/Images/);
    expect(input).toBeRequired();
  });
});
