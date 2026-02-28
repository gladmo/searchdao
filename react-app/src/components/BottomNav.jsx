import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import RecordsModal from './RecordsModal';
import './BottomNav.css';

const BottomNav = () => {
  const { gameState, toggleAutoEquip } = useGame();
  const [showRecords, setShowRecords] = useState(false);

  return (
    <>
      <div className="bottom-nav">
        <button className="nav-button">
          💰 商店
        </button>
        <button
          className={`nav-button ${gameState.autoEquip ? 'active' : ''}`}
          onClick={toggleAutoEquip}
        >
          {gameState.autoEquip ? '✓ 自动' : '自动'}
        </button>
        <button
          className="nav-button"
          onClick={() => setShowRecords(true)}
        >
          📜 记录
        </button>
      </div>

      {showRecords && (
        <RecordsModal onClose={() => setShowRecords(false)} />
      )}
    </>
  );
};

export default BottomNav;
