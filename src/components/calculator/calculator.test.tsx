import { render, screen } from '@testing-library/react';
import Calculator from './calculator';

describe('Component: Calculator', () => {
  it('should render component correctly', () => {
    render(<Calculator />);

    expect(screen.getByText(/Delivery fee calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Cart value/i)).toBeInTheDocument();
    expect(screen.getByText(/Delivery distance/i)).toBeInTheDocument();
    expect(screen.getByText(/Number of items/i)).toBeInTheDocument();
    expect(screen.getByText(/Order time/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button')
      .find((element) => element.textContent === 'Calculate delivery price')).toBeInTheDocument();
    expect(screen.getByText(/Delivery price:/i)).toBeInTheDocument();
  });
});
