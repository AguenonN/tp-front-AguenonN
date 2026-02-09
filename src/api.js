const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return null;
  return res.json();
}

export const api = {
  getByPage: (page) => request(`/pokemonsByPage/${page}`),
  getById: (id) => request(`/pokemons/${id}`),
  getByNameEnglish: (name) => request(`/pokemonByName/${encodeURIComponent(name)}`),

  create: (payload) =>
    request(`/pokemonCreate`, { method: "POST", body: JSON.stringify(payload) }),

  updateByEnglishName: (nameEnglish, setObject) =>
    request(`/pokemonUpdate/${encodeURIComponent(nameEnglish)}`, {
      method: "PUT",
      body: JSON.stringify({ $set: setObject }),
    }),

  deleteByEnglishName: (nameEnglish) =>
    request(`/pokemonDelete/${encodeURIComponent(nameEnglish)}`, {
      method: "DELETE",
    }),

  // Backward-compatible aliases used by existing components
  getPokemons: (page = 0) => request(`/pokemonsByPage/${page}`),
  getPokemonByName: (name) => request(`/pokemonByName/${encodeURIComponent(name)}`),
  updatePokemon: (nameEnglish, payload) =>
    request(`/pokemonUpdate/${encodeURIComponent(nameEnglish)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deletePokemon: (nameEnglish) =>
    request(`/pokemonDelete/${encodeURIComponent(nameEnglish)}`, {
      method: "DELETE",
    }),
};
