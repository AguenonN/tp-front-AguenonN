import { Link, useNavigate, useSearchParams } from "react-router";
import { api } from "../api";
import { clearIntegrityLock, getIntegrityLock } from "../utils/integrityLock";
import "./integrityAlert.css";

const IntegrityAlert = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lock = getIntegrityLock();

  const pokemonName = searchParams.get("pokemon") || lock?.pokemonName || "Inconnu";

  const handlePurge = async () => {
    if (!window.confirm("Confirmer la suppression totale du Pokédex ?")) return;

    try {
      await api.purgePokedex();
      clearIntegrityLock();
      navigate("/");
    } catch (error) {
      alert(`Échec de purge: ${String(error?.message || error)}`);
    }
  };

  const handleKeepQuarantine = () => {
    navigate("/");
  };

  const handleRestore = () => {
    clearIntegrityLock();
    navigate(`/pokemonDetails/${encodeURIComponent(pokemonName)}`);
  };

  return (
    <main className="integrity-alert-page">
      <section className="integrity-alert-card">
        <h1>Clé Corrompue Détectée</h1>
        <p>
          La clé d'intégrité du Pokémon <strong>{pokemonName}</strong> est signalée comme corrompue.
        </p>
        <p>Souhaitez-vous supprimer le Pokédex pour préserver l'intégrité du site ?</p>

        <div className="integrity-alert-actions">
          <button onClick={handlePurge} className="alert-danger">Oui, supprimer le Pokédex</button>
          <button onClick={handleKeepQuarantine}>Non, maintenir la quarantaine</button>
          <button onClick={handleRestore}>Rétablir l'intégrité</button>
        </div>

        <Link to="/" className="integrity-back-link">Retour</Link>
      </section>
    </main>
  );
};

export default IntegrityAlert;
