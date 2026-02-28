import React from 'react';
import { useGame } from '../contexts/GameContext';
import { RECORD_TYPES } from '../utils/constants';
import './RecordsModal.css';

const RecordsModal = ({ onClose }) => {
  const { gameState } = useGame();
  
  const getRecordTypeLabel = (type) => {
    switch (type) {
      case RECORD_TYPES.DROP:
        return '掉落';
      case RECORD_TYPES.EQUIP:
        return '装备';
      case RECORD_TYPES.DISASSEMBLE:
        return '分解';
      default:
        return '';
    }
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content records-modal" onClick={(e) => e.stopPropagation()}>
        <h3>精怪记录</h3>
        
        <div className="records-list">
          {gameState.records.length === 0 ? (
            <div className="empty-records">暂无记录</div>
          ) : (
            gameState.records.map(record => (
              <div key={record.id} className="record-item">
                <div className="record-header">
                  <span className={`record-type type-${record.type}`}>
                    {getRecordTypeLabel(record.type)}
                  </span>
                  <span className="record-time">{record.timestamp}</span>
                </div>
                <div className="record-equipment">
                  <span className="equipment-icon">{record.equipment.icon}</span>
                  <span className="equipment-name">{record.equipment.name}</span>
                  <span className={`equipment-quality quality-${record.equipment.quality}`}>
                    {record.equipment.qualityName}
                  </span>
                  <span className="equipment-level">Lv.{record.equipment.level}</span>
                </div>
                <div className="record-stats">
                  <span>⚔️{record.equipment.attack}</span>
                  <span>❤️{record.equipment.life}</span>
                  <span>🛡️{record.equipment.defense}</span>
                  <span>⚡{record.equipment.agility}</span>
                </div>
                {record.reward && (
                  <div className="record-reward">
                    获得灵石: {record.reward}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="modal-actions">
          <button className="btn-close" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordsModal;
