import { Link, useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { api } from '../api';
import { clearIntegrityLock, getIntegrityLock, setIntegrityLock } from '../utils/integrityLock';
import './pokemonDetails.css';

const PokemonDetails = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [auditLogs, setAuditLogs] = useState([]);
    const [simulateCorruption, setSimulateCorruption] = useState(false);

    const loadDetails = async () => {
        const decoded = decodeURIComponent(name);
        const [pokemonData, logsData] = await Promise.all([
            api.getPokemonByName(decoded),
            api.getPokemonAuditLogs(decoded, 30),
        ]);

        setPokemon(pokemonData);
        setFormData(pokemonData?.base || {});
        setAuditLogs(Array.isArray(logsData) ? logsData : []);
    };

    useEffect(() => {
        loadDetails()
            .catch((error) => {
                console.error('Erreur lors du chargement de la fiche:', error);
            })
            .finally(() => setLoading(false));
    }, [name]);

    useEffect(() => {
        const lock = getIntegrityLock();
        const currentName = decodeURIComponent(name || '');
        if (!lock?.pokemonName) return;

        const locked = String(lock.pokemonName).toLowerCase();
        const current = String(currentName).toLowerCase();
        if (locked !== current) {
            alert(`La clé du Pokémon ${lock.pokemonName} est corrompue. Accès restreint.`);
            navigate(`/integrity-alert?pokemon=${encodeURIComponent(lock.pokemonName)}`, { replace: true });
            return;
        }
        setSimulateCorruption(true);
    }, [name, navigate]);

    const handleDelete = async () => {
        if (window.confirm('Supprimer ce Pokémon ?')) {
            await api.deletePokemon(pokemon.name.english);
            navigate('/');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const updated = await api.updatePokemon(pokemon.name.english, { base: formData });
        setPokemon(updated);
        setIsEditing(false);
        const logs = await api.getPokemonAuditLogs(pokemon.name.english, 30);
        setAuditLogs(Array.isArray(logs) ? logs : []);
    };

    if (loading) return <p className="details-loading">Chargement...</p>;
    if (!pokemon) return <p className="details-loading">Pokémon introuvable.</p>;

    const integrityHash = String(pokemon.integrityHash || '');
    const isIntegrityValid = Boolean(integrityHash) && !simulateCorruption;

    const handleToggleCorruption = () => {
        if (simulateCorruption) {
            clearIntegrityLock();
            setSimulateCorruption(false);
            return;
        }
        setIntegrityLock(pokemon.name.english);
        setSimulateCorruption(true);
        navigate(`/integrity-alert?pokemon=${encodeURIComponent(pokemon.name.english)}`);
    };

    return (
        <div className="details-view">
            <div className={`details-card ${isIntegrityValid ? '' : 'details-corrupted'}`.trim()}>
                <div className="details-page-label">Page 1</div>

                <div className="details-name-panel">
                    <h1 className="details-name">{pokemon.name.french}</h1>
                    <p className="details-name-en">({pokemon.name.english})</p>
                </div>

                <p className="details-type">{pokemon.type.join(' / ')}</p>

                <section className="integrity-seal-box">
                    <p className={`integrity-seal ${isIntegrityValid ? 'integrity-valid' : 'integrity-invalid'}`}>
                        Sceau d'Intégrité
                    </p>
                    <code className="integrity-hash">{integrityHash || 'hash indisponible'}</code>
                    <button
                        className="details-btn details-btn-secondary"
                        type="button"
                        onClick={handleToggleCorruption}
                    >
                        {simulateCorruption ? 'Retirer Corruption' : 'Simuler Corruption'}
                    </button>
                </section>

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
                                    onChange={(e) => setFormData({ ...formData, [k]: parseInt(e.target.value || 0, 10) })}
                                />
                            </div>
                        ))}
                        <div className="details-actions">
                            <button className="details-btn" type="submit">Sauvegarder</button>
                            <button className="details-btn details-btn-secondary" type="button" onClick={() => setIsEditing(false)}>Annuler</button>
                        </div>
                    </form>
                )}

                <section className="audit-trail-box">
                    <h3>Audit Trail</h3>
                    <div className="audit-scroll">
                        <div className="audit-track">
                            {(auditLogs.length ? [...auditLogs, ...auditLogs] : [{ event: 'NO_LOGS', statusCode: 0, action: 'NONE' }]).map((log, idx) => (
                                <pre className="audit-line" key={`${log._id || 'audit'}-${idx}`}>
{JSON.stringify(log, null, 2)}
                                </pre>
                            ))}
                        </div>
                    </div>
                </section>

                <Link className="details-back-link" to="/">Retour au Pokédex</Link>
            </div>
        </div>
    );
};

export default PokemonDetails;
