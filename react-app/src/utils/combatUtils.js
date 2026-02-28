import { LIFE_TO_POWER_RATIO, DEFENSE_MULTIPLIER } from '../constants/gameConfig';

// Calculate total combat power
export const calculateCombatPower = (gameState) => {
    const { attack, life, defense, agility } = gameState;
    return attack + Math.floor(life / LIFE_TO_POWER_RATIO) + defense * DEFENSE_MULTIPLIER + agility;
};

// Update combat power from equipment
export const updateCombatPowerFromEquipment = (equipment) => {
    let totalAttack = 0;
    let totalLife = 100; // Base life
    let totalDefense = 0;
    let totalAgility = 0;

    Object.values(equipment).forEach(equip => {
        if (equip) {
            totalAttack += equip.attack;
            totalLife += equip.life;
            totalDefense += equip.defense;
            totalAgility += equip.agility;
        }
    });

    return {
        attack: totalAttack,
        life: totalLife,
        defense: totalDefense,
        agility: totalAgility,
        combatPower: totalAttack + Math.floor(totalLife / LIFE_TO_POWER_RATIO) + totalDefense * DEFENSE_MULTIPLIER + totalAgility
    };
};
