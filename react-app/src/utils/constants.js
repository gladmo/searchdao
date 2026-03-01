// Quality tier names - 7 quality levels
export const QUALITY_NAMES = ['', '普通', '精良', '稀有', '史诗', '传说', '神话', '不朽'];

// Quality level for Epic and above (affixes start from Epic quality)
export const EPIC_QUALITY_THRESHOLD = 4;

// Minimum drop rate for any quality tier
export const MIN_QUALITY_DROP_RATE = 0.05;

// Combat power calculation constants
export const LIFE_TO_POWER_RATIO = 10;
export const DEFENSE_MULTIPLIER = 2;

// Disassemble reward calculation
export const DISASSEMBLE_REWARD_BASE = 10;

// Records system constants
export const MAX_RECORDS = 200;
export const RECORD_TYPES = {
  DROP: 'equipment_drop',
  EQUIP: 'equipment_equip',
  DISASSEMBLE: 'equipment_disassemble'
};

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
  { quality: 7, baseRate: 0.00, powerMultiplier: 3.0 }   // 不朽
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
  1.45   // Quality 7 (不朽) - 45% boost
];

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
