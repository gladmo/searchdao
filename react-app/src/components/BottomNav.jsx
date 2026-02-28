import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import RecordsModal from './RecordsModal';
import './BottomNav.css';

const BottomNav = () => {
  const { gameState, toggleAutoEquip, showNotification } = useGame();
  const [showRecords, setShowRecords] = useState(false);
  
  // Auto-equip unlocks at Foundation Establishment (筑基期) - level 10+
  const isAutoEquipUnlocked = gameState.level >= 10;

  const handleAutoEquipClick = () => {
    if (!isAutoEquipUnlocked) {
      showNotification('需达到筑基期（10级）才能解锁自动装备功能！');
      return;
    }
    toggleAutoEquip();
  };

  return (
    <>
      <div className="bottom-nav">
        <button className="nav-button">
          💰 商店
        </button>
        <button
          className={`nav-button ${gameState.autoEquip ? 'active' : ''} ${!isAutoEquipUnlocked ? 'locked' : ''}`}
          onClick={handleAutoEquipClick}
          title={!isAutoEquipUnlocked ? '需达到筑基期（10级）解锁' : ''}
        >
          {gameState.autoEquip ? '✓ 自动' : '自动'}
          {!isAutoEquipUnlocked && ' 🔒'}
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
