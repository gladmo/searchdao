import { useGame } from '../contexts/GameContext';
import { getLevelUpInfo } from '../utils/levelUtils';
import './LevelDisplay.css';

const LevelDisplay = () => {
    const { gameState } = useGame();
    const { chopsNeeded } = getLevelUpInfo(gameState.level);
    const progress = gameState.chopCount % chopsNeeded;

    return (
        <div className="level-display">
            <span>
                {gameState.level}级·{gameState.cultivation.stage}·{gameState.cultivation.rank}
                {' '}({progress}/{chopsNeeded})
            </span>
        </div>
    );
};

export default LevelDisplay;
