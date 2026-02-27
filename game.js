// Game State
const gameState = {
    player: {
        level: 1,
        exp: 0,
        maxExp: 100,
        spiritStones: 0,
        power: 10
    },
    resources: {
        wood: 0
    },
    equipment: {
        weapon: null,
        armor: null
    },
    pet: null,
    skills: {
        basic: { level: 1, cost: 10 },
        flying: { level: 1, cost: 20 }
    },
    pvp: {
        wins: 0,
        losses: 0
    },
    inventory: [],
    events: {
        doubleExp: {
            active: false,
            duration: 300000, // 5 minutes
            endTime: null
        }
    },
    cooldowns: {
        chopTree: 0
    }
};

// Equipment qualities
const QUALITIES = ['普通', '精良', '稀有', '史诗', '传说'];
const QUALITY_CLASSES = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
const QUALITY_MULTIPLIERS = [1, 1.5, 2, 3, 5];

// Pet names
const PET_NAMES = ['灵狐', '青龙', '朱雀', '玄武', '白虎', '麒麟'];

// Initialize game
function initGame() {
    loadGameState();
    updateUI();
    startGameLoop();
    startEvent();
    
    // Event listeners
    document.getElementById('chop-tree-btn').addEventListener('click', chopTree);
    document.getElementById('upgrade-weapon-btn').addEventListener('click', () => upgradeEquipment('weapon'));
    document.getElementById('upgrade-armor-btn').addEventListener('click', () => upgradeEquipment('armor'));
    document.getElementById('summon-pet-btn').addEventListener('click', summonPet);
    document.getElementById('upgrade-pet-btn').addEventListener('click', upgradePet);
    document.getElementById('pvp-battle-btn').addEventListener('click', startPvPBattle);
    
    document.querySelectorAll('.upgrade-skill-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const skill = e.target.dataset.skill;
            upgradeSkill(skill);
        });
    });
    
    addLog('欢迎来到寻道大千！开始你的修仙之旅吧！', 'info');
}

// Save/Load game state
function saveGameState() {
    localStorage.setItem('searchdao_save', JSON.stringify(gameState));
}

function loadGameState() {
    const saved = localStorage.getItem('searchdao_save');
    if (saved) {
        const loaded = JSON.parse(saved);
        Object.assign(gameState, loaded);
        addLog('读取存档成功！', 'success');
    }
}

// Resource gathering
function chopTree() {
    const now = Date.now();
    if (gameState.cooldowns.chopTree > now) {
        addLog('技能冷却中...', 'warning');
        return;
    }
    
    const baseWood = 5;
    const woodGained = Math.floor(baseWood * (1 + gameState.player.level * 0.1));
    gameState.resources.wood += woodGained;
    
    const baseExp = 10;
    const expMultiplier = gameState.events.doubleExp.active ? 2 : 1;
    const expGained = Math.floor(baseExp * expMultiplier);
    gainExp(expGained);
    
    // Random spirit stone drop
    if (Math.random() < 0.3) {
        const stonesGained = Math.floor(Math.random() * 3) + 1;
        gameState.player.spiritStones += stonesGained;
        addLog(`获得 ${stonesGained} 灵石！`, 'success');
    }
    
    addLog(`砍树获得 ${woodGained} 木材，${expGained} 经验${expMultiplier > 1 ? ' (双倍)' : ''}`, 'success');
    
    // Set cooldown (2 seconds)
    gameState.cooldowns.chopTree = now + 2000;
    
    updateUI();
    saveGameState();
}

// Experience and leveling
function gainExp(amount) {
    gameState.player.exp += amount;
    
    while (gameState.player.exp >= gameState.player.maxExp) {
        gameState.player.exp -= gameState.player.maxExp;
        gameState.player.level++;
        gameState.player.maxExp = Math.floor(gameState.player.maxExp * 1.5);
        gameState.player.power += 10;
        addLog(`恭喜升级！当前等级: ${gameState.player.level}`, 'success');
    }
}

// Equipment system
function upgradeEquipment(slot) {
    const cost = gameState.resources.wood >= 50 ? 50 : -1;
    
    if (cost < 0 || gameState.resources.wood < cost) {
        addLog('木材不足！需要 50 木材', 'error');
        return;
    }
    
    gameState.resources.wood -= cost;
    
    // Random quality
    const rand = Math.random();
    let qualityIndex;
    if (rand < 0.50) qualityIndex = 0; // 50% common
    else if (rand < 0.80) qualityIndex = 1; // 30% uncommon
    else if (rand < 0.95) qualityIndex = 2; // 15% rare
    else if (rand < 0.99) qualityIndex = 3; // 4% epic
    else qualityIndex = 4; // 1% legendary
    
    const quality = QUALITIES[qualityIndex];
    const qualityClass = QUALITY_CLASSES[qualityIndex];
    const multiplier = QUALITY_MULTIPLIERS[qualityIndex];
    
    const basePower = 10 + gameState.player.level * 2;
    const power = Math.floor(basePower * multiplier);
    
    const equipment = {
        name: slot === 'weapon' ? '剑' : '护甲',
        quality: quality,
        qualityClass: qualityClass,
        power: power,
        level: 1
    };
    
    gameState.equipment[slot] = equipment;
    gameState.player.power += power;
    
    addLog(`强化${equipment.name}成功！获得 ${quality} 品质装备 (+${power} 战力)`, 'success');
    
    updateUI();
    saveGameState();
}

// Pet system
function summonPet() {
    if (gameState.pet) {
        addLog('你已经有灵宠了！', 'warning');
        return;
    }
    
    if (gameState.player.spiritStones < 50) {
        addLog('灵石不足！需要 50 灵石', 'error');
        return;
    }
    
    gameState.player.spiritStones -= 50;
    
    const petName = PET_NAMES[Math.floor(Math.random() * PET_NAMES.length)];
    gameState.pet = {
        name: petName,
        level: 1,
        power: 15
    };
    
    gameState.player.power += gameState.pet.power;
    
    addLog(`成功召唤灵宠: ${petName}！(+${gameState.pet.power} 战力)`, 'success');
    
    updateUI();
    saveGameState();
}

function upgradePet() {
    if (!gameState.pet) return;
    
    const cost = gameState.pet.level * 20;
    
    if (gameState.player.spiritStones < cost) {
        addLog(`灵石不足！需要 ${cost} 灵石`, 'error');
        return;
    }
    
    gameState.player.spiritStones -= cost;
    
    const powerGain = 10;
    gameState.pet.level++;
    gameState.pet.power += powerGain;
    gameState.player.power += powerGain;
    
    addLog(`灵宠升级至 ${gameState.pet.level} 级！(+${powerGain} 战力)`, 'success');
    
    updateUI();
    saveGameState();
}

// Skills system
function upgradeSkill(skillName) {
    const skill = gameState.skills[skillName];
    if (!skill) return;
    
    const cost = skill.cost * skill.level;
    
    if (gameState.player.spiritStones < cost) {
        addLog(`灵石不足！需要 ${cost} 灵石`, 'error');
        return;
    }
    
    gameState.player.spiritStones -= cost;
    skill.level++;
    
    const powerGain = 5 * skill.level;
    gameState.player.power += powerGain;
    
    const skillNames = {
        basic: '基础剑法',
        flying: '御剑术'
    };
    
    addLog(`${skillNames[skillName]} 升级至 ${skill.level} 级！(+${powerGain} 战力)`, 'success');
    
    updateUI();
    saveGameState();
}

// PVP system
function startPvPBattle() {
    // Generate opponent with similar power
    const opponentPower = Math.floor(gameState.player.power * (0.8 + Math.random() * 0.4));
    
    // Battle calculation with some randomness
    const playerRoll = gameState.player.power * (0.9 + Math.random() * 0.2);
    const opponentRoll = opponentPower * (0.9 + Math.random() * 0.2);
    
    const victory = playerRoll > opponentRoll;
    
    const resultDiv = document.getElementById('pvp-result');
    
    if (victory) {
        gameState.pvp.wins++;
        const reward = Math.floor(10 + gameState.player.level * 2);
        gameState.player.spiritStones += reward;
        
        resultDiv.textContent = `胜利！战力 ${gameState.player.power} vs ${opponentPower}。获得 ${reward} 灵石！`;
        resultDiv.className = 'pvp-result victory';
        addLog(`竞技场胜利！获得 ${reward} 灵石`, 'success');
    } else {
        gameState.pvp.losses++;
        
        resultDiv.textContent = `失败！战力 ${gameState.player.power} vs ${opponentPower}。继续努力！`;
        resultDiv.className = 'pvp-result defeat';
        addLog('竞技场失败！继续提升实力吧', 'error');
    }
    
    updateUI();
    saveGameState();
}

// Events system
function startEvent() {
    // Start double exp event for 5 minutes
    gameState.events.doubleExp.active = true;
    gameState.events.doubleExp.endTime = Date.now() + gameState.events.doubleExp.duration;
    
    addLog('双倍经验活动已开启！', 'info');
}

function updateEventTimer() {
    if (gameState.events.doubleExp.active) {
        const remaining = gameState.events.doubleExp.endTime - Date.now();
        
        if (remaining <= 0) {
            gameState.events.doubleExp.active = false;
            addLog('双倍经验活动已结束', 'warning');
            // Restart event after 2 minutes
            setTimeout(startEvent, 120000);
        }
        
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        document.getElementById('event-timer-1').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Update UI
function updateUI() {
    // Player info
    document.getElementById('player-level').textContent = gameState.player.level;
    document.getElementById('player-exp').textContent = gameState.player.exp;
    document.getElementById('player-max-exp').textContent = gameState.player.maxExp;
    document.getElementById('spirit-stones').textContent = gameState.player.spiritStones;
    
    // Resources
    document.getElementById('wood-count').textContent = gameState.resources.wood;
    
    // Equipment
    const weaponSlot = document.getElementById('weapon-slot');
    if (gameState.equipment.weapon) {
        const w = gameState.equipment.weapon;
        weaponSlot.className = `slot-content filled quality-${w.qualityClass}`;
        weaponSlot.textContent = `${w.quality} ${w.name} (+${w.power})`;
    } else {
        weaponSlot.className = 'slot-content empty';
        weaponSlot.textContent = '无';
    }
    
    const armorSlot = document.getElementById('armor-slot');
    if (gameState.equipment.armor) {
        const a = gameState.equipment.armor;
        armorSlot.className = `slot-content filled quality-${a.qualityClass}`;
        armorSlot.textContent = `${a.quality} ${a.name} (+${a.power})`;
    } else {
        armorSlot.className = 'slot-content empty';
        armorSlot.textContent = '无';
    }
    
    // Pet
    if (gameState.pet) {
        document.getElementById('pet-name').textContent = gameState.pet.name;
        document.getElementById('pet-level').textContent = gameState.pet.level;
        document.getElementById('summon-pet-btn').style.display = 'none';
        document.getElementById('upgrade-pet-btn').style.display = 'block';
    } else {
        document.getElementById('pet-name').textContent = '无灵宠';
        document.getElementById('pet-level').textContent = '0';
        document.getElementById('summon-pet-btn').style.display = 'block';
        document.getElementById('upgrade-pet-btn').style.display = 'none';
    }
    
    // Skills
    document.getElementById('skill-basic-level').textContent = gameState.skills.basic.level;
    document.getElementById('skill-flying-level').textContent = gameState.skills.flying.level;
    
    // Update skill button costs
    document.querySelectorAll('.upgrade-skill-btn').forEach(btn => {
        const skill = btn.dataset.skill;
        const skillData = gameState.skills[skill];
        const cost = skillData.cost * skillData.level;
        btn.textContent = `升级 (${cost} 灵石)`;
        btn.disabled = gameState.player.spiritStones < cost;
    });
    
    // PVP
    document.getElementById('player-power').textContent = gameState.player.power;
    document.getElementById('pvp-wins').textContent = gameState.pvp.wins;
    document.getElementById('pvp-losses').textContent = gameState.pvp.losses;
    
    // Update button states
    updateButtonStates();
}

function updateButtonStates() {
    // Update chop tree button cooldown
    const chopBtn = document.getElementById('chop-tree-btn');
    const chopCooldown = document.getElementById('chop-cooldown');
    const now = Date.now();
    
    if (gameState.cooldowns.chopTree > now) {
        chopBtn.disabled = true;
        const remaining = Math.ceil((gameState.cooldowns.chopTree - now) / 1000);
        chopCooldown.textContent = `${remaining}s`;
    } else {
        chopBtn.disabled = false;
        chopCooldown.textContent = '';
    }
    
    // Update equipment buttons
    document.getElementById('upgrade-weapon-btn').disabled = gameState.resources.wood < 50;
    document.getElementById('upgrade-armor-btn').disabled = gameState.resources.wood < 50;
    
    // Update pet buttons
    document.getElementById('summon-pet-btn').disabled = gameState.player.spiritStones < 50;
    if (gameState.pet) {
        const petCost = gameState.pet.level * 20;
        const upgradePetBtn = document.getElementById('upgrade-pet-btn');
        upgradePetBtn.disabled = gameState.player.spiritStones < petCost;
        upgradePetBtn.textContent = `提升灵宠 (${petCost} 灵石)`;
    }
}

// Logging system
function addLog(message, type = 'info') {
    const logContent = document.getElementById('log-content');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    
    const timestamp = new Date().toLocaleTimeString('zh-CN');
    entry.textContent = `[${timestamp}] ${message}`;
    
    logContent.insertBefore(entry, logContent.firstChild);
    
    // Keep only last 50 messages
    while (logContent.children.length > 50) {
        logContent.removeChild(logContent.lastChild);
    }
}

// Game loop
function startGameLoop() {
    setInterval(() => {
        updateButtonStates();
        updateEventTimer();
    }, 100);
    
    // Auto-save every 30 seconds
    setInterval(() => {
        saveGameState();
    }, 30000);
}

// Passive resource generation (idle mechanics)
setInterval(() => {
    if (gameState.pet && gameState.pet.level >= 5) {
        const woodGain = Math.floor(gameState.pet.level * 0.5);
        if (woodGain > 0) {
            gameState.resources.wood += woodGain;
            updateUI();
        }
    }
}, 10000); // Every 10 seconds

// Initialize on load
window.addEventListener('DOMContentLoaded', initGame);

// Save before unload
window.addEventListener('beforeunload', saveGameState);
