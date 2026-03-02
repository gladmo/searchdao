import { LEVEL_CONFIG, LIFE_TO_POWER_RATIO, DEFENSE_MULTIPLIER } from './constants';
import { calculateEquipmentPower } from './equipment';

// Calculate maximum stamina based on level
export function calculateMaxStamina(level) {
  return LEVEL_CONFIG.baseStamina + (level - 1) * LEVEL_CONFIG.staminaPerLevel;
}

// Calculate total combat power from game state
export function calculateCombatPower(gameState) {
  let totalAttack = gameState.attack;
  let totalLife = gameState.life;
  let totalDefense = gameState.defense;
  let totalAgility = gameState.agility;
  
  // Add equipment bonuses
  Object.values(gameState.equipment).forEach(equip => {
    if (equip) {
      totalAttack += equip.attack;
      totalLife += equip.life;
      totalDefense += equip.defense;
      totalAgility += equip.agility;
    }
  });
  
  // Add mount bonuses if mount exists
  if (gameState.mount) {
    totalAttack += gameState.mount.attack;
    totalLife += gameState.mount.life;
    totalDefense += gameState.mount.defense;
    totalAgility += gameState.mount.agility;
  }
  
  return Math.floor(totalAttack + totalLife / LIFE_TO_POWER_RATIO + totalDefense * DEFENSE_MULTIPLIER + totalAgility);
}

// Calculate combat power from individual stats
export function calculateCombatPowerFromStats(attack, life, defense, agility) {
  return Math.floor(attack + life / LIFE_TO_POWER_RATIO + defense * DEFENSE_MULTIPLIER + agility);
}

export { calculateEquipmentPower };
