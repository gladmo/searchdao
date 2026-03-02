import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { EQUIPMENT_TYPES } from '../utils/constants';
import EquipmentDetailModal from './EquipmentDetailModal';
import './EquipmentGrid.css';

const EquipmentGrid = () => {
  const { gameState } = useGame();
  const [detailModal, setDetailModal] = useState(null);
  const [mountDetailModal, setMountDetailModal] = useState(false);
  
  const handleEquipmentClick = (equipType) => {
    const equipment = gameState.equipment[equipType.type];
    if (equipment) {
      setDetailModal(equipment);
    }
  };
  
  const handleMountClick = () => {
    if (gameState.mount) {
      setMountDetailModal(true);
    }
  };
  
  const handleCloseModal = () => {
    setDetailModal(null);
    setMountDetailModal(false);
  };
  
  return (
    <>
      <div className="equipment-grid-container">
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
        
        {/* Mount Display Column */}
        <div className="mount-display-column">
          <div className="mount-display-title">坐骑</div>
          <div 
            className={`mount-slot ${gameState.mount ? 'has-mount' : ''}`}
            onClick={handleMountClick}
          >
            {gameState.mount ? (
              <>
                <div className="mount-icon">☁️</div>
                <div className="mount-name">筋斗云</div>
                <div className="mount-level">Lv.{gameState.mount.level}</div>
                <div className="mount-stats-mini">
                  <div>⚔️ {gameState.mount.attack}</div>
                  <div>❤️ {gameState.mount.life}</div>
                  <div>🛡️ {gameState.mount.defense}</div>
                  <div>⚡ {gameState.mount.agility}</div>
                </div>
              </>
            ) : (
              <>
                <div className="mount-icon-empty">☁️</div>
                <div className="mount-name-empty">未获得</div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {detailModal && (
        <EquipmentDetailModal
          equipment={detailModal}
          onClose={handleCloseModal}
        />
      )}
      
      {mountDetailModal && gameState.mount && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content mount-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>☁️ 筋斗云坐骑</h2>
              <button className="close-button" onClick={handleCloseModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="mount-detail-stats">
                <h3>等级 {gameState.mount.level}</h3>
                <div className="mount-attributes">
                  <div className="attribute-item">
                    <span className="attribute-label">⚔️ 攻击:</span>
                    <span className="attribute-value">{gameState.mount.attack}</span>
                  </div>
                  <div className="attribute-item">
                    <span className="attribute-label">❤️ 生命:</span>
                    <span className="attribute-value">{gameState.mount.life}</span>
                  </div>
                  <div className="attribute-item">
                    <span className="attribute-label">🛡️ 防御:</span>
                    <span className="attribute-value">{gameState.mount.defense}</span>
                  </div>
                  <div className="attribute-item">
                    <span className="attribute-label">⚡ 敏捷:</span>
                    <span className="attribute-value">{gameState.mount.agility}</span>
                  </div>
                </div>
                
                {gameState.mount.affixes && gameState.mount.affixes.length > 0 && (
                  <div className="mount-affixes">
                    <h4>特殊词条</h4>
                    {gameState.mount.affixes.map((affix, index) => (
                      <div key={index} className="affix-item">
                        {affix.name} +{affix.value}
                      </div>
                    ))}
                  </div>
                )}
                
                {gameState.mount.skills && gameState.mount.skills.length > 0 && (
                  <div className="mount-skills">
                    <h4>特殊技能</h4>
                    {gameState.mount.skills.map((skill, index) => (
                      <div key={index} className="skill-item">
                        {skill.name} {skill.value}%
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EquipmentGrid;
