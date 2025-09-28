// Basic reference interfaces
interface NamedAPIResource {
  name: string;
  url: string;
}

// Ability interfaces
interface PokemonAbility {
  ability: NamedAPIResource;
  is_hidden: boolean;
  slot: number;
}

interface PastAbility {
  abilities: {
    ability: NamedAPIResource | null;
    is_hidden: boolean;
    slot: number;
  }[];
  generation: NamedAPIResource;
}

// Cries interface
interface PokemonCries {
  latest: string;
  legacy: string;
}

// Game indices interface
interface PokemonGameIndex {
  game_index: number;
  version: NamedAPIResource;
}

// Held items interface
interface PokemonHeldItemVersion {
  rarity: number;
  version: NamedAPIResource;
}

interface PokemonHeldItem {
  item: NamedAPIResource;
  version_details: PokemonHeldItemVersion[];
}

// Move interfaces
interface MoveLearnMethod {
  name: string;
  url: string;
}

interface VersionGroup {
  name: string;
  url: string;
}

interface PokemonMoveVersion {
  level_learned_at: number;
  move_learn_method: MoveLearnMethod;
  order: number | null;
  version_group: VersionGroup;
}

interface PokemonMove {
  move: NamedAPIResource;
  version_group_details: PokemonMoveVersion[];
}

// Sprites interfaces
interface PokemonSpritesOther {
  dream_world: {
    front_default: string | null;
    front_female: string | null;
  };
  home: {
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
  };
  "official-artwork": {
    front_default: string | null;
    front_shiny: string | null;
  };
  showdown: {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
  };
}

interface GenerationSprites {
  back_default: string | null;
  back_female?: string | null;
  back_gray?: string | null;
  back_shiny?: string | null;
  back_shiny_female?: string | null;
  back_shiny_transparent?: string | null;
  back_transparent?: string | null;
  front_default: string | null;
  front_female?: string | null;
  front_gray?: string | null;
  front_shiny?: string | null;
  front_shiny_female?: string | null;
  front_shiny_transparent?: string | null;
  front_transparent?: string | null;
}

interface GenerationSpritesAnimated extends GenerationSprites {
  animated?: GenerationSprites;
}

interface PokemonSpritesVersions {
  "generation-i": {
    "red-blue": GenerationSprites;
    yellow: GenerationSprites;
  };
  "generation-ii": {
    crystal: GenerationSprites;
    gold: GenerationSprites;
    silver: GenerationSprites;
  };
  "generation-iii": {
    emerald: GenerationSprites;
    "firered-leafgreen": GenerationSprites;
    "ruby-sapphire": GenerationSprites;
  };
  "generation-iv": {
    "diamond-pearl": GenerationSprites;
    "heartgold-soulsilver": GenerationSprites;
    platinum: GenerationSprites;
  };
  "generation-v": {
    "black-white": GenerationSpritesAnimated;
  };
  "generation-vi": {
    "omegaruby-alphasapphire": GenerationSprites;
    "x-y": GenerationSprites;
  };
  "generation-vii": {
    icons: GenerationSprites;
    "ultra-sun-ultra-moon": GenerationSprites;
  };
  "generation-viii": {
    icons: GenerationSprites;
  };
}

interface PokemonSprites {
  back_default: string | null;
  back_female: string | null;
  back_shiny: string | null;
  back_shiny_female: string | null;
  front_default: string | null;
  front_female: string | null;
  front_shiny: string | null;
  front_shiny_female: string | null;
  other: PokemonSpritesOther;
  versions: PokemonSpritesVersions;
}

// Stats interface
interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

// Type interface
interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

// Main Pokemon Details interface
interface PokemonDetails {
  abilities: PokemonAbility[];
  base_experience: number;
  cries: PokemonCries;
  forms: NamedAPIResource[];
  game_indices: PokemonGameIndex[];
  height: number;
  held_items: PokemonHeldItem[];
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: PokemonMove[];
  name: string;
  order: number;
  past_abilities: PastAbility[];
  past_types: unknown[]; // Usually empty array
  species: NamedAPIResource;
  sprites: PokemonSprites;
  stats: PokemonStat[];
  types: PokemonType[];
  weight: number;
}

export type {
  PokemonDetails,
  PokemonAbility,
  PokemonMove,
  PokemonSprites,
  PokemonStat,
  PokemonType,
  NamedAPIResource
};