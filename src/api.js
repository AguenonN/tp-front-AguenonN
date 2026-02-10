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

async function requestNullable(path, options = {}) {
  try {
    return await request(path, options);
  } catch (error) {
    if (String(error?.message || "").includes("HTTP 404")) {
      return null;
    }
    throw error;
  }
}

export const api = {
  getByPage: (page) => request(`/pokemonsByPage/${page}`),
  getAll: () => request(`/pokemons`),
  getById: (id) => request(`/pokemons/${id}`),
  getByNameEnglish: (name) => request(`/pokemonByName/${encodeURIComponent(name)}`),
  getExactByAnyName: (name) => requestNullable(`/pokemonExactByName/${encodeURIComponent(name)}`),
  searchByName: (name) => request(`/pokemonsSearch?name=${encodeURIComponent(name)}`),
  getAuditLogsByName: (name, limit = 20) =>
    request(`/auditLogs/${encodeURIComponent(name)}?limit=${encodeURIComponent(limit)}`),

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
  purgePokedex: () =>
    request(`/pokemonsPurge`, {
      method: "DELETE",
    }),

  // Backward-compatible aliases used by existing components
  getAllPokemons: () => request(`/pokemons`),
  getPokemons: (page = 0) => request(`/pokemonsByPage/${page}`),
  getPokemonByName: (name) => request(`/pokemonByName/${encodeURIComponent(name)}`),
  getExactPokemonByAnyName: (name) => requestNullable(`/pokemonExactByName/${encodeURIComponent(name)}`),
  searchPokemonsByName: (name) => request(`/pokemonsSearch?name=${encodeURIComponent(name)}`),
  getPokemonAuditLogs: (name, limit = 20) =>
    request(`/auditLogs/${encodeURIComponent(name)}?limit=${encodeURIComponent(limit)}`),
  createPokemon: (payload) =>
    request(`/pokemonCreate`, { method: "POST", body: JSON.stringify(payload) }),
  updatePokemon: (nameEnglish, payload) =>
    request(`/pokemonUpdate/${encodeURIComponent(nameEnglish)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deletePokemon: (nameEnglish) =>
    request(`/pokemonDelete/${encodeURIComponent(nameEnglish)}`, {
      method: "DELETE",
    }),
  purgePokemons: () =>
    request(`/pokemonsPurge`, {
      method: "DELETE",
    }),
};
