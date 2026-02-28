import React from 'react';
import { useGame } from '../contexts/GameContext';
import './LevelDisplay.css';

const LevelDisplay = () => {
  const { gameState } = useGame();
  
  const requiredChops = gameState.level * 10;
  const progress = gameState.chopCount % requiredChops;
  
  return (
    <div className="level-display">
      <span>
        {gameState.level}级·{gameState.cultivation.stage}·{gameState.cultivation.rank} ({progress}/{requiredChops})
      </span>
    </div>
  );
};

export default LevelDisplay;
