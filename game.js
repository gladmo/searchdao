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

// Calculate equipment power
function calculateEquipmentPower(equipment) {
    return equipment.attack + equipment.life / LIFE_TO_POWER_RATIO + equipment.defense * DEFENSE_MULTIPLIER + equipment.agility;
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
            slot.title = `${equip.name} ${equip.level}级\n攻击:${equip.attack} 生命:${equip.life}\n防御:${equip.defense} 敏捷:${equip.agility}\n点击分解`;
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
