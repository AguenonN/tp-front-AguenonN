import { Link, useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { api } from '../api';

const PokemonDetails = () => { 
    const { name } = useParams();
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        api.getPokemonByName(decodeURIComponent(name))
            .then(data => {
                setPokemon(data);
                setFormData(data.base);
                setLoading(false);
            });
    }, [name]);

    const handleDelete = async () => {
        if (window.confirm("Supprimer ce Pokémon ?")) {
            await api.deletePokemon(pokemon.name.english);
            navigate('/');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const updated = await api.updatePokemon(pokemon.name.english, { base: formData });
        setPokemon(updated);
        setIsEditing(false);
    };

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="details-view">
            <h1>{pokemon.name.french} ({pokemon.name.english})</h1>
            <img src={pokemon.image} alt={pokemon.name.english} width="200" />
            
            {!isEditing ? (
                <div className="info">
                    <div className="stats-grid">
                        {Object.entries(pokemon.base).map(([k, v]) => <p key={k}>{k}: {v}</p>)}
                    </div>
                    <button onClick={() => setIsEditing(true)}>Modifier les Stats</button>
                    <button onClick={handleDelete} className="danger">Supprimer</button>
                </div>
            ) : (
                <form onSubmit={handleUpdate}>
                    {Object.entries(formData).map(([k, v]) => (
                        <div key={k}>
                            <label>{k}: </label>
                            <input 
                                type="number" 
                                value={v} 
                                onChange={(e) => setFormData({...formData, [k]: parseInt(e.target.value)})}
                            />
                        </div>
                    ))}
                    <button type="submit">Sauvegarder</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Annuler</button>
                </form>
            )}
            <br />
            <Link to="/">Retour au Pokédex</Link>
        </div>
    );
};

export default PokemonDetails;