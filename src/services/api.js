const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { supabase } from "./supabase";

export const api = {
  // MLP API functions
  async getCharacters(limit = 555, offset = 0) {
    const response = await fetch(
      `${BASE_URL}/character/all?limit=${limit}&offset=${offset}`,
      {
        mode: "cors",
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.json();
  },

  async getCharacterById(id) {
    const response = await fetch(`${BASE_URL}/character/${id}`, {
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    });
    return response.json();
  },

  async getEpisodes(limit = 250, offset = 0) {
    const response = await fetch(
      `${BASE_URL}/episode/all?limit=${limit}&offset=${offset}`,
      {
        mode: "cors",
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.json();
  },

  async getEpisodeById(id) {
    const response = await fetch(`${BASE_URL}/episode/${id}`, {
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    });
    return response.json();
  },

  async getSongs(limit = 200, offset = 0) {
    const response = await fetch(
      `${BASE_URL}/song/all?limit=${limit}&offset=${offset}`,
      {
        mode: "cors",
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.json();
  },

  async getSongById(id) {
    const response = await fetch(`${BASE_URL}/song/${id}`, {
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    });
    return response.json();
  },

  async searchCharacters(query) {
    // Instead of searching by kind directly, we'll filter from all characters
    const response = await this.getCharacters(200); // Get a larger set of characters
    const characters = response.data || [];

    // Filter characters based on the kind
    return {
      ...response,
      data: characters.filter((character) =>
        character.kind?.some((k) =>
          k.toLowerCase().includes(query.toLowerCase())
        )
      ),
    };
  },

  async searchEpisodes(query) {
    const response = await this.getEpisodes();
    const data = response;
    const searchTerm = query.toLowerCase();

    return {
      ...data,
      data: data.data?.filter(
        (episode) =>
          episode.name.toLowerCase().includes(searchTerm) ||
          episode.writtenby?.toLowerCase().includes(searchTerm) ||
          episode.storyby?.toLowerCase().includes(searchTerm)
      ),
    };
  },

  async searchSongs(query) {
    const response = await fetch(`${BASE_URL}/song/${query}`, {
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    });
    return response.json();
  },

  // Pony CRUD operations
  async createPony(ponyData) {
    const { data, error } = await supabase
      .from("ponies")
      .insert([ponyData])
      .select();

    if (error) throw error;
    return data[0];
  },

  async updatePony(id, ponyData) {
    const { data, error } = await supabase
      .from("ponies")
      .update(ponyData)
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  },

  async deletePony(id) {
    const { error } = await supabase.from("ponies").delete().eq("id", id);

    if (error) throw error;
    return true;
  },

  async getPonies() {
    const { data, error } = await supabase
      .from("ponies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getPonyById(id) {
    const { data, error } = await supabase
      .from("ponies")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },
};
