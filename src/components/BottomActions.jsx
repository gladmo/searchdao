import React from 'react';
import { useGame } from '../contexts/GameContext';
import './BottomActions.css';

const BottomActions = ({ handleChop }) => {
  const { gameState } = useGame();
  
  return (
    <div className="bottom-actions">
      <div className="disassemble-stats">
        <span>已分解: {gameState.disassembleCount}</span>
        <span>获得灵石: {gameState.disassembleReward}</span>
      </div>
      <button className="chop-button" onClick={handleChop}>
        🪓 砍树
      </button>
    </div>
  );
};

export default BottomActions;
