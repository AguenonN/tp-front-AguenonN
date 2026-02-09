import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import PokemonDetails from './screens/pokemonDetails.jsx';

createRoot(document.getElementById('root')).render(
 <BrowserRouter>
    <Routes>
        <Route path="/" element={<App />} />
        <Route path="/pokemonDetails" element={<Navigate to="/" replace />} />
        <Route path="/pokemonDetails/:name" element={<PokemonDetails />} />
    </Routes>
</BrowserRouter>
,
)
