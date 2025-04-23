import React, { useEffect, useState } from "react";

const PokemonList = ({ team, setTeam }) => {
  const [pokemon, setPokemon] = useState([]);
  // const [team, setTeam] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    const fetchPokemon = async () => {
      const limit = 20;
      const offset = (page - 1) * limit;
      const url = search
        ? `https://pokeapi.co/api/v2/pokemon?limit=1000`
        : `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (search) {
          const filtered = data.results.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
          );
          setPokemon(filtered);
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
        setTeam(data);
      } catch (error) {
        console.error("Error fetching team:", error);
      }
    };

    fetchPokemon();
    fetchTeam();
  }, [page, search]);

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
      setTeam([...team, data]);
    } catch (error) {
      console.error("Error adding Pokémon to team:", error);
    }
  };

  const removeFromTeam = async (id) => {
    try {
      await fetch(`http://localhost:3001/team/${id}`, {
        method: "DELETE",
      });
      // setTeam(team.filter((p) => p.id !== id));
      setTeam((prevTeam) => prevTeam.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error removing Pokémon from team:", error);
    }
  };

  const viewPokemonDetails = async (name) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await response.json();
      setSelectedPokemon(data);
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Pokémon List</h2>

      {/* Pokémon List */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search Pokémon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ul className="list-group mb-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
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

        <div className="d-flex justify-content-between">
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
      </div>

      {/* Pokémon Details */}
      <div className="mb-4">
        <div className="card" style={{ height: "300px", overflowY: "auto" }}>
          <div className="card-body">
            {selectedPokemon ? (
              <>
                <h3 className="card-title text-center">
                  {selectedPokemon.name.toUpperCase()}
                </h3>
                <div className="text-center mb-3">
                  <img
                    src={selectedPokemon.sprites.other["official-artwork"].front_default}
                    alt={selectedPokemon.name}
                    className="img-fluid"
                    style={{ maxWidth: "150px", height: "150px", objectFit: "contain" }}
                  />
                </div>
                <p><strong>HP:</strong> {selectedPokemon.stats[0].base_stat}</p>
                <p><strong>Attack:</strong> {selectedPokemon.stats[1].base_stat}</p>
                <p><strong>Defense:</strong> {selectedPokemon.stats[2].base_stat}</p>
                <p><strong>Speed:</strong> {selectedPokemon.stats[5].base_stat}</p>
                <p>
                  <strong>Types:</strong>{" "}
                  {selectedPokemon.types.map((t) => t.type.name).join(", ")}
                </p>
                <p>
                  <strong>Abilities:</strong>{" "}
                  {selectedPokemon.abilities.map((a) => a.ability.name).join(", ")}
                </p>
              </>
            ) : (
              <p className="text-center">Select a Pokémon to view details</p>
            )}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div>
        <h2 className="text-center mb-3">Your Team</h2>
        <ul className="list-group" style={{ maxHeight: "200px", overflowY: "auto" }}>
          {
          team.map((p) => (
            <li
              key={p.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {p.name}
              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeFromTeam(p.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PokemonList;
