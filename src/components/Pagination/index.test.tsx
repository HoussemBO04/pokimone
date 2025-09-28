import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pagination from '../Pagination';

jest.mock('next/link', () => {
  return function MockLink({ children, href, className }: { 
    children: React.ReactNode; 
    href: string; 
    className?: string; 
  }) {
    return <a href={href} className={className}>{children}</a>;
  };
});

interface PaginationProps {
  total: number;
  perPage?: number;
  current: number;
}

describe('Pagination', () => {
  describe('Basic Rendering', () => {
    it('should render pagination navigation', () => {
      render(<Pagination total={100} current={0} />);
      
      const navigation = screen.getByRole('navigation');
      expect(navigation).toBeInTheDocument();
      expect(navigation).toHaveClass('te-Pagination');
    });

    it('should render page numbers with correct labels', () => {
      render(<Pagination total={100} current={2} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should use default perPage value of 20', () => {
      render(<Pagination total={40} current={0} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.queryByText('3')).not.toBeInTheDocument();
    });

    it('should use custom perPage value', () => {
      render(<Pagination total={50} perPage={10} current={0} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('Current Page Highlighting', () => {
    it('should highlight current page with active class', () => {
      render(<Pagination total={100} current={2} />);
      
      const currentPageLink = screen.getByText('3').closest('a');
      expect(currentPageLink).toHaveClass('te-Pagination-button');
      expect(currentPageLink).toHaveClass('te-Pagination-button--active');
    });

    it('should not highlight non-current pages', () => {
      render(<Pagination total={100} current={2} />);
      
      const nonCurrentPageLink = screen.getByText('2').closest('a');
      expect(nonCurrentPageLink).toHaveClass('te-Pagination-button');
      expect(nonCurrentPageLink).not.toHaveClass('te-Pagination-button--active');
    });

    it('should highlight first page when current is 0', () => {
      render(<Pagination total={100} current={0} />);
      
      const firstPageLink = screen.getByText('1').closest('a');
      expect(firstPageLink).toHaveClass('te-Pagination-button--active');
    });
  });

  describe('Previous Button', () => {
    it('should show previous button when not on first page', () => {
      render(<Pagination total={100} current={3} />);
      
      const prevButton = screen.getByText('« Prev');
      expect(prevButton).toBeInTheDocument();
      expect(prevButton.closest('a')).toHaveAttribute('href', '/?offset=2');
      expect(prevButton.closest('a')).toHaveClass('te-Pagination-button');
      expect(prevButton.closest('a')).toHaveClass('te-Pagination-button--prev');
    });

    it('should not show previous button when on first page', () => {
      render(<Pagination total={100} current={0} />);
      
      expect(screen.queryByText('« Prev')).not.toBeInTheDocument();
    });

    it('should show previous button when current is 1', () => {
      render(<Pagination total={100} current={1} />);
      
      const prevButton = screen.getByText('« Prev');
      expect(prevButton.closest('a')).toHaveAttribute('href', '/?offset=0');
    });
  });

  describe('Next Button', () => {
    it('should show next button when not on last page', () => {
      render(<Pagination total={100} current={2} />);
      
      const nextButton = screen.getByText('Next »');
      expect(nextButton).toBeInTheDocument();
      expect(nextButton.closest('a')).toHaveAttribute('href', '/?offset=3');
      expect(nextButton.closest('a')).toHaveClass('te-Pagination-button');
      expect(nextButton.closest('a')).toHaveClass('te-Pagination-button--next');
    });

    it('should not show next button when on last page', () => {
      render(<Pagination total={100} current={4} />);
      
      expect(screen.queryByText('Next »')).not.toBeInTheDocument();
    });

    it('should show next button when one page before last', () => {
      render(<Pagination total={100} current={3} />);
      
      const nextButton = screen.getByText('Next »');
      expect(nextButton.closest('a')).toHaveAttribute('href', '/?offset=4');
    });
  });

  describe('Page Links', () => {
    it('should generate correct href for each page', () => {
      render(<Pagination total={100} current={2} />);
      
      expect(screen.getByText('1').closest('a')).toHaveAttribute('href', '/?offset=0');
      expect(screen.getByText('2').closest('a')).toHaveAttribute('href', '/?offset=1');
      expect(screen.getByText('3').closest('a')).toHaveAttribute('href', '/?offset=2');
      expect(screen.getByText('4').closest('a')).toHaveAttribute('href', '/?offset=3');
      expect(screen.getByText('5').closest('a')).toHaveAttribute('href', '/?offset=4');
    });

    it('should apply correct CSS classes to page links', () => {
      render(<Pagination total={100} current={1} />);
      
      const pageLinks = screen.getAllByText(/^\d+$/);
      pageLinks.forEach(link => {
        expect(link.closest('a')).toHaveClass('te-Pagination-button');
      });
    });
  });

  describe('Visible Pages Range', () => {
    it('should show pages around current when current is in middle', () => {
      render(<Pagination total={200} current={5} />);
      
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.queryByText('3')).not.toBeInTheDocument();
      expect(screen.queryByText('9')).not.toBeInTheDocument();
    });

    it('should show pages 1-3 when current is 0 and limited pages', () => {
      render(<Pagination total={60} current={0} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.queryByText('4')).not.toBeInTheDocument();
    });

    it('should show correct range when current page is near the end', () => {
      render(<Pagination total={100} current={4} />);
      
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.queryByText('2')).not.toBeInTheDocument();
      expect(screen.queryByText('6')).not.toBeInTheDocument();
    });

    it('should show correct range when current page is at the beginning', () => {
      render(<Pagination total={200} current={0} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.queryByText('4')).not.toBeInTheDocument();
    });

    it('should handle edge case when current is 1', () => {
      render(<Pagination total={200} current={1} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.queryByText('5')).not.toBeInTheDocument();
    });
  });

  describe('Total Pages Calculation', () => {
    it('should calculate correct total pages with exact division', () => {
      render(<Pagination total={40} perPage={20} current={0} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.queryByText('3')).not.toBeInTheDocument();
    });

    it('should calculate correct total pages with remainder', () => {
      render(<Pagination total={45} perPage={20} current={0} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.queryByText('4')).not.toBeInTheDocument();
    });

    it('should handle single page correctly', () => {
      render(<Pagination total={15} perPage={20} current={0} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.queryByText('2')).not.toBeInTheDocument();
      expect(screen.queryByText('« Prev')).not.toBeInTheDocument();
      expect(screen.queryByText('Next »')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero total items', () => {
      render(<Pagination total={0} current={0} />);
      
      expect(screen.queryByText('1')).not.toBeInTheDocument();
      expect(screen.queryByText('« Prev')).not.toBeInTheDocument();
      expect(screen.queryByText('Next »')).not.toBeInTheDocument();
    });

    it('should handle total less than perPage', () => {
      render(<Pagination total={5} perPage={20} current={0} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.queryByText('2')).not.toBeInTheDocument();
      expect(screen.queryByText('« Prev')).not.toBeInTheDocument();
      expect(screen.queryByText('Next »')).not.toBeInTheDocument();
    });

    it('should handle current page being last page', () => {
      render(<Pagination total={60} perPage={20} current={2} />);
      
      expect(screen.getByText('« Prev')).toBeInTheDocument();
      expect(screen.queryByText('Next »')).not.toBeInTheDocument();
      
      const currentPageLink = screen.getByText('3').closest('a');
      expect(currentPageLink).toHaveClass('te-Pagination-button--active');
    });

    it('should handle very large numbers', () => {
      render(<Pagination total={10000} perPage={100} current={50} />);
      
      expect(screen.getByText('« Prev')).toBeInTheDocument();
      expect(screen.getByText('Next »')).toBeInTheDocument();
      expect(screen.getByText('51')).toBeInTheDocument();
      
      const currentPageLink = screen.getByText('51').closest('a');
      expect(currentPageLink).toHaveClass('te-Pagination-button--active');
    });

    it('should handle perPage of 1', () => {
      render(<Pagination total={5} perPage={1} current={2} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      
      const currentPageLink = screen.getByText('3').closest('a');
      expect(currentPageLink).toHaveClass('te-Pagination-button--active');
    });

    it('should handle when current exceeds total pages', () => {
      render(<Pagination total={40} perPage={20} current={5} />);
      
      expect(screen.getByText('« Prev')).toBeInTheDocument();
      expect(screen.queryByText('Next »')).not.toBeInTheDocument();
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });
  });

  describe('Real World Usage with PokemonList', () => {
    it('should work correctly with Pokemon API pagination pattern', () => {
      render(<Pagination total={1118} perPage={20} current={0} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.queryByText('« Prev')).not.toBeInTheDocument();
      expect(screen.getByText('Next »')).toBeInTheDocument();
    });

    it('should work correctly for middle page in Pokemon list', () => {
      render(<Pagination total={1118} perPage={20} current={10} />);
      
      expect(screen.getByText('« Prev')).toBeInTheDocument();
      expect(screen.getByText('Next »')).toBeInTheDocument();
      expect(screen.getByText('9')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('11')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('13')).toBeInTheDocument();
      
      const currentPageLink = screen.getByText('11').closest('a');
      expect(currentPageLink).toHaveClass('te-Pagination-button--active');
    });

    it('should work correctly for last page in Pokemon list', () => {
      const totalPages = Math.ceil(1118 / 20);
      const lastPageIndex = totalPages - 1;
      
      render(<Pagination total={1118} perPage={20} current={lastPageIndex} />);
      
      expect(screen.getByText('« Prev')).toBeInTheDocument();
      expect(screen.queryByText('Next »')).not.toBeInTheDocument();
      
      const currentPageLink = screen.getByText(totalPages.toString()).closest('a');
      expect(currentPageLink).toHaveClass('te-Pagination-button--active');
    });
  });

  describe('Accessibility', () => {
    it('should render as nav element for accessibility', () => {
      render(<Pagination total={100} current={0} />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should have proper link structure for screen readers', () => {
      render(<Pagination total={100} current={2} />);
      
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
      
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });

    it('should provide clear navigation context', () => {
      render(<Pagination total={100} current={2} />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('te-Pagination');
      
      const prevButton = screen.getByText('« Prev');
      const nextButton = screen.getByText('Next »');
      
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });
  });
});