import { 
    AFFIX_POOL, 
    AFFIX_LEVEL_CONFIG, 
    LEVEL_ATTRIBUTE_CONFIG, 
    COMBAT_POWER_DROP_CONFIG,
    EQUIPMENT_TYPES,
    QUALITY_NAMES 
} from '../constants/gameConfig';

// Generate affixes for equipment
export const generateAffixes = (equipmentLevel, quality) => {
    const affixCount = AFFIX_LEVEL_CONFIG.getAffixCount(equipmentLevel);
    if (affixCount === 0) return [];

    // Calculate total weight
    const totalWeight = AFFIX_POOL.reduce((sum, affix) => sum + affix.weight, 0);
    
    const affixes = [];
    const usedAffixes = new Set();

    for (let i = 0; i < affixCount; i++) {
        let remainingPool = AFFIX_POOL.filter(affix => !usedAffixes.has(affix.name));
        if (remainingPool.length === 0) break;

        let random = Math.random() * remainingPool.reduce((sum, affix) => sum + affix.weight, 0);
        let selectedAffix = null;

        for (const affix of remainingPool) {
            random -= affix.weight;
            if (random <= 0) {
                selectedAffix = affix;
                break;
            }
        }

        if (selectedAffix) {
            const valueRange = selectedAffix.max - selectedAffix.min;
            const baseValue = selectedAffix.min + Math.random() * valueRange;
            const qualityMultiplier = 1 + (quality - 1) * 0.2;
            const value = Math.floor(baseValue * qualityMultiplier);

            affixes.push({
                name: selectedAffix.name,
                type: selectedAffix.type,
                value: value
            });

            usedAffixes.add(selectedAffix.name);
        }
    }

    return affixes;
};

// Apply affixes to equipment
export const applyAffixesToEquipment = (equipment, affixes) => {
    const equipmentCopy = { ...equipment };

    affixes.forEach(affix => {
        if (affix.type === 'multi') {
            equipmentCopy.attack += affix.value;
            equipmentCopy.life += affix.value * 10;
            equipmentCopy.defense += affix.value;
            equipmentCopy.agility += affix.value;
        } else {
            equipmentCopy[affix.type] += affix.value;
        }
    });

    equipmentCopy.affixes = affixes;
    return equipmentCopy;
};

// Drop a random equipment
export const dropEquipment = (playerLevel, combatPower) => {
    const types = EQUIPMENT_TYPES;
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    // Determine quality based on combat power
    let qualityRoll = Math.random() * 100;
    const powerTier = COMBAT_POWER_DROP_CONFIG.findLast(tier => combatPower >= tier.threshold) || COMBAT_POWER_DROP_CONFIG[0];
    
    let quality;
    const qualityBonus = powerTier.qualityBonus;
    
    if (qualityRoll < 5 + qualityBonus) quality = 4; // Epic
    else if (qualityRoll < 20 + qualityBonus) quality = 3; // Rare
    else if (qualityRoll < 50 + qualityBonus) quality = 2; // Fine
    else quality = 1; // Common

    // Equipment level: playerLevel ± 2, capped at maxLevel
    const levelVariation = Math.floor(Math.random() * 5) - 2;
    const equipmentLevel = Math.max(1, Math.min(
        playerLevel + levelVariation,
        LEVEL_ATTRIBUTE_CONFIG.maxLevel
    ));

    // Calculate variance based on player level
    const levelFactor = (playerLevel - 1) / (LEVEL_ATTRIBUTE_CONFIG.maxLevel - 1);
    const variance = LEVEL_ATTRIBUTE_CONFIG.baseVariance + 
                    (LEVEL_ATTRIBUTE_CONFIG.maxVariance - LEVEL_ATTRIBUTE_CONFIG.baseVariance) * levelFactor;

    // Base attributes scale with equipment level
    const levelScale = 1 + (equipmentLevel - 1) * LEVEL_ATTRIBUTE_CONFIG.scalePerLevel;
    const attributeBonus = 1 + powerTier.attributeBonus / 100;

    // Generate base attributes
    const baseAttack = Math.floor((10 + Math.random() * 20) * quality * levelScale * attributeBonus * (1 + (Math.random() * 2 - 1) * variance));
    const baseLife = Math.floor((50 + Math.random() * 100) * quality * levelScale * attributeBonus * (1 + (Math.random() * 2 - 1) * variance));
    const baseDefense = Math.floor((5 + Math.random() * 10) * quality * levelScale * attributeBonus * (1 + (Math.random() * 2 - 1) * variance));
    const baseAgility = Math.floor((5 + Math.random() * 10) * quality * levelScale * attributeBonus * (1 + (Math.random() * 2 - 1) * variance));

    let equipment = {
        id: Date.now(),
        type: randomType.type,
        icon: randomType.icon,
        name: randomType.name,
        quality: quality,
        qualityName: QUALITY_NAMES[quality],
        level: equipmentLevel,
        attack: baseAttack,
        life: baseLife,
        defense: baseDefense,
        agility: baseAgility,
        affixes: []
    };

    // Generate and apply affixes
    const affixes = generateAffixes(equipmentLevel, quality);
    equipment = applyAffixesToEquipment(equipment, affixes);

    return equipment;
};

// Calculate equipment power
export const calculateEquipmentPower = (equipment) => {
    if (!equipment) return 0;
    return equipment.attack + 
           Math.floor(equipment.life / 10) + 
           equipment.defense * 2 + 
           equipment.agility;
};

// Compare equipment
export const isEquipmentBetter = (newEquip, oldEquip) => {
    if (!oldEquip) return true;
    
    const newPower = calculateEquipmentPower(newEquip);
    const oldPower = calculateEquipmentPower(oldEquip);
    
    if (newPower !== oldPower) return newPower > oldPower;
    if (newEquip.quality !== oldEquip.quality) return newEquip.quality > oldEquip.quality;
    return newEquip.level > oldEquip.level;
};

// Calculate disassemble reward
export const calculateDisassembleReward = (equipment) => {
    const basePower = calculateEquipmentPower(equipment);
    return Math.floor(basePower / 100) + equipment.quality * 5 + equipment.level;
};

// Format affixes for display
export const formatAffixes = (equipment) => {
    if (!equipment.affixes || equipment.affixes.length === 0) {
        return '';
    }
    return equipment.affixes.map(affix => `${affix.name}+${affix.value}`).join(' ');
};
