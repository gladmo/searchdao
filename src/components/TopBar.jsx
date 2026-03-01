import React from 'react';
import { useGame } from '../contexts/GameContext';
import './TopBar.css';

const TopBar = () => {
  const { gameState } = useGame();
  
  return (
    <div className="top-bar">
      <div className="character-info">
        <div className="avatar">🐭</div>
        <div className="player-info">
          <div className="player-name">历飞雨</div>
          <div className="currency">
            <span className="spirit-stone">💎 {gameState.spiritStone}</span>
            <span className="crystal">🔷 {gameState.crystal}</span>
          </div>
        </div>
      </div>
      <div className="combat-power">
        <span className="power-icon">🔥</span>
        <span className="power-value">{gameState.combatPower}</span>
      </div>
    </div>
  );
};

export default TopBar;
