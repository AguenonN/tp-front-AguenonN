import { Link } from "react-router";
import './index.css';
import PokeTitle from "./pokeTitle";
import PokeImage from "./pokeImage";

const PokeCard = ({ pokemon }) => {
    if (!pokemon || !pokemon.name) return null;
    const mainType = (pokemon.type?.[0] || "normal").toLowerCase();
    const safeTypeClass = mainType.replace(/\s+/g, "-");

    const statIcons = {
        HP: "❤",
        Attack: "⚔️",
        Defense: "🛡️",
        SpecialAttack: "✦",
        SpecialDefense: "◈",
        Speed: "⚡",
    };

    return (
        <Link
            to={`/pokemonDetails/${encodeURIComponent(pokemon.name.english)}`}
            className="poke-card-link"
        >
            <div className={`poke-card poke-theme-${safeTypeClass}`}>
                <span className="adinkra-mark adinkra-top-left" aria-hidden="true">✶</span>
                <span className="adinkra-mark adinkra-bottom-right" aria-hidden="true">✶</span>

                <div className="poke-card-header">
                    <PokeTitle name={pokemon.name.french || pokemon.name.english} />
                </div>

                <p className="poke-type-chip">{pokemon.type?.join(" / ")}</p>
                
                <div className="poke-image-background">
                    <PokeImage imageUrl={pokemon.image} />
                </div>

                <div className="poke-stats">
                    {pokemon.base && Object.entries(pokemon.base).map(([statName, value]) => (
                        <div className="poke-stat-row" key={statName}>
                            <span className="stat-label">
                                <span className="stat-icon" aria-hidden="true">{statIcons[statName] || "•"}</span>
                                {statName}
                            </span>
                            <span className="stat-value">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Link>
    );
};

export default PokeCard;
