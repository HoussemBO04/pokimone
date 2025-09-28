import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PokemonDetails from '../PokemonDetails';
import { useGetPokemonByIdQuery } from '../../lib/redux/api/pokemonApi';

interface PokemonSprites {
  front_default: string | null;
}

interface PokemonType {
  type: {
    name: string;
  };
}

interface PokemonDetailsResponse {
  name: string;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: PokemonType[];
}

interface QueryState {
  data?: PokemonDetailsResponse;
  isLoading: boolean;
  isError: boolean;
  refetch: jest.Mock;
  error?: { message: string };
}

jest.mock('../../lib/redux/api/pokemonApi', () => ({
  useGetPokemonByIdQuery: jest.fn(),
}));

jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height }: { 
    src: string; 
    alt: string; 
    width: number; 
    height: number; 
  }) {
    return <img src={src} alt={alt} width={width} height={height} />;
  };
});

jest.mock('next/link', () => {
  return function MockLink({ children, href, className }: { 
    children: React.ReactNode; 
    href: string; 
    className?: string; 
  }) {
    return <a href={href} className={className}>{children}</a>;
  };
});

const mockUseGetPokemonByIdQuery = useGetPokemonByIdQuery as jest.MockedFunction<typeof useGetPokemonByIdQuery>;

describe('PokemonDetails', () => {
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

      mockUseGetPokemonByIdQuery.mockReturnValue(loadingState);

      render(<PokemonDetails id="1" />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
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

      mockUseGetPokemonByIdQuery.mockReturnValue(errorState);

      render(<PokemonDetails id="1" />);

      expect(screen.getByText('Error: Failed to fetch pokemon.')).toBeInTheDocument();
    });
  });

  describe('Success State', () => {
    const mockPokemonData: PokemonDetailsResponse = {
      name: 'pikachu',
      height: 4,
      weight: 60,
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      },
      types: [
        {
          type: {
            name: 'electric',
          },
        },
      ],
    };

    it('should render pokemon details when data is loaded successfully', () => {
      const successState: QueryState = {
        data: mockPokemonData,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonByIdQuery.mockReturnValue(successState);

      render(<PokemonDetails id="25" />);

      expect(screen.getByRole('heading', { name: /pikachu/i })).toBeInTheDocument();
      expect(screen.getByText('Name:')).toBeInTheDocument();
      const nameSection = screen.getByText('Name:').parentElement;
      expect(nameSection).toHaveTextContent('pikachu');
      expect(screen.getByText('Height:')).toBeInTheDocument();
      expect(screen.getByText('40 cm')).toBeInTheDocument();
      expect(screen.getByText('Weight:')).toBeInTheDocument();
      expect(screen.getByText('6 kg')).toBeInTheDocument();
      expect(screen.getByText('Types:')).toBeInTheDocument();
      expect(screen.getByText('electric')).toBeInTheDocument();
    });

    it('should render pokemon image with correct attributes', () => {
      const successState: QueryState = {
        data: mockPokemonData,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonByIdQuery.mockReturnValue(successState);

      render(<PokemonDetails id="25" />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png');
      expect(image).toHaveAttribute('alt', 'pikachu');
      expect(image).toHaveAttribute('width', '96');
      expect(image).toHaveAttribute('height', '96');
    });

    it('should render return link with correct attributes', () => {
      const successState: QueryState = {
        data: mockPokemonData,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonByIdQuery.mockReturnValue(successState);

      render(<PokemonDetails id="25" />);

      const returnLink = screen.getByText('<=');
      expect(returnLink.closest('a')).toHaveAttribute('href', '/');
      expect(returnLink.closest('a')).toHaveClass('te-Card-return');
    });

    it('should use fallback image when sprite is null', () => {
      const dataWithNullSprite: PokemonDetailsResponse = {
        ...mockPokemonData,
        sprites: {
          front_default: null,
        },
      };

      const successState: QueryState = {
        data: dataWithNullSprite,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonByIdQuery.mockReturnValue(successState);

      render(<PokemonDetails id="25" />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', '/no-image.png');
    });

    it('should render multiple types with correct formatting', () => {
      const dataWithMultipleTypes: PokemonDetailsResponse = {
        ...mockPokemonData,
        types: [
          {
            type: {
              name: 'grass',
            },
          },
          {
            type: {
              name: 'poison',
            },
          },
        ],
      };

      const successState: QueryState = {
        data: dataWithMultipleTypes,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonByIdQuery.mockReturnValue(successState);

      render(<PokemonDetails id="1" />);

      expect(screen.getByText(/grass/)).toBeInTheDocument();
      expect(screen.getByText(/poison/)).toBeInTheDocument();
      
      const typesSection = screen.getByText('Types:').parentElement;
      expect(typesSection).toHaveTextContent('grass, poison');
    });

    it('should render single type without comma', () => {
      const successState: QueryState = {
        data: mockPokemonData,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonByIdQuery.mockReturnValue(successState);

      render(<PokemonDetails id="25" />);

      const typesSection = screen.getByText('Types:').parentElement;
      expect(typesSection).toHaveTextContent('electric');
      expect(typesSection).not.toHaveTextContent('electric,');
    });
  });

  describe('Helper Functions', () => {
    it('should convert height correctly using getHeight function', () => {
      const mockData: PokemonDetailsResponse = {
        name: 'test-pokemon',
        height: 7,
        weight: 100,
        sprites: { front_default: 'test.png' },
        types: [{ type: { name: 'fire' } }],
      };

      const successState: QueryState = {
        data: mockData,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonByIdQuery.mockReturnValue(successState);

      render(<PokemonDetails id="1" />);

      expect(screen.getByText('70 cm')).toBeInTheDocument();
    });

    it('should convert weight correctly using getWeight function', () => {
      const mockData: PokemonDetailsResponse = {
        name: 'test-pokemon',
        height: 5,
        weight: 125,
        sprites: { front_default: 'test.png' },
        types: [{ type: { name: 'water' } }],
      };

      const successState: QueryState = {
        data: mockData,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonByIdQuery.mockReturnValue(successState);

      render(<PokemonDetails id="1" />);

      expect(screen.getByText('12.5 kg')).toBeInTheDocument();
    });

    it('should handle zero values correctly', () => {
      const mockData: PokemonDetailsResponse = {
        name: 'zero-stats',
        height: 0, 
        weight: 0, 
        sprites: { front_default: 'test.png' },
        types: [{ type: { name: 'normal' } }],
      };

      const successState: QueryState = {
        data: mockData,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonByIdQuery.mockReturnValue(successState);

      render(<PokemonDetails id="1" />);

      expect(screen.getByText('0 cm')).toBeInTheDocument();
      expect(screen.getByText('0 kg')).toBeInTheDocument();
    });
  });

  describe('API Query', () => {
    it('should call API with correct id parameter', () => {
      const loadingState: QueryState = {
        data: undefined,
        isLoading: true,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonByIdQuery.mockReturnValue(loadingState);

      render(<PokemonDetails id="123" />);

      expect(mockUseGetPokemonByIdQuery).toHaveBeenCalledWith({ id: '123' });
    });

    it('should handle string id parameter correctly', () => {
      const loadingState: QueryState = {
        data: undefined,
        isLoading: true,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonByIdQuery.mockReturnValue(loadingState);

      render(<PokemonDetails id="pikachu" />);

      expect(mockUseGetPokemonByIdQuery).toHaveBeenCalledWith({ id: 'pikachu' });
    });
  });

  describe('Component Structure', () => {
    it('should render with correct CSS classes when data is available', () => {
      const mockData: PokemonDetailsResponse = {
        name: 'charizard',
        height: 17,
        weight: 905,
        sprites: { front_default: 'charizard.png' },
        types: [{ type: { name: 'fire' } }, { type: { name: 'flying' } }],
      };

      const successState: QueryState = {
        data: mockData,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonByIdQuery.mockReturnValue(successState);

      const { container } = render(<PokemonDetails id="6" />);

      expect(container.querySelector('.te-Card-title')).toBeInTheDocument();
      expect(container.querySelector('.te-Card-return')).toBeInTheDocument();
      expect(container.querySelector('.te-Card-content')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle both loading and error states', () => {
      const edgeCaseState: QueryState = {
        data: undefined,
        isLoading: true,
        isError: true,
        refetch: jest.fn(),
        error: { message: 'Network error' },
      };

      mockUseGetPokemonByIdQuery.mockReturnValue(edgeCaseState);

      render(<PokemonDetails id="1" />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByText('Error: Failed to fetch pokemon.')).toBeInTheDocument();
    });

    it('should handle empty types array', () => {
      const dataWithEmptyTypes: PokemonDetailsResponse = {
        name: 'no-type-pokemon',
        height: 10,
        weight: 50,
        sprites: { front_default: 'test.png' },
        types: [],
      };

      const successState: QueryState = {
        data: dataWithEmptyTypes,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonByIdQuery.mockReturnValue(successState);

      render(<PokemonDetails id="1" />);

      const typesSection = screen.getByText('Types:').parentElement;
      expect(typesSection).toHaveTextContent('Types:');
      expect(screen.getByRole('heading', { name: /no-type-pokemon/i })).toBeInTheDocument();
    });

    it('should not render pokemon details when data is undefined', () => {
      const noDataState: QueryState = {
        data: undefined,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonByIdQuery.mockReturnValue(noDataState);

      render(<PokemonDetails id="1" />);

      expect(screen.queryByText('Name:')).not.toBeInTheDocument();
      expect(screen.queryByText('Height:')).not.toBeInTheDocument();
      expect(screen.queryByText('Weight:')).not.toBeInTheDocument();
      expect(screen.queryByText('Types:')).not.toBeInTheDocument();
    });

    it('should handle very large numbers for height and weight', () => {
      const mockData: PokemonDetailsResponse = {
        name: 'giant-pokemon',
        height: 999, 
        weight: 9999,
        sprites: { front_default: 'giant.png' },
        types: [{ type: { name: 'steel' } }],
      };

      const successState: QueryState = {
        data: mockData,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        error: undefined,
      };

      mockUseGetPokemonByIdQuery.mockReturnValue(successState);

      render(<PokemonDetails id="1" />);

      expect(screen.getByText('9990 cm')).toBeInTheDocument();
      expect(screen.getByText('999.9 kg')).toBeInTheDocument();
    });
  });
});