"use client"

import { useState, useEffect } from "react"
import "./App.css"
import PokemonList from "./PokemonList"
import Battle from './battle';
import BattleHistory from './BattleHistory';

function App() {
  const [battles, setBattles] = useState([])
  const [team, setTeam] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch team data
        const teamResponse = await fetch("https://pokemon-916w.onrender.com/team") //http://localhost:3001/team
        const teamData = await teamResponse.json()
        setTeam(teamData)

        // Fetch battle history
        const battlesResponse = await fetch("https://pokemon-916w.onrender.com/battles") //http://localhost:3001/battles
        const battlesData = await battlesResponse.json()
        const sortedBattles = [...battlesData].sort((a, b) => new Date(b.date) - new Date(a.date))
        setBattles(sortedBattles)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 to-blue-600 text-white p-4 md:p-8">
        <div className="animate-bounce bg-white p-4 rounded-full">
          <div className="h-16 w-16 rounded-full border-4 border-gray-900 flex items-center justify-center">
            <div className="h-8 w-8 bg-gray-900 rounded-full"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 to-blue-600 text-white p-4 md:p-8">
      <div className="w-full ">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-2 text-white drop-shadow-lg">My Pokédex</h1>
          <p className="text-lg text-white/80">Catch, battle, and become the very best!</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PokemonList team={team} setTeam={setTeam} />
          </div>
          <div className="space-y-6">
            <Battle battles={battles} setBattles={setBattles} team={team} />
            <BattleHistory battles={battles} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
