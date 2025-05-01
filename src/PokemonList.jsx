"use client"

import { useEffect, useState } from "react"
import { Search, PlusCircle, Info } from "lucide-react"

const PokemonList = ({ team, setTeam }) => {
  const [pokemon, setPokemon] = useState([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [teamSprites, setTeamSprites] = useState({})

  useEffect(() => {
    const fetchPokemon = async () => {
      setIsLoading(true)
      const limit = 20
      const offset = (page - 1) * limit
      const url = search
        ? `https://pokeapi.co/api/v2/pokemon?limit=1000`
        : `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`

      try {
        const response = await fetch(url)
        const data = await response.json()

        if (search) {
          const filtered = data.results.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
          setPokemon(filtered)
        } else {
          setPokemon(data.results)
        }
      } catch (error) {
        console.error("Error fetching Pokémon:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchTeam = async () => {
      try {
        const response = await fetch("https://pokemon-916w.onrender.com/team")
        const data = await response.json()
        setTeam(data)
      } catch (error) {
        console.error("Error fetching team:", error)
      }
    }

    fetchPokemon()
    fetchTeam()
  }, [page, search, setTeam])

  // Fetch sprites for team members
  useEffect(() => {
    const fetchTeamSprites = async () => {
      const sprites = {}

      for (const member of team) {
        if (!teamSprites[member.name]) {
          try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${member.name}`)
            const data = await response.json()
            sprites[member.name] = data.sprites.front_default || data.sprites.other["official-artwork"].front_default
          } catch (error) {
            console.error(`Error fetching sprite for ${member.name}:`, error)
            sprites[member.name] = null
          }
        }
      }

      setTeamSprites((prev) => ({ ...prev, ...sprites }))
    }

    if (team.length > 0) {
      fetchTeamSprites()
    }
  }, [team])

  const addToTeam = async (poke) => {
    if (team.length >= 6) {
      alert("Your team is full! (Max 6 Pokémon)")
      return
    }

    try {
      const response = await fetch("https://pokemon-916w.onrender.com/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(poke),
      })

      const data = await response.json()
      setTeam([...team, data])

      // Fetch sprite for the newly added Pokémon
      try {
        const spriteResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${poke.name}`)
        const spriteData = await spriteResponse.json()
        setTeamSprites((prev) => ({
          ...prev,
          [poke.name]: spriteData.sprites.front_default || spriteData.sprites.other["official-artwork"].front_default,
        }))
      } catch (error) {
        console.error(`Error fetching sprite for ${poke.name}:`, error)
      }
    } catch (error) {
      console.error("Error adding Pokémon to team:", error)
    }
  }

  const removeFromTeam = async (id) => {
    try {
      await fetch(`https://pokemon-916w.onrender.com/team/${id}`, {
        method: "DELETE",
      })
      setTeam((prevTeam) => prevTeam.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Error removing Pokémon from team:", error)
    }
  }

  const viewPokemonDetails = async (name) => {
    try {
      setIsLoading(true)
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      const data = await response.json()
      setSelectedPokemon(data)
    } catch (error) {
      console.error("Error fetching Pokémon details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Pokémon List</h2>

        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-white/60" />
          </div>
          <input
            type="text"
            className="bg-white/20 border-0 text-white placeholder-white/60 rounded-lg pl-10 p-3 w-full focus:ring-2 focus:ring-blue-400 focus:bg-white/30 focus:outline-none transition"
            placeholder="Search Pokémon"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="bg-white/5 rounded-xl overflow-hidden">
            <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              <table className="min-w-full divide-y divide-white/10">
                <tbody className="divide-y divide-white/10">
                   {pokemon.map((p, index) => (
                     <tr key={index} className="hover:bg-white/10 transition">
                       <td className="px-4 py-3 whitespace-nowrap flex items-center gap-3">
                         {/* Add the sprite */}
                         <img
                           src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.url
                             .split("/")
                             .filter(Boolean)
                             .pop()}.png`}
                           onError={(e) => (e.target.src = "/Pokemon.jpg")}
                           alt={p.name}
                           className="h-8 w-8"
                         />
                         <div className="font-medium capitalize">{p.name}</div>
                       </td>
                       <td className="px-4 py-3 whitespace-nowrap text-right">
                         <button
                           className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition mr-2"
                           onClick={() => addToTeam(p)}
                         >
                           <PlusCircle className="h-4 w-4 mr-1" />
                           Add
                         </button>
                         <button
                           className="inline-flex items-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition"
                           onClick={() => viewPokemonDetails(p.name)}
                         >
                           <Info className="h-4 w-4 mr-1" />
                           Details
                         </button>
                       </td>
                     </tr>
                   ))}
               </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <button
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-white/10 rounded-lg">Page {page}</span>
          <button
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Pokémon Details</h2>
        {selectedPokemon ? (
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold uppercase mb-2">{selectedPokemon.name}</h3>
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-full blur-xl"></div>
              <img
                src={
                  selectedPokemon.sprites.other["official-artwork"].front_default ||
                  selectedPokemon.sprites.front_default ||
                  "/placeholder.svg" ||
                  "/placeholder.svg"
                }
                alt={selectedPokemon.name}
                className="relative z-10 h-40 w-40 object-contain"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-sm text-white/70">HP</div>
                <div className="font-bold text-lg">{selectedPokemon.stats[0].base_stat}</div>
                <div className="w-full bg-white/20 rounded-full h-2 mt-1">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(selectedPokemon.stats[0].base_stat / 255) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-sm text-white/70">Defense</div>
                <div className="font-bold text-lg">{selectedPokemon.stats[2].base_stat}</div>
                <div className="w-full bg-white/20 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(selectedPokemon.stats[2].base_stat / 255) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-sm text-white/70">Attack</div>
                <div className="font-bold text-lg">{selectedPokemon.stats[1].base_stat}</div>
                <div className="w-full bg-white/20 rounded-full h-2 mt-1">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${(selectedPokemon.stats[1].base_stat / 255) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-sm text-white/70">Speed</div>
                <div className="font-bold text-lg">{selectedPokemon.stats[5].base_stat}</div>
                <div className="w-full bg-white/20 rounded-full h-2 mt-1">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${(selectedPokemon.stats[5].base_stat / 255) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="w-full mt-4 space-y-2">
              <div className="flex flex-wrap gap-2">
                <div className="text-sm font-medium">Types:</div>
                {selectedPokemon.types.map((t, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-medium rounded-full capitalize"
                    style={{ backgroundColor: getTypeColor(t.type.name) }}
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="text-sm font-medium">Abilities:</div>
                {selectedPokemon.abilities.map((a, index) => (
                  <span key={index} className="px-2 py-1 bg-white/10 text-xs font-medium rounded-full capitalize">
                    {a.ability.name.replace("-", " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-white/60">
            <Info className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Select a Pokémon to view details</p>
          </div>
        )}
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Your Team</h2>
        {team.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <p>Your team is empty. Add some Pokémon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {team.map((p) => (
              <div key={p.id} className="bg-white/5 rounded-xl p-3 text-center relative group">
                <button
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  onClick={() => removeFromTeam(p.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div className="h-16 w-16 mx-auto mb-2 bg-white/10 rounded-full flex items-center justify-center overflow-hidden">
                  {teamSprites[p.name] ? (
                    <img
                      src={teamSprites[p.name] || "/placeholder.svg"}
                      alt={p.name}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg"
                      }}
                    />
                  ) : (
                    <div className="animate-pulse h-full w-full bg-white/20 rounded-full"></div>
                  )}
                </div>
                <div className="capitalize text-sm font-medium truncate">{p.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to get color based on Pokémon type
function getTypeColor(type) {
  const typeColors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  }

  return typeColors[type] || "#777777"
}

export default PokemonList
