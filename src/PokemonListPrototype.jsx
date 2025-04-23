import React, { useEffect, useState } from "react";

const PokemonList = () => {
  const [pokemon, setPokemon] = useState([]);
  const [team, setTeam] = useState([]);
  const [page, setPage] = useState(1); // State for pagination
  const [search, setSearch] = useState(""); // State for search query

  useEffect(() => {
    const fetchPokemon = async () => {
      const limit = 20; // Number of Pokémon per page
      const offset = (page - 1) * limit; // Calculate offset for pagination
      const url = search
        ? `https://pokeapi.co/api/v2/pokemon?limit=1000` // Fetch all Pokémon for search
        : `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

      const response = await fetch(url);
      const data = await response.json();

      if (search) {
        // Filter Pokémon by search query
        const filteredPokemon = data.results.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
        setPokemon(filteredPokemon);
      } else {
        setPokemon(data.results);
      }
    };

    fetchPokemon();

    const fetchTeam = async () => {
      const response = await fetch("http://localhost:3001/team");
      const data = await response.json();
      setTeam(data); // Update the team state
    };
  
    fetchTeam();




  }, [page, search]); // Re-run effect when page or search changes



  const addToTeam = async (poke) => {
    if (team.length >= 6) {
      alert("Your team is full! (Max 6 Pokémon)");
      return;
    }

    const response = await fetch("http://localhost:3001/team", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(poke),
    });

    const data = await response.json();
    setTeam([...team, data]);
  };

  const removeFromTeam = async (id) => {
    await fetch(`http://localhost:3001/team/${id}`, {
      method: "DELETE",
    });
    setTeam(team.filter((pokemon) => pokemon.id !== id));
  };

  return (
    <div>
      <h2>Pokémon List</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search Pokémon"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul>
        {pokemon.map((p, index) => (
          <li key={index}>
            {p.name}{" "}
            <button onClick={() => addToTeam(p)}>Add to Team</button>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
          Previous
        </button>
        <span> Page {page} </span>
        <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
      </div>

      <h2>Your Team</h2>
      <ul>
        {team.map((pokemon) => (
          <li key={pokemon.id}>
            {pokemon.name}{" "}
            <button onClick={() => removeFromTeam(pokemon.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonList;