import PokemonDetails from '@/components/PokemonDetails';
import React from 'react'

const Pokemon = async ({params}: {
    params: Promise<{ id: string }>;
}) => {

    const { id } = await params

  return (
    <div className="te-Card">
        <PokemonDetails id={id} />
    </div>
  )
}

export default Pokemon
