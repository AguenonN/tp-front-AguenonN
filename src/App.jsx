import "./App.css";
import Pokelist from "./components/pokelist";
import bronzeSeal from "../Bronze-image.png";

function App() {
  return (
    <div className="app-shell">
      <header className="royal-header">
        <div className="benin-flag" aria-label="Drapeau du Bénin">
          <div className="benin-green"></div>
          <div className="benin-right">
            <div className="benin-yellow"></div>
            <div className="benin-red"></div>
          </div>
        </div>

        <h1 className="royal-title">Dahomey Pokedex</h1>

        <div className="bronze-seal-wrap" aria-hidden="true">
          <img src={bronzeSeal} alt="" className="bronze-seal" />
        </div>
      </header>

      <Pokelist></Pokelist>
    </div>
  );
}

export default App;
