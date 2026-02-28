import { useGame } from '../contexts/GameContext';
import './StaminaBar.css';

const StaminaBar = () => {
    const { gameState } = useGame();
    const fillPercent = (gameState.stamina / gameState.maxStamina) * 100;

    return (
        <div className="stamina-container">
            <div className="stamina-label">
                修为: <span>{Math.floor(gameState.stamina)}</span>/<span>{gameState.maxStamina}</span>
            </div>
            <div className="stamina-bar">
                <div className="stamina-fill" style={{ width: `${fillPercent}%` }}></div>
            </div>
            <button className="wave-button">波劫</button>
        </div>
    );
};

export default StaminaBar;
