import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { isEquipmentBetter } from '../utils/equipment';
import EquipmentComparisonModal from './EquipmentComparisonModal';
import DropAnimation from './DropAnimation';
import './GameArea.css';

const GameArea = () => {
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
      }, 50);
      
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
      }, 500); // Delay to let animation start
    }
  };
  
  const handleCloseModal = () => {
    setComparisonModal(null);
  };
  
  const handleAnimationComplete = () => {
    setDropAnimation(null);
  };
  
  return (
    <div className="game-area">
      <div className="tree-container">
        <div className="tree" onClick={handleChop}>🌳</div>
        <div className="character">🐭⛏️</div>
      </div>
      
      {dropAnimation && (
        <DropAnimation 
          equipment={dropAnimation} 
          onComplete={handleAnimationComplete}
        />
      )}
      
      {comparisonModal && (
        <EquipmentComparisonModal
          oldEquipment={comparisonModal.oldEquipment}
          newEquipment={comparisonModal.newEquipment}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default GameArea;
