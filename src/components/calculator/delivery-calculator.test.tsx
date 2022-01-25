import { render, screen } from '@testing-library/react';
import DeliveryCalculator from './delivery-calculator';

describe('Component: DeliveryCalculator', () => {
  it('should render component correctly', () => {
    render(<DeliveryCalculator />);

    expect(screen.getByText(/Delivery fee calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Cart value/i)).toBeInTheDocument();
    expect(screen.getByText(/Delivery distance/i)).toBeInTheDocument();
    expect(screen.getByText(/Number of items/i)).toBeInTheDocument();
    expect(screen.getByText(/Order time/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText(/Delivery price:/i)).toBeInTheDocument();
  });
});
