import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PokemonList from '../PokemonList';
import { useGetPokemonsQuery } from '../../lib/redux/api/pokemonApi';

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonListResponse {
  count?: number;
  results: Pokemon[];
}

interface QueryState {
  data?: PokemonListResponse;
  isLoading: boolean;
  isError: boolean;
  refetch: jest.Mock;
  error?: { message: string };
}

jest.mock('../../lib/redux/api/pokemonApi', () => ({
  useGetPokemonsQuery: jest.fn(),
}));

jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('../Pagination', () => {
  return function MockPagination({ total, perPage, current }: { total: number; perPage: number; current: number }) {
    return (
      <div data-testid="pagination">
        Pagination: total={total}, perPage={perPage}, current={current}
      </div>
    );
  };
});

const mockUseGetPokemonsQuery = useGetPokemonsQuery as jest.MockedFunction<typeof useGetPokemonsQuery>;

describe('PokemonList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should display loading message when data is loading', () => {
      const loadingState: QueryState = {
        data: undefined,
        isLoading: true,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonsQuery.mockReturnValue(loadingState);

      render(<PokemonList offset={0} />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByText('Pokemon List')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when there is an error', () => {
      const errorState: QueryState = {
        data: undefined,
        isLoading: false,
        isError: true,
        refetch: jest.fn(),
        error: { message: 'Network error' },
      };

      mockUseGetPokemonsQuery.mockReturnValue(errorState);

      render(<PokemonList offset={0} />);

      expect(screen.getByText('Error: Failed to fetch pokemons.')).toBeInTheDocument();
      expect(screen.getByText('Pokemon List')).toBeInTheDocument();
    });
  });

  describe('Success State', () => {
    const mockPokemonData: PokemonListResponse = {
      count: 1118,
      results: [
        {
          name: 'bulbasaur',
          url: 'https://pokeapi.co/api/v2/pokemon/1/',
        },
        {
          name: 'ivysaur',
          url: 'https://pokeapi.co/api/v2/pokemon/2/',
        },
        {
          name: 'venusaur',
          url: 'https://pokeapi.co/api/v2/pokemon/3/',
        },
      ],
    };

    it('should render pokemon list when data is loaded successfully', () => {
      const successState: QueryState = {
        data: mockPokemonData,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonsQuery.mockReturnValue(successState);

      render(<PokemonList offset={0} />);

      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('ivysaur')).toBeInTheDocument();
      expect(screen.getByText('venusaur')).toBeInTheDocument();
    });

    it('should render correct links for each pokemon', () => {
      const successState: QueryState = {
        data: mockPokemonData,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonsQuery.mockReturnValue(successState);

      render(<PokemonList offset={0} />);

      const bulbasaurLink = screen.getByText('bulbasaur').closest('a');
      const ivysaurLink = screen.getByText('ivysaur').closest('a');
      const venusaurLink = screen.getByText('venusaur').closest('a');

      expect(bulbasaurLink).toHaveAttribute('href', '/pokemon/1');
      expect(ivysaurLink).toHaveAttribute('href', '/pokemon/2');
      expect(venusaurLink).toHaveAttribute('href', '/pokemon/3');
    });

    it('should render pagination when data has count', () => {
      const successState: QueryState = {
        data: mockPokemonData,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonsQuery.mockReturnValue(successState);

      render(<PokemonList offset={0} />);

      const pagination = screen.getByTestId('pagination');
      expect(pagination).toBeInTheDocument();
      expect(pagination).toHaveTextContent('Pagination: total=1118, perPage=20, current=0');
    });

    it('should not render pagination when data has no count', () => {
      const dataWithoutCount: PokemonListResponse = {
        results: mockPokemonData.results,
      };

      const stateWithoutCount: QueryState = {
        data: dataWithoutCount,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonsQuery.mockReturnValue(stateWithoutCount);

      render(<PokemonList offset={0} />);

      expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });
  });

  describe('Offset Handling', () => {
    it('should call API with correct offset when offset is 0', () => {
      const loadingState: QueryState = {
        data: undefined,
        isLoading: true,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonsQuery.mockReturnValue(loadingState);

      render(<PokemonList offset={0} />);

      expect(mockUseGetPokemonsQuery).toHaveBeenCalledWith({
        offset: 0,
      });
    });

    it('should call API with correct offset when offset is a number', () => {
      const loadingState: QueryState = {
        data: undefined,
        isLoading: true,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonsQuery.mockReturnValue(loadingState);

      render(<PokemonList offset={5} />);

      expect(mockUseGetPokemonsQuery).toHaveBeenCalledWith({
        offset: 100,
      });
    });

    it('should call API with correct offset when offset is a string', () => {
      const loadingState: QueryState = {
        data: undefined,
        isLoading: true,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonsQuery.mockReturnValue(loadingState);

      render(<PokemonList offset="3" />);

      expect(mockUseGetPokemonsQuery).toHaveBeenCalledWith({
        offset: 60,
      });
    });

    it('should handle invalid string offset and default to 0', () => {
      const loadingState: QueryState = {
        data: undefined,
        isLoading: true,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonsQuery.mockReturnValue(loadingState);

      render(<PokemonList offset="invalid" />);

      expect(mockUseGetPokemonsQuery).toHaveBeenCalledWith({
        offset: 0,
      });
    });
  });

  describe('getId Helper Function', () => {
    it('should extract correct ID from Pokemon URL', () => {
      const mockDataWithDifferentUrl: PokemonListResponse = {
        count: 1,
        results: [
          {
            name: 'charizard',
            url: 'https://pokeapi.co/api/v2/pokemon/6/',
          },
        ],
      };

      const successState: QueryState = {
        data: mockDataWithDifferentUrl,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonsQuery.mockReturnValue(successState);

      render(<PokemonList offset={0} />);

      const charizardLink = screen.getByText('charizard').closest('a');
      expect(charizardLink).toHaveAttribute('href', '/pokemon/6');
    });

    it('should handle malformed URL gracefully', () => {
      const mockDataWithMalformedUrl: PokemonListResponse = {
        count: 1,
        results: [
          {
            name: 'test-pokemon',
            url: 'invalid-url',
          },
        ],
      };

      const successState: QueryState = {
        data: mockDataWithMalformedUrl,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonsQuery.mockReturnValue(successState);

      render(<PokemonList offset={0} />);

      const testPokemonLink = screen.getByText('test-pokemon').closest('a');
      expect(testPokemonLink).toHaveAttribute('href', '/pokemon/');
    });
  });

  describe('Component Structure', () => {
    it('should render with correct CSS classes', () => {
      const mockData: PokemonListResponse = {
        count: 10,
        results: [{ name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }],
      };

      const successState: QueryState = {
        data: mockData,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonsQuery.mockReturnValue(successState);

      const { container } = render(<PokemonList offset={0} />);

      expect(container.querySelector('.te-page-wrapper')).toBeInTheDocument();
      expect(container.querySelector('.te-Card.te-Card--large')).toBeInTheDocument();
      expect(container.querySelector('.te-Card-title')).toBeInTheDocument();
      expect(container.querySelector('.te-Card-content.te-Card-content--listing')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty results array', () => {
      const emptyData: PokemonListResponse = {
        count: 0,
        results: [],
      };

      const emptyState: QueryState = {
        data: emptyData,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonsQuery.mockReturnValue(emptyState);

      render(<PokemonList offset={0} />);

      expect(screen.getByText('Pokemon List')).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.queryByText('Error: Failed to fetch pokemons.')).not.toBeInTheDocument();
    });

    it('should handle both loading and error states (edge case)', () => {
      const edgeCaseState: QueryState = {
        data: undefined,
        isLoading: true,
        isError: true,
        refetch: jest.fn(),
        error: { message: 'Network error' },
      };

      mockUseGetPokemonsQuery.mockReturnValue(edgeCaseState);

      render(<PokemonList offset={0} />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByText('Error: Failed to fetch pokemons.')).toBeInTheDocument();
    });
  });
});