import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import EquipmentComparisonModal from './EquipmentComparisonModal';
import './GameArea.css';

const GameArea = () => {
  const { gameState, chopTree, equipNewEquipment, showNotification } = useGame();
  const [comparisonModal, setComparisonModal] = useState(null);
  
  const handleChop = () => {
    if (gameState.stamina < 1) {
      showNotification('修为不足！');
      return;
    }
    
    const newEquipment = chopTree();
    if (newEquipment) {
      const existingEquipment = gameState.equipment[newEquipment.type];
      
      if (existingEquipment) {
        // Show comparison modal
        setComparisonModal({
          oldEquipment: existingEquipment,
          newEquipment: newEquipment
        });
      } else {
        // Auto equip if slot is empty
        equipNewEquipment(newEquipment);
        showNotification(`获得 ${newEquipment.qualityName} ${newEquipment.name}`);
      }
    }
  };
  
  const handleCloseModal = () => {
    setComparisonModal(null);
  };
  
  return (
    <div className="game-area">
      <div className="tree-container">
        <div className="tree" onClick={handleChop}>🌳</div>
        <div className="character">🐭⛏️</div>
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
};

export default GameArea;
