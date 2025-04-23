import { useState, useEffect } from 'react'
import './App.css'
import PokemonList from "./PokemonList"
import Battle from './battle';
import BattleHistory from './BattleHistory';

function App() {

  const [battles, setBattles] = useState([]);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/team")
      .then((res) => res.json())
      .then((data) => setTeam(data))
      .catch((error) => console.error("Error fetching team:", error));
  }, []);

  // Fetch initial battle history
  useEffect(() => {
    fetch("http://localhost:3001/battles")
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setBattles(sorted);
      });
  }, []);


    return (
      <div>
        <h1>My Pokédex</h1>
        <PokemonList team={team} setTeam={setTeam}/>
        <Battle battles={battles} setBattles={setBattles} team={team} />
        <BattleHistory battles={battles}/>
      </div>
    );
  }

export default App
