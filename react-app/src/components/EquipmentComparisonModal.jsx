import React from 'react';
import { useGame } from '../contexts/GameContext';
import { calculateEquipmentPower, isEquipmentBetter } from '../utils/equipment';
import './EquipmentComparisonModal.css';

const EquipmentComparisonModal = ({ oldEquipment, newEquipment, onClose }) => {
  const { equipNewEquipment, showNotification, disassembleEquipment } = useGame();
  
  const handleEquipNew = () => {
    // Disassemble old equipment
    disassembleEquipment(oldEquipment.type);
    // Equip new equipment
    equipNewEquipment(newEquipment);
    showNotification(`装备 ${newEquipment.qualityName} ${newEquipment.name}`);
    onClose();
  };
  
  const handleKeepOld = () => {
    // Disassemble new equipment (auto disassemble)
    const reward = Math.floor(10 * (newEquipment.quality || 1) * (newEquipment.level || 1));
    showNotification(`保留旧装备，分解新装备获得 ${reward} 灵石`);
    onClose();
  };
  
  const createStatRow = (label, oldValue, newValue) => {
    const diff = newValue - oldValue;
    const diffClass = diff > 0 ? 'increase' : diff < 0 ? 'decrease' : '';
    const arrow = diff > 0 ? '▲' : diff < 0 ? '▼' : '';
    
    return (
      <div className="stat-row" key={label}>
        <span className="stat-label">{label}</span>
        <span className="stat-old">{Math.floor(oldValue)}</span>
        <span className={`stat-diff ${diffClass}`}>
          {diff !== 0 && `${arrow} ${Math.floor(Math.abs(diff))}`}
        </span>
        <span className="stat-new">{Math.floor(newValue)}</span>
      </div>
    );
  };
  
  const oldPower = calculateEquipmentPower(oldEquipment);
  const newPower = calculateEquipmentPower(newEquipment);
  const isBetter = isEquipmentBetter(newEquipment, oldEquipment);
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>装备对比</h3>
        
        <div className="equipment-comparison">
          <div className="equipment-header">
            <div className="equipment-info old">
              <div className="equipment-title">当前装备</div>
              <div className="equipment-name">{oldEquipment.name}</div>
              <div className="equipment-meta">
                <span>Lv.{oldEquipment.level}</span>
                <span className={`quality-${oldEquipment.quality}`}>{oldEquipment.qualityName}</span>
              </div>
            </div>
            
            <div className="vs">VS</div>
            
            <div className="equipment-info new">
              <div className="equipment-title">新装备</div>
              <div className="equipment-name">{newEquipment.name}</div>
              <div className="equipment-meta">
                <span>Lv.{newEquipment.level}</span>
                <span className={`quality-${newEquipment.quality}`}>{newEquipment.qualityName}</span>
              </div>
            </div>
          </div>
          
          <div className="stats-comparison">
            {createStatRow('攻击', oldEquipment.attack, newEquipment.attack)}
            {createStatRow('生命', oldEquipment.life, newEquipment.life)}
            {createStatRow('防御', oldEquipment.defense, newEquipment.defense)}
            {createStatRow('敏捷', oldEquipment.agility, newEquipment.agility)}
            {createStatRow('战力', oldPower, newPower)}
          </div>
          
          {(oldEquipment.affixes?.length > 0 || newEquipment.affixes?.length > 0) && (
            <div className="affixes-section">
              <div className="affix-column">
                <div className="affix-title">当前词条</div>
                {oldEquipment.affixes?.map((affix, idx) => (
                  <div key={idx} className="affix-item">
                    {affix.name}+{affix.value}
                  </div>
                ))}
              </div>
              <div className="affix-column">
                <div className="affix-title">新装备词条</div>
                {newEquipment.affixes?.map((affix, idx) => (
                  <div key={idx} className="affix-item">
                    {affix.name}+{affix.value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="modal-actions">
          <button className="btn-equip" onClick={handleEquipNew}>
            装备新的 {isBetter && '(推荐)'}
          </button>
          <button className="btn-keep" onClick={handleKeepOld}>
            保留旧的 {!isBetter && '(推荐)'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentComparisonModal;
