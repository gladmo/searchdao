import { useGame } from '../contexts/GameContext';
import { EQUIPMENT_TYPES, QUALITY_COLORS } from '../constants/gameConfig';
import { formatAffixes } from '../utils/equipmentUtils';
import './EquipmentGrid.css';

const EquipmentGrid = ({ onEquipmentClick }) => {
    const { gameState } = useGame();

    return (
        <div className="equipment-container">
            <div className="equipment-grid">
                {EQUIPMENT_TYPES.map((type) => {
                    const equipment = gameState.equipment[type.type];
                    const hasEquipment = !!equipment;

                    return (
                        <div 
                            key={type.type}
                            className={`equipment-slot ${hasEquipment ? 'equipped' : ''}`}
                            onClick={() => hasEquipment && onEquipmentClick(type.type)}
                            style={{
                                borderColor: hasEquipment ? QUALITY_COLORS[equipment.quality] : '#ddd'
                            }}
                        >
                            <div className="equipment-icon">{type.icon}</div>
                            {hasEquipment && (
                                <>
                                    <div className="equipment-level">Lv.{equipment.level}</div>
                                    <div className="equipment-quality" style={{ color: QUALITY_COLORS[equipment.quality] }}>
                                        {equipment.qualityName}
                                    </div>
                                    {equipment.affixes && equipment.affixes.length > 0 && (
                                        <div className="equipment-affixes">
                                            {formatAffixes(equipment)}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="equipment-actions">
                <div className="spirit-display">
                    <span>灵兽</span>
                    <span>🐉</span>
                </div>
                <div className="feature-buttons">
                    <button className="feature-btn" onClick={() => onEquipmentClick('records')}>精怪</button>
                    <button className="feature-btn">灵脉</button>
                    <button className="feature-btn">法宝</button>
                    <button className="feature-btn disabled">座驾</button>
                </div>
            </div>
        </div>
    );
};

export default EquipmentGrid;
