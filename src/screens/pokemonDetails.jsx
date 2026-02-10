import { Link, useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { api } from '../api';
import './pokemonDetails.css';

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

    if (loading) return <p className="details-loading">Chargement...</p>;

    return (
        <div className="details-view">
            <div className="details-card">
                <div className="details-page-label">Page 1</div>

                <div className="details-name-panel">
                    <h1 className="details-name">{pokemon.name.french}</h1>
                    <p className="details-name-en">({pokemon.name.english})</p>
                </div>

                <p className="details-type">{pokemon.type.join(" / ")}</p>

                <div className="details-image-panel">
                    <img src={pokemon.image} alt={pokemon.name.english} className="details-image" />
                </div>

                {!isEditing ? (
                    <div className="info">
                        <div className="stats-grid">
                            {Object.entries(pokemon.base).map(([k, v]) => (
                                <div className="stat-row" key={k}>
                                    <span className="stat-left">{k}</span>
                                    <span className="stat-right">{v}</span>
                                </div>
                            ))}
                        </div>
                        <div className="details-actions">
                            <button className="details-btn" onClick={() => setIsEditing(true)}>Modifier les Stats</button>
                            <button className="details-btn details-btn-danger" onClick={handleDelete}>Supprimer</button>
                        </div>
                    </div>
                ) : (
                    <form className="details-form" onSubmit={handleUpdate}>
                        {Object.entries(formData).map(([k, v]) => (
                            <div key={k} className="form-row">
                                <label>{k}</label>
                                <input 
                                    type="number" 
                                    value={v} 
                                    onChange={(e) => setFormData({...formData, [k]: parseInt(e.target.value || 0, 10)})}
                                />
                            </div>
                        ))}
                        <div className="details-actions">
                            <button className="details-btn" type="submit">Sauvegarder</button>
                            <button className="details-btn details-btn-secondary" type="button" onClick={() => setIsEditing(false)}>Annuler</button>
                        </div>
                    </form>
                )}

                <Link className="details-back-link" to="/">Retour au Pokédex</Link>
            </div>
        </div>
    );
};

export default PokemonDetails;
