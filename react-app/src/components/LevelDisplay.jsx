import React from 'react';
import { useGame } from '../contexts/GameContext';
import { CULTIVATION_POINTS_PER_LEVEL } from '../utils/constants';
import './LevelDisplay.css';

const LevelDisplay = () => {
  const { gameState } = useGame();
  
  const requiredCultivation = gameState.level * CULTIVATION_POINTS_PER_LEVEL;
  const progress = (gameState.cultivationPoints || 0) % requiredCultivation;
  
  return (
    <div className="level-display">
      <span>
        {gameState.level}级·{gameState.cultivation.stage}·{gameState.cultivation.rank} ({progress}/{requiredCultivation})
      </span>
    </div>
  );
};

export default LevelDisplay;
