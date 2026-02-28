// Game State
const gameState = {
    // Player stats
    combatPower: 0,
    spiritStone: 0,
    crystal: 1142,
    
    // Stamina system
    stamina: 50,
    maxStamina: 50,
    staminaRecoveryRate: 1, // recover 1 stamina per second
    lastStaminaUpdate: Date.now(),
    
    // Level system
    level: 1,
    chopCount: 0, // Total tree chops
    cultivation: {
        stage: '炼气前期',
        rank: '一阶'
    },
    
    // Stats
    attack: 0,
    life: 100,
    defense: 0,
    agility: 0,
    
    // Equipment - slot-based system (one equipment per type)
    equipment: {}, // Changed from array to object with type as key
    maxEquipment: 12,
    equipmentIdCounter: 0,
    
    // Settings
    autoEquip: false,
    
    // Disassemble
    disassembleCount: 0,
    disassembleReward: 0
};

// Quality tier names
const QUALITY_NAMES = ['', '普通', '精良', '稀有', '史诗'];

// Combat power calculation constants
const LIFE_TO_POWER_RATIO = 10;
const DEFENSE_MULTIPLIER = 2;

// Disassemble reward calculation
const DISASSEMBLE_REWARD_BASE = 10;

// Affix system configuration
const AFFIX_POOL = [
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
const AFFIX_LEVEL_CONFIG = {
    getAffixCount: (level) => {
        if (level < 10) return 0;  // No affixes for levels 1-9
        if (level < 20) return 1;  // 1 affix for levels 10-19
        if (level < 30) return 2;  // 2 affixes for levels 20-29
        if (level < 50) return 3;  // 3 affixes for levels 30-49
        if (level < 70) return 4;  // 4 affixes for levels 50-69
        return 5;                   // 5 affixes for levels 70+
    }
};

// Affix generation constants
const MAX_AFFIX_SELECTION_ATTEMPTS = 20;
const AFFIX_MULTI_TYPE_ATTACK_MULTIPLIER = 1.0;
const AFFIX_MULTI_TYPE_LIFE_MULTIPLIER = 10;
const AFFIX_MULTI_TYPE_DEFENSE_MULTIPLIER = 0.3;
const AFFIX_MULTI_TYPE_AGILITY_MULTIPLIER = 0.5;

// Level system configuration
const LEVEL_CONFIG = {
    chopsPerLevel: 10, // Tree chops required per level
    maxLevel: 100,
    // Stamina configuration
    baseStamina: 50, // Base stamina at level 1
    staminaPerLevel: 5, // Additional stamina per level
    // Cultivation stages by level ranges
    cultivationStages: [
        { minLevel: 1, maxLevel: 10, stage: '炼气期', rank: '一阶' },
        { minLevel: 11, maxLevel: 20, stage: '筑基期', rank: '二阶' },
        { minLevel: 21, maxLevel: 30, stage: '金丹期', rank: '三阶' },
        { minLevel: 31, maxLevel: 40, stage: '元婴期', rank: '四阶' },
        { minLevel: 41, maxLevel: 50, stage: '化神期', rank: '五阶' },
        { minLevel: 51, maxLevel: 60, stage: '炼虚期', rank: '六阶' },
        { minLevel: 61, maxLevel: 70, stage: '合体期', rank: '七阶' },
        { minLevel: 71, maxLevel: 80, stage: '大乘期', rank: '八阶' },
        { minLevel: 81, maxLevel: 90, stage: '渡劫期', rank: '九阶' },
        { minLevel: 91, maxLevel: 100, stage: '飞升期', rank: '十阶' }
    ]
};

// Level-based attribute configuration
// Each level tier has different multipliers for equipment attributes
const LEVEL_ATTRIBUTE_CONFIG = {
    // Base multiplier increases with level
    getBaseMultiplier: (level) => {
        return 1 + (level - 1) * 0.1; // 10% increase per level
    },
    // Attribute variance increases at higher levels
    getVariance: (level) => {
        const baseVariance = 0.4; // ±40% at level 1
        const levelBonus = level * 0.01; // +1% per level
        return Math.min(0.8, baseVariance + levelBonus); // Max ±80%
    }
};

// Combat power influence on drop rates
const COMBAT_POWER_DROP_CONFIG = {
    // Thresholds for drop rate bonuses
    tiers: [
        { minPower: 0, qualityBonus: 0, attrBonus: 0 },
        { minPower: 1000, qualityBonus: 0.05, attrBonus: 0.1 },
        { minPower: 5000, qualityBonus: 0.1, attrBonus: 0.2 },
        { minPower: 10000, qualityBonus: 0.15, attrBonus: 0.3 },
        { minPower: 20000, qualityBonus: 0.2, attrBonus: 0.4 },
        { minPower: 50000, qualityBonus: 0.25, attrBonus: 0.5 }
    ],
    // Get current tier based on combat power
    getTier: (combatPower) => {
        for (let i = COMBAT_POWER_DROP_CONFIG.tiers.length - 1; i >= 0; i--) {
            if (combatPower >= COMBAT_POWER_DROP_CONFIG.tiers[i].minPower) {
                return COMBAT_POWER_DROP_CONFIG.tiers[i];
            }
        }
        return COMBAT_POWER_DROP_CONFIG.tiers[0];
    }
};

// Calculate max stamina based on level
function calculateMaxStamina(level) {
    return LEVEL_CONFIG.baseStamina + (level - 1) * LEVEL_CONFIG.staminaPerLevel;
}

// Equipment types and their icons
const equipmentTypes = [
    { name: '武器', icon: '⚔️', type: 'weapon' },
    { name: '头盔', icon: '🪖', type: 'helmet' },
    { name: '护甲', icon: '🛡️', type: 'armor' },
    { name: '靴子', icon: '🥾', type: 'boots' },
    { name: '腰带', icon: '🔗', type: 'belt' },
    { name: '护腕', icon: '💪', type: 'bracers' },
    { name: '项链', icon: '📿', type: 'necklace' },
    { name: '戒指', icon: '💍', type: 'ring' },
    { name: '玉佩', icon: '🔮', type: 'jade' },
    { name: '宝石', icon: '💎', type: 'gem' },
    { name: '符咒', icon: '📜', type: 'talisman' },
    { name: '灵兽蛋', icon: '🥚', type: 'pet_egg' }
];

// Initialize game
function initGame() {
    loadGameState();
    renderEquipmentGrid();
    updateUI();
    startStaminaRecovery();
    
    // Event listeners
    document.getElementById('chopBtn').addEventListener('click', chopTree);
    document.getElementById('autoEquipBtn').addEventListener('click', toggleAutoEquip);
    document.getElementById('tree').addEventListener('click', chopTree);
    
    // Equipment grid click handling
    document.getElementById('equipmentGrid').addEventListener('click', (e) => {
        const slot = e.target.closest('.equipment-slot');
        if (slot && !slot.classList.contains('empty')) {
            const type = slot.dataset.type;
            disassembleEquipment(type);
        }
    });
}

// Save game state to localStorage
function saveGameState() {
    localStorage.setItem('searchdao_save', JSON.stringify(gameState));
}

// Load game state from localStorage
function loadGameState() {
    const saved = localStorage.getItem('searchdao_save');
    if (saved) {
        const loadedState = JSON.parse(saved);
        
        // Handle backward compatibility: convert array equipment to object
        if (Array.isArray(loadedState.equipment)) {
            const equipmentObj = {};
            loadedState.equipment.forEach(equip => {
                const existing = equipmentObj[equip.type];
                // Keep the equipment with higher combat power
                if (!existing || calculateEquipmentPower(equip) > calculateEquipmentPower(existing)) {
                    equipmentObj[equip.type] = equip;
                }
            });
            loadedState.equipment = equipmentObj;
        }
        
        Object.assign(gameState, loadedState);
        gameState.lastStaminaUpdate = Date.now();
        
        // Initialize equipmentIdCounter from loaded state
        if (!gameState.equipmentIdCounter) {
            gameState.equipmentIdCounter = 0;
        }
        
        // Initialize chopCount if not present (backward compatibility)
        if (gameState.chopCount === undefined) {
            gameState.chopCount = 0;
        }
        
        // Update cultivation stage based on level
        updateCultivationStage();
        
        // Update max stamina based on level
        gameState.maxStamina = calculateMaxStamina(gameState.level);
        
        // Cap current stamina to max stamina if needed
        if (gameState.stamina > gameState.maxStamina) {
            gameState.stamina = gameState.maxStamina;
        }
    }
}

// Stamina recovery system
function startStaminaRecovery() {
    setInterval(() => {
        const now = Date.now();
        const timePassed = (now - gameState.lastStaminaUpdate) / 1000; // seconds
        
        if (gameState.stamina < gameState.maxStamina) {
            const recovery = Math.floor(timePassed * gameState.staminaRecoveryRate);
            if (recovery > 0) {
                gameState.stamina = Math.min(gameState.maxStamina, gameState.stamina + recovery);
                gameState.lastStaminaUpdate = now;
                updateStaminaDisplay();
                saveGameState();
            }
        }
    }, 1000);
}

// Chop tree action
function chopTree() {
    const staminaCost = 1;
    
    if (gameState.stamina < staminaCost) {
        showNotification('体力不足！');
        return;
    }
    
    // Consume stamina
    gameState.stamina -= staminaCost;
    gameState.lastStaminaUpdate = Date.now();
    
    // Increment chop count
    gameState.chopCount++;
    
    // Check for level up
    checkLevelUp();
    
    // Tree shake animation
    const tree = document.getElementById('tree');
    tree.classList.add('shake');
    setTimeout(() => tree.classList.remove('shake'), 300);
    
    // Drop equipment
    dropEquipment();
    
    // Update UI
    updateUI();
    saveGameState();
}

// Check for level up
function checkLevelUp() {
    const requiredChops = gameState.level * LEVEL_CONFIG.chopsPerLevel;
    
    if (gameState.chopCount >= requiredChops && gameState.level < LEVEL_CONFIG.maxLevel) {
        gameState.level++;
        gameState.chopCount = 0; // Reset chop count for next level
        
        // Update cultivation stage
        updateCultivationStage();
        
        // Update max stamina based on new level
        const oldMaxStamina = gameState.maxStamina;
        gameState.maxStamina = calculateMaxStamina(gameState.level);
        
        // Increase current stamina proportionally
        const staminaIncrease = gameState.maxStamina - oldMaxStamina;
        if (staminaIncrease > 0) {
            gameState.stamina = Math.min(gameState.maxStamina, gameState.stamina + staminaIncrease);
        }
        
        // Show level up notification with stamina increase info
        const notificationMsg = staminaIncrease > 0 
            ? `🎉 恭喜升级到 ${gameState.level} 级！修为上限增加${staminaIncrease}点`
            : `🎉 恭喜升级到 ${gameState.level} 级！`;
        showNotification(notificationMsg);
        
        // Add level up visual effect
        const levelIndicator = document.getElementById('levelUpIndicator');
        if (levelIndicator) {
            levelIndicator.textContent = '✨';
            levelIndicator.classList.add('level-up-flash');
            setTimeout(() => {
                levelIndicator.textContent = '';
                levelIndicator.classList.remove('level-up-flash');
            }, 2000);
        }
    }
}

// Update cultivation stage based on level
function updateCultivationStage() {
    for (const config of LEVEL_CONFIG.cultivationStages) {
        if (gameState.level >= config.minLevel && gameState.level <= config.maxLevel) {
            gameState.cultivation.stage = config.stage;
            gameState.cultivation.rank = config.rank;
            break;
        }
    }
}

// Generate affixes for equipment based on level
function generateAffixes(equipmentLevel, quality) {
    const affixCount = AFFIX_LEVEL_CONFIG.getAffixCount(equipmentLevel);
    if (affixCount === 0) return [];
    
    const affixes = [];
    const usedAffixes = new Set(); // Prevent duplicate affixes
    
    // Calculate total weight for weighted random selection
    const totalWeight = AFFIX_POOL.reduce((sum, affix) => sum + affix.weight, 0);
    
    for (let i = 0; i < affixCount; i++) {
        let attempts = 0;
        let selectedAffix = null;
        
        // Try to select a unique affix
        while (attempts < MAX_AFFIX_SELECTION_ATTEMPTS && !selectedAffix) {
            let random = Math.random() * totalWeight;
            let accumulated = 0;
            
            for (const affix of AFFIX_POOL) {
                accumulated += affix.weight;
                if (random <= accumulated && !usedAffixes.has(affix.name)) {
                    selectedAffix = affix;
                    usedAffixes.add(affix.name);
                    break;
                }
            }
            attempts++;
        }
        
        if (selectedAffix) {
            // Calculate affix value based on level and quality
            const levelMultiplier = Math.max(1, 1 + (equipmentLevel - 10) * 0.05); // 5% increase per level above 10, minimum 1
            const qualityMultiplier = quality * 0.3; // 30% increase per quality level
            const baseValue = selectedAffix.min + Math.random() * (selectedAffix.max - selectedAffix.min);
            const finalValue = Math.floor(baseValue * levelMultiplier * (1 + qualityMultiplier));
            
            affixes.push({
                name: selectedAffix.name,
                type: selectedAffix.type,
                value: finalValue
            });
        }
    }
    
    return affixes;
}

// Apply affixes to equipment stats
function applyAffixesToEquipment(equipment, affixes) {
    affixes.forEach(affix => {
        if (affix.type === 'attack') {
            equipment.attack += affix.value;
        } else if (affix.type === 'life') {
            equipment.life += affix.value;
        } else if (affix.type === 'defense') {
            equipment.defense += affix.value;
        } else if (affix.type === 'agility') {
            equipment.agility += affix.value;
        } else if (affix.type === 'multi') {
            // Multi affixes add to all stats proportionally
            equipment.attack += Math.floor(affix.value * AFFIX_MULTI_TYPE_ATTACK_MULTIPLIER);
            equipment.life += Math.floor(affix.value * AFFIX_MULTI_TYPE_LIFE_MULTIPLIER);
            equipment.defense += Math.floor(affix.value * AFFIX_MULTI_TYPE_DEFENSE_MULTIPLIER);
            equipment.agility += Math.floor(affix.value * AFFIX_MULTI_TYPE_AGILITY_MULTIPLIER);
        }
    });
}

// Drop equipment with random attributes
function dropEquipment() {
    // Random equipment type
    const equipType = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];
    
    // Get combat power tier for drop bonuses
    const powerTier = COMBAT_POWER_DROP_CONFIG.getTier(gameState.combatPower);
    
    // Random quality (1-4) with combat power influence
    // Higher combat power increases chance of higher quality
    const qualityRoll = Math.random();
    const qualityBonus = powerTier.qualityBonus;
    
    let quality;
    // Adjust drop rates based on combat power, prevent negative thresholds
    const commonThreshold = Math.max(0, 0.5 - qualityBonus);
    const uncommonThreshold = Math.max(commonThreshold, 0.8 - qualityBonus * 0.5);
    
    if (qualityRoll < commonThreshold) quality = 1;      // Common (reduced with power)
    else if (qualityRoll < uncommonThreshold) quality = 2; // Uncommon
    else if (qualityRoll < 0.95) quality = 3;              // Rare (increased with power)
    else quality = 4;                                       // Epic (slightly increased with power)
    
    // Random level (1 to player level + 2), capped at max level
    const maxEquipmentLevel = Math.min(gameState.level + 2, LEVEL_CONFIG.maxLevel);
    const level = Math.floor(Math.random() * maxEquipmentLevel) + 1;
    
    // Get level-based multipliers
    const baseMultiplier = LEVEL_ATTRIBUTE_CONFIG.getBaseMultiplier(gameState.level);
    const variance = LEVEL_ATTRIBUTE_CONFIG.getVariance(gameState.level);
    const attrBonus = 1 + powerTier.attrBonus; // Combat power attribute bonus
    
    // Calculate stats based on quality, level, player level, and combat power
    const baseStats = level * 10 * quality * baseMultiplier * attrBonus;
    
    // Generate random variance for each attribute
    const getRandomStat = (base) => {
        const randomFactor = 1 - variance + Math.random() * variance * 2;
        return Math.floor(base * randomFactor);
    };
    
    const equipment = {
        id: ++gameState.equipmentIdCounter,
        name: equipType.name,
        icon: equipType.icon,
        type: equipType.type,
        quality: quality,
        level: level,
        attack: getRandomStat(baseStats),
        life: getRandomStat(baseStats * 10),
        defense: getRandomStat(baseStats * 0.3),
        agility: getRandomStat(baseStats * 0.5),
        affixes: [] // Initialize affixes array
    };
    
    // Generate and apply affixes
    const affixes = generateAffixes(level, quality);
    equipment.affixes = affixes;
    applyAffixesToEquipment(equipment, affixes);
    
    // Check if equipment of this type already exists
    const existingEquipment = gameState.equipment[equipment.type];
    
    if (existingEquipment) {
        // Show comparison dialog if equipment of this type already exists
        if (gameState.autoEquip) {
            // Auto-equip: automatically choose better one
            autoEquipCheck(equipment);
        } else {
            // Show comparison dialog
            showEquipmentComparisonDialog(existingEquipment, equipment);
        }
    } else {
        // No existing equipment of this type, equip directly
        gameState.equipment[equipment.type] = equipment;
        showNotification(`获得 ${QUALITY_NAMES[quality]} ${equipment.name} ${level}级`);
        renderEquipmentGrid();
        updateCombatPower();
    }
}

// Calculate equipment power
function calculateEquipmentPower(equipment) {
    return equipment.attack + equipment.life / LIFE_TO_POWER_RATIO + equipment.defense * DEFENSE_MULTIPLIER + equipment.agility;
}

// Helper function to create stat comparison row HTML
function createStatComparisonRow(statName, oldValue, newValue) {
    const comparison = newValue > oldValue ? 'better' : newValue < oldValue ? 'worse' : '';
    const indicator = newValue > oldValue ? ' ▲' : newValue < oldValue ? ' ▼' : '';
    return `<div class="stat-row ${comparison}">${statName}: ${newValue}${indicator}</div>`;
}

// Helper function to format affixes for display
function formatAffixes(equipment) {
    if (!equipment.affixes || equipment.affixes.length === 0) {
        return '<div class="affixes-section"><div class="affixes-title">词条: 无</div></div>';
    }
    
    const affixesHtml = equipment.affixes.map(affix => 
        `<div class="affix-item">${affix.name}+${affix.value}</div>`
    ).join('');
    
    return `<div class="affixes-section">
        <div class="affixes-title">词条 (${equipment.affixes.length}):</div>
        <div class="affixes-list">${affixesHtml}</div>
    </div>`;
}

// Helper function to check if new equipment is better
function isEquipmentBetter(newEquip, oldEquip) {
    const oldPower = calculateEquipmentPower(oldEquip);
    const newPower = calculateEquipmentPower(newEquip);
    
    // Compare by power first, then quality, then level
    if (newPower !== oldPower) {
        return newPower > oldPower;
    }
    if (newEquip.quality !== oldEquip.quality) {
        return newEquip.quality > oldEquip.quality;
    }
    return newEquip.level > oldEquip.level;
}

// Show equipment comparison dialog
function showEquipmentComparisonDialog(oldEquipment, newEquipment) {
    // Remove any existing modal first to prevent multiple modals
    const existingModal = document.querySelector('.equipment-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Calculate combat power for each
    const oldPower = calculateEquipmentPower(oldEquipment);
    const newPower = calculateEquipmentPower(newEquipment);
    const powerDiff = newPower - oldPower;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'equipment-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3 class="modal-title">装备选择</h3>
            <p class="modal-subtitle">已装备相同类型装备，请选择保留或替换</p>
            
            <div class="equipment-comparison">
                <div class="equipment-card old">
                    <div class="card-header">当前装备</div>
                    <div class="equipment-icon-large">${oldEquipment.icon}</div>
                    <div class="equipment-name quality-${oldEquipment.quality}">${QUALITY_NAMES[oldEquipment.quality]} ${oldEquipment.name}</div>
                    <div class="equipment-level">等级: ${oldEquipment.level}</div>
                    <div class="equipment-stats">
                        <div class="stat-row">攻击: ${oldEquipment.attack}</div>
                        <div class="stat-row">生命: ${oldEquipment.life}</div>
                        <div class="stat-row">防御: ${oldEquipment.defense}</div>
                        <div class="stat-row">敏捷: ${oldEquipment.agility}</div>
                    </div>
                    ${formatAffixes(oldEquipment)}
                    <div class="equipment-power">战力: ${Math.floor(oldPower)}</div>
                </div>
                
                <div class="comparison-arrow">
                    <div class="arrow-icon">➜</div>
                    <div class="power-diff ${powerDiff >= 0 ? 'positive' : 'negative'}">
                        ${powerDiff >= 0 ? '+' : ''}${Math.floor(powerDiff)}
                    </div>
                </div>
                
                <div class="equipment-card new">
                    <div class="card-header">新装备</div>
                    <div class="equipment-icon-large">${newEquipment.icon}</div>
                    <div class="equipment-name quality-${newEquipment.quality}">${QUALITY_NAMES[newEquipment.quality]} ${newEquipment.name}</div>
                    <div class="equipment-level">等级: ${newEquipment.level}</div>
                    <div class="equipment-stats">
                        ${createStatComparisonRow('攻击', oldEquipment.attack, newEquipment.attack)}
                        ${createStatComparisonRow('生命', oldEquipment.life, newEquipment.life)}
                        ${createStatComparisonRow('防御', oldEquipment.defense, newEquipment.defense)}
                        ${createStatComparisonRow('敏捷', oldEquipment.agility, newEquipment.agility)}
                    </div>
                    ${formatAffixes(newEquipment)}
                    <div class="equipment-power ${powerDiff >= 0 ? 'better' : 'worse'}">战力: ${Math.floor(newPower)}</div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="modal-btn disassemble-old equip-new-btn">
                    <span>装备新的</span>
                    <span class="btn-detail">分解旧装备获得 ${calculateDisassembleReward(oldEquipment)} 灵石</span>
                </button>
                <button class="modal-btn disassemble-new keep-old-btn">
                    <span>保留旧的</span>
                    <span class="btn-detail">分解新装备获得 ${calculateDisassembleReward(newEquipment)} 灵石</span>
                </button>
            </div>
        </div>
    `;
    
    // Append modal to DOM first
    document.body.appendChild(modal);
    
    // Add event listeners using querySelector on modal to avoid ID conflicts
    const equipNewBtn = modal.querySelector('.equip-new-btn');
    const keepOldBtn = modal.querySelector('.keep-old-btn');
    
    const handleEquipNew = () => {
        equipNewEquipment(oldEquipment, newEquipment);
        modal.remove();
    };
    
    const handleKeepOld = () => {
        keepOldEquipment(oldEquipment, newEquipment);
        modal.remove();
    };
    
    equipNewBtn.addEventListener('click', handleEquipNew);
    keepOldBtn.addEventListener('click', handleKeepOld);
    
    // Show modal with animation
    setTimeout(() => modal.classList.add('show'), 10);
}

// Equip new equipment and disassemble old one
function equipNewEquipment(oldEquipment, newEquipment) {
    const reward = calculateDisassembleReward(oldEquipment);
    gameState.spiritStone += reward;
    gameState.disassembleCount++;
    gameState.disassembleReward += reward;
    
    // Replace with new equipment
    gameState.equipment[newEquipment.type] = newEquipment;
    
    showNotification(`装备 ${QUALITY_NAMES[newEquipment.quality]} ${newEquipment.name}，分解旧装备获得 ${reward} 灵石`);
    
    renderEquipmentGrid();
    updateCombatPower();
    updateUI();
    saveGameState();
}

// Keep old equipment and disassemble new one
function keepOldEquipment(oldEquipment, newEquipment) {
    const reward = calculateDisassembleReward(newEquipment);
    gameState.spiritStone += reward;
    gameState.disassembleCount++;
    gameState.disassembleReward += reward;
    
    showNotification(`保留旧装备，分解新装备获得 ${reward} 灵石`);
    
    updateUI();
    saveGameState();
}

// Auto equip logic - automatically disassemble lower quality items of same type
function autoEquipCheck(newEquipment) {
    const existing = gameState.equipment[newEquipment.type];
    
    if (!existing) {
        // No existing equipment of this type, equip directly
        gameState.equipment[newEquipment.type] = newEquipment;
        showNotification(`获得 ${QUALITY_NAMES[newEquipment.quality]} ${newEquipment.name} ${newEquipment.level}级`);
        renderEquipmentGrid();
        updateCombatPower();
        return;
    }
    
    const oldPower = calculateEquipmentPower(existing);
    const newPower = calculateEquipmentPower(newEquipment);
    
    // If new equipment is better, auto-equip it
    if (isEquipmentBetter(newEquipment, existing)) {
        // Auto-disassemble the weaker item
        const reward = calculateDisassembleReward(existing);
        gameState.spiritStone += reward;
        gameState.disassembleCount++;
        gameState.disassembleReward += reward;
        
        gameState.equipment[newEquipment.type] = newEquipment;
        showNotification(`自动装备 ${QUALITY_NAMES[newEquipment.quality]} ${newEquipment.name}，分解旧装备获得 ${reward} 灵石`);
        
        renderEquipmentGrid();
        updateCombatPower();
    } else {
        // New equipment is worse, auto-disassemble it
        const reward = calculateDisassembleReward(newEquipment);
        gameState.spiritStone += reward;
        gameState.disassembleCount++;
        gameState.disassembleReward += reward;
        
        showNotification(`获得 ${QUALITY_NAMES[newEquipment.quality]} ${newEquipment.name}，自动分解获得 ${reward} 灵石`);
    }
}

// Disassemble equipment
function disassembleEquipment(equipmentType) {
    const equipment = gameState.equipment[equipmentType];
    if (!equipment) return;
    
    const reward = calculateDisassembleReward(equipment);
    
    gameState.spiritStone += reward;
    gameState.disassembleCount++;
    gameState.disassembleReward += reward;
    
    showNotification(`分解 ${equipment.name}，获得 ${reward} 灵石`);
    
    // Remove equipment
    delete gameState.equipment[equipmentType];
    
    renderEquipmentGrid();
    updateCombatPower();
    updateUI();
    saveGameState();
}

// Toggle auto equip
function toggleAutoEquip() {
    gameState.autoEquip = !gameState.autoEquip;
    const btn = document.getElementById('autoEquipBtn');
    const status = btn.querySelector('.toggle-status');
    
    if (gameState.autoEquip) {
        btn.classList.add('active');
        status.textContent = 'ON';
    } else {
        btn.classList.remove('active');
        status.textContent = 'OFF';
    }
    
    saveGameState();
}

function calculateDisassembleReward(equipment) {
    return equipment.level * equipment.quality * DISASSEMBLE_REWARD_BASE;
}

// Calculate combat power from all equipment
function updateCombatPower() {
    let totalPower = 0;
    
    Object.values(gameState.equipment).forEach(equip => {
        totalPower += equip.attack + equip.life / LIFE_TO_POWER_RATIO + equip.defense * DEFENSE_MULTIPLIER + equip.agility;
    });
    
    gameState.combatPower = Math.floor(totalPower);
    
    // Update stats
    gameState.attack = 0;
    gameState.life = 100; // base life
    gameState.defense = 0;
    gameState.agility = 0;
    
    Object.values(gameState.equipment).forEach(equip => {
        gameState.attack += equip.attack;
        gameState.life += equip.life;
        gameState.defense += equip.defense;
        gameState.agility += equip.agility;
    });
}

// Render equipment grid
function renderEquipmentGrid() {
    const grid = document.getElementById('equipmentGrid');
    grid.innerHTML = '';
    
    // Render slots for each equipment type
    equipmentTypes.forEach(equipType => {
        const equip = gameState.equipment[equipType.type];
        const slot = document.createElement('div');
        
        if (equip) {
            // Slot has equipment
            slot.className = `equipment-slot quality-${equip.quality}`;
            slot.dataset.type = equipType.type;
            slot.innerHTML = `
                <div class="equipment-icon">${equip.icon}</div>
                <div class="equipment-level">${equip.level}级</div>
            `;
            
            // Build tooltip with affixes
            let tooltip = `${equip.name} ${equip.level}级\n攻击:${equip.attack} 生命:${equip.life}\n防御:${equip.defense} 敏捷:${equip.agility}`;
            if (equip.affixes && equip.affixes.length > 0) {
                tooltip += '\n词条:';
                equip.affixes.forEach(affix => {
                    tooltip += `\n  ${affix.name}+${affix.value}`;
                });
            }
            tooltip += '\n点击分解';
            slot.title = tooltip;
        } else {
            // Empty slot
            slot.className = 'equipment-slot empty';
            slot.dataset.type = equipType.type;
            slot.innerHTML = `
                <div class="equipment-icon empty-icon">${equipType.icon}</div>
                <div class="equipment-type-name">${equipType.name}</div>
            `;
            slot.title = `${equipType.name}槽位（空）`;
        }
        
        grid.appendChild(slot);
    });
}

// Update all UI elements
function updateUI() {
    // Combat power
    document.getElementById('combatPower').textContent = gameState.combatPower.toLocaleString();
    
    // Currency
    document.getElementById('spiritStone').textContent = gameState.spiritStone;
    document.getElementById('crystal').textContent = gameState.crystal;
    
    // Stats
    document.getElementById('attack').textContent = gameState.attack;
    document.getElementById('life').textContent = gameState.life;
    document.getElementById('defense').textContent = gameState.defense;
    document.getElementById('agility').textContent = gameState.agility;
    
    // Level with progress
    const requiredChops = gameState.level * LEVEL_CONFIG.chopsPerLevel;
    const progress = gameState.chopCount;
    document.getElementById('cultivationLevel').textContent = 
        `${gameState.level}级·${gameState.cultivation.stage}·${gameState.cultivation.rank} (${progress}/${requiredChops})`;
    
    // Disassemble info
    document.getElementById('disassembleReward').textContent = gameState.disassembleReward;
    document.getElementById('disassembleCount').textContent = gameState.disassembleCount;
    
    updateStaminaDisplay();
}

// Update stamina display
function updateStaminaDisplay() {
    const current = document.getElementById('staminaCurrent');
    const max = document.getElementById('staminaMax');
    const fill = document.getElementById('staminaFill');
    const btn = document.getElementById('chopBtn');
    
    current.textContent = gameState.stamina;
    max.textContent = gameState.maxStamina;
    
    const percentage = (gameState.stamina / gameState.maxStamina) * 100;
    fill.style.width = percentage + '%';
    
    // Disable chop button if not enough stamina
    if (gameState.stamina < 1) {
        btn.classList.add('disabled');
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
    } else {
        btn.classList.remove('disabled');
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    }
}

// Show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', initGame);
