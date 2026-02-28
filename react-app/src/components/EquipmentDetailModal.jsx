import { QUALITY_COLORS } from '../constants/gameConfig';
import { calculateEquipmentPower, formatAffixes } from '../utils/equipmentUtils';
import './EquipmentDetailModal.css';

const EquipmentDetailModal = ({ equipment, onClose, onDisassemble }) => {
    const power = calculateEquipmentPower(equipment);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content equipment-detail" onClick={(e) => e.stopPropagation()}>
                <h3>装备详情</h3>
                
                <div className="equipment-detail-card">
                    <div className="equipment-header">
                        <span className="equipment-icon-xlarge">{equipment.icon}</span>
                        <div className="equipment-info">
                            <div className="equipment-name">{equipment.name}</div>
                            <div 
                                className="equipment-quality-text"
                                style={{ color: QUALITY_COLORS[equipment.quality] }}
                            >
                                Lv.{equipment.level} {equipment.qualityName}
                            </div>
                            <div className="equipment-power">战力: {power}</div>
                        </div>
                    </div>

                    {equipment.affixes && equipment.affixes.length > 0 && (
                        <div className="affixes-section">
                            <div className="section-title">附加属性</div>
                            <div className="affixes-list">
                                {equipment.affixes.map((affix, index) => (
                                    <div key={index} className="affix-item">
                                        {affix.name} +{affix.value}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="stats-section">
                        <div className="section-title">基础属性</div>
                        <div className="stats-list">
                            <div className="stat-item">
                                <span>攻击</span>
                                <span>{equipment.attack}</span>
                            </div>
                            <div className="stat-item">
                                <span>生命</span>
                                <span>{equipment.life}</span>
                            </div>
                            <div className="stat-item">
                                <span>防御</span>
                                <span>{equipment.defense}</span>
                            </div>
                            <div className="stat-item">
                                <span>敏捷</span>
                                <span>{equipment.agility}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onClose}>
                        关闭
                    </button>
                    <button className="btn-danger" onClick={onDisassemble}>
                        分解
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EquipmentDetailModal;
