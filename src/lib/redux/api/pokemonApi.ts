import {
  GetPokemonByIdParams,
  GetPokemonsParams,
  PokemonListResponse,
} from "@/lib/types/pokemon";
import { PokemonDetails } from "@/lib/types/pokemonDetails";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pokemonApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API || "https://pokeapi.co/api/v2",
  }),

  endpoints: (builder) => ({
    getPokemons: builder.query<PokemonListResponse, GetPokemonsParams>({
      query: ({ offset = 0, limit = 20 }) => ({
        url: `/pokemon?offset=${offset}&limit=${limit}`,
      }),
    }),
    getPokemonById: builder.query<PokemonDetails, GetPokemonByIdParams>({
      query: ({ id }) => ({ url: `/pokemon/${id}` }),
    }),
  }),
});

export const { useGetPokemonsQuery, useGetPokemonByIdQuery } = pokemonApi;

// export endpoints for use in SSR
export const { getPokemons, getPokemonById } = pokemonApi.endpoints;
