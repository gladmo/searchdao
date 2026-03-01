import React from 'react';
import DropAnimation from './DropAnimation';
import './GameArea.css';

const GameArea = ({ handleChop, dropAnimation, onAnimationComplete }) => {
  return (
    <div className="game-area">
      <div className="tree-container">
        <div className="tree" onClick={handleChop}>🌳</div>
        <div className="character">🐭⛏️</div>
      </div>
      
      {dropAnimation && (
        <DropAnimation 
          equipment={dropAnimation} 
          onComplete={onAnimationComplete}
        />
      )}
    </div>
  );
};

export default GameArea;
