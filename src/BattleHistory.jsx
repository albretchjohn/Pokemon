import { Clock, Trophy } from 'lucide-react'

const BattleHistory = ({ battles }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Clock className="h-6 w-6 mr-2" />
        Battle History
      </h2>

      {battles.length === 0 ? (
        <div className="text-center py-8 text-white/60">
          <p>No battles yet. Start battling to see your history!</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {battles.map((battle, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <span className="capitalize font-medium">{battle.player1}</span>
                    <span className="mx-2 text-white/60">vs</span>
                    <span className="capitalize font-medium">{battle.player2}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="capitalize text-sm font-medium">{battle.winner}</span>
                </div>
              </div>
              <div className="text-xs text-white/60 mt-1">{new Date(battle.date).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BattleHistory
