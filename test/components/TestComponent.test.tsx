import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TestComponent from '../../src/components/TestComponent';

describe('TestComponent', () => {
  it('renders correctly', () => {
    render(<TestComponent />);

    expect(screen.getByText('Test Component')).toBeInTheDocument();
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Increment' })
    ).toBeInTheDocument();
  });

  it('increments count when button is clicked', async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    const button = screen.getByRole('button', { name: 'Increment' });
    await user.click(button);

    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});
