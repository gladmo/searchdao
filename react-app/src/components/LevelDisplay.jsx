import React from 'react';
import { useGame } from '../contexts/GameContext';
import './LevelDisplay.css';

const LevelDisplay = () => {
  const { gameState } = useGame();
  
  const requiredCultivation = gameState.level * 100;
  const progress = gameState.cultivationPoints % requiredCultivation;
  
  return (
    <div className="level-display">
      <span>
        {gameState.level}级·{gameState.cultivation.stage}·{gameState.cultivation.rank} ({progress}/{requiredCultivation})
      </span>
    </div>
  );
};

export default LevelDisplay;
