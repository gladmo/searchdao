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
          
          <div className="base-attributes-section">
            <div className="attributes-title">基础属性</div>
            <div className="attribute-entry">
              <span className="attribute-icon">⚔️</span>
              <span className="attribute-name">攻击</span>
              <span className="attribute-value">+{equipment.attack}</span>
            </div>
            <div className="attribute-entry">
              <span className="attribute-icon">❤️</span>
              <span className="attribute-name">生命</span>
              <span className="attribute-value">+{equipment.life}</span>
            </div>
            <div className="attribute-entry">
              <span className="attribute-icon">🛡️</span>
              <span className="attribute-name">防御</span>
              <span className="attribute-value">+{equipment.defense}</span>
            </div>
            <div className="attribute-entry">
              <span className="attribute-icon">⚡</span>
              <span className="attribute-name">敏捷</span>
              <span className="attribute-value">+{equipment.agility}</span>
            </div>
          </div>
          
          {equipment.affixes && equipment.affixes.length > 0 && (
            <div className="affixes-section">
              <div className="affixes-title">装备词条</div>
              {equipment.affixes.map((affix, idx) => (
                <div key={idx} className="affix-entry">
                  <span className="affix-name">{affix.name}</span>
                  <span className="affix-value">+{affix.value}</span>
                </div>
              ))}
            </div>
          )}
          
          {equipment.skills && equipment.skills.length > 0 && (
            <div className="skills-section">
              <div className="skills-title">装备技能</div>
              {equipment.skills.map((skill, idx) => (
                <div key={idx} className={`skill-entry skill-${skill.category}`}>
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-value">{skill.value}%</span>
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
