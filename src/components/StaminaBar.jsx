import React from 'react';
import { useGame } from '../contexts/GameContext';
import './StaminaBar.css';

const StaminaBar = () => {
  const { gameState } = useGame();
  
  const percentage = (gameState.stamina / gameState.maxStamina) * 100;
  
  return (
    <div className="stamina-container">
      <div className="stamina-label">
        修为: {gameState.stamina}/{gameState.maxStamina}
      </div>
      <div className="stamina-bar">
        <div 
          className="stamina-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default StaminaBar;
