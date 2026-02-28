import { useGame } from '../contexts/GameContext';
import './StatsDisplay.css';

const StatsDisplay = () => {
    const { gameState } = useGame();

    return (
        <div className="stats-display">
            <div className="stat">攻击:<span>{gameState.attack}</span></div>
            <div className="stat">生命:<span>{gameState.life}</span></div>
            <div className="stat">防御:<span>{gameState.defense}</span></div>
            <div className="stat">敏捷:<span>{gameState.agility}</span></div>
        </div>
    );
};

export default StatsDisplay;
