import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pokemon from './page';

interface Params {
  id: string;
}

jest.mock('../../../components/PokemonDetails', () => {
  return function MockPokemonDetails({ id }: { id: string }) {
    return (
      <div data-testid="pokemon-details">
        Pokemon Details for ID: {id}
      </div>
    );
  };
});

describe('Pokemon Page', () => {
  describe('Basic Rendering', () => {
    it('should render wrapper div with correct CSS class', async () => {
      const params = Promise.resolve({ id: '1' });
      
      const { container } = render(await Pokemon({ params }));
      
      const wrapperDiv = container.firstChild;
      expect(wrapperDiv).toHaveClass('te-Card');
    });

    it('should render PokemonDetails component', async () => {
      const params = Promise.resolve({ id: '25' });
      
      render(await Pokemon({ params }));
      
      expect(screen.getByTestId('pokemon-details')).toBeInTheDocument();
    });

    it('should pass id from params to PokemonDetails', async () => {
      const params = Promise.resolve({ id: '150' });
      
      render(await Pokemon({ params }));
      
      expect(screen.getByText('Pokemon Details for ID: 150')).toBeInTheDocument();
    });
  });

  describe('Parameters Handling', () => {
    it('should handle numeric string id from params', async () => {
      const params = Promise.resolve({ id: '123' });
      
      render(await Pokemon({ params }));
      
      await waitFor(() => {
        expect(screen.getByText('Pokemon Details for ID: 123')).toBeInTheDocument();
      });
    });

    it('should handle pokemon name as id from params', async () => {
      const params = Promise.resolve({ id: 'pikachu' });
      
      render(await Pokemon({ params }));
      
      await waitFor(() => {
        expect(screen.getByText('Pokemon Details for ID: pikachu')).toBeInTheDocument();
      });
    });

    it('should handle single digit id from params', async () => {
      const params = Promise.resolve({ id: '5' });
      
      render(await Pokemon({ params }));
      
      await waitFor(() => {
        expect(screen.getByText('Pokemon Details for ID: 5')).toBeInTheDocument();
      });
    });

    it('should handle large numeric id from params', async () => {
      const params = Promise.resolve({ id: '999' });
      
      render(await Pokemon({ params }));
      
      await waitFor(() => {
        expect(screen.getByText('Pokemon Details for ID: 999')).toBeInTheDocument();
      });
    });
  });

  describe('Async Params Handling', () => {
    it('should properly await params promise', async () => {
      const mockParams: Params = { id: 'charizard' };
      const paramsPromise = new Promise<Params>((resolve) => {
        setTimeout(() => resolve(mockParams), 10);
      });
      
      render(await Pokemon({ params: paramsPromise }));
      
      await waitFor(() => {
        expect(screen.getByText('Pokemon Details for ID: charizard')).toBeInTheDocument();
      });
    });

    it('should handle delayed promise resolution', async () => {
      const delayedParams = new Promise<Params>((resolve) => {
        setTimeout(() => resolve({ id: 'bulbasaur' }), 50);
      });
      
      render(await Pokemon({ params: delayedParams }));
      
      await waitFor(() => {
        expect(screen.getByText('Pokemon Details for ID: bulbasaur')).toBeInTheDocument();
      });
    });

    it('should handle immediately resolved promise', async () => {
      const immediatePromise = Promise.resolve({ id: 'squirtle' });
      
      render(await Pokemon({ params: immediatePromise }));
      
      expect(screen.getByText('Pokemon Details for ID: squirtle')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should have only one child element in wrapper div', async () => {
      const params = Promise.resolve({ id: '42' });
      
      const { container } = render(await Pokemon({ params }));
      
      const wrapperDiv = container.firstChild as Element;
      expect(wrapperDiv.children).toHaveLength(1);
    });

    it('should render PokemonDetails as direct child of wrapper', async () => {
      const params = Promise.resolve({ id: '88' });
      
      const { container } = render(await Pokemon({ params }));
      
      const wrapperDiv = container.firstChild as Element;
      const pokemonDetails = wrapperDiv.firstChild;
      expect(pokemonDetails).toHaveAttribute('data-testid', 'pokemon-details');
    });

    it('should maintain correct DOM hierarchy', async () => {
      const params = Promise.resolve({ id: '200' });
      
      const { container } = render(await Pokemon({ params }));
      
      expect(container.innerHTML).toContain('<div class="te-Card">');
      expect(container.innerHTML).toContain('data-testid="pokemon-details"');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string id', async () => {
      const params = Promise.resolve({ id: '' });
      
      render(await Pokemon({ params }));
      
      await waitFor(() => {
        expect(screen.getByText('Pokemon Details for ID:')).toBeInTheDocument();
      });
    });

    it('should handle id with special characters', async () => {
      const params = Promise.resolve({ id: 'mr-mime' });
      
      render(await Pokemon({ params }));
      
      await waitFor(() => {
        expect(screen.getByText('Pokemon Details for ID: mr-mime')).toBeInTheDocument();
      });
    });

    it('should handle id with numbers and letters', async () => {
      const params = Promise.resolve({ id: 'pokemon123' });
      
      render(await Pokemon({ params }));
      
      await waitFor(() => {
        expect(screen.getByText('Pokemon Details for ID: pokemon123')).toBeInTheDocument();
      });
    });

    it('should handle very long id string', async () => {
      const longId = 'this-is-a-very-long-pokemon-name-that-might-exist';
      const params = Promise.resolve({ id: longId });
      
      render(await Pokemon({ params }));
      
      await waitFor(() => {
        expect(screen.getByText(`Pokemon Details for ID: ${longId}`)).toBeInTheDocument();
      });
    });
  });

  describe('Promise Resolution', () => {
    it('should handle promise that resolves with different id formats', async () => {
      const formatPromise = Promise.resolve({ id: '001' });
      
      render(await Pokemon({ params: formatPromise }));
      
      expect(screen.getByText('Pokemon Details for ID: 001')).toBeInTheDocument();
    });

    it('should handle multiple sequential renders with different ids', async () => {
      const params1 = Promise.resolve({ id: 'first' });
      const params2 = Promise.resolve({ id: 'second' });
      
      const { rerender } = render(await Pokemon({ params: params1 }));
      expect(screen.getByText('Pokemon Details for ID: first')).toBeInTheDocument();
      
      rerender(await Pokemon({ params: params2 }));
      expect(screen.getByText('Pokemon Details for ID: second')).toBeInTheDocument();
    });
  });

  describe('Function Behavior', () => {
    it('should be an async function', () => {
      expect(Pokemon.constructor.name).toBe('AsyncFunction');
    });

    it('should return a React element when awaited', async () => {
      const params = Promise.resolve({ id: 'test' });
      
      const result = await Pokemon({ params });
      
      expect(React.isValidElement(result)).toBe(true);
    });

    it('should destructure id from awaited params', async () => {
      const params = Promise.resolve({ id: 'destructured' });
      
      render(await Pokemon({ params }));
      
      expect(screen.getByText('Pokemon Details for ID: destructured')).toBeInTheDocument();
    });
  });

  describe('Type Safety', () => {
    it('should handle params with proper typing', async () => {
      const typedParams: Promise<Params> = Promise.resolve({ id: 'typed-test' });
      
      render(await Pokemon({ params: typedParams }));
      
      expect(screen.getByText('Pokemon Details for ID: typed-test')).toBeInTheDocument();
    });

    it('should maintain string type for id parameter', async () => {
      const params = Promise.resolve({ id: '999' });
      
      render(await Pokemon({ params }));
      
      const pokemonDetails = screen.getByTestId('pokemon-details');
      expect(pokemonDetails).toHaveTextContent('Pokemon Details for ID: 999');
    });
  });

  describe('Error Handling', () => {
    it('should handle rejected params promise gracefully', async () => {
      const rejectedPromise = Promise.reject(new Error('Params failed'));
      
      await expect(Pokemon({ params: rejectedPromise })).rejects.toThrow('Params failed');
    });

    it('should propagate promise rejection errors', async () => {
      const errorPromise = Promise.reject(new Error('Route error'));
      
      try {
        await Pokemon({ params: errorPromise });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Route error');
      }
    });

    it('should handle network-like errors in params', async () => {
      const networkError = Promise.reject(new Error('Failed to fetch route params'));
      
      await expect(Pokemon({ params: networkError })).rejects.toThrow('Failed to fetch route params');
    });
  });

  describe('CSS and Styling', () => {
    it('should apply te-Card class to wrapper element', async () => {
      const params = Promise.resolve({ id: 'styled' });
      
      const { container } = render(await Pokemon({ params }));
      
      expect(container.firstChild).toHaveClass('te-Card');
    });

    it('should not apply any additional classes to wrapper', async () => {
      const params = Promise.resolve({ id: 'clean' });
      
      const { container } = render(await Pokemon({ params }));
      
      const wrapperDiv = container.firstChild as Element;
      expect(wrapperDiv.className).toBe('te-Card');
    });
  });
});