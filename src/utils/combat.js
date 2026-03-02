/**
 * Turn-based Combat System for Training Gameplay
 * 
 * Combat Formula:
 * 1. Damage Calculation: max(1, Attack - Defense)
 * 2. Critical Hit: 2x damage (based on agility comparison)
 * 3. Dodge: 0 damage (based on agility comparison)
 * 4. Turn Order: Higher agility acts first
 * 5. Skills: Apply skill effects (stun, lifesteal, etc.)
 * 6. Buffs: Apply temporary stat modifications
 */

/**
 * Calculate base damage dealt by attacker to defender
 * @param {number} attack - Attacker's attack value
 * @param {number} defense - Defender's defense value
 * @returns {number} Damage dealt (minimum 1)
 */
export const calculateDamage = (attack, defense) => {
  return Math.max(1, attack - defense);
};

/**
 * Calculate critical hit chance based on agility difference
 * @param {number} attackerAgility - Attacker's agility
 * @param {number} defenderAgility - Defender's agility
 * @returns {number} Critical chance (0-1)
 */
export const calculateCriticalChance = (attackerAgility, defenderAgility) => {
  const agilityDiff = attackerAgility - defenderAgility;
  const baseCritChance = 0.05; // 5% base
  const bonusCritChance = Math.max(0, agilityDiff * 0.001); // +0.1% per agility point
  return Math.min(0.5, baseCritChance + bonusCritChance); // Max 50%
};

/**
 * Calculate dodge chance based on agility difference
 * @param {number} attackerAgility - Attacker's agility
 * @param {number} defenderAgility - Defender's agility
 * @returns {number} Dodge chance (0-1)
 */
export const calculateDodgeChance = (attackerAgility, defenderAgility) => {
  const agilityDiff = defenderAgility - attackerAgility;
  const baseDodgeChance = 0.03; // 3% base
  const bonusDodgeChance = Math.max(0, agilityDiff * 0.001); // +0.1% per agility point
  return Math.min(0.4, baseDodgeChance + bonusDodgeChance); // Max 40%
};

/**
 * Apply skill effects to combat turn
 * @param {Object} attacker - Attacker stats with skills
 * @param {Object} defender - Defender stats with skills
 * @param {number} baseDamage - Base damage before skills
 * @returns {Object} Modified damage and effects
 */
export const applySkillEffects = (attacker, defender, baseDamage) => {
  let damage = baseDamage;
  const effects = [];
  
  // Check for stun (from mount skills)
  if (attacker.skills) {
    const stunSkill = attacker.skills.find(s => s.type === 'stun');
    if (stunSkill && Math.random() < stunSkill.value / 100) {
      effects.push({ type: 'stun', source: 'attacker' });
    }
    
    // Check for lifesteal
    const lifestealSkill = attacker.skills.find(s => s.type === 'lifesteal');
    if (lifestealSkill) {
      const healAmount = Math.floor(damage * (lifestealSkill.value / 100));
      effects.push({ type: 'lifesteal', amount: healAmount, source: 'attacker' });
    }
  }
  
  return { damage, effects };
};

/**
 * Execute a single combat turn
 * @param {Object} attacker - Attacker's current state
 * @param {Object} defender - Defender's current state
 * @returns {Object} Turn result with damage, effects, and logs
 */
export const executeTurn = (attacker, defender) => {
  const log = [];
  
  // Check for dodge
  const dodgeChance = calculateDodgeChance(attacker.agility, defender.agility);
  if (Math.random() < dodgeChance) {
    log.push(`${defender.name} 闪避了攻击！`);
    return {
      damage: 0,
      dodged: true,
      effects: [],
      log
    };
  }
  
  // Calculate base damage
  let damage = calculateDamage(attacker.attack, defender.defense);
  log.push(`${attacker.name} 攻击 ${defender.name}，造成基础伤害 ${damage}`);
  
  // Check for critical hit
  const critChance = calculateCriticalChance(attacker.agility, defender.agility);
  const isCritical = Math.random() < critChance;
  if (isCritical) {
    damage *= 2;
    log.push(`💥 暴击！伤害翻倍至 ${damage}`);
  }
  
  // Apply skill effects
  const { damage: finalDamage, effects } = applySkillEffects(attacker, defender, damage);
  
  effects.forEach(effect => {
    if (effect.type === 'stun') {
      log.push(`😵 ${defender.name} 被击晕！`);
    } else if (effect.type === 'lifesteal') {
      log.push(`🩸 ${attacker.name} 吸取生命 ${effect.amount}`);
    }
  });
  
  log.push(`${defender.name} 受到 ${finalDamage} 点伤害`);
  
  return {
    damage: finalDamage,
    dodged: false,
    critical: isCritical,
    effects,
    log
  };
};

/**
 * Simulate full turn-based combat
 * @param {Object} playerStats - Player's stats
 * @param {Object} enemyStats - Enemy's stats
 * @param {number} maxTurns - Maximum number of turns (default 50)
 * @returns {Object} Combat result with victory status and detailed logs
 */
export const simulateTurnBasedCombat = (playerStats, enemyStats, maxTurns = 50) => {
  // Initialize combatants
  const player = {
    name: '我方',
    ...playerStats,
    currentLife: playerStats.life,
    buffs: []
  };
  
  const enemy = {
    name: '敌方',
    ...enemyStats,
    currentLife: enemyStats.life,
    buffs: []
  };
  
  const combatLog = [];
  let turn = 0;
  
  combatLog.push('====== 战斗开始 ======');
  combatLog.push(`我方: 生命 ${player.currentLife}/${player.life}`);
  combatLog.push(`敌方: 生命 ${enemy.currentLife}/${enemy.life}`);
  combatLog.push('');
  
  // Determine turn order based on agility
  const playerFirst = player.agility >= enemy.agility;
  
  // Combat loop
  while (turn < maxTurns && player.currentLife > 0 && enemy.currentLife > 0) {
    turn++;
    combatLog.push(`--- 回合 ${turn} ---`);
    
    // Determine attack order
    const firstAttacker = playerFirst ? player : enemy;
    const secondAttacker = playerFirst ? enemy : player;
    
    // First attacker's turn
    if (firstAttacker.currentLife > 0) {
      const turnResult = executeTurn(firstAttacker, secondAttacker);
      combatLog.push(...turnResult.log);
      
      secondAttacker.currentLife -= turnResult.damage;
      
      // Apply lifesteal
      turnResult.effects.forEach(effect => {
        if (effect.type === 'lifesteal') {
          firstAttacker.currentLife = Math.min(
            firstAttacker.life,
            firstAttacker.currentLife + effect.amount
          );
        }
      });
      
      combatLog.push(`${secondAttacker.name} 剩余生命: ${Math.max(0, secondAttacker.currentLife)}/${secondAttacker.life}`);
      
      // Check if second attacker is defeated
      if (secondAttacker.currentLife <= 0) {
        combatLog.push('');
        combatLog.push('====== 战斗结束 ======');
        combatLog.push(`${firstAttacker.name} 胜利！`);
        break;
      }
    }
    
    combatLog.push('');
    
    // Second attacker's turn
    if (secondAttacker.currentLife > 0 && firstAttacker.currentLife > 0) {
      const turnResult = executeTurn(secondAttacker, firstAttacker);
      combatLog.push(...turnResult.log);
      
      firstAttacker.currentLife -= turnResult.damage;
      
      // Apply lifesteal
      turnResult.effects.forEach(effect => {
        if (effect.type === 'lifesteal') {
          secondAttacker.currentLife = Math.min(
            secondAttacker.life,
            secondAttacker.currentLife + effect.amount
          );
        }
      });
      
      combatLog.push(`${firstAttacker.name} 剩余生命: ${Math.max(0, firstAttacker.currentLife)}/${firstAttacker.life}`);
      
      // Check if first attacker is defeated
      if (firstAttacker.currentLife <= 0) {
        combatLog.push('');
        combatLog.push('====== 战斗结束 ======');
        combatLog.push(`${secondAttacker.name} 胜利！`);
        break;
      }
    }
    
    combatLog.push('');
  }
  
  // Determine winner
  const victory = player.currentLife > 0;
  
  // Add summary
  if (turn >= maxTurns) {
    combatLog.push('');
    combatLog.push('====== 战斗超时 ======');
    combatLog.push(`判定: ${victory ? '我方胜利' : '敌方胜利'}`);
  }
  
  return {
    victory,
    turns: turn,
    playerFinalLife: Math.max(0, player.currentLife),
    enemyFinalLife: Math.max(0, enemy.currentLife),
    combatLog
  };
};
