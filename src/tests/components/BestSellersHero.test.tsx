import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestHelpers } from '../test-utils';
import { BestSellersHero } from '../../components/bestsellers/BestSellersHero';

// Mock the hooks
vi.mock('../../hooks/useCountdownTimer', () => ({
  useCountdownTimer: () => ({
    timeLeft: {
      days: 2,
      hours: 14,
      minutes: 30,
      seconds: 45,
    },
    isExpired: false,
  }),
}));

describe('BestSellersHero', () => {
  beforeEach(() => {
    TestHelpers.setupGlobalMocks();
  });

  it('renders the hero section correctly', () => {
    const Wrapper = TestHelpers.createWrapper();
    
    render(<BestSellersHero />, { wrapper: Wrapper });
    
    // Check if main heading is present
    expect(screen.getByText(/best sellers/i)).toBeInTheDocument();
    
    // Check if description is present
    expect(screen.getByText(/discover the most popular products/i)).toBeInTheDocument();
    
    // Check if countdown timer is displayed
    expect(screen.getByText(/2/)).toBeInTheDocument(); // days
    expect(screen.getByText(/14/)).toBeInTheDocument(); // hours
    expect(screen.getByText(/30/)).toBeInTheDocument(); // minutes
    expect(screen.getByText(/45/)).toBeInTheDocument(); // seconds
  });

  it('displays trust indicators', () => {
    const Wrapper = TestHelpers.createWrapper();
    
    render(<BestSellersHero />, { wrapper: Wrapper });
    
    // Check for trust indicators
    expect(screen.getByText(/trusted by thousands/i)).toBeInTheDocument();
    expect(screen.getByText(/fast delivery/i)).toBeInTheDocument();
    expect(screen.getByText(/secure payment/i)).toBeInTheDocument();
  });

  it('has proper responsive classes', () => {
    const Wrapper = TestHelpers.createWrapper();
    
    render(<BestSellersHero />, { wrapper: Wrapper });
    
    const heroSection = screen.getByRole('banner');
    expect(heroSection).toHaveClass('min-h-screen');
  });
});