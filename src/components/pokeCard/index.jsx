import { Link } from "react-router";
import './index.css';
import PokeTitle from "./pokeTitle";
import PokeImage from "./pokeImage";

const PokeCard = ({ pokemon }) => {
    if (!pokemon || !pokemon.name) return null;
    const mainType = (pokemon.type?.[0] || "normal").toLowerCase();
    const safeTypeClass = mainType.replace(/\s+/g, "-");
    const typeColors = {
        fire: "#ff8b4d",
        water: "#53b9ff",
        grass: "#4fe08f",
        electric: "#f6df39",
        psychic: "#ff72c1",
        dragon: "#9e8dff",
        dark: "#a6b7d8",
        ice: "#8ff2ff",
        poison: "#cd7dff",
        bug: "#8fd141",
        normal: "#90a4bf",
    };
    const typeColor = typeColors[safeTypeClass] || "#31d9ff";

    return (
        <Link
            to={`/pokemonDetails/${encodeURIComponent(pokemon.name.english)}`}
            className="poke-card-link"
        >
            <div className={`card-scene poke-theme-${safeTypeClass}`} style={{ "--type-color": typeColor }}>
                <article className="card-wrap">
                    <div className="card-layer background-art" aria-hidden="true"></div>
                    <div className="card-layer midground-effects" aria-hidden="true"></div>

                    <div className="card-layer foreground-content">
                        <div className="poke-card-header">
                            <PokeTitle name={pokemon.name.french || pokemon.name.english} />
                        </div>
                        <p className="poke-type-chip">{pokemon.type?.join(" / ")}</p>
                    </div>

                    <div className="card-layer pokemon-character">
                        <div className="poke-image-background">
                            <PokeImage imageUrl={pokemon.image} />
                        </div>
                    </div>

                    <div className="card-layer stats-layer">
                        <div className="poke-stats">
                            {pokemon.base && Object.entries(pokemon.base).map(([statName, value]) => (
                                <div className="poke-stat-row" key={statName}>
                                    <div className="stat-head">
                                        <span className="stat-label">{statName}</span>
                                        <span className="stat-value">{value}</span>
                                    </div>
                                    <div className="stat-bar">
                                        <div
                                            className="stat-bar-fill"
                                            style={{ "--stat-value": `${Math.min(100, Math.round((value / 255) * 100))}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </article>
            </div>
        </Link>
    );
};

export default PokeCard;
