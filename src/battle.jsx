import React, { useState, useEffect } from "react";

const fetchPokemonStats = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return {
    name: data.name,
    hp: data.stats[0].base_stat,
    attack: data.stats[1].base_stat,
    defense: data.stats[2].base_stat,
    sprite: data.sprites.front_default, // Add sprite URL
  };
};

const simulateBattle = (poke1, poke2) => {
  const score1 = poke1.attack - poke2.defense + poke1.hp;
  const score2 = poke2.attack - poke1.defense + poke2.hp;

  if (score1 > score2) return poke1.name;
  else if (score2 > score1) return poke2.name;
  else return "draw";
};

const saveBattleResult = async (poke1, poke2, winner) => {
  await fetch("http://localhost:3001/battles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      player1: poke1.name,
      player2: poke2.name,
      winner,
      date: new Date().toISOString(),
    }),
  });
};

const Battle = ({ battles, setBattles, team }) => {
  // const [team, setTeam] = useState([]);
  const [poke1, setPoke1] = useState("");
  const [poke2, setPoke2] = useState("");
  const [poke1Data, setPoke1Data] = useState(null);
  const [poke2Data, setPoke2Data] = useState(null);

  // useEffect(() => {
  //   fetch("http://localhost:3001/team")
  //     .then((res) => res.json())
  //     .then((data) => setTeam(data));
  // }, []);

  const handleBattle = async () => {
    const p1 = await fetchPokemonStats(poke1);
    const p2 = await fetchPokemonStats(poke2);
    const winner = simulateBattle(p1, p2);
    const newBattle = {
      player1: p1.name,
      player2: p2.name,
      winner,
      date: new Date().toISOString(),
    };
    await saveBattleResult(p1, p2, winner);
    setBattles([newBattle, ...battles]);
    alert(`${p1.name} vs ${p2.name} — 🏆 Winner: ${winner}`);
  };

  const handlePoke1Change = async (url) => {
    setPoke1(url);
    if (url) {
      const data = await fetchPokemonStats(url);
      setPoke1Data(data);
    } else {
      setPoke1Data(null);
    }
  };

  const handlePoke2Change = async (url) => {
    setPoke2(url);
    if (url) {
      const data = await fetchPokemonStats(url);
      setPoke2Data(data);
    } else {
      setPoke2Data(null);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Battle Simulator</h2>
      <div className="card p-4 shadow-lg">
        <div className="row mb-3">
          {/* Pokémon 1 Selection */}
          <div className="col-md-6 text-center">
            <label htmlFor="poke1" className="form-label">
              Select Pokémon 1:
            </label>
            <select
              id="poke1"
              className="form-select mb-3"
              value={poke1}
              onChange={(e) => handlePoke1Change(e.target.value)}
            >
              <option value="">Select Pokémon 1</option>
              {team.map((p) => (
                <option key={p.id} value={p.url}>
                  {p.name}
                </option>
              ))}
            </select>
            {poke1Data && (
              <div>
                <img
                  src={poke1Data.sprite}
                  alt={poke1Data.name}
                  className="img-fluid"
                  style={{ maxWidth: "150px" }}
                />
                <p>{poke1Data.name.toUpperCase()}</p>
                <p>HP: {poke1Data.hp}</p>
                <p>Attack: {poke1Data.attack}</p>
                <p>Defense: {poke1Data.defense}</p>
              </div>
            )}
          </div>

          {/* Pokémon 2 Selection */}
          <div className="col-md-6 text-center">
            <label htmlFor="poke2" className="form-label">
              Select Pokémon 2:
            </label>
            <select
              id="poke2"
              className="form-select mb-3"
              value={poke2}
              onChange={(e) => handlePoke2Change(e.target.value)}
            >
              <option value="">Select Pokémon 2</option>
              {team.map((p) => (
                <option key={p.id} value={p.url}>
                  {p.name}
                </option>
              ))}
            </select>
            {poke2Data && (
              <div>
                <img
                  src={poke2Data.sprite}
                  alt={poke2Data.name}
                  className="img-fluid"
                  style={{ maxWidth: "150px" }}
                />
                <p>{poke2Data.name.toUpperCase()}</p>
                <p>HP: {poke2Data.hp}</p>
                <p>Attack: {poke2Data.attack}</p>
                <p>Defense: {poke2Data.defense}</p>
              </div>
            )}
          </div>
        </div>

        {/* Battle Button */}
        <div className="text-center">
          <button
            className="btn btn-primary w-50"
            onClick={handleBattle}
            disabled={!poke1 || !poke2}
          >
            Battle!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Battle;