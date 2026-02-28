import { useGame } from '../contexts/GameContext';
import './BottomActions.css';

const BottomActions = ({ onChop, onToggleAutoEquip }) => {
    const { gameState } = useGame();

    return (
        <div className="bottom-actions">
            <div className="disassemble-info">
                <span className="disassemble-icon">♻️</span>
                <span>分解装备获得<span>{gameState.disassembleReward}</span>个灵石(<span>{gameState.disassembleCount}</span>/100)</span>
            </div>
            <button className="action-btn chop-btn" onClick={onChop}>
                <span className="btn-icon">🪓</span>
                <span className="stamina-cost">1</span>
            </button>
            <div className="auto-actions">
                <button className="toggle-btn" onClick={onToggleAutoEquip}>
                    <span>自动</span>
                    <span className="toggle-status">{gameState.autoEquip ? 'ON' : 'OFF'}</span>
                </button>
                <button className="info-btn">等级</button>
            </div>
        </div>
    );
};

export default BottomActions;
