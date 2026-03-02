import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { TRAINING_CONFIG } from '../utils/constants';
import './TrainingModal.css';

const TrainingModal = ({ onClose }) => {
  const { gameState, startTrainingBattle, claimTrainingReward } = useGame();
  const { training, mount } = gameState;
  const [battleResult, setBattleResult] = useState(null);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(training.currentCheckpoint);
  const [selectedSubLevel, setSelectedSubLevel] = useState(training.currentSubLevel);

  // Calculate player combat stats including mount
  const getPlayerStats = () => {
    return {
      attack: gameState.attack + (mount?.attack || 0),
      life: gameState.life + (mount?.life || 0),
      defense: gameState.defense + (mount?.defense || 0),
      agility: gameState.agility + (mount?.agility || 0)
    };
  };

  const handleBattle = () => {
    const result = startTrainingBattle(selectedCheckpoint, selectedSubLevel);
    setBattleResult(result);

    // Auto-advance to next level on victory
    if (result.victory) {
      setTimeout(() => {
        if (selectedSubLevel === TRAINING_CONFIG.subLevelsPerCheckpoint) {
          setSelectedCheckpoint(selectedCheckpoint + 1);
          setSelectedSubLevel(1);
        } else {
          setSelectedSubLevel(selectedSubLevel + 1);
        }
        setBattleResult(null);
      }, 2000);
    }
  };

  const handleClaimReward = (checkpoint) => {
    claimTrainingReward(checkpoint);
  };

  const renderCheckpointList = () => {
    const checkpoints = [];
    const maxVisible = Math.min(training.currentCheckpoint + 5, TRAINING_CONFIG.totalMajorCheckpoints);

    for (let i = 1; i <= maxVisible; i++) {
      const isCompleted = training.completedCheckpoints.includes(i);
      const isCurrent = i === training.currentCheckpoint;
      const isLocked = i > training.currentCheckpoint;
      const isRewardClaimed = training.claimedRewards.includes(i);

      checkpoints.push(
        <div 
          key={i} 
          className={`checkpoint-item ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
          onClick={() => !isLocked && setSelectedCheckpoint(i)}
        >
          <div className="checkpoint-number">
            {isCompleted ? '✓' : isLocked ? '🔒' : i}
          </div>
          <div className="checkpoint-info">
            <div className="checkpoint-name">第 {i} 关</div>
            <div className="checkpoint-reward">
              修为 +{TRAINING_CONFIG.getCultivationReward(i)}
              <br />
              云朵 +{TRAINING_CONFIG.getCloudPieceReward(i)}
            </div>
          </div>
          {isCompleted && !isRewardClaimed && (
            <button 
              className="claim-button-small"
              onClick={(e) => {
                e.stopPropagation();
                handleClaimReward(i);
              }}
            >
              领取
            </button>
          )}
          {isCompleted && isRewardClaimed && (
            <span className="claimed-badge">已领取</span>
          )}
        </div>
      );
    }

    return checkpoints;
  };

  const renderSubLevels = () => {
    if (selectedCheckpoint > training.currentCheckpoint) {
      return <div className="locked-notice">🔒 请先完成前面的关卡</div>;
    }

    const subLevels = [];
    const maxSubLevel = selectedCheckpoint === training.currentCheckpoint 
      ? training.currentSubLevel 
      : TRAINING_CONFIG.subLevelsPerCheckpoint;

    for (let i = 1; i <= TRAINING_CONFIG.subLevelsPerCheckpoint; i++) {
      const isAvailable = i <= maxSubLevel;
      const isBoss = i === TRAINING_CONFIG.bossSubLevel;
      const enemyStats = TRAINING_CONFIG.getEnemyStats(selectedCheckpoint, i);

      subLevels.push(
        <div 
          key={i} 
          className={`sub-level-item ${!isAvailable ? 'locked' : ''} ${isBoss ? 'boss' : ''} ${i === selectedSubLevel ? 'selected' : ''}`}
          onClick={() => isAvailable && setSelectedSubLevel(i)}
        >
          <div className="sub-level-number">
            {isBoss ? '👹' : i}
          </div>
          <div className="sub-level-stats">
            <div className="stat-mini">⚔️ {enemyStats.attack}</div>
            <div className="stat-mini">❤️ {enemyStats.life}</div>
            <div className="stat-mini">🛡️ {enemyStats.defense}</div>
            <div className="stat-mini">⚡ {enemyStats.agility}</div>
          </div>
        </div>
      );
    }

    return subLevels;
  };

  const playerStats = getPlayerStats();
  const enemyStats = TRAINING_CONFIG.getEnemyStats(selectedCheckpoint, selectedSubLevel);
  const canBattle = selectedCheckpoint === training.currentCheckpoint && selectedSubLevel === training.currentSubLevel;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content training-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚔️ 历练玩法</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="training-progress">
            <h3>当前进度</h3>
            <p>第 {training.currentCheckpoint} 关 - 第 {training.currentSubLevel} 小关</p>
            <p>已完成: {training.completedCheckpoints.length} / {TRAINING_CONFIG.totalMajorCheckpoints} 关</p>
          </div>

          <div className="training-content">
            <div className="checkpoints-section">
              <h3>关卡列表</h3>
              <div className="checkpoints-list">
                {renderCheckpointList()}
              </div>
            </div>

            <div className="battle-section">
              <h3>第 {selectedCheckpoint} 关 - 小关</h3>
              <div className="sub-levels-grid">
                {renderSubLevels()}
              </div>

              {selectedCheckpoint <= training.currentCheckpoint && (
                <>
                  <div className="battle-preview">
                    <div className="battle-side player-side">
                      <h4>我方</h4>
                      <div className="battle-stats">
                        <div className="stat-item">⚔️ 攻击: {playerStats.attack}</div>
                        <div className="stat-item">❤️ 生命: {playerStats.life}</div>
                        <div className="stat-item">🛡️ 防御: {playerStats.defense}</div>
                        <div className="stat-item">⚡ 敏捷: {playerStats.agility}</div>
                      </div>
                    </div>

                    <div className="battle-vs">VS</div>

                    <div className="battle-side enemy-side">
                      <h4>敌方 {enemyStats.isBoss ? '(BOSS)' : ''}</h4>
                      <div className="battle-stats">
                        <div className="stat-item">⚔️ 攻击: {enemyStats.attack}</div>
                        <div className="stat-item">❤️ 生命: {enemyStats.life}</div>
                        <div className="stat-item">🛡️ 防御: {enemyStats.defense}</div>
                        <div className="stat-item">⚡ 敏捷: {enemyStats.agility}</div>
                      </div>
                    </div>
                  </div>

                  {battleResult && (
                    <div className={`battle-result ${battleResult.victory ? 'victory' : 'defeat'}`}>
                      {battleResult.victory ? (
                        <>
                          <div className="result-icon">🏆</div>
                          <div className="result-text">战斗胜利！</div>
                          <div className="result-power">
                            我方战力: {battleResult.playerPower} vs 敌方战力: {battleResult.enemyPower}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="result-icon">💔</div>
                          <div className="result-text">战斗失败</div>
                          <div className="result-power">
                            我方战力: {battleResult.playerPower} vs 敌方战力: {battleResult.enemyPower}
                          </div>
                          <div className="result-hint">提升装备和等级后再试吧！</div>
                        </>
                      )}
                    </div>
                  )}

                  <button 
                    className="battle-button"
                    onClick={handleBattle}
                    disabled={!canBattle || battleResult !== null}
                  >
                    {canBattle ? '开始战斗' : '已完成'}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="training-info">
            <h4>💡 玩法说明</h4>
            <p>• 共100个大关卡，每个关卡有10个小关卡</p>
            <p>• 第10小关为BOSS，难度更高</p>
            <p>• 完成关卡可领取修为奖励</p>
            <p>• 完成大关卡额外获得筋斗云朵</p>
            <p>• 战力不足时可先提升装备和等级</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingModal;
