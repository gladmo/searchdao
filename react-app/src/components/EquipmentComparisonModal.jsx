import { QUALITY_COLORS } from '../constants/gameConfig';
import { calculateEquipmentPower, formatAffixes } from '../utils/equipmentUtils';
import './EquipmentComparisonModal.css';

const EquipmentComparisonModal = ({ oldEquipment, newEquipment, onEquipNew, onKeepOld }) => {
    const oldPower = calculateEquipmentPower(oldEquipment);
    const newPower = calculateEquipmentPower(newEquipment);
    const powerDiff = newPower - oldPower;

    const createComparisonRow = (statName, oldValue, newValue) => {
        const diff = newValue - oldValue;
        const diffClass = diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'neutral';
        const arrow = diff > 0 ? '▲' : diff < 0 ? '▼' : '';

        return (
            <div key={statName} className="stat-row">
                <span className="stat-name">{statName}</span>
                <span className="stat-old">{oldValue}</span>
                <span className={`stat-diff ${diffClass}`}>
                    {arrow}{diff !== 0 ? Math.abs(diff) : ''}
                </span>
                <span className="stat-new">{newValue}</span>
            </div>
        );
    };

    return (
        <div className="modal-overlay" onClick={onKeepOld}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>获得新装备</h3>
                
                <div className="equipment-comparison">
                    <div className="equipment-card">
                        <div className="equipment-header">
                            <span className="equipment-icon-large">{oldEquipment.icon}</span>
                            <div className="equipment-info">
                                <div className="equipment-name">{oldEquipment.name}</div>
                                <div 
                                    className="equipment-quality-text"
                                    style={{ color: QUALITY_COLORS[oldEquipment.quality] }}
                                >
                                    Lv.{oldEquipment.level} {oldEquipment.qualityName}
                                </div>
                            </div>
                        </div>
                        {oldEquipment.affixes && oldEquipment.affixes.length > 0 && (
                            <div className="equipment-affixes-display">
                                {formatAffixes(oldEquipment)}
                            </div>
                        )}
                        <div className="equipment-power">战力: {oldPower}</div>
                    </div>

                    <div className="comparison-arrow">→</div>

                    <div className="equipment-card">
                        <div className="equipment-header">
                            <span className="equipment-icon-large">{newEquipment.icon}</span>
                            <div className="equipment-info">
                                <div className="equipment-name">{newEquipment.name}</div>
                                <div 
                                    className="equipment-quality-text"
                                    style={{ color: QUALITY_COLORS[newEquipment.quality] }}
                                >
                                    Lv.{newEquipment.level} {newEquipment.qualityName}
                                </div>
                            </div>
                        </div>
                        {newEquipment.affixes && newEquipment.affixes.length > 0 && (
                            <div className="equipment-affixes-display">
                                {formatAffixes(newEquipment)}
                            </div>
                        )}
                        <div className="equipment-power">
                            战力: {newPower} 
                            {powerDiff !== 0 && (
                                <span className={powerDiff > 0 ? 'positive' : 'negative'}>
                                    {' '}({powerDiff > 0 ? '+' : ''}{powerDiff})
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="stats-comparison">
                    <div className="stats-header">
                        <span className="stat-name">属性</span>
                        <span className="stat-old">旧装备</span>
                        <span className="stat-diff">变化</span>
                        <span className="stat-new">新装备</span>
                    </div>
                    {createComparisonRow('攻击', oldEquipment.attack, newEquipment.attack)}
                    {createComparisonRow('生命', oldEquipment.life, newEquipment.life)}
                    {createComparisonRow('防御', oldEquipment.defense, newEquipment.defense)}
                    {createComparisonRow('敏捷', oldEquipment.agility, newEquipment.agility)}
                </div>

                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onKeepOld}>
                        保留旧的
                    </button>
                    <button className="btn-primary" onClick={onEquipNew}>
                        装备新的
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EquipmentComparisonModal;
