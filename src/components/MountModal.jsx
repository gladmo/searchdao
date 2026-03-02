import React from 'react';
import { useGame } from '../contexts/GameContext';
import { MOUNT_CONFIG } from '../utils/constants';
import './MountModal.css';

const MountModal = ({ onClose }) => {
  const { gameState, synthesizeMount, upgradeMount } = useGame();
  const { mount, cloudPieces, level } = gameState;

  const isUnlocked = level >= MOUNT_CONFIG.unlockLevel;
  const synthesisRequirement = MOUNT_CONFIG.getSynthesisRequirement();
  const upgradeRequirement = mount ? MOUNT_CONFIG.getUpgradeRequirement(mount.level) : 0;

  const handleSynthesize = () => {
    synthesizeMount();
  };

  const handleUpgrade = () => {
    upgradeMount();
  };

  const renderMountStats = () => {
    if (!mount) return null;

    return (
      <div className="mount-stats">
        <h3>筋斗云 - {mount.level}级</h3>
        <div className="mount-attributes">
          <div className="attribute-item">
            <span className="attribute-label">⚔️ 攻击:</span>
            <span className="attribute-value">{mount.attack}</span>
          </div>
          <div className="attribute-item">
            <span className="attribute-label">❤️ 生命:</span>
            <span className="attribute-value">{mount.life}</span>
          </div>
          <div className="attribute-item">
            <span className="attribute-label">🛡️ 防御:</span>
            <span className="attribute-value">{mount.defense}</span>
          </div>
          <div className="attribute-item">
            <span className="attribute-label">⚡ 敏捷:</span>
            <span className="attribute-value">{mount.agility}</span>
          </div>
        </div>

        {mount.affixes && mount.affixes.length > 0 && (
          <div className="mount-affixes">
            <h4>特殊词条</h4>
            {mount.affixes.map((affix, index) => (
              <div key={index} className="affix-item">
                {affix.name} +{affix.value}
              </div>
            ))}
          </div>
        )}

        {mount.skills && mount.skills.length > 0 && (
          <div className="mount-skills">
            <h4>特殊技能</h4>
            {mount.skills.map((skill, index) => (
              <div key={index} className="skill-item">
                {skill.name} {skill.value}%
              </div>
            ))}
          </div>
        )}

        {mount.level < MOUNT_CONFIG.maxLevel && (
          <div className="upgrade-section">
            <h4>升级对比 (Lv.{mount.level} → Lv.{mount.level + 1})</h4>
            <div className="comparison-grid">
              <div className="comparison-column current-column">
                <div className="comparison-header">当前等级 ({mount.level}级)</div>
                <div className="comparison-stat">
                  <span className="stat-label">⚔️ 攻击:</span>
                  <span className="stat-value">{mount.attack}</span>
                </div>
                <div className="comparison-stat">
                  <span className="stat-label">❤️ 生命:</span>
                  <span className="stat-value">{mount.life}</span>
                </div>
                <div className="comparison-stat">
                  <span className="stat-label">🛡️ 防御:</span>
                  <span className="stat-value">{mount.defense}</span>
                </div>
                <div className="comparison-stat">
                  <span className="stat-label">⚡ 敏捷:</span>
                  <span className="stat-value">{mount.agility}</span>
                </div>
              </div>
              
              <div className="comparison-arrow">→</div>
              
              <div className="comparison-column next-column">
                <div className="comparison-header">下一等级 ({mount.level + 1}级)</div>
                {(() => {
                  const nextAttrs = MOUNT_CONFIG.getAttributesByLevel(mount.level + 1);
                  return (
                    <>
                      <div className="comparison-stat">
                        <span className="stat-label">⚔️ 攻击:</span>
                        <span className="stat-value increase">
                          {nextAttrs.attack}
                          <span className="increase-amount">(+{nextAttrs.attack - mount.attack})</span>
                        </span>
                      </div>
                      <div className="comparison-stat">
                        <span className="stat-label">❤️ 生命:</span>
                        <span className="stat-value increase">
                          {nextAttrs.life}
                          <span className="increase-amount">(+{nextAttrs.life - mount.life})</span>
                        </span>
                      </div>
                      <div className="comparison-stat">
                        <span className="stat-label">🛡️ 防御:</span>
                        <span className="stat-value increase">
                          {nextAttrs.defense}
                          <span className="increase-amount">(+{nextAttrs.defense - mount.defense})</span>
                        </span>
                      </div>
                      <div className="comparison-stat">
                        <span className="stat-label">⚡ 敏捷:</span>
                        <span className="stat-value increase">
                          {nextAttrs.agility}
                          <span className="increase-amount">(+{nextAttrs.agility - mount.agility})</span>
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
            <button 
              className="upgrade-button" 
              onClick={handleUpgrade}
              disabled={cloudPieces < upgradeRequirement}
            >
              升级 (需要 {upgradeRequirement} 筋斗云朵)
            </button>
          </div>
        )}

        {mount.level >= MOUNT_CONFIG.maxLevel && (
          <div className="max-level-notice">
            ✨ 已达到最高等级！
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content mount-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>☁️ 坐骑筋斗云</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="cloud-pieces-display">
            <span className="cloud-icon">☁️</span>
            <span className="cloud-count">筋斗云朵: {cloudPieces}</span>
          </div>

          {!isUnlocked && (
            <div className="unlock-notice">
              <p>🔒 坐骑系统将在筑基期（{MOUNT_CONFIG.unlockLevel}级）时解锁</p>
              <p>当前等级: {level}级</p>
            </div>
          )}

          {isUnlocked && !mount && (
            <div className="synthesis-section">
              <h3>合成筋斗云</h3>
              <p>筋斗云是养成型坐骑，可通过筋斗云朵合成并持续升级</p>
              <p>每个等级提升基础属性、特殊词条和技能</p>
              
              <div className="synthesis-preview">
                <h4>初始属性预览</h4>
                {(() => {
                  const attrs = MOUNT_CONFIG.getAttributesByLevel(1);
                  return (
                    <div className="preview-attributes">
                      <div className="preview-item">⚔️ 攻击: {attrs.attack}</div>
                      <div className="preview-item">❤️ 生命: {attrs.life}</div>
                      <div className="preview-item">🛡️ 防御: {attrs.defense}</div>
                      <div className="preview-item">⚡ 敏捷: {attrs.agility}</div>
                    </div>
                  );
                })()}
              </div>

              <button 
                className="synthesis-button" 
                onClick={handleSynthesize}
                disabled={cloudPieces < synthesisRequirement}
              >
                合成 (需要 {synthesisRequirement} 筋斗云朵)
              </button>
            </div>
          )}

          {isUnlocked && mount && renderMountStats()}

          <div className="mount-info">
            <h4>💡 获取方式</h4>
            <p>• 砍树时有极小概率掉落筋斗云朵</p>
            <p>• 完成历练关卡可获得筋斗云朵奖励</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MountModal;
