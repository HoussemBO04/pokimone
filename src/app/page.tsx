import PokemonList from "@/components/PokemonList";

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ offset: string | number }>;
}) {
    const { offset } = await searchParams;

    return (
        <PokemonList offset={offset} />
    );
}
