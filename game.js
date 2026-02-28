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
    cultivation: {
        stage: '炼气前期',
        rank: '一阶'
    },
    
    // Stats
    attack: 0,
    life: 100,
    defense: 0,
    agility: 0,
    
    // Equipment
    equipment: [],
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
            const index = parseInt(slot.dataset.index);
            disassembleEquipment(index);
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
        Object.assign(gameState, loadedState);
        gameState.lastStaminaUpdate = Date.now();
        // Initialize equipmentIdCounter from loaded state
        if (!gameState.equipmentIdCounter) {
            gameState.equipmentIdCounter = 0;
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

// Drop equipment with random attributes
function dropEquipment() {
    if (gameState.equipment.length >= gameState.maxEquipment) {
        showNotification('装备栏已满！');
        return;
    }
    
    // Random equipment type
    const equipType = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];
    
    // Random quality (1-4, with higher quality being rarer)
    const qualityRoll = Math.random();
    let quality;
    if (qualityRoll < 0.5) quality = 1;      // 50% common
    else if (qualityRoll < 0.8) quality = 2; // 30% uncommon
    else if (qualityRoll < 0.95) quality = 3; // 15% rare
    else quality = 4;                          // 5% epic
    
    // Random level (1 to player level + 2)
    const level = Math.floor(Math.random() * (gameState.level + 2)) + 1;
    
    // Calculate stats based on quality and level
    const baseStats = level * 10 * quality;
    const equipment = {
        id: ++gameState.equipmentIdCounter,
        name: equipType.name,
        icon: equipType.icon,
        type: equipType.type,
        quality: quality,
        level: level,
        attack: Math.floor(baseStats * (0.8 + Math.random() * 0.4)),
        life: Math.floor(baseStats * 10 * (0.8 + Math.random() * 0.4)),
        defense: Math.floor(baseStats * 0.3 * (0.8 + Math.random() * 0.4)),
        agility: Math.floor(baseStats * 0.5 * (0.8 + Math.random() * 0.4))
    };
    
    gameState.equipment.push(equipment);
    
    // Show notification
    showNotification(`获得 ${QUALITY_NAMES[quality]} ${equipment.name} ${level}级`);
    
    // Auto equip if enabled and this is better than existing
    if (gameState.autoEquip) {
        autoEquipCheck(equipment);
    }
    
    renderEquipmentGrid();
    updateCombatPower();
}

// Auto equip logic - automatically disassemble lower quality items of same type
function autoEquipCheck(newEquipment) {
    // Find equipment of same type with lower quality or level
    for (let i = gameState.equipment.length - 2; i >= 0; i--) {
        const existing = gameState.equipment[i];
        if (existing.type === newEquipment.type) {
            // If new equipment is better quality, or same quality but higher level
            if (newEquipment.quality > existing.quality || 
                (newEquipment.quality === existing.quality && newEquipment.level > existing.level)) {
                // Auto-disassemble the weaker item
                const reward = calculateDisassembleReward(existing);
                gameState.spiritStone += reward;
                gameState.disassembleCount++;
                gameState.disassembleReward += reward;
                gameState.equipment.splice(i, 1);
                showNotification(`自动分解 ${existing.name}，获得 ${reward} 灵石`);
                break;
            }
        }
    }
}

// Disassemble equipment
function disassembleEquipment(index) {
    if (index < 0 || index >= gameState.equipment.length) return;
    
    const equipment = gameState.equipment[index];
    const reward = calculateDisassembleReward(equipment);
    
    gameState.spiritStone += reward;
    gameState.disassembleCount++;
    gameState.disassembleReward += reward;
    
    showNotification(`分解 ${equipment.name}，获得 ${reward} 灵石`);
    
    // Remove equipment
    gameState.equipment.splice(index, 1);
    
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

// Combat power calculation constants
const LIFE_TO_POWER_RATIO = 10;
const DEFENSE_MULTIPLIER = 2;

// Disassemble reward calculation
const DISASSEMBLE_REWARD_BASE = 10;

function calculateDisassembleReward(equipment) {
    return equipment.level * equipment.quality * DISASSEMBLE_REWARD_BASE;
}

// Calculate combat power from all equipment
function updateCombatPower() {
    let totalPower = 0;
    
    gameState.equipment.forEach(equip => {
        totalPower += equip.attack + equip.life / LIFE_TO_POWER_RATIO + equip.defense * DEFENSE_MULTIPLIER + equip.agility;
    });
    
    gameState.combatPower = Math.floor(totalPower);
    
    // Update stats
    gameState.attack = 0;
    gameState.life = 100; // base life
    gameState.defense = 0;
    gameState.agility = 0;
    
    gameState.equipment.forEach(equip => {
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
    
    // Render existing equipment
    gameState.equipment.forEach((equip, index) => {
        const slot = document.createElement('div');
        slot.className = `equipment-slot quality-${equip.quality}`;
        slot.dataset.index = index;
        slot.innerHTML = `
            <div class="equipment-icon">${equip.icon}</div>
            <div class="equipment-level">${equip.level}级</div>
        `;
        slot.title = `${equip.name} ${equip.level}级\n攻击:${equip.attack} 生命:${equip.life}\n防御:${equip.defense} 敏捷:${equip.agility}\n点击分解`;
        grid.appendChild(slot);
    });
    
    // Fill remaining slots
    for (let i = gameState.equipment.length; i < gameState.maxEquipment; i++) {
        const slot = document.createElement('div');
        slot.className = 'equipment-slot empty';
        grid.appendChild(slot);
    }
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
    
    // Level
    document.getElementById('cultivationLevel').textContent = 
        `${gameState.level}级·${gameState.cultivation.stage}·${gameState.cultivation.rank}`;
    
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
