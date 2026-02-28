import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { isEquipmentBetter } from '../utils/equipment';
import EquipmentComparisonModal from './EquipmentComparisonModal';
import './GameArea.css';

const GameArea = () => {
  const { gameState, chopTree, equipNewEquipment, disassembleEquipment, autoDisassembleNewEquipment, showNotification } = useGame();
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
        // Check auto-equip mode
        if (gameState.autoEquip) {
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
