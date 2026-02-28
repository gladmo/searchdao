import { useState } from 'react';
import { RECORD_TYPES, QUALITY_COLORS } from '../constants/gameConfig';
import { getRecordsByType } from '../utils/recordUtils';
import './RecordsModal.css';

const RecordsModal = ({ records, onClose }) => {
    const [filter, setFilter] = useState('all');

    const filteredRecords = filter === 'all' ? records : getRecordsByType(records, filter);

    const getRecordTypeName = (type) => {
        switch (type) {
            case RECORD_TYPES.DROP:
                return '掉落';
            case RECORD_TYPES.EQUIP:
                return '装备';
            case RECORD_TYPES.DISASSEMBLE:
                return '分解';
            default:
                return '未知';
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content records-modal" onClick={(e) => e.stopPropagation()}>
                <h3>装备记录</h3>

                <div className="filter-tabs">
                    <button 
                        className={filter === 'all' ? 'active' : ''}
                        onClick={() => setFilter('all')}
                    >
                        全部
                    </button>
                    <button 
                        className={filter === RECORD_TYPES.DROP ? 'active' : ''}
                        onClick={() => setFilter(RECORD_TYPES.DROP)}
                    >
                        掉落
                    </button>
                    <button 
                        className={filter === RECORD_TYPES.EQUIP ? 'active' : ''}
                        onClick={() => setFilter(RECORD_TYPES.EQUIP)}
                    >
                        装备
                    </button>
                    <button 
                        className={filter === RECORD_TYPES.DISASSEMBLE ? 'active' : ''}
                        onClick={() => setFilter(RECORD_TYPES.DISASSEMBLE)}
                    >
                        分解
                    </button>
                </div>

                <div className="records-list">
                    {filteredRecords.length === 0 ? (
                        <div className="empty-message">暂无记录</div>
                    ) : (
                        filteredRecords.map((record) => (
                            <div key={record.id} className="record-item">
                                <div className="record-header">
                                    <span className="record-type">{getRecordTypeName(record.type)}</span>
                                    <span className="record-time">{record.timestamp}</span>
                                </div>
                                <div className="record-equipment">
                                    <span className="equipment-icon-small">{record.equipment.icon}</span>
                                    <div className="equipment-details">
                                        <div className="equipment-name-small">{record.equipment.name}</div>
                                        <div 
                                            className="equipment-quality-small"
                                            style={{ color: QUALITY_COLORS[record.equipment.quality] }}
                                        >
                                            Lv.{record.equipment.level} {record.equipment.qualityName}
                                        </div>
                                    </div>
                                    <div className="equipment-stats-small">
                                        <div>攻:{record.equipment.attack}</div>
                                        <div>生:{record.equipment.life}</div>
                                        <div>防:{record.equipment.defense}</div>
                                        <div>敏:{record.equipment.agility}</div>
                                    </div>
                                </div>
                                {record.equipment.affixes && record.equipment.affixes.length > 0 && (
                                    <div className="record-affixes">
                                        {record.equipment.affixes.map((affix, idx) => (
                                            <span key={idx} className="affix-badge">
                                                {affix.name}+{affix.value}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {record.type === RECORD_TYPES.DISASSEMBLE && record.reward && (
                                    <div className="record-reward">
                                        获得 {record.reward} 灵石
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="modal-actions">
                    <button className="btn-primary" onClick={onClose}>
                        关闭
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecordsModal;
