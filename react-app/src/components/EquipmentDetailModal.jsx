import React from 'react';
import { useGame } from '../contexts/GameContext';
import { formatAffixes } from '../utils/equipment';
import './EquipmentDetailModal.css';

const EquipmentDetailModal = ({ equipment, onClose }) => {
  const { disassembleEquipment, showNotification } = useGame();
  
  const handleDisassemble = () => {
    disassembleEquipment(equipment.type);
    onClose();
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>装备详情</h3>
        
        <div className="equipment-detail">
          <div className="equipment-header">
            <div className="equipment-icon-large">{equipment.icon}</div>
            <div>
              <div className="equipment-name">{equipment.name}</div>
              <div className="equipment-meta">
                <span>Lv.{equipment.level}</span>
                <span className={`quality-${equipment.quality}`}>{equipment.qualityName}</span>
              </div>
            </div>
          </div>
          
          <div className="equipment-stats">
            <div className="stat-item">
              <span className="stat-icon">⚔️</span>
              <span className="stat-label">攻击</span>
              <span className="stat-value">{equipment.attack}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">❤️</span>
              <span className="stat-label">生命</span>
              <span className="stat-value">{equipment.life}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🛡️</span>
              <span className="stat-label">防御</span>
              <span className="stat-value">{equipment.defense}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⚡</span>
              <span className="stat-label">敏捷</span>
              <span className="stat-value">{equipment.agility}</span>
            </div>
          </div>
          
          {equipment.affixes && equipment.affixes.length > 0 && (
            <div className="affixes-section">
              <div className="affixes-title">装备词条</div>
              {equipment.affixes.map((affix, idx) => (
                <div key={idx} className="affix-item">
                  {affix.name}+{affix.value}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="modal-actions">
          <button className="btn-disassemble" onClick={handleDisassemble}>
            分解装备
          </button>
          <button className="btn-close" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetailModal;
