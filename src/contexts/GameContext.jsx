import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadGameState, saveGameState } from '../utils/storage';
import { calculateMaxStamina, calculateCombatPower, calculateEquipmentPower } from '../utils/calculations';
import { generateEquipment, generateAffixes, applyAffixesToEquipment } from '../utils/equipment';
import { LEVEL_CONFIG, RECORD_TYPES, MAX_RECORDS, CULTIVATION_POINTS_PER_CHOP, CULTIVATION_POINTS_PER_LEVEL, TASK_CONFIG, TASK_TYPES } from '../utils/constants';

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
      tasks: generateTasksForLevel(1)
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

  const chopTree = useCallback(() => {
    if (gameState.stamina < 1) {
      showNotification('修为不足！');
      return null;
    }

    // Capture current level and combat power before state update
    const currentLevel = gameState.level;
    const currentCombatPower = gameState.combatPower;

    setGameState(prev => {
      const newState = {
        ...prev,
        stamina: prev.stamina - 1,
        chopCount: prev.chopCount + 1,
        cultivationPoints: prev.cultivationPoints + CULTIVATION_POINTS_PER_CHOP
      };
      return newState;
    });

    // Update task progress for chop tasks
    updateTaskProgress(TASK_TYPES.CHOP, 1);

    // Drop equipment using captured values
    const equipment = generateEquipment(currentLevel, currentCombatPower);
    addRecord(RECORD_TYPES.DROP, equipment);

    // Check level up
    setTimeout(() => checkLevelUp(), 100);

    return equipment;
  }, [gameState.stamina, gameState.level, gameState.combatPower, showNotification, addRecord, checkLevelUp]);

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
  }, [addRecord, updateCombatPower]);

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
    // Update task progress for spirit stone collection
    updateTaskProgress(TASK_TYPES.COLLECT_SPIRIT, reward);

    setTimeout(() => updateCombatPower(), 100);
    showNotification(`分解 ${equipment.name}，获得 ${reward} 灵石`);
  }, [gameState.equipment, addRecord, updateCombatPower, showNotification]);

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
    // Update task progress for spirit stone collection
    updateTaskProgress(TASK_TYPES.COLLECT_SPIRIT, reward);

    return reward;
  }, [addRecord]);

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
          const completed = newProgress >= task.target;
          
          if (completed && !task.completed) {
            // Task just completed
            setTimeout(() => {
              showNotification(`✅ 任务完成：${task.name}！可以领取奖励了`);
            }, 100);
          }
          
          return {
            ...task,
            progress: Math.min(newProgress, task.target),
            completed
          };
        }
        return task;
      });
      
      return { ...prev, tasks: updatedTasks };
    });
  }, [showNotification]);

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
    claimTaskReward
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
