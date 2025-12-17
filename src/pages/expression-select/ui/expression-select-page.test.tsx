import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ExpressionSelectPage } from './expression-select-page';

describe('ExpressionSelectPage', () => {
  it('StepHeader 타이틀이 렌더링된다', () => {
    render(<ExpressionSelectPage />);
    expect(screen.getByText('표정을 선택해주세요')).toBeInTheDocument();
  });
});
