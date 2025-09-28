"use client";

import { useGetPokemonsQuery } from "@/lib/redux/api/pokemonApi";
import Link from "next/link";
import Pagination from "../Pagination";

const PokemonList = ({ offset }: { offset: number | string }) => {
    const currentPage = Number(offset) || 0;

    const { data, isLoading, isError } = useGetPokemonsQuery({
        offset: currentPage * 20,
    });

    const getId = (url: string) =>
        url.split("/")[url.split("/").length - 2] || "";

    return (
        <div className="te-page-wrapper">
            <div className="te-Card te-Card--large">
                <h1 className="te-Card-title">Pokemon List</h1>

                <div className="te-Card-content te-Card-content--listing">
                    {isLoading && <p>Loading...</p>}
                    {isError && <p>Error: Failed to fetch pokemons.</p>}

                    {data?.results?.map((pokemon) => (
                        <Link
                            key={pokemon.name}
                            href={`/pokemon/${getId(pokemon.url)}`}
                        >
                            <h2>{pokemon.name}</h2>
                        </Link>
                    ))}
                </div>
            </div>
            {data?.count && (
                <Pagination
                    total={data.count}
                    perPage={20}
                    current={currentPage}
                />
            )}
        </div>
    );
};

export default PokemonList;
