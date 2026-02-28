// Quality tier names
export const QUALITY_NAMES = ['', '普通', '精良', '稀有', '史诗'];

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
        if (level < 10) return 0;  // No affixes for levels 1-9
        if (level < 20) return 1;  // 1 affix for levels 10-19
        if (level < 30) return 2;  // 2 affixes for levels 20-29
        if (level < 50) return 3;  // 3 affixes for levels 30-49
        if (level < 70) return 4;  // 4 affixes for levels 50-69
        return 5;                   // 5 affixes for levels 70+
    }
};

// Equipment level scaling configuration
export const LEVEL_ATTRIBUTE_CONFIG = {
    baseVariance: 0.4,      // ±40% at level 1
    maxVariance: 0.8,       // ±80% at level 100
    scalePerLevel: 0.1,     // 10% attribute increase per level
    maxLevel: 100           // Max equipment level
};

// Combat power drop tier configuration
export const COMBAT_POWER_DROP_CONFIG = [
    { threshold: 0, qualityBonus: 0, attributeBonus: 0 },
    { threshold: 1000, qualityBonus: 5, attributeBonus: 10 },
    { threshold: 5000, qualityBonus: 10, attributeBonus: 20 },
    { threshold: 10000, qualityBonus: 15, attributeBonus: 30 },
    { threshold: 20000, qualityBonus: 20, attributeBonus: 40 },
    { threshold: 50000, qualityBonus: 25, attributeBonus: 50 }
];

// Level system configuration
export const LEVEL_CONFIG = {
    chopsPerLevel: 10,
    stages: [
        { minLevel: 1, maxLevel: 10, name: '炼气前期', ranks: ['一阶', '二阶', '三阶', '四阶', '五阶', '六阶', '七阶', '八阶', '九阶', '十阶'] },
        { minLevel: 11, maxLevel: 20, name: '炼气后期', ranks: ['一阶', '二阶', '三阶', '四阶', '五阶', '六阶', '七阶', '八阶', '九阶', '十阶'] },
        { minLevel: 21, maxLevel: 30, name: '筑基前期', ranks: ['一阶', '二阶', '三阶', '四阶', '五阶', '六阶', '七阶', '八阶', '九阶', '十阶'] },
        { minLevel: 31, maxLevel: 40, name: '筑基后期', ranks: ['一阶', '二阶', '三阶', '四阶', '五阶', '六阶', '七阶', '八阶', '九阶', '十阶'] },
        { minLevel: 41, maxLevel: 50, name: '金丹前期', ranks: ['一阶', '二阶', '三阶', '四阶', '五阶', '六阶', '七阶', '八阶', '九阶', '十阶'] },
        { minLevel: 51, maxLevel: 60, name: '金丹后期', ranks: ['一阶', '二阶', '三阶', '四阶', '五阶', '六阶', '七阶', '八阶', '九阶', '十阶'] },
        { minLevel: 61, maxLevel: 70, name: '元婴期', ranks: ['一阶', '二阶', '三阶', '四阶', '五阶', '六阶', '七阶', '八阶', '九阶', '十阶'] },
        { minLevel: 71, maxLevel: 80, name: '化神期', ranks: ['一阶', '二阶', '三阶', '四阶', '五阶', '六阶', '七阶', '八阶', '九阶', '十阶'] },
        { minLevel: 81, maxLevel: 90, name: '炼虚期', ranks: ['一阶', '二阶', '三阶', '四阶', '五阶', '六阶', '七阶', '八阶', '九阶', '十阶'] },
        { minLevel: 91, maxLevel: 100, name: '合体期', ranks: ['一阶', '二阶', '三阶', '四阶', '五阶', '六阶', '七阶', '八阶', '九阶', '十阶'] }
    ],
    baseStamina: 50,
    staminaPerLevel: 5
};

// Equipment types configuration
export const EQUIPMENT_TYPES = [
    { type: 'weapon', icon: '⚔️', name: '武器' },
    { type: 'helmet', icon: '🪖', name: '头盔' },
    { type: 'armor', icon: '🛡️', name: '护甲' },
    { type: 'boots', icon: '🥾', name: '靴子' },
    { type: 'belt', icon: '🔗', name: '腰带' },
    { type: 'bracers', icon: '💪', name: '护腕' },
    { type: 'necklace', icon: '📿', name: '项链' },
    { type: 'ring', icon: '💍', name: '戒指' },
    { type: 'jade', icon: '🔮', name: '玉佩' },
    { type: 'gem', icon: '💎', name: '宝石' },
    { type: 'talisman', icon: '📜', name: '符咒' },
    { type: 'pet', icon: '🥚', name: '灵兽蛋' }
];

// Quality colors
export const QUALITY_COLORS = {
    1: '#9e9e9e',  // 普通 - gray
    2: '#4caf50',  // 精良 - green
    3: '#2196f3',  // 稀有 - blue
    4: '#9c27b0'   // 史诗 - purple
};
