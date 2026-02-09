import { useState, useEffect } from "react";
import PokeCard from "../pokeCard";
import { api } from "../../api"; 
import './index.css';

const PokeList = () => {
    const [page, setPage] = useState(0);
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.getPokemons(page)
            .then((data) => {
                setPokemons(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erreur de connexion au backend:", error);
                setLoading(false);
            });
    }, [page]);

    if (loading) return <div className="loader">Chargement du Pokédex local...</div>;

    return (
        <div className="poke-list-container">
            <h2>Liste des Pokémon (Page {page + 1})</h2>
            
            <div className="pagination-controls">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                    Précédent
                </button>
                <button onClick={() => setPage(p => p + 1)}>
                    Suivant
                </button>
            </div>

            <ul className="poke-list">
                {pokemons.map((pokemon) => (
                    <PokeCard key={pokemon._id || pokemon.id} pokemon={pokemon} />
                ))}
            </ul>
        </div>
    );
};

export default PokeList;