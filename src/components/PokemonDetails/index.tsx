"use client";
import { useGetPokemonByIdQuery } from "@/lib/redux/api/pokemonApi";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const PokemonDetails = ({ id }: { id: string }) => {
    const { data, isLoading, isError } = useGetPokemonByIdQuery({ id });

    const getHeight = (height: number) => {
        return height * 10;
    };

    const getWeight = (weight: number) => {
        return weight / 10;
    };

    return (
        <>
            {isLoading && <p>Loading...</p>}
            {isError && <p>Error: Failed to fetch pokemon.</p>}

            {data && (
                <>
                    <h1 className="te-Card-title">
                        {data?.name}
                        <Link href={'/'} className="te-Card-return">&lt;=</Link>
                    </h1>
                    <div className="te-Card-content">
                        <Image
                            src={
                                data?.sprites?.front_default || "/no-image.png"
                            }
                            alt={data.name}
                            width={96}
                            height={96}
                        />
                        <p>
                            <span>Name: </span> <span>{data.name}</span>
                        </p>
                        <p>
                            <span>Height: </span>{" "}
                            <span>{getHeight(data.height)} cm</span>
                        </p>
                        <p>
                            <span>Weight: </span>{" "}
                            <span>{getWeight(data.weight)} kg</span>
                        </p>
                        <p>
                            <span>Types: </span>
                            <span>
                                {data.types.map((type, index) => (
                                    <span key={`${type.type.name}-${index}`}>
                                        {type.type.name}
                                        {index !== data.types.length - 1 &&
                                            ", "}
                                    </span>
                                ))}
                            </span>
                        </p>
                    </div>
                </>
            )}
        </>
    );
};

export default PokemonDetails;
