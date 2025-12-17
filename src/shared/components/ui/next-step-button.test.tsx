/**
 * NextStepButton — Unit Tests
 */

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NextStepButton } from './next-step-button';

describe('NextStepButton', () => {
  it('renders with default text', () => {
    render(<NextStepButton />);
    expect(screen.getByRole('button', { name: '다음으로' })).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<NextStepButton>확인하기</NextStepButton>);
    expect(screen.getByRole('button', { name: '확인하기' })).toBeInTheDocument();
  });

  it('shows loading text when isLoading is true', () => {
    render(<NextStepButton isLoading />);
    expect(screen.getByRole('button', { name: '처리 중...' })).toBeInTheDocument();
  });

  it('shows custom loading text', () => {
    render(<NextStepButton isLoading loadingText="올리는 중..." />);
    expect(screen.getByRole('button', { name: '올리는 중...' })).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<NextStepButton disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when isLoading is true', () => {
    render(<NextStepButton isLoading />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<NextStepButton onClick={handleClick} />);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<NextStepButton onClick={handleClick} disabled />);

    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('accepts custom className', () => {
    render(<NextStepButton className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('accepts variant prop', () => {
    render(<NextStepButton variant="secondary" />);
    const button = screen.getByRole('button');
    // secondary variant는 bg-brand-100 클래스를 가짐
    expect(button).toHaveClass('bg-brand-100');
  });

  it('has default size of lg', () => {
    render(<NextStepButton />);
    const button = screen.getByRole('button');
    // lg size는 h-12 클래스를 가짐
    expect(button).toHaveClass('h-12');
  });

  it('accepts all button props', () => {
    render(<NextStepButton type="submit" name="next-button" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('name', 'next-button');
  });
});
