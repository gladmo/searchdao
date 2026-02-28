import {
  EQUIPMENT_TYPES,
  QUALITY_NAMES,
  QUALITY_DROP_CONFIG,
  MIN_QUALITY_DROP_RATE,
  COMBAT_POWER_DROP_CONFIG,
  LEVEL_ATTRIBUTE_CONFIG,
  AFFIX_POOL,
  AFFIX_LEVEL_CONFIG,
  EPIC_QUALITY_THRESHOLD,
  QUALITY_ATTRIBUTE_MULTIPLIERS
} from './constants';

// Generate equipment with level and combat power bonuses
export function generateEquipment(playerLevel, combatPower) {
  // Random equipment type
  const equipType = EQUIPMENT_TYPES[Math.floor(Math.random() * EQUIPMENT_TYPES.length)];
  
  // Equipment level (player level ±2, capped at maxLevel)
  const levelVariance = Math.floor(Math.random() * 5) - 2; // -2 to +2
  const equipmentLevel = Math.max(1, Math.min(
    LEVEL_ATTRIBUTE_CONFIG.maxEquipmentLevel,
    playerLevel + levelVariance
  ));
  
  // Get combat power tier bonuses
  const powerTier = COMBAT_POWER_DROP_CONFIG.getCurrentTier(combatPower);
  
  // Determine quality with combat power bonus
  const quality = determineQuality(powerTier.qualityBonus);
  
  // Calculate base attributes with level scaling
  const levelMultiplier = 1 + (equipmentLevel - 1) * LEVEL_ATTRIBUTE_CONFIG.attributeMultiplierPerLevel;
  
  // Variance increases with level
  const varianceRange = LEVEL_ATTRIBUTE_CONFIG.minVariance + 
    (LEVEL_ATTRIBUTE_CONFIG.maxVariance - LEVEL_ATTRIBUTE_CONFIG.minVariance) * 
    (equipmentLevel / LEVEL_ATTRIBUTE_CONFIG.maxEquipmentLevel);
  
  // Generate base attributes
  const baseAttack = Math.floor((10 + Math.random() * 20) * levelMultiplier * (1 + Math.random() * varianceRange - varianceRange / 2));
  const baseLife = Math.floor((50 + Math.random() * 100) * levelMultiplier * (1 + Math.random() * varianceRange - varianceRange / 2));
  const baseDefense = Math.floor((5 + Math.random() * 15) * levelMultiplier * (1 + Math.random() * varianceRange - varianceRange / 2));
  const baseAgility = Math.floor((3 + Math.random() * 12) * levelMultiplier * (1 + Math.random() * varianceRange - varianceRange / 2));
  
  // Apply combat power bonus to attributes
  const attributeBonus = 1 + powerTier.attributeBonus;
  
  // Apply quality multiplier to base attributes
  const qualityMultiplier = QUALITY_ATTRIBUTE_MULTIPLIERS[quality] || 1.0;
  
  const equipment = {
    id: Date.now() + Math.random(),
    type: equipType.type,
    name: equipType.name,
    icon: equipType.icon,
    level: equipmentLevel,
    quality: quality,
    qualityName: QUALITY_NAMES[quality],
    attack: Math.max(1, Math.floor(baseAttack * attributeBonus * qualityMultiplier)),
    life: Math.max(10, Math.floor(baseLife * attributeBonus * qualityMultiplier)),
    defense: Math.max(1, Math.floor(baseDefense * attributeBonus * qualityMultiplier)),
    agility: Math.max(1, Math.floor(baseAgility * attributeBonus * qualityMultiplier)),
    affixes: []
  };
  
  // Generate affixes for Epic and above quality
  if (quality >= EPIC_QUALITY_THRESHOLD) {
    const affixes = generateAffixes(equipmentLevel, quality);
    applyAffixesToEquipment(equipment, affixes);
  }
  
  return equipment;
}

// Determine equipment quality based on drop rates and combat power bonus
function determineQuality(qualityBonus) {
  let rates = QUALITY_DROP_CONFIG.map(config => {
    const adjustedRate = config.baseRate * (1 + qualityBonus * config.powerMultiplier);
    return Math.max(MIN_QUALITY_DROP_RATE, adjustedRate);
  });
  
  // Normalize rates to sum to 1.0
  const totalRate = rates.reduce((sum, rate) => sum + rate, 0);
  rates = rates.map(rate => rate / totalRate);
  
  // Select quality based on normalized rates
  const rand = Math.random();
  let cumulative = 0;
  for (let i = 0; i < rates.length; i++) {
    cumulative += rates[i];
    if (rand <= cumulative) {
      return i + 1;
    }
  }
  return 1; // fallback to normal quality
}

// Generate affixes based on equipment level and quality
export function generateAffixes(equipmentLevel, quality) {
  const affixCount = AFFIX_LEVEL_CONFIG.getAffixCount(equipmentLevel);
  
  if (affixCount === 0) {
    return [];
  }
  
  // Calculate total weight
  const totalWeight = AFFIX_POOL.reduce((sum, affix) => sum + affix.weight, 0);
  
  // Select unique affixes
  const selectedAffixes = [];
  const availableAffixes = [...AFFIX_POOL];
  
  for (let i = 0; i < affixCount && availableAffixes.length > 0; i++) {
    const rand = Math.random() * totalWeight;
    let cumulative = 0;
    let selectedIndex = -1;
    
    for (let j = 0; j < availableAffixes.length; j++) {
      cumulative += availableAffixes[j].weight;
      if (rand <= cumulative) {
        selectedIndex = j;
        break;
      }
    }
    
    if (selectedIndex !== -1) {
      const affix = availableAffixes[selectedIndex];
      const value = Math.floor(affix.min + Math.random() * (affix.max - affix.min + 1));
      
      selectedAffixes.push({
        name: affix.name,
        type: affix.type,
        value: value
      });
      
      availableAffixes.splice(selectedIndex, 1);
    }
  }
  
  return selectedAffixes;
}

// Apply affixes to equipment attributes
export function applyAffixesToEquipment(equipment, affixes) {
  equipment.affixes = affixes;
  
  affixes.forEach(affix => {
    switch (affix.type) {
      case 'attack':
        equipment.attack += affix.value;
        break;
      case 'life':
        equipment.life += affix.value;
        break;
      case 'defense':
        equipment.defense += affix.value;
        break;
      case 'agility':
        equipment.agility += affix.value;
        break;
      case 'multi':
        // Multi-type affixes boost all attributes
        const multiBonus = Math.floor(affix.value / 3);
        equipment.attack += multiBonus;
        equipment.life += multiBonus * 3;
        equipment.defense += multiBonus;
        equipment.agility += multiBonus;
        break;
    }
  });
}

// Format affixes for display
export function formatAffixes(equipment) {
  if (!equipment.affixes || equipment.affixes.length === 0) {
    return '';
  }
  
  return equipment.affixes.map(affix => `${affix.name}+${affix.value}`).join('\n');
}

// Compare two equipment pieces
export function isEquipmentBetter(newEquip, oldEquip) {
  if (!oldEquip) return true;
  
  const newPower = calculateEquipmentPower(newEquip);
  const oldPower = calculateEquipmentPower(oldEquip);
  
  return newPower > oldPower;
}

// Calculate equipment power
export function calculateEquipmentPower(equipment) {
  if (!equipment) return 0;
  return equipment.attack + equipment.life / 10 + equipment.defense * 2 + equipment.agility;
}
