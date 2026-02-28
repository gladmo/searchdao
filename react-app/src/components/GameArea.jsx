import './GameArea.css';

const GameArea = ({ onChop }) => {
    return (
        <div className="game-area">
            <div className="tree-container">
                <div className="tree" onClick={onChop}>🌳</div>
                <div className="character">🐭⛏️</div>
            </div>
        </div>
    );
};

export default GameArea;
