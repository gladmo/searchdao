import React, { useState } from 'react';
import { GameProvider, useGame } from './contexts/GameContext';
import { isEquipmentBetter } from './utils/equipment';
import TopBar from './components/TopBar';
import Notification from './components/Notification';
import GameArea from './components/GameArea';
import LevelDisplay from './components/LevelDisplay';
import StaminaBar from './components/StaminaBar';
import StatsDisplay from './components/StatsDisplay';
import EquipmentGrid from './components/EquipmentGrid';
import BottomActions from './components/BottomActions';
import BottomNav from './components/BottomNav';
import EquipmentComparisonModal from './components/EquipmentComparisonModal';
import './App.css';

// Animation delay to ensure previous drop animation is cleared before showing new one
const ANIMATION_CLEAR_DELAY = 50;
const EQUIPMENT_PROCESS_DELAY = 500;

function GameContent() {
  const { gameState, chopTree, equipNewEquipment, disassembleEquipment, autoDisassembleNewEquipment, showNotification } = useGame();
  const [comparisonModal, setComparisonModal] = useState(null);
  const [dropAnimation, setDropAnimation] = useState(null);
  
  const handleChop = () => {
    if (gameState.stamina < 1) {
      showNotification('修为不足！');
      return;
    }
    
    const newEquipment = chopTree();
    if (newEquipment) {
      // Clear any existing drop animation before showing new one
      setDropAnimation(null);
      
      // Show new drop animation after a brief moment
      setTimeout(() => {
        setDropAnimation(newEquipment);
      }, ANIMATION_CLEAR_DELAY);
      
      // Process equipment after animation starts
      setTimeout(() => {
        const existingEquipment = gameState.equipment[newEquipment.type];
        
        if (existingEquipment) {
          // Check auto-equip mode and level requirement
          if (gameState.autoEquip && gameState.level >= 10) {
            // Automatically equip if new equipment is better
            if (isEquipmentBetter(newEquipment, existingEquipment)) {
              disassembleEquipment(existingEquipment.type);
              equipNewEquipment(newEquipment);
              showNotification(`自动装备 ${newEquipment.qualityName} ${newEquipment.name}`);
            } else {
              // Auto-disassemble the new equipment if it's worse
              const reward = autoDisassembleNewEquipment(newEquipment);
              showNotification(`自动分解 ${newEquipment.qualityName} ${newEquipment.name}，获得 ${reward} 灵石`);
            }
          } else {
            // Show comparison modal
            setComparisonModal({
              oldEquipment: existingEquipment,
              newEquipment: newEquipment
            });
          }
        } else {
          // Auto equip if slot is empty
          equipNewEquipment(newEquipment);
          showNotification(`获得 ${newEquipment.qualityName} ${newEquipment.name}`);
        }
      }, EQUIPMENT_PROCESS_DELAY); // Delay to let animation start
    }
  };
  
  const handleCloseModal = () => {
    setComparisonModal(null);
  };

  const handleAnimationComplete = () => {
    setDropAnimation(null);
  };

  return (
    <div className="app-container">
      <div className="game-container">
        <TopBar />
        <Notification />
        <GameArea 
          handleChop={handleChop}
          dropAnimation={dropAnimation}
          onAnimationComplete={handleAnimationComplete}
        />
        <LevelDisplay />
        <StaminaBar />
        <StatsDisplay />
        <EquipmentGrid />
        <BottomActions handleChop={handleChop} />
        <BottomNav />
      </div>
      {comparisonModal && (
        <EquipmentComparisonModal
          oldEquipment={comparisonModal.oldEquipment}
          newEquipment={comparisonModal.newEquipment}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;
