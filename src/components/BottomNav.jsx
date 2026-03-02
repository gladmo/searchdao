import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import RecordsModal from './RecordsModal';
import TasksModal from './TasksModal';
import MountModal from './MountModal';
import TrainingModal from './TrainingModal';
import './BottomNav.css';

const BottomNav = () => {
  const { gameState, toggleAutoEquip, showNotification } = useGame();
  const [showRecords, setShowRecords] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [showMount, setShowMount] = useState(false);
  const [showTraining, setShowTraining] = useState(false);
  
  // Auto-equip unlocks at Foundation Establishment (筑基期) - level 10+
  const isAutoEquipUnlocked = gameState.level >= 10;

  // Check if there are claimable tasks
  const hasClaimableTasks = gameState.tasks && gameState.tasks.some(task => task.completed && !task.claimed);

  // Check if there are claimable training rewards
  const hasClaimableTrainingRewards = gameState.training && gameState.training.completedCheckpoints.some(
    checkpoint => !gameState.training.claimedRewards.includes(checkpoint)
  );

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
        <button
          className={`nav-button ${hasClaimableTasks ? 'has-notification' : ''}`}
          onClick={() => setShowTasks(true)}
        >
          📜 任务
          {hasClaimableTasks && <span className="notification-badge">!</span>}
        </button>
        <button 
          className={`nav-button ${hasClaimableTrainingRewards ? 'has-notification' : ''}`}
          onClick={() => setShowTraining(true)}
        >
          ⚔️ 历练
          {hasClaimableTrainingRewards && <span className="notification-badge">!</span>}
        </button>
        <button 
          className="nav-button"
          onClick={() => setShowMount(true)}
        >
          ☁️ 坐骑
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

      {showTasks && (
        <TasksModal onClose={() => setShowTasks(false)} />
      )}

      {showTraining && (
        <TrainingModal onClose={() => setShowTraining(false)} />
      )}

      {showMount && (
        <MountModal onClose={() => setShowMount(false)} />
      )}

      {showRecords && (
        <RecordsModal onClose={() => setShowRecords(false)} />
      )}
    </>
  );
};

export default BottomNav;
