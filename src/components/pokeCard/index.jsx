import { Link } from "react-router";
import './index.css';
import PokeTitle from "./pokeTitle";
import PokeImage from "./pokeImage";

const PokeCard = ({ pokemon }) => {
    if (!pokemon || !pokemon.name) return null;

    return (
        <Link to={`/pokemonDetails/${encodeURIComponent(pokemon.name.english)}`}>
            <div className="poke-card">
                <div className="poke-card-header">
                    <PokeTitle name={pokemon.name.french || pokemon.name.english} />
                </div>
                
                <div className="poke-image-background">
                    <PokeImage imageUrl={pokemon.image} />
                </div>

                <div className="poke-stats">
                    {pokemon.base && Object.entries(pokemon.base).map(([statName, value]) => (
                        <div className="poke-stat-row" key={statName}>
                            <span className="stat-label">{statName}</span>
                            <span className="stat-value">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Link>
    );
};

export default PokeCard;