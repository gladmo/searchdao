import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { EQUIPMENT_TYPES } from '../utils/constants';
import EquipmentDetailModal from './EquipmentDetailModal';
import './EquipmentGrid.css';

const EquipmentGrid = () => {
  const { gameState } = useGame();
  const [detailModal, setDetailModal] = useState(null);
  
  const handleEquipmentClick = (equipType) => {
    const equipment = gameState.equipment[equipType.type];
    if (equipment) {
      setDetailModal(equipment);
    }
  };
  
  const handleCloseModal = () => {
    setDetailModal(null);
  };
  
  return (
    <>
      <div className="equipment-grid">
        {EQUIPMENT_TYPES.map(equipType => {
          const equipment = gameState.equipment[equipType.type];
          const qualityClass = equipment ? `quality-${equipment.quality}` : '';
          
          return (
            <div 
              key={equipType.type} 
              className={`equipment-slot ${qualityClass}`}
              onClick={() => handleEquipmentClick(equipType)}
            >
              <div className="equipment-icon">{equipType.icon}</div>
              <div className="equipment-name">{equipType.name}</div>
              {equipment && (
                <>
                  <div className="equipment-level">Lv.{equipment.level}</div>
                  <div className="equipment-quality">{equipment.qualityName}</div>
                </>
              )}
            </div>
          );
        })}
      </div>
      
      {detailModal && (
        <EquipmentDetailModal
          equipment={detailModal}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default EquipmentGrid;
