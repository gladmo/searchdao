import { LEVEL_CONFIG } from '../constants/gameConfig';

// Calculate max stamina based on level
export const calculateMaxStamina = (level) => {
    return LEVEL_CONFIG.baseStamina + (level - 1) * LEVEL_CONFIG.staminaPerLevel;
};

// Update cultivation stage based on level
export const getCultivationInfo = (level) => {
    const stage = LEVEL_CONFIG.stages.find(s => level >= s.minLevel && level <= s.maxLevel);
    if (!stage) {
        return { stage: '飞升期', rank: '十阶' };
    }
    
    const stageProgress = level - stage.minLevel;
    const rank = stage.ranks[Math.min(stageProgress, stage.ranks.length - 1)];
    
    return {
        stage: stage.name,
        rank: rank
    };
};

// Check if player should level up
export const checkLevelUp = (chopCount, currentLevel) => {
    const chopsNeeded = currentLevel * LEVEL_CONFIG.chopsPerLevel;
    return chopCount >= chopsNeeded;
};

// Get level up info
export const getLevelUpInfo = (level) => {
    const chopsNeeded = level * LEVEL_CONFIG.chopsPerLevel;
    return { chopsNeeded };
};
