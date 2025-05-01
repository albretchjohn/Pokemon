"use client"

import { useState } from "react"
import { Zap } from "lucide-react"

const fetchPokemonStats = async (url) => {
  const res = await fetch(url)
  const data = await res.json()
  return {
    name: data.name,
    hp: data.stats[0].base_stat,
    attack: data.stats[1].base_stat,
    defense: data.stats[2].base_stat,
    sprite: data.sprites.other["official-artwork"].front_default || data.sprites.front_default,
    types: data.types.map((t) => t.type.name),
  }
}

const simulateBattle = (poke1, poke2) => {
  const score1 = poke1.attack - poke2.defense + poke1.hp
  const score2 = poke2.attack - poke1.defense + poke2.hp

  if (score1 > score2) return poke1.name
  else if (score2 > score1) return poke2.name
  else return "draw"
}

const saveBattleResult = async (poke1, poke2, winner) => {
  await fetch("https://pokemon-916w.onrender.com/battles", { //http://localhost:3001/battles
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      player1: poke1.name,
      player2: poke2.name,
      winner,
      date: new Date().toISOString(),
    }),
  })
}

const Battle = ({ battles, setBattles, team }) => {
  const [poke1, setPoke1] = useState("")
  const [poke2, setPoke2] = useState("")
  const [poke1Data, setPoke1Data] = useState(null)
  const [poke2Data, setPoke2Data] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [battleResult, setBattleResult] = useState(null)

  const handleBattle = async () => {
    setIsLoading(true)
    try {
      const p1 = await fetchPokemonStats(poke1)
      const p2 = await fetchPokemonStats(poke2)
      const winner = simulateBattle(p1, p2)

      const newBattle = {
        player1: p1.name,
        player2: p2.name,
        winner,
        date: new Date().toISOString(),
      }

      await saveBattleResult(p1, p2, winner)
      setBattles([newBattle, ...battles])
      setBattleResult({ winner, p1, p2 })
    } catch (error) {
      console.error("Battle error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePoke1Change = async (url) => {
    setPoke1(url)
    setBattleResult(null)
    if (url) {
      setIsLoading(true)
      try {
        const data = await fetchPokemonStats(url)
        setPoke1Data(data)
      } catch (error) {
        console.error("Error fetching Pokémon data:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      setPoke1Data(null)
    }
  }

  const handlePoke2Change = async (url) => {
    setPoke2(url)
    setBattleResult(null)
    if (url) {
      setIsLoading(true)
      try {
        const data = await fetchPokemonStats(url)
        setPoke2Data(data)
      } catch (error) {
        console.error("Error fetching Pokémon data:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      setPoke2Data(null)
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Battle Simulator</h2>

      {battleResult ? (
        <div className="mb-6">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="relative">
                  <img
                    src={battleResult.p1.sprite || "/placeholder.svg"}
                    alt={battleResult.p1.name}
                    className="h-20 w-20 object-contain"
                  />
                  {battleResult.winner === battleResult.p1.name && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                      🏆
                    </div>
                  )}
                </div>
                <div className="capitalize text-sm mt-1">{battleResult.p1.name}</div>
              </div>

              <div className="text-xl font-bold">VS</div>

              <div className="text-center">
                <div className="relative">
                  <img
                    src={battleResult.p2.sprite || "/placeholder.svg"}
                    alt={battleResult.p2.name}
                    className="h-20 w-20 object-contain"
                  />
                  {battleResult.winner === battleResult.p2.name && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                      🏆
                    </div>
                  )}
                </div>
                <div className="capitalize text-sm mt-1">{battleResult.p2.name}</div>
              </div>
            </div>

            <div className="text-lg font-bold">
              {battleResult.winner === "draw" ? "It's a draw!" : `Winner: ${battleResult.winner.toUpperCase()}`}
            </div>

            <button
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
              onClick={() => setBattleResult(null)}
            >
              New Battle
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pokémon 1 Selection */}
            <div className="bg-white/5 rounded-xl p-4">
              <label className="block text-sm font-medium mb-2">Select Pokémon 1:</label>
              <select
                className="w-full bg-white/20 border-0 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:bg-white/30 focus:outline-none transition"
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
                <div className="mt-4 flex flex-col items-center">
                  <img
                    src={poke1Data.sprite || "/placeholder.svg"}
                    alt={poke1Data.name}
                    className="h-24 w-24 object-contain mb-2"
                  />
                  <div className="capitalize font-medium">{poke1Data.name}</div>

                  <div className="grid grid-cols-2 gap-2 w-full mt-2">
                    <div className="bg-white/10 p-2 rounded text-center">
                      <div className="text-xs text-white/70">HP</div>
                      <div className="font-bold">{poke1Data.hp}</div>
                    </div>
                    <div className="bg-white/10 p-2 rounded text-center">
                      <div className="text-xs text-white/70">ATK</div>
                      <div className="font-bold">{poke1Data.attack}</div>
                    </div>
                    <div className="bg-white/10 p-2 rounded text-center">
                      <div className="text-xs text-white/70">DEF</div>
                      <div className="font-bold">{poke1Data.defense}</div>
                    </div>
                    <div className="bg-white/10 p-2 rounded text-center">
                      <div className="text-xs text-white/70">Types</div>
                      <div className="text-xs capitalize">{poke1Data.types.join(", ")}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pokémon 2 Selection */}
            <div className="bg-white/5 rounded-xl p-4">
              <label className="block text-sm font-medium mb-2">Select Pokémon 2:</label>
              <select
                className="w-full bg-white/20 border-0 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:bg-white/30 focus:outline-none transition"
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
                <div className="mt-4 flex flex-col items-center">
                  <img
                    src={poke2Data.sprite || "/placeholder.svg"}
                    alt={poke2Data.name}
                    className="h-24 w-24 object-contain mb-2"
                  />
                  <div className="capitalize font-medium">{poke2Data.name}</div>

                  <div className="grid grid-cols-2 gap-2 w-full mt-2">
                    <div className="bg-white/10 p-2 rounded text-center">
                      <div className="text-xs text-white/70">HP</div>
                      <div className="font-bold">{poke2Data.hp}</div>
                    </div>
                    <div className="bg-white/10 p-2 rounded text-center">
                      <div className="text-xs text-white/70">ATK</div>
                      <div className="font-bold">{poke2Data.attack}</div>
                    </div>
                    <div className="bg-white/10 p-2 rounded text-center">
                      <div className="text-xs text-white/70">DEF</div>
                      <div className="font-bold">{poke2Data.defense}</div>
                    </div>
                    <div className="bg-white/10 p-2 rounded text-center">
                      <div className="text-xs text-white/70">Types</div>
                      <div className="text-xs capitalize">{poke2Data.types.join(", ")}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Battle Button */}
          <button
            className="w-full py-3 bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 rounded-lg font-bold flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleBattle}
            disabled={!poke1 || !poke2 || poke1 === poke2 || isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Zap className="h-5 w-5 mr-2" />
            )}
            Battle!
          </button>
        </div>
      )}
    </div>
  )
}

export default Battle
