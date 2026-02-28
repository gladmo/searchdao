import React from 'react';
import { useGame } from '../contexts/GameContext';
import './StatsDisplay.css';

const StatsDisplay = () => {
  const { gameState } = useGame();
  
  // Calculate total stats from equipment
  let totalAttack = gameState.attack;
  let totalLife = gameState.life;
  let totalDefense = gameState.defense;
  let totalAgility = gameState.agility;
  
  Object.values(gameState.equipment).forEach(equip => {
    if (equip) {
      totalAttack += equip.attack;
      totalLife += equip.life;
      totalDefense += equip.defense;
      totalAgility += equip.agility;
    }
  });
  
  return (
    <div className="stats-display">
      <div className="stat-item">
        <span className="stat-icon">⚔️</span>
        <span className="stat-label">攻击</span>
        <span className="stat-value">{totalAttack}</span>
      </div>
      <div className="stat-item">
        <span className="stat-icon">❤️</span>
        <span className="stat-label">生命</span>
        <span className="stat-value">{totalLife}</span>
      </div>
      <div className="stat-item">
        <span className="stat-icon">🛡️</span>
        <span className="stat-label">防御</span>
        <span className="stat-value">{totalDefense}</span>
      </div>
      <div className="stat-item">
        <span className="stat-icon">⚡</span>
        <span className="stat-label">敏捷</span>
        <span className="stat-value">{totalAgility}</span>
      </div>
    </div>
  );
};

export default StatsDisplay;
