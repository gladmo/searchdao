import React from 'react';
import { useGame } from '../contexts/GameContext';
import './TasksModal.css';

const TasksModal = ({ onClose }) => {
  const { gameState, claimTaskReward } = useGame();

  const handleClaim = (taskId) => {
    claimTaskReward(taskId);
  };

  const getProgressPercentage = (task) => {
    return Math.min((task.progress / task.target) * 100, 100);
  };

  const hasClaimableTask = gameState.tasks.some(task => task.completed && !task.claimed);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content tasks-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📜 成长任务</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {gameState.tasks.length === 0 ? (
            <div className="no-tasks">
              <p>暂无任务</p>
            </div>
          ) : (
            <div className="tasks-list">
              {gameState.tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`task-item ${task.completed ? 'completed' : ''} ${task.claimed ? 'claimed' : ''}`}
                >
                  <div className="task-header">
                    <span className="task-icon">{task.icon}</span>
                    <div className="task-info">
                      <h3 className="task-name">{task.name}</h3>
                      <p className="task-description">{task.description}</p>
                    </div>
                    <div className="task-reward">
                      <span className="reward-label">奖励</span>
                      <span className="reward-value">修为 +{task.reward}</span>
                    </div>
                  </div>
                  
                  <div className="task-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${getProgressPercentage(task)}%` }}
                      />
                    </div>
                    <div className="progress-text">
                      {task.progress} / {task.target}
                    </div>
                  </div>
                  
                  {task.completed && !task.claimed && (
                    <button 
                      className="claim-button"
                      onClick={() => handleClaim(task.id)}
                    >
                      领取奖励
                    </button>
                  )}
                  
                  {task.claimed && (
                    <div className="claimed-badge">已领取</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <div className="tasks-summary">
            <span>
              完成: {gameState.tasks.filter(t => t.completed).length} / {gameState.tasks.length}
            </span>
            {hasClaimableTask && (
              <span className="claimable-hint">⭐ 有任务可领取！</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksModal;
