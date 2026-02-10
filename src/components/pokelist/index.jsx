import { useState, useEffect } from "react";
import PokeCard from "../pokeCard";
import { api } from "../../api"; 
import './index.css';

const normalize = (value) =>
    String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

const PokeList = () => {
    const [page, setPage] = useState(0);
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [createForm, setCreateForm] = useState({
        english: "",
        french: "",
        type1: "",
        type2: "",
        hp: "50",
        attack: "50",
        defense: "50",
        specialAttack: "50",
        specialDefense: "50",
        speed: "50",
        imageUrl: "",
    });
    const [createLoading, setCreateLoading] = useState(false);
    const [createMessage, setCreateMessage] = useState("");
    const [createError, setCreateError] = useState("");

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search]);

    const trimmedSearch = debouncedSearch;
    const isSearching = trimmedSearch.length > 0;

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        const request = isSearching
            ? api.getAllPokemons()
            : api.getPokemons(page);

        request
            .then((data) => {
                if (cancelled) return;
                const list = Array.isArray(data) ? data : [];
                if (!isSearching) {
                    setPokemons(list);
                    setLoading(false);
                    return;
                }

                const query = normalize(trimmedSearch);
                const filtered = list.filter((pokemon) => {
                    const en = normalize(pokemon?.name?.english);
                    const fr = normalize(pokemon?.name?.french);
                    return en.includes(query) || fr.includes(query);
                });
                setPokemons(filtered);
                setLoading(false);
            })
            .catch((error) => {
                if (cancelled) return;
                console.error("Erreur de connexion au backend:", error);
                setPokemons([]);
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [page, isSearching, trimmedSearch]);

    const handleCreateField = (field, value) => {
        setCreateForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setCreateLoading(true);
        setCreateMessage("");
        setCreateError("");

        try {
            const payload = {
                name: {
                    english: createForm.english.trim(),
                    french: createForm.french.trim(),
                    japanese: "",
                    chinese: "",
                },
                type: [createForm.type1, createForm.type2]
                    .map((t) => t.trim())
                    .filter(Boolean),
                base: {
                    HP: Number(createForm.hp),
                    Attack: Number(createForm.attack),
                    Defense: Number(createForm.defense),
                    SpecialAttack: Number(createForm.specialAttack),
                    SpecialDefense: Number(createForm.specialDefense),
                    Speed: Number(createForm.speed),
                },
                imageUrl: createForm.imageUrl.trim(),
            };

            await api.create(payload);

            setCreateMessage("Pokémon ajouté avec succès.");
            setCreateForm({
                english: "",
                french: "",
                type1: "",
                type2: "",
                hp: "50",
                attack: "50",
                defense: "50",
                specialAttack: "50",
                specialDefense: "50",
                speed: "50",
                imageUrl: "",
            });
            setSearch("");

            const refreshed = await api.getPokemons(page);
            setPokemons(Array.isArray(refreshed) ? refreshed : []);
        } catch (error) {
            const backendMessage = String(error?.message || "");
            setCreateError(
                backendMessage
                    ? `Impossible d'ajouter le Pokémon: ${backendMessage}`
                    : "Impossible d'ajouter le Pokémon. Vérifie les champs et le lien d'image."
            );
            console.error(error);
        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <div className="poke-list-container">
            <h2>{isSearching ? `Résultat pour "${trimmedSearch}"` : `Liste des Pokémon (Page ${page + 1})`}</h2>

            <form className="pokemon-create-form" onSubmit={handleCreateSubmit}>
                <h3>Ajouter un Pokémon</h3>
                <div className="create-grid">
                    <input
                        type="text"
                        placeholder="Nom anglais (ex: Pikachu)"
                        value={createForm.english}
                        onChange={(e) => handleCreateField("english", e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Nom français (ex: Pikachu)"
                        value={createForm.french}
                        onChange={(e) => handleCreateField("french", e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Type 1 (ex: Electric)"
                        value={createForm.type1}
                        onChange={(e) => handleCreateField("type1", e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Type 2 (optionnel)"
                        value={createForm.type2}
                        onChange={(e) => handleCreateField("type2", e.target.value)}
                    />
                    <input
                        type="number"
                        min="1"
                        max="255"
                        placeholder="HP"
                        value={createForm.hp}
                        onChange={(e) => handleCreateField("hp", e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        min="1"
                        max="255"
                        placeholder="Attack"
                        value={createForm.attack}
                        onChange={(e) => handleCreateField("attack", e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        min="1"
                        max="255"
                        placeholder="Defense"
                        value={createForm.defense}
                        onChange={(e) => handleCreateField("defense", e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        min="1"
                        max="255"
                        placeholder="SpecialAttack"
                        value={createForm.specialAttack}
                        onChange={(e) => handleCreateField("specialAttack", e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        min="1"
                        max="255"
                        placeholder="SpecialDefense"
                        value={createForm.specialDefense}
                        onChange={(e) => handleCreateField("specialDefense", e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        min="1"
                        max="255"
                        placeholder="Speed"
                        value={createForm.speed}
                        onChange={(e) => handleCreateField("speed", e.target.value)}
                        required
                    />
                    <input
                        className="create-image-input"
                        type="url"
                        placeholder="Lien image à télécharger (https://...)"
                        value={createForm.imageUrl}
                        onChange={(e) => handleCreateField("imageUrl", e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={createLoading}>
                    {createLoading ? "Ajout..." : "Ajouter"}
                </button>
                {createMessage && <p className="create-message">{createMessage}</p>}
                {createError && <p className="create-error">{createError}</p>}
            </form>

            <div className="search-bar-wrapper">
                <input
                    className="search-bar"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher un Pokémon par nom (FR ou EN)"
                />
                {isSearching && (
                    <button className="clear-search-btn" onClick={() => setSearch("")}>
                        Effacer
                    </button>
                )}
            </div>

            {loading && <div className="search-status">Chargement...</div>}

            {!isSearching && (
                <div className="pagination-controls">
                    <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                        Précédent
                    </button>
                    <button onClick={() => setPage(p => p + 1)}>
                        Suivant
                    </button>
                </div>
            )}

            {!loading && pokemons.length === 0 && (
                <p className="no-result">Aucun Pokémon trouvé.</p>
            )}

            <ul className="poke-list">
                {pokemons.map((pokemon) => (
                    <PokeCard key={pokemon._id || pokemon.id} pokemon={pokemon} />
                ))}
            </ul>
        </div>
    );
};

export default PokeList;
