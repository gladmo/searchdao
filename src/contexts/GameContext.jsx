import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadGameState, saveGameState } from '../utils/storage';
import { calculateMaxStamina, calculateCombatPower } from '../utils/calculations';
import { generateEquipment, generateAffixes } from '../utils/equipment';
import { simulateTurnBasedCombat } from '../utils/combat';
import { LEVEL_CONFIG, RECORD_TYPES, MAX_RECORDS, CULTIVATION_POINTS_PER_CHOP, CULTIVATION_POINTS_PER_LEVEL, TASK_CONFIG, TASK_TYPES, MOUNT_CONFIG, TRAINING_CONFIG } from '../utils/constants';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  // Helper function to generate tasks for current level
  const generateTasksForLevel = (level) => {
    const config = TASK_CONFIG.find(c => level >= c.minLevel && level <= c.maxLevel);
    if (!config) return [];
    
    return config.tasks.map((task, index) => ({
      id: `task_${level}_${index}`,
      ...task,
      progress: 0,
      completed: false,
      claimed: false
    }));
  };

  const [gameState, setGameState] = useState(() => {
    const saved = loadGameState();
    if (saved) {
      // Ensure maxStamina is calculated correctly on load
      saved.maxStamina = calculateMaxStamina(saved.level);
      // Initialize cultivationPoints if not present (for backward compatibility)
      saved.cultivationPoints = saved.cultivationPoints ?? 0;
      // Initialize tasks if not present or regenerate if level changed
      if (!saved.tasks || saved.tasks.length === 0) {
        saved.tasks = generateTasksForLevel(saved.level);
      }
      // Initialize mount system if not present
      saved.cloudPieces = saved.cloudPieces ?? 0;
      saved.mount = saved.mount ?? null;
      // Initialize training system if not present
      saved.training = saved.training ?? {
        currentCheckpoint: 1,
        currentSubLevel: 1,
        completedCheckpoints: [],
        claimedRewards: []
      };
      return saved;
    }
    return {
      combatPower: 0,
      spiritStone: 0,
      crystal: 1142,
      stamina: 50,
      maxStamina: 50,
      staminaRecoveryRate: 1,
      lastStaminaUpdate: Date.now(),
      level: 1,
      chopCount: 0,
      cultivationPoints: 0,
      cultivation: {
        stage: '炼气前期',
        rank: '一阶'
      },
      attack: 0,
      life: 100,
      defense: 0,
      agility: 0,
      equipment: {},
      maxEquipment: 12,
      equipmentIdCounter: 0,
      autoEquip: false,
      disassembleCount: 0,
      disassembleReward: 0,
      records: [],
      tasks: generateTasksForLevel(1),
      // Mount system
      cloudPieces: 0,
      mount: null,
      // Training system
      training: {
        currentCheckpoint: 1,
        currentSubLevel: 1,
        completedCheckpoints: [],
        claimedRewards: []
      }
    };
  });

  const [notification, setNotification] = useState('');

  // Save game state whenever it changes
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // Stamina recovery
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const now = Date.now();
        const timePassed = (now - prev.lastStaminaUpdate) / 10000;
        const staminaToRecover = Math.floor(timePassed * prev.staminaRecoveryRate);

        if (staminaToRecover > 0 && prev.stamina < prev.maxStamina) {
          const newStamina = Math.min(prev.maxStamina, prev.stamina + staminaToRecover);
          return {
            ...prev,
            stamina: newStamina,
            lastStaminaUpdate: now
          };
        }
        return prev;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const showNotification = useCallback((message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  }, []);

  const addRecord = useCallback((type, equipment, extraInfo = {}) => {
    setGameState(prev => {
      const record = {
        id: Date.now(),
        type,
        timestamp: new Date().toLocaleString('zh-CN'),
        equipment: { ...equipment },
        ...extraInfo
      };

      const newRecords = [record, ...prev.records];
      if (newRecords.length > MAX_RECORDS) {
        newRecords.length = MAX_RECORDS;
      }

      return { ...prev, records: newRecords };
    });
  }, []);

  const updateCombatPower = useCallback(() => {
    setGameState(prev => {
      const combatPower = calculateCombatPower(prev);
      return { ...prev, combatPower };
    });
  }, []);

  const updateCultivationStage = (level) => {
    for (const config of LEVEL_CONFIG.stages) {
      if (level >= config.minLevel && level <= config.maxLevel) {
        const rankIndex = Math.floor((level - config.minLevel) / 3);
        const rank = config.ranks[Math.min(rankIndex, config.ranks.length - 1)];
        return {
          stage: config.name,
          rank: rank
        };
      }
    }
    return { stage: '飞升期', rank: '十阶' };
  };

  const calculateDisassembleReward = (equipment) => {
    const baseReward = 10;
    const qualityMultiplier = equipment.quality || 1;
    const levelMultiplier = equipment.level || 1;
    return Math.floor(baseReward * qualityMultiplier * levelMultiplier);
  };

  const updateTaskProgress = useCallback((taskType, amount) => {
    setGameState(prev => {
      const updatedTasks = prev.tasks.map(task => {
        if (task.type === taskType && !task.completed) {
          const newProgress = task.progress + amount;
          return {
            ...task,
            progress: newProgress,
            completed: newProgress >= task.target
          };
        }
        return task;
      });

      return { ...prev, tasks: updatedTasks };
    });
  }, []);

  const checkLevelUp = useCallback(() => {
    setGameState(prev => {
      const requiredCultivation = prev.level * CULTIVATION_POINTS_PER_LEVEL;
      if (prev.cultivationPoints >= requiredCultivation) {
        const newLevel = prev.level + 1;
        const newMaxStamina = calculateMaxStamina(newLevel);
        const cultivation = updateCultivationStage(newLevel);

        showNotification(`✨ 恭喜升级！等级提升至 ${newLevel} 级 - ${cultivation.stage} ${cultivation.rank}`);

        // Check if we need to generate new tasks for the new level
        const currentConfig = TASK_CONFIG.find(c => prev.level >= c.minLevel && prev.level <= c.maxLevel);
        const newConfig = TASK_CONFIG.find(c => newLevel >= c.minLevel && newLevel <= c.maxLevel);
        
        let newTasks = prev.tasks;
        // Generate new tasks if moving to a different level range
        if (currentConfig !== newConfig) {
          newTasks = generateTasksForLevel(newLevel);
          showNotification(`📜 新的成长任务已更新！`);
        }

        return {
          ...prev,
          level: newLevel,
          cultivationPoints: prev.cultivationPoints - requiredCultivation,
          maxStamina: newMaxStamina,
          stamina: Math.min(prev.stamina, newMaxStamina),
          cultivation,
          tasks: newTasks
        };
      }
      return prev;
    });
  }, [showNotification]);

  const chopTree = useCallback(() => {
    if (gameState.stamina < 1) {
      showNotification('修为不足！');
      return null;
    }

    // Capture current level and combat power before state update
    const currentLevel = gameState.level;
    const currentCombatPower = gameState.combatPower;

    // Check for cloud piece drop (very small chance)
    const cloudPieceDrop = Math.random() < MOUNT_CONFIG.cloudPieceDropRate;

    setGameState(prev => {
      const newState = {
        ...prev,
        stamina: prev.stamina - 1,
        chopCount: prev.chopCount + 1,
        cultivationPoints: prev.cultivationPoints + CULTIVATION_POINTS_PER_CHOP
      };
      
      // Add cloud piece if dropped
      if (cloudPieceDrop) {
        newState.cloudPieces = prev.cloudPieces + 1;
      }
      
      return newState;
    });

    // Show notification for cloud piece drop
    if (cloudPieceDrop) {
      showNotification('✨ 获得筋斗云朵 x1');
    }

    // Update task progress for chop tasks
    updateTaskProgress(TASK_TYPES.CHOP, 1);

    // Drop equipment using captured values
    const equipment = generateEquipment(currentLevel, currentCombatPower);
    addRecord(RECORD_TYPES.DROP, equipment);

    // Check level up
    setTimeout(() => checkLevelUp(), 100);

    return equipment;
  }, [gameState.stamina, gameState.level, gameState.combatPower, showNotification, addRecord, checkLevelUp, updateTaskProgress]);

  const equipNewEquipment = useCallback((equipment) => {
    setGameState(prev => {
      const newEquipment = { ...prev.equipment };
      newEquipment[equipment.type] = equipment;

      addRecord(RECORD_TYPES.EQUIP, equipment);

      return { ...prev, equipment: newEquipment };
    });

    // Update task progress for equip tasks
    updateTaskProgress(TASK_TYPES.EQUIP, 1);

    setTimeout(() => updateCombatPower(), 100);
  }, [addRecord, updateCombatPower, updateTaskProgress]);

  const disassembleEquipment = useCallback((equipmentType) => {
    const equipment = gameState.equipment[equipmentType];
    if (!equipment) return;

    const reward = calculateDisassembleReward(equipment);

    setGameState(prev => {
      const newEquipment = { ...prev.equipment };
      delete newEquipment[equipmentType];

      addRecord(RECORD_TYPES.DISASSEMBLE, equipment, { reward });

      return {
        ...prev,
        equipment: newEquipment,
        spiritStone: prev.spiritStone + reward,
        disassembleCount: prev.disassembleCount + 1,
        disassembleReward: prev.disassembleReward + reward
      };
    });

    // Update task progress for disassemble tasks
    updateTaskProgress(TASK_TYPES.DISASSEMBLE, 1);

    setTimeout(() => updateCombatPower(), 100);
    showNotification(`分解 ${equipment.name}，获得 ${reward} 灵石`);
  }, [gameState.equipment, addRecord, updateCombatPower, showNotification, updateTaskProgress]);

  const autoDisassembleNewEquipment = useCallback((equipment) => {
    const reward = calculateDisassembleReward(equipment);

    setGameState(prev => {
      addRecord(RECORD_TYPES.DISASSEMBLE, equipment, { reward });

      return {
        ...prev,
        spiritStone: prev.spiritStone + reward,
        disassembleCount: prev.disassembleCount + 1,
        disassembleReward: prev.disassembleReward + reward
      };
    });

    // Update task progress for disassemble tasks
    updateTaskProgress(TASK_TYPES.DISASSEMBLE, 1);

    return reward;
  }, [addRecord, updateTaskProgress]);

  const updateCombatPowerTask = useCallback(() => {
    setGameState(prev => {
      const updatedTasks = prev.tasks.map(task => {
        if (task.type === TASK_TYPES.COMBAT_POWER && !task.completed) {
          const completed = prev.combatPower >= task.target;
          
          if (completed && !task.completed) {
            setTimeout(() => {
              showNotification(`✅ 任务完成：${task.name}！可以领取奖励了`);
            }, 100);
          }
          
          return {
            ...task,
            progress: prev.combatPower,
            completed
          };
        }
        return task;
      });
      
      return { ...prev, tasks: updatedTasks };
    });
  }, [showNotification]);

  // Update combat power tasks when combat power changes
  useEffect(() => {
    updateCombatPowerTask();
  }, [gameState.combatPower, updateCombatPowerTask]);

  const claimTaskReward = useCallback((taskId) => {
    setGameState(prev => {
      const task = prev.tasks.find(t => t.id === taskId);
      if (!task || !task.completed || task.claimed) {
        return prev;
      }

      const updatedTasks = prev.tasks.map(t => 
        t.id === taskId ? { ...t, claimed: true } : t
      );

      showNotification(`🎉 领取奖励：修为 +${task.reward}`);

      return {
        ...prev,
        tasks: updatedTasks,
        cultivationPoints: prev.cultivationPoints + task.reward
      };
    });

    // Check for level up after claiming reward
    setTimeout(() => checkLevelUp(), 100);
  }, [showNotification, checkLevelUp]);

  const toggleAutoEquip = useCallback(() => {
    setGameState(prev => ({ ...prev, autoEquip: !prev.autoEquip }));
  }, []);

  // Mount System Functions
  const synthesizeMount = useCallback(() => {
    const requirement = MOUNT_CONFIG.getSynthesisRequirement();
    if (gameState.cloudPieces < requirement) {
      showNotification(`需要 ${requirement} 个筋斗云朵才能合成！`);
      return false;
    }
    
    if (gameState.level < MOUNT_CONFIG.unlockLevel) {
      showNotification(`需达到筑基期（${MOUNT_CONFIG.unlockLevel}级）才能合成坐骑！`);
      return false;
    }

    setGameState(prev => {
      const attributes = MOUNT_CONFIG.getAttributesByLevel(1);
      const mount = {
        level: 1,
        ...attributes,
        affixes: [],
        skills: []
      };

      showNotification('🎉 成功合成筋斗云坐骑！');

      return {
        ...prev,
        cloudPieces: prev.cloudPieces - requirement,
        mount
      };
    });

    setTimeout(() => updateCombatPower(), 100);
    return true;
  }, [gameState.cloudPieces, gameState.level, showNotification, updateCombatPower]);

  const upgradeMount = useCallback(() => {
    if (!gameState.mount) {
      showNotification('请先合成坐骑！');
      return false;
    }

    const currentLevel = gameState.mount.level;
    if (currentLevel >= MOUNT_CONFIG.maxLevel) {
      showNotification('坐骑已达到最高等级！');
      return false;
    }

    const requirement = MOUNT_CONFIG.getUpgradeRequirement(currentLevel);
    if (gameState.cloudPieces < requirement) {
      showNotification(`需要 ${requirement} 个筋斗云朵才能升级！`);
      return false;
    }

    setGameState(prev => {
      const newLevel = prev.mount.level + 1;
      const attributes = MOUNT_CONFIG.getAttributesByLevel(newLevel);
      
      // Generate affixes if level reaches threshold
      const affixCount = MOUNT_CONFIG.getAffixesByLevel(newLevel);
      let affixes = prev.mount.affixes || [];
      if (affixCount > affixes.length) {
        affixes = generateAffixes(affixCount);
      }

      // Note: Skills functionality will be implemented in a future update
      // For now, we keep the skills array empty
      const skills = [];

      const mount = {
        ...prev.mount,
        level: newLevel,
        ...attributes,
        affixes,
        skills
      };

      showNotification(`✨ 坐骑升级至 ${newLevel} 级！`);

      return {
        ...prev,
        cloudPieces: prev.cloudPieces - requirement,
        mount
      };
    });

    setTimeout(() => updateCombatPower(), 100);
    return true;
  }, [gameState.cloudPieces, gameState.mount, showNotification, updateCombatPower]);

  // Training System Functions
  const startTrainingBattle = useCallback((checkpoint, subLevel) => {
    // Get current player stats including mount
    const playerStats = {
      attack: gameState.attack + (gameState.mount?.attack || 0),
      life: gameState.life + (gameState.mount?.life || 0),
      defense: gameState.defense + (gameState.mount?.defense || 0),
      agility: gameState.agility + (gameState.mount?.agility || 0),
      skills: gameState.mount?.skills || []
    };

    // Get enemy stats
    const enemyStats = TRAINING_CONFIG.getEnemyStats(checkpoint, subLevel);

    // Simulate turn-based combat
    const result = simulateTurnBasedCombat(playerStats, enemyStats);

    if (result.victory) {
      // Update training progress
      setGameState(prev => {
        const newTraining = { ...prev.training };
        
        // Mark checkpoint as completed if this was the last sub-level
        if (subLevel === TRAINING_CONFIG.subLevelsPerCheckpoint) {
          if (!newTraining.completedCheckpoints.includes(checkpoint)) {
            newTraining.completedCheckpoints.push(checkpoint);
          }
          // Move to next checkpoint
          newTraining.currentCheckpoint = checkpoint + 1;
          newTraining.currentSubLevel = 1;
        } else {
          // Move to next sub-level
          newTraining.currentSubLevel = subLevel + 1;
        }

        return {
          ...prev,
          training: newTraining
        };
      });

      const isBoss = enemyStats.isBoss;
      showNotification(isBoss ? '🏆 击败BOSS！' : '✓ 战斗胜利！');
    } else {
      showNotification('✗ 战斗失败！请提升实力后再试。');
    }

    return result;
  }, [gameState.attack, gameState.life, gameState.defense, gameState.agility, gameState.mount, showNotification]);

  const claimTrainingReward = useCallback((checkpoint) => {
    if (!gameState.training.completedCheckpoints.includes(checkpoint)) {
      showNotification('请先完成该关卡！');
      return false;
    }

    if (gameState.training.claimedRewards.includes(checkpoint)) {
      showNotification('已经领取过该关卡奖励！');
      return false;
    }

    const cultivationReward = TRAINING_CONFIG.getCultivationReward(checkpoint);
    const cloudPieceReward = TRAINING_CONFIG.getCloudPieceReward(checkpoint);

    setGameState(prev => {
      const newTraining = { ...prev.training };
      newTraining.claimedRewards.push(checkpoint);

      showNotification(`🎉 获得修为 +${cultivationReward}，筋斗云朵 +${cloudPieceReward}`);

      return {
        ...prev,
        training: newTraining,
        cultivationPoints: prev.cultivationPoints + cultivationReward,
        cloudPieces: prev.cloudPieces + cloudPieceReward
      };
    });

    setTimeout(() => checkLevelUp(), 100);
    return true;
  }, [gameState.training, showNotification, checkLevelUp]);

  const value = {
    gameState,
    setGameState,
    notification,
    showNotification,
    chopTree,
    equipNewEquipment,
    disassembleEquipment,
    autoDisassembleNewEquipment,
    toggleAutoEquip,
    updateCombatPower,
    addRecord,
    claimTaskReward,
    // Mount system
    synthesizeMount,
    upgradeMount,
    // Training system
    startTrainingBattle,
    claimTrainingReward
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
