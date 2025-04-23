import React, { useEffect, useState } from "react";

const PokemonList = () => {
  const [pokemon, setPokemon] = useState([]);
  const [team, setTeam] = useState([]);
  const [page, setPage] = useState(1); // State for pagination
  const [search, setSearch] = useState(""); // State for search query
  const [selectedPokemon, setSelectedPokemon] = useState(null); // State for selected Pokémon details

  // Dynamically add Bootstrap CSS
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link); // Cleanup on component unmount
    };
  }, []);

  // Fetch Pokémon list and team data
  useEffect(() => {
    const fetchPokemon = async () => {
      const limit = 20; // Number of Pokémon per page
      const offset = (page - 1) * limit; // Calculate offset for pagination
      const url = search
        ? `https://pokeapi.co/api/v2/pokemon?limit=1000` // Fetch all Pokémon for search
        : `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (search) {
          const filteredPokemon = data.results.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
          );
          setPokemon(filteredPokemon);
        } else {
          setPokemon(data.results);
        }
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
      }
    };

    const fetchTeam = async () => {
      try {
        const response = await fetch("http://localhost:3001/team");
        const data = await response.json();
        setTeam(data); // Update the team state
      } catch (error) {
        console.error("Error fetching team:", error);
      }
    };

    fetchPokemon();
    fetchTeam();
  }, [page, search]); // Re-run effect when page or search changes

  // Add Pokémon to the team
  const addToTeam = async (poke) => {
    if (team.length >= 6) {
      alert("Your team is full! (Max 6 Pokémon)");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(poke),
      });

      const data = await response.json();
      setTeam([...team, data]); // Update the team state
    } catch (error) {
      console.error("Error adding Pokémon to team:", error);
    }
  };

  // Remove Pokémon from the team
  const removeFromTeam = async (id) => {
    try {
      await fetch(`http://localhost:3001/team/${id}`, {
        method: "DELETE",
      });
      setTeam(team.filter((pokemon) => pokemon.id !== id)); // Update the team state
    } catch (error) {
      console.error("Error removing Pokémon from team:", error);
    }
  };

  // View Pokémon details
  const viewPokemonDetails = async (name) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await response.json();
      setSelectedPokemon(data); // Update the selected Pokémon state with detailed data
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Pokémon List</h2>

      {/* Search Input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search Pokémon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Pokémon List */}
      <ul className="list-group mb-4">
        {pokemon.map((p, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {p.name}
            <div>
              <button
                className="btn btn-primary btn-sm me-2"
                onClick={() => addToTeam(p)}
              >
                Add to Team
              </button>
              <button
                className="btn btn-info btn-sm"
                onClick={() => viewPokemonDetails(p.name)}
              >
                View Details
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn btn-secondary"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          className="btn btn-secondary"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      <h2 className="text-center mb-4">Your Team</h2>

      {/* Team List */}
      <ul className="list-group">
        {team.map((pokemon) => (
          <li
            key={pokemon.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {pokemon.name}
            <button
              className="btn btn-danger btn-sm"
              onClick={() => removeFromTeam(pokemon.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {/* Selected Pokémon Details */}
      {selectedPokemon && (
        <div className="card mt-4">
          <div className="card-body">
            <h3 className="card-title text-center">
              {selectedPokemon.name.toUpperCase()}
            </h3>
            <p><strong>HP:</strong> {selectedPokemon.stats[0].base_stat}</p>
            <p><strong>Attack:</strong> {selectedPokemon.stats[1].base_stat}</p>
            <p><strong>Speed:</strong> {selectedPokemon.stats[5].base_stat}</p>
            <p>
              <strong>Types:</strong>{" "}
              {selectedPokemon.types.map((t) => t.type.name).join(", ")}
            </p>
            <p>
              <strong>Abilities:</strong>{" "}
              {selectedPokemon.abilities.map((a) => a.ability.name).join(", ")}
            </p>
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedPokemon(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonList;