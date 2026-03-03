// Quality tier names - 8 quality levels
export const QUALITY_NAMES = ['', '普通', '精良', '稀有', '史诗', '传说', '神话', '不朽', '至尊'];

// Quality level for Epic and above (affixes start from Epic quality)
export const EPIC_QUALITY_THRESHOLD = 4;

// Minimum drop rate for any quality tier
export const MIN_QUALITY_DROP_RATE = 0.05;

// Combat power calculation constants
export const LIFE_TO_POWER_RATIO = 10;
export const DEFENSE_MULTIPLIER = 2;

// Disassemble reward calculation
export const DISASSEMBLE_REWARD_BASE = 10;

// Cultivation system constants
export const CULTIVATION_POINTS_PER_CHOP = 10;
export const CULTIVATION_POINTS_PER_LEVEL = 100;

// Records system constants
export const MAX_RECORDS = 200;
export const RECORD_TYPES = {
  DROP: 'equipment_drop',
  EQUIP: 'equipment_equip',
  DISASSEMBLE: 'equipment_disassemble'
};

// Task system constants
export const TASK_TYPES = {
  CHOP: 'chop',           // 砍树任务
  EQUIP: 'equip',         // 装备任务
  DISASSEMBLE: 'disassemble', // 分解装备任务
  COMBAT_POWER: 'combat_power', // 战力提升任务
  COLLECT_SPIRIT: 'collect_spirit' // 收集灵石任务
};

// Task configuration based on level ranges
// Tasks are level-appropriate: requirements scale with player level
export const TASK_CONFIG = [
  // Level 1-9: 炼气期 tasks - basic training
  {
    minLevel: 1,
    maxLevel: 9,
    tasks: [
      { type: TASK_TYPES.CHOP, name: '初窥门径', description: '砍树修炼', target: 10, reward: 50, icon: '🌳' },
      { type: TASK_TYPES.EQUIP, name: '武装自己', description: '装备任意装备', target: 3, reward: 30, icon: '⚔️' },
      { type: TASK_TYPES.COMBAT_POWER, name: '实力初成', description: '战力达到目标', target: 100, reward: 40, icon: '💪' }
    ]
  },
  // Level 10-19: 筑基期 tasks - foundation building
  {
    minLevel: 10,
    maxLevel: 19,
    tasks: [
      { type: TASK_TYPES.CHOP, name: '筑基修行', description: '砍树修炼', target: 30, reward: 150, icon: '🌳' },
      { type: TASK_TYPES.DISASSEMBLE, name: '炼器入门', description: '分解装备', target: 10, reward: 100, icon: '♻️' },
      { type: TASK_TYPES.EQUIP, name: '精益求精', description: '装备任意装备', target: 8, reward: 120, icon: '⚔️' },
      { type: TASK_TYPES.COMBAT_POWER, name: '筑基之力', description: '战力达到目标', target: 500, reward: 130, icon: '💪' }
    ]
  },
  // Level 20-29: 金丹期 tasks - forming the golden core
  {
    minLevel: 20,
    maxLevel: 29,
    tasks: [
      { type: TASK_TYPES.CHOP, name: '金丹淬炼', description: '砍树修炼', target: 50, reward: 300, icon: '🌳' },
      { type: TASK_TYPES.DISASSEMBLE, name: '炼器精通', description: '分解装备', target: 25, reward: 250, icon: '♻️' },
      { type: TASK_TYPES.COLLECT_SPIRIT, name: '聚灵成丹', description: '收集灵石', target: 5000, reward: 280, icon: '💎' },
      { type: TASK_TYPES.COMBAT_POWER, name: '金丹之威', description: '战力达到目标', target: 2000, reward: 320, icon: '💪' }
    ]
  },
  // Level 30-39: 元婴期 tasks - nascent soul
  {
    minLevel: 30,
    maxLevel: 39,
    tasks: [
      { type: TASK_TYPES.CHOP, name: '元婴孕育', description: '砍树修炼', target: 80, reward: 500, icon: '🌳' },
      { type: TASK_TYPES.DISASSEMBLE, name: '炼器大师', description: '分解装备', target: 40, reward: 450, icon: '♻️' },
      { type: TASK_TYPES.COLLECT_SPIRIT, name: '灵石万千', description: '收集灵石', target: 15000, reward: 480, icon: '💎' },
      { type: TASK_TYPES.COMBAT_POWER, name: '元婴之能', description: '战力达到目标', target: 5000, reward: 520, icon: '💪' }
    ]
  },
  // Level 40-49: 化神期 tasks - spirit transformation
  {
    minLevel: 40,
    maxLevel: 49,
    tasks: [
      { type: TASK_TYPES.CHOP, name: '化神蜕变', description: '砍树修炼', target: 120, reward: 800, icon: '🌳' },
      { type: TASK_TYPES.DISASSEMBLE, name: '炼器宗师', description: '分解装备', target: 60, reward: 700, icon: '♻️' },
      { type: TASK_TYPES.COLLECT_SPIRIT, name: '灵石如海', description: '收集灵石', target: 30000, reward: 750, icon: '💎' },
      { type: TASK_TYPES.COMBAT_POWER, name: '化神之力', description: '战力达到目标', target: 15000, reward: 850, icon: '💪' }
    ]
  },
  // Level 50-59: 炼虚期 tasks - void refinement
  {
    minLevel: 50,
    maxLevel: 59,
    tasks: [
      { type: TASK_TYPES.CHOP, name: '炼虚归一', description: '砍树修炼', target: 150, reward: 1200, icon: '🌳' },
      { type: TASK_TYPES.DISASSEMBLE, name: '炼器圣手', description: '分解装备', target: 80, reward: 1000, icon: '♻️' },
      { type: TASK_TYPES.COLLECT_SPIRIT, name: '灵石无尽', description: '收集灵石', target: 50000, reward: 1100, icon: '💎' },
      { type: TASK_TYPES.COMBAT_POWER, name: '炼虚之威', description: '战力达到目标', target: 30000, reward: 1300, icon: '💪' }
    ]
  },
  // Level 60-69: 合体期 tasks - integration
  {
    minLevel: 60,
    maxLevel: 69,
    tasks: [
      { type: TASK_TYPES.CHOP, name: '合体之道', description: '砍树修炼', target: 200, reward: 1800, icon: '🌳' },
      { type: TASK_TYPES.DISASSEMBLE, name: '炼器至尊', description: '分解装备', target: 100, reward: 1500, icon: '♻️' },
      { type: TASK_TYPES.COLLECT_SPIRIT, name: '灵石成山', description: '收集灵石', target: 80000, reward: 1650, icon: '💎' },
      { type: TASK_TYPES.COMBAT_POWER, name: '合体之能', description: '战力达到目标', target: 60000, reward: 1950, icon: '💪' }
    ]
  },
  // Level 70-89: 大乘期 tasks - mahayana
  {
    minLevel: 70,
    maxLevel: 89,
    tasks: [
      { type: TASK_TYPES.CHOP, name: '大乘悟道', description: '砍树修炼', target: 250, reward: 2500, icon: '🌳' },
      { type: TASK_TYPES.DISASSEMBLE, name: '炼器神匠', description: '分解装备', target: 130, reward: 2200, icon: '♻️' },
      { type: TASK_TYPES.COLLECT_SPIRIT, name: '灵石连城', description: '收集灵石', target: 120000, reward: 2350, icon: '💎' },
      { type: TASK_TYPES.COMBAT_POWER, name: '大乘之力', description: '战力达到目标', target: 100000, reward: 2700, icon: '💪' }
    ]
  },
  // Level 90+: 渡劫期及以上 tasks - tribulation and beyond
  {
    minLevel: 90,
    maxLevel: 999,
    tasks: [
      { type: TASK_TYPES.CHOP, name: '渡劫圆满', description: '砍树修炼', target: 300, reward: 3500, icon: '🌳' },
      { type: TASK_TYPES.DISASSEMBLE, name: '炼器神尊', description: '分解装备', target: 150, reward: 3000, icon: '♻️' },
      { type: TASK_TYPES.COLLECT_SPIRIT, name: '灵石无量', description: '收集灵石', target: 200000, reward: 3200, icon: '💎' },
      { type: TASK_TYPES.COMBAT_POWER, name: '渡劫之威', description: '战力达到目标', target: 200000, reward: 3800, icon: '💪' }
    ]
  }
];

// Affix system configuration
export const AFFIX_POOL = [
  // Attack related
  { name: '力道', type: 'attack', min: 5, max: 20, weight: 10 },
  { name: '锋利', type: 'attack', min: 10, max: 30, weight: 8 },
  { name: '破甲', type: 'attack', min: 8, max: 25, weight: 9 },
  { name: '暴击', type: 'attack', min: 3, max: 15, weight: 7 },
  
  // Life related
  { name: '生机', type: 'life', min: 50, max: 200, weight: 10 },
  { name: '回春', type: 'life', min: 80, max: 250, weight: 8 },
  { name: '护体', type: 'life', min: 60, max: 180, weight: 9 },
  
  // Defense related
  { name: '坚固', type: 'defense', min: 3, max: 15, weight: 10 },
  { name: '守护', type: 'defense', min: 5, max: 20, weight: 8 },
  { name: '铁壁', type: 'defense', min: 4, max: 18, weight: 9 },
  
  // Agility related
  { name: '迅捷', type: 'agility', min: 4, max: 18, weight: 10 },
  { name: '轻灵', type: 'agility', min: 6, max: 22, weight: 8 },
  { name: '闪避', type: 'agility', min: 5, max: 20, weight: 9 },
  
  // Special affixes
  { name: '五行', type: 'multi', min: 3, max: 12, weight: 5 },
  { name: '灵力', type: 'multi', min: 5, max: 15, weight: 6 },
  { name: '神通', type: 'multi', min: 4, max: 13, weight: 5 }
];

// Affix count based on equipment level
export const AFFIX_LEVEL_CONFIG = {
  getAffixCount: (level) => {
    if (level <= 20) return 0;
    if (level <= 40) return 1;
    if (level <= 60) return 2;
    if (level <= 80) return 3;
    if (level <= 90) return 4;
    return 5;
  }
};

// Level system configuration
export const LEVEL_CONFIG = {
  baseStamina: 50,
  staminaPerLevel: 5,
  stages: [
    { name: '炼气前期', minLevel: 1, maxLevel: 3, ranks: ['一阶', '二阶', '三阶'] },
    { name: '炼气后期', minLevel: 4, maxLevel: 9, ranks: ['一阶', '二阶', '三阶', '四阶', '五阶', '六阶'] },
    { name: '筑基期', minLevel: 10, maxLevel: 19, ranks: ['一阶', '二阶', '三阶', '四阶', '五阶', '六阶', '七阶', '八阶', '九阶', '十阶'] },
    { name: '金丹期', minLevel: 20, maxLevel: 29, ranks: ['一阶', '二阶', '三阶', '四阶', '五阶', '六阶', '七阶', '八阶', '九阶', '十阶'] },
    { name: '元婴期', minLevel: 30, maxLevel: 39, ranks: ['一阶', '二阶', '三阶', '四阶', '五阶', '六阶', '七阶', '八阶', '九阶', '十阶'] },
    { name: '化神期', minLevel: 40, maxLevel: 49, ranks: ['一阶', '二阶', '三阶', '四阶', '五阶', '六阶', '七阶', '八阶', '九阶', '十阶'] },
    { name: '炼虚期', minLevel: 50, maxLevel: 59, ranks: ['一阶', '二阶', '三阶', '四阶', '五阶', '六阶', '七阶', '八阶', '九阶', '十阶'] },
    { name: '合体期', minLevel: 60, maxLevel: 69, ranks: ['一阶', '二阶', '三阶', '四阶', '五阶', '六阶', '七阶', '八阶', '九阶', '十阶'] },
    { name: '大乘期', minLevel: 70, maxLevel: 89, ranks: ['一阶', '二阶', '三阶', '四阶', '五阶', '六阶', '七阶', '八阶', '九阶', '十阶'] },
    { name: '渡劫期', minLevel: 90, maxLevel: 99, ranks: ['一阶', '二阶', '三阶', '四阶', '五阶', '六阶', '七阶', '八阶', '九阶', '十阶'] },
    { name: '飞升期', minLevel: 100, maxLevel: 999, ranks: ['一阶', '二阶', '三阶', '四阶', '五阶', '六阶', '七阶', '八阶', '九阶', '十阶'] }
  ]
};

// Equipment level scaling configuration
export const LEVEL_ATTRIBUTE_CONFIG = {
  attributeMultiplierPerLevel: 0.1,
  minVariance: 0.4,
  maxVariance: 0.8,
  maxEquipmentLevel: 100
};

// Combat power drop bonuses
export const COMBAT_POWER_DROP_CONFIG = {
  tiers: [
    { threshold: 0, qualityBonus: 0, attributeBonus: 0 },
    { threshold: 1000, qualityBonus: 0.05, attributeBonus: 0.1 },
    { threshold: 5000, qualityBonus: 0.1, attributeBonus: 0.2 },
    { threshold: 10000, qualityBonus: 0.15, attributeBonus: 0.3 },
    { threshold: 20000, qualityBonus: 0.2, attributeBonus: 0.4 },
    { threshold: 50000, qualityBonus: 0.25, attributeBonus: 0.5 }
  ],
  getCurrentTier: (combatPower) => {
    for (let i = COMBAT_POWER_DROP_CONFIG.tiers.length - 1; i >= 0; i--) {
      if (combatPower >= COMBAT_POWER_DROP_CONFIG.tiers[i].threshold) {
        return COMBAT_POWER_DROP_CONFIG.tiers[i];
      }
    }
    return COMBAT_POWER_DROP_CONFIG.tiers[0];
  }
};

// Quality drop rates configuration
export const QUALITY_DROP_CONFIG = [
  { quality: 1, baseRate: 0.50, powerMultiplier: 0.8 },  // 普通
  { quality: 2, baseRate: 0.30, powerMultiplier: 0.9 },  // 精良
  { quality: 3, baseRate: 0.15, powerMultiplier: 1.0 },  // 稀有
  { quality: 4, baseRate: 0.05, powerMultiplier: 1.2 },  // 史诗
  { quality: 5, baseRate: 0.00, powerMultiplier: 1.5 },  // 传说
  { quality: 6, baseRate: 0.00, powerMultiplier: 2.0 },  // 神话
  { quality: 7, baseRate: 0.00, powerMultiplier: 3.0 },  // 不朽
  { quality: 8, baseRate: 0.00, powerMultiplier: 4.0 }   // 至尊
];

// Quality attribute multipliers - higher quality = stronger base attributes
// Balanced to make Quality 7 competitive with equipment ~4-5 levels higher
export const QUALITY_ATTRIBUTE_MULTIPLIERS = [
  0,     // Index 0 (unused)
  1.0,   // Quality 1 (普通) - baseline
  1.06,  // Quality 2 (精良) - 6% boost
  1.13,  // Quality 3 (稀有) - 13% boost
  1.20,  // Quality 4 (史诗) - 20% boost
  1.28,  // Quality 5 (传说) - 28% boost
  1.36,  // Quality 6 (神话) - 36% boost
  1.45,  // Quality 7 (不朽) - 45% boost
  1.55   // Quality 8 (至尊) - 55% boost
];

// Skill system configuration - for Epic and above quality equipment
export const SKILL_POOL = [
  // Trigger skills (percentage-based per hit)
  { name: '击晕', type: 'stun', category: 'trigger', min: 1, max: 15, weight: 8, powerMultiplier: 3.0 },
  { name: '暴击', type: 'critical', category: 'trigger', min: 2, max: 20, weight: 10, powerMultiplier: 2.5 },
  { name: '连击', type: 'combo', category: 'trigger', min: 2, max: 18, weight: 9, powerMultiplier: 2.8 },
  { name: '闪避', type: 'dodge', category: 'trigger', min: 1, max: 16, weight: 9, powerMultiplier: 2.6 },
  { name: '反击', type: 'counter', category: 'trigger', min: 1, max: 14, weight: 8, powerMultiplier: 2.7 },
  { name: '吸血', type: 'lifesteal', category: 'trigger', min: 2, max: 20, weight: 9, powerMultiplier: 2.4 },
  
  // Resistance skills (percentage-based resistance)
  { name: '击晕抗性', type: 'stun_resist', category: 'resistance', min: 3, max: 25, weight: 7, powerMultiplier: 2.2 },
  { name: '暴击抗性', type: 'critical_resist', category: 'resistance', min: 3, max: 25, weight: 7, powerMultiplier: 2.2 },
  { name: '连击抗性', type: 'combo_resist', category: 'resistance', min: 3, max: 25, weight: 7, powerMultiplier: 2.2 },
  { name: '闪避抗性', type: 'dodge_resist', category: 'resistance', min: 3, max: 25, weight: 7, powerMultiplier: 2.2 },
  { name: '反击抗性', type: 'counter_resist', category: 'resistance', min: 3, max: 25, weight: 7, powerMultiplier: 2.2 },
  { name: '吸血抗性', type: 'lifesteal_resist', category: 'resistance', min: 3, max: 25, weight: 7, powerMultiplier: 2.2 }
];

// Skill count configuration based on equipment level and quality
export const SKILL_LEVEL_CONFIG = {
  getSkillCount: (level, quality) => {
    // Only Epic (4) and above can have skills
    if (quality < EPIC_QUALITY_THRESHOLD) return 0;
    
    // Skill count increases with level
    if (level < 30) return 0;
    if (level < 50) return 1;
    if (level < 70) return 2;
    if (level < 90) return 3;
    return 4; // Max 4 skills for level 90+
  },
  
  // Skill value scales with level - higher levels get better values
  getLevelScaling: (level) => {
    // Returns a multiplier from 1.0 (level 1) to 2.0 (level 100)
    return 1.0 + Math.min(1.0, level / 100);
  }
};

// Equipment types
export const EQUIPMENT_TYPES = [
  { type: 'weapon', name: '武器', icon: '⚔️' },
  { type: 'helmet', name: '头盔', icon: '🪖' },
  { type: 'armor', name: '护甲', icon: '🛡️' },
  { type: 'boots', name: '靴子', icon: '🥾' },
  { type: 'belt', name: '腰带', icon: '🔗' },
  { type: 'bracer', name: '护腕', icon: '💪' },
  { type: 'necklace', name: '项链', icon: '📿' },
  { type: 'ring', name: '戒指', icon: '💍' },
  { type: 'jade', name: '玉佩', icon: '🔮' },
  { type: 'gem', name: '宝石', icon: '💎' },
  { type: 'talisman', name: '符咒', icon: '📜' },
  { type: 'pet', name: '灵兽蛋', icon: '🥚' }
];

// Mount System Configuration (坐骑筋斗云)
export const MOUNT_CONFIG = {
  unlockLevel: 10, // Unlocks at Foundation Establishment (筑基期)
  maxLevel: 100,
  cloudPieceDropRate: 0.005, // 0.5% chance per tree chop
  
  // Cloud pieces required for synthesis and upgrades
  getSynthesisRequirement: () => 100, // Initial synthesis requires 100 pieces
  getUpgradeRequirement: (currentLevel) => {
    // Upgrade cost increases with level
    return Math.floor(50 + currentLevel * 10);
  },
  
  // Attribute gains per level
  getAttributesByLevel: (level) => {
    const baseAttack = 20;
    const baseLife = 200;
    const baseDefense = 10;
    const baseAgility = 10;
    
    return {
      attack: Math.floor(baseAttack * (1 + level * 0.15)),
      life: Math.floor(baseLife * (1 + level * 0.15)),
      defense: Math.floor(baseDefense * (1 + level * 0.15)),
      agility: Math.floor(baseAgility * (1 + level * 0.15))
    };
  },
  
  // Affixes unlocked at certain levels
  getAffixesByLevel: (level) => {
    if (level < 20) return 0;
    if (level < 40) return 1;
    if (level < 60) return 2;
    if (level < 80) return 3;
    return 4;
  },
  
  // Skills unlocked at certain levels
  getSkillsByLevel: (level) => {
    if (level < 30) return 0;
    if (level < 50) return 1;
    if (level < 70) return 2;
    if (level < 90) return 3;
    return 4;
  }
};

// Training System Configuration (历练玩法)
export const TRAINING_CONFIG = {
  totalMajorCheckpoints: 100,
  subLevelsPerCheckpoint: 10,
  bossSubLevel: 10, // Last sub-level is always a BOSS
  
  // Rewards - increased values (3x previous)
  getCultivationReward: (checkpoint) => {
    // Cultivation reward increases with checkpoint
    return Math.floor(300 + checkpoint * 60);
  },
  
  getCloudPieceReward: (checkpoint) => {
    // Cloud pieces awarded every major checkpoint completion
    if (checkpoint % 10 === 0) return Math.floor(30 + checkpoint / 10 * 3); // Extra reward every 10 checkpoints
    return Math.floor(9 + checkpoint / 20 * 3);
  },
  
  // Enemy stats scaling - optimized to ensure next checkpoint first stage > previous boss
  getEnemyStats: (checkpoint, subLevel) => {
    const isBoss = subLevel === 10;
    
    const baseAttack = 50;
    const baseLife = 500;
    const baseDefense = 20;
    const baseAgility = 15;
    
    // Each checkpoint increases base by 120 (ensures next checkpoint > previous boss)
    const checkpointBase = checkpoint * 120;
    
    // Sublevel progression: 0 to 81 (9 levels * 9)
    const subLevelBonus = (subLevel - 1) * 9;
    
    // Boss gets small bonus
    const bossBonus = isBoss ? 10 : 0;
    
    return {
      attack: baseAttack + checkpointBase + subLevelBonus + bossBonus,
      life: baseLife + checkpointBase * 10 + subLevelBonus * 10 + bossBonus * 10,
      defense: baseDefense + Math.floor(checkpointBase * 0.4) + Math.floor(subLevelBonus * 0.4) + Math.floor(bossBonus * 0.4),
      agility: baseAgility + Math.floor(checkpointBase * 0.3) + Math.floor(subLevelBonus * 0.3) + Math.floor(bossBonus * 0.3),
      isBoss
    };
  },
  
  // Check if player can sweep a checkpoint (player stats significantly greater than boss)
  canSweepCheckpoint: (playerStats, checkpoint) => {
    const bossStats = TRAINING_CONFIG.getEnemyStats(checkpoint, TRAINING_CONFIG.bossSubLevel);
    
    // Player power calculation
    const playerPower = playerStats.attack + playerStats.defense * 2 + playerStats.agility + playerStats.life / 10;
    const bossPower = bossStats.attack + bossStats.defense * 2 + bossStats.agility + bossStats.life / 10;
    
    // Can sweep if player power is at least 2x boss power (significant advantage)
    return playerPower >= bossPower * 2;
  },
  
  // Calculate combat result
  simulateCombat: (playerStats, enemyStats) => {
    // Simple combat simulation
    const playerPower = playerStats.attack + playerStats.defense * 2 + playerStats.agility + playerStats.life / 10;
    const enemyPower = enemyStats.attack + enemyStats.defense * 2 + enemyStats.agility + enemyStats.life / 10;
    
    // Add some randomness (±10%)
    const playerRoll = playerPower * (0.9 + Math.random() * 0.2);
    const enemyRoll = enemyPower * (0.9 + Math.random() * 0.2);
    
    return {
      victory: playerRoll > enemyRoll,
      playerPower: Math.floor(playerRoll),
      enemyPower: Math.floor(enemyRoll)
    };
  }
};
