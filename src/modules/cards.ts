import axios from 'axios';
import { reactive, readonly } from 'vue';

interface PokemonApi {
  name: string
  url: string
}

export interface PokemonType {
  slot: number
  type: {
    name: string
    url: string
  }
}

export interface PokemonStat {
  baseStat: number
  effort: number
  stat: {
    name: string
    url: string
  }
}

export interface Pokemon {
  id: number
  name: string
  types: PokemonType[]
  height: number
  weight: number
  sprites: {
    backDefault: string
    frontDefault: string
  }
  price: number
  stats: PokemonStat[]
}

export interface CardState {
  pokemons: Pokemon[]
  myPokemons: Pokemon[]
  categories: string[]
  busy: boolean
  nextUrl: string
}

const state: CardState = reactive({
  pokemons: [],
  myPokemons: [],
  categories: [],
  busy: false,
  nextUrl: 'https://pokeapi.co/api/v2/pokemon?limit=5&offset=0',
});

const mutations = {
  setBusy(value: boolean) {
    state.busy = value;
    if (value === true) {
      console.log('Estou ocupado');
    } else {
      console.log('Estou disponível');
    }
  },

  setNextUrl(url: string) {
    state.nextUrl = url;
  },

  processPokemon(pokemon: Pokemon) {
    const idx = state.pokemons.findIndex((p) => p.id === pokemon.id);
    if (idx > -1) {
      state.pokemons[idx] = pokemon;
    } else {
      state.pokemons.push(pokemon);
    }

    pokemon.types.forEach((type) => {
      const category = type.type.name;

      if (!state.categories.includes(category)) {
        state.categories.push(category);
      }
    });
  },

  buyPokemon(pokemon: Pokemon) {
    state.myPokemons.push(pokemon);
  },

  sellPokemon(pokemon: Pokemon) {
    state.myPokemons = state.myPokemons.filter((p) => p.id !== pokemon.id);
  },
};

const actions = {
  async loadPokemons() {
    mutations.setBusy(true);
    const res = await axios.get(state.nextUrl);

    if (res.data.next) {
      mutations.setNextUrl(res.data.next);
    }

    res.data.results.forEach((pokemon: PokemonApi) => {
      actions.loadPokemon(pokemon.url);
    });
    mutations.setBusy(false);
  },

  async loadPokemon(url: string) {
    const res = await axios.get(url);
    const pokemon: Pokemon = {
      id: res.data.id,
      name: res.data.name,
      types: res.data.types,
      height: res.data.height,
      weight: res.data.weight,
      sprites: {
        backDefault: res.data.sprites.back_default,
        frontDefault: res.data.sprites.front_default,
      },
      price: Math.ceil(Math.random() * 100),
      stats: res.data.stats.map((stat: any) => ({
        baseStat: stat.base_stat,
        effort: stat.effort,
        stat: {
          name: stat.stat.name,
          url: stat.stat.url,
        },
      })),
    };
    mutations.processPokemon(pokemon);
  },

  async loadMyPokemons(): Promise<boolean> {
    // TODO: Quando implementar API

    const key = 'pokeStore';
    const pokemons = localStorage.getItem(key);
    if (pokemons) {
      state.myPokemons = JSON.parse(pokemons);
    }

    return true;
  },

  async buyPokemon(pokemon: Pokemon): Promise<boolean> {
    // TODO: 1. fazer chamada API de compra

    mutations.buyPokemon(pokemon);

    const key = 'pokeStore';
    localStorage.setItem(key, JSON.stringify(state.myPokemons));

    return true;
  },

  async sellPokemon(pokemon: Pokemon): Promise<boolean> {
    // TODO: 1. fazer chamada API de compra

    mutations.sellPokemon(pokemon);

    const key = 'pokeStore';
    localStorage.setItem(key, JSON.stringify(state.myPokemons));

    return true;
  },
};

export default function useCards() {
  return readonly({
    state,
    mutations,
    actions,
  });
}
