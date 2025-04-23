import React, { useEffect, useState } from "react";

const BattleHistory = ({ battles }) => {
  // const [battles, setBattles] = useState([]);



  return (
    <div>
      <h2>📜 Battle History</h2>
      {battles.length === 0 ? (
        <p>No battles yet.</p>
      ) : (
        <ul>
          {battles.map((battle, index) => (
            <li key={index}>
              <strong>{battle.player1}</strong> vs{" "}
              <strong>{battle.player2}</strong> —{" "}
              🏆 <strong>{battle.winner}</strong> (
              {new Date(battle.date).toLocaleString()})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BattleHistory;
