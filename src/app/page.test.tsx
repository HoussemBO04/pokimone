import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './page';

interface SearchParams {
  offset: string | number;
}

jest.mock('../components/PokemonList', () => {
  return function MockPokemonList({ offset }: { offset: string | number }) {
    return (
      <div data-testid="pokemon-list">
        Pokemon List with offset: {offset}
      </div>
    );
  };
});

describe('Home Page', () => {
  describe('Basic Rendering', () => {
    it('should render PokemonList component', async () => {
      const searchParams = Promise.resolve({ offset: 0 });
      
      render(await Home({ searchParams }));
      
      expect(screen.getByTestId('pokemon-list')).toBeInTheDocument();
    });

    it('should pass offset from searchParams to PokemonList', async () => {
      const searchParams = Promise.resolve({ offset: 5 });
      
      render(await Home({ searchParams }));
      
      expect(screen.getByText('Pokemon List with offset: 5')).toBeInTheDocument();
    });
  });

  describe('Search Parameters Handling', () => {
    it('should handle numeric offset from searchParams', async () => {
      const searchParams = Promise.resolve({ offset: 10 });
      
      render(await Home({ searchParams }));
      
      await waitFor(() => {
        expect(screen.getByText('Pokemon List with offset: 10')).toBeInTheDocument();
      });
    });

    it('should handle string offset from searchParams', async () => {
      const searchParams = Promise.resolve({ offset: '7' });
      
      render(await Home({ searchParams }));
      
      await waitFor(() => {
        expect(screen.getByText('Pokemon List with offset: 7')).toBeInTheDocument();
      });
    });

    it('should handle zero offset from searchParams', async () => {
      const searchParams = Promise.resolve({ offset: 0 });
      
      render(await Home({ searchParams }));
      
      await waitFor(() => {
        expect(screen.getByText('Pokemon List with offset: 0')).toBeInTheDocument();
      });
    });

    it('should handle string zero offset from searchParams', async () => {
      const searchParams = Promise.resolve({ offset: '0' });
      
      render(await Home({ searchParams }));
      
      await waitFor(() => {
        expect(screen.getByText('Pokemon List with offset: 0')).toBeInTheDocument();
      });
    });
  });

  describe('Async SearchParams Handling', () => {
    it('should properly await searchParams promise', async () => {
      const mockSearchParams: SearchParams = { offset: 15 };
      const searchParamsPromise = new Promise<SearchParams>((resolve) => {
        setTimeout(() => resolve(mockSearchParams), 10);
      });
      
      render(await Home({ searchParams: searchParamsPromise }));
      
      await waitFor(() => {
        expect(screen.getByText('Pokemon List with offset: 15')).toBeInTheDocument();
      });
    });

    it('should handle delayed promise resolution', async () => {
      const delayedSearchParams = new Promise<SearchParams>((resolve) => {
        setTimeout(() => resolve({ offset: 25 }), 50);
      });
      
      render(await Home({ searchParams: delayedSearchParams }));
      
      await waitFor(() => {
        expect(screen.getByText('Pokemon List with offset: 25')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined offset in searchParams', async () => {
      const searchParams = Promise.resolve({ offset: undefined as unknown as string });
      
      render(await Home({ searchParams }));
      
      await waitFor(() => {
        expect(screen.getByText('Pokemon List with offset:')).toBeInTheDocument();
      });
    });

    it('should handle large numeric offset', async () => {
      const searchParams = Promise.resolve({ offset: 999999 });
      
      render(await Home({ searchParams }));
      
      await waitFor(() => {
        expect(screen.getByText('Pokemon List with offset: 999999')).toBeInTheDocument();
      });
    });

    it('should handle negative numeric offset', async () => {
      const searchParams = Promise.resolve({ offset: -5 });
      
      render(await Home({ searchParams }));
      
      await waitFor(() => {
        expect(screen.getByText('Pokemon List with offset: -5')).toBeInTheDocument();
      });
    });

    it('should handle empty string offset', async () => {
      const searchParams = Promise.resolve({ offset: '' });
      
      render(await Home({ searchParams }));
      
      await waitFor(() => {
        expect(screen.getByText('Pokemon List with offset:')).toBeInTheDocument();
      });
    });

    it('should handle non-numeric string offset', async () => {
      const searchParams = Promise.resolve({ offset: 'invalid' });
      
      render(await Home({ searchParams }));
      
      await waitFor(() => {
        expect(screen.getByText('Pokemon List with offset: invalid')).toBeInTheDocument();
      });
    });
  });

  describe('Component Integration', () => {
    it('should render only PokemonList component', async () => {
      const searchParams = Promise.resolve({ offset: 3 });
      
      const { container } = render(await Home({ searchParams }));
      
      expect(container.children).toHaveLength(1);
      expect(screen.getByTestId('pokemon-list')).toBeInTheDocument();
    });

    it('should not render any additional wrapper elements', async () => {
      const searchParams = Promise.resolve({ offset: 1 });
      
      const { container } = render(await Home({ searchParams }));
      
      const firstChild = container.firstChild;
      expect(firstChild).toHaveAttribute('data-testid', 'pokemon-list');
    });
  });

  describe('Promise Resolution', () => {
    it('should handle immediately resolved promise', async () => {
      const immediatePromise = Promise.resolve({ offset: 8 });
      
      render(await Home({ searchParams: immediatePromise }));
      
      expect(screen.getByText('Pokemon List with offset: 8')).toBeInTheDocument();
    });

    it('should handle promise that resolves with different data types', async () => {
      const mixedTypePromise = Promise.resolve({ offset: '42' });
      
      render(await Home({ searchParams: mixedTypePromise }));
      
      expect(screen.getByText('Pokemon List with offset: 42')).toBeInTheDocument();
    });
  });

  describe('Function Behavior', () => {
    it('should be an async function', () => {
      expect(Home.constructor.name).toBe('AsyncFunction');
    });

    it('should return a React element when awaited', async () => {
      const searchParams = Promise.resolve({ offset: 0 });
      
      const result = await Home({ searchParams });
      
      expect(React.isValidElement(result)).toBe(true);
    });

    it('should destructure offset from awaited searchParams', async () => {
      const searchParams = Promise.resolve({ offset: 123 });
      
      render(await Home({ searchParams }));
      
      expect(screen.getByText('Pokemon List with offset: 123')).toBeInTheDocument();
    });
  });

  describe('Type Safety', () => {
    it('should handle string offset type correctly', async () => {
      const searchParams: Promise<SearchParams> = Promise.resolve({ offset: '99' });
      
      render(await Home({ searchParams }));
      
      expect(screen.getByText('Pokemon List with offset: 99')).toBeInTheDocument();
    });

    it('should handle number offset type correctly', async () => {
      const searchParams: Promise<SearchParams> = Promise.resolve({ offset: 77 });
      
      render(await Home({ searchParams }));
      
      expect(screen.getByText('Pokemon List with offset: 77')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle rejected searchParams promise gracefully', async () => {
      const rejectedPromise = Promise.reject(new Error('Search params failed'));
      
      await expect(Home({ searchParams: rejectedPromise })).rejects.toThrow('Search params failed');
    });

    it('should propagate promise rejection errors', async () => {
      const errorPromise = Promise.reject(new Error('Network error'));
      
      try {
        await Home({ searchParams: errorPromise });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Network error');
      }
    });
  });
});