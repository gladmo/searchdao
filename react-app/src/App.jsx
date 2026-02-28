import { useState, useCallback } from 'react';
import { GameProvider, useGame } from './contexts/GameContext';
import TopBar from './components/TopBar';
import Notification from './components/Notification';
import GameArea from './components/GameArea';
import LevelDisplay from './components/LevelDisplay';
import StaminaBar from './components/StaminaBar';
import StatsDisplay from './components/StatsDisplay';
import EquipmentGrid from './components/EquipmentGrid';
import BottomActions from './components/BottomActions';
import BottomNav from './components/BottomNav';
import EquipmentComparisonModal from './components/EquipmentComparisonModal';
import EquipmentDetailModal from './components/EquipmentDetailModal';
import RecordsModal from './components/RecordsModal';
import { RECORD_TYPES } from './constants/gameConfig';
import { 
    dropEquipment, 
    isEquipmentBetter, 
    calculateDisassembleReward 
} from './utils/equipmentUtils';
import { 
    checkLevelUp, 
    getCultivationInfo, 
    calculateMaxStamina 
} from './utils/levelUtils';
import { updateCombatPowerFromEquipment } from './utils/combatUtils';
import { addRecord } from './utils/recordUtils';
import './App.css';

function GameContent() {
    const { gameState, updateGameState, setGameState, showNotification } = useGame();
    const [comparisonModal, setComparisonModal] = useState(null);
    const [detailModal, setDetailModal] = useState(null);
    const [showRecords, setShowRecords] = useState(false);

    // Handle tree chop
    const handleChop = useCallback(() => {
        if (gameState.stamina < 1) {
            showNotification('修为不足！');
            return;
        }

        // Consume stamina
        const newStamina = gameState.stamina - 1;
        const newChopCount = gameState.chopCount + 1;

        // Drop equipment
        const droppedEquipment = dropEquipment(gameState.level, gameState.combatPower);
        
        // Add drop record
        const newRecords = addRecord(gameState.records, RECORD_TYPES.DROP, droppedEquipment);

        // Check if slot is occupied
        const existingEquipment = gameState.equipment[droppedEquipment.type];

        let updates = {
            stamina: newStamina,
            chopCount: newChopCount,
            records: newRecords
        };

        // Check for level up
        if (checkLevelUp(newChopCount, gameState.level)) {
            const newLevel = gameState.level + 1;
            const cultivation = getCultivationInfo(newLevel);
            const maxStamina = calculateMaxStamina(newLevel);
            
            updates = {
                ...updates,
                level: newLevel,
                cultivation: cultivation,
                maxStamina: maxStamina
            };

            showNotification(`✨ 恭喜升级到 ${newLevel}级！`);
        }

        if (existingEquipment) {
            if (gameState.autoEquip) {
                // Auto equip logic
                if (isEquipmentBetter(droppedEquipment, existingEquipment)) {
                    const newEquipment = { ...gameState.equipment };
                    newEquipment[droppedEquipment.type] = droppedEquipment;
                    
                    const stats = updateCombatPowerFromEquipment(newEquipment);
                    const reward = calculateDisassembleReward(existingEquipment);
                    const equipRecords = addRecord(newRecords, RECORD_TYPES.EQUIP, droppedEquipment);
                    const disassembleRecords = addRecord(equipRecords, RECORD_TYPES.DISASSEMBLE, existingEquipment, { reward });
                    
                    updates = {
                        ...updates,
                        equipment: newEquipment,
                        ...stats,
                        spiritStone: gameState.spiritStone + reward,
                        disassembleCount: gameState.disassembleCount + 1,
                        disassembleReward: gameState.disassembleReward + reward,
                        records: disassembleRecords
                    };

                    showNotification(`自动装备：${droppedEquipment.name}`);
                } else {
                    // Disassemble new equipment
                    const reward = calculateDisassembleReward(droppedEquipment);
                    const disassembleRecords = addRecord(newRecords, RECORD_TYPES.DISASSEMBLE, droppedEquipment, { reward });
                    
                    updates = {
                        ...updates,
                        spiritStone: gameState.spiritStone + reward,
                        disassembleCount: gameState.disassembleCount + 1,
                        disassembleReward: gameState.disassembleReward + reward,
                        records: disassembleRecords
                    };

                    showNotification(`自动分解：${droppedEquipment.name}`);
                }
                
                updateGameState(updates);
            } else {
                // Show comparison modal
                updateGameState(updates);
                setComparisonModal({
                    old: existingEquipment,
                    new: droppedEquipment
                });
            }
        } else {
            // Equip directly
            const newEquipment = { ...gameState.equipment };
            newEquipment[droppedEquipment.type] = droppedEquipment;
            
            const stats = updateCombatPowerFromEquipment(newEquipment);
            const equipRecords = addRecord(newRecords, RECORD_TYPES.EQUIP, droppedEquipment);
            
            updates = {
                ...updates,
                equipment: newEquipment,
                ...stats,
                records: equipRecords
            };

            updateGameState(updates);
            showNotification(`获得装备：${droppedEquipment.name}`);
        }
    }, [gameState, updateGameState, showNotification]);

    // Handle equip new equipment from comparison
    const handleEquipNew = useCallback(() => {
        if (!comparisonModal) return;

        const { old: oldEquipment, new: newEquipment } = comparisonModal;
        const newEquipmentState = { ...gameState.equipment };
        newEquipmentState[newEquipment.type] = newEquipment;
        
        const stats = updateCombatPowerFromEquipment(newEquipmentState);
        const reward = calculateDisassembleReward(oldEquipment);
        let newRecords = addRecord(gameState.records, RECORD_TYPES.EQUIP, newEquipment);
        newRecords = addRecord(newRecords, RECORD_TYPES.DISASSEMBLE, oldEquipment, { reward });

        updateGameState({
            equipment: newEquipmentState,
            ...stats,
            spiritStone: gameState.spiritStone + reward,
            disassembleCount: gameState.disassembleCount + 1,
            disassembleReward: gameState.disassembleReward + reward,
            records: newRecords
        });

        showNotification(`装备：${newEquipment.name}`);
        setComparisonModal(null);
    }, [comparisonModal, gameState, updateGameState, showNotification]);

    // Handle keep old equipment
    const handleKeepOld = useCallback(() => {
        if (!comparisonModal) return;

        const { new: newEquipment } = comparisonModal;
        const reward = calculateDisassembleReward(newEquipment);
        const newRecords = addRecord(gameState.records, RECORD_TYPES.DISASSEMBLE, newEquipment, { reward });

        updateGameState({
            spiritStone: gameState.spiritStone + reward,
            disassembleCount: gameState.disassembleCount + 1,
            disassembleReward: gameState.disassembleReward + reward,
            records: newRecords
        });

        showNotification(`分解：${newEquipment.name}`);
        setComparisonModal(null);
    }, [comparisonModal, gameState, updateGameState, showNotification]);

    // Handle equipment click
    const handleEquipmentClick = useCallback((equipmentType) => {
        if (equipmentType === 'records') {
            setShowRecords(true);
            return;
        }

        const equipment = gameState.equipment[equipmentType];
        if (equipment) {
            setDetailModal(equipment);
        }
    }, [gameState.equipment]);

    // Handle equipment disassemble
    const handleDisassemble = useCallback(() => {
        if (!detailModal) return;

        const newEquipmentState = { ...gameState.equipment };
        delete newEquipmentState[detailModal.type];
        
        const stats = updateCombatPowerFromEquipment(newEquipmentState);
        const reward = calculateDisassembleReward(detailModal);
        const newRecords = addRecord(gameState.records, RECORD_TYPES.DISASSEMBLE, detailModal, { reward });

        updateGameState({
            equipment: newEquipmentState,
            ...stats,
            spiritStone: gameState.spiritStone + reward,
            disassembleCount: gameState.disassembleCount + 1,
            disassembleReward: gameState.disassembleReward + reward,
            records: newRecords
        });

        showNotification(`分解：${detailModal.name}`);
        setDetailModal(null);
    }, [detailModal, gameState, updateGameState, showNotification]);

    // Toggle auto equip
    const handleToggleAutoEquip = useCallback(() => {
        updateGameState({
            autoEquip: !gameState.autoEquip
        });
        showNotification(`自动装备：${!gameState.autoEquip ? '开启' : '关闭'}`);
    }, [gameState.autoEquip, updateGameState, showNotification]);

    return (
        <div className="game-container">
            <TopBar />
            <Notification />
            <GameArea onChop={handleChop} />
            <LevelDisplay />
            <StaminaBar />
            <StatsDisplay />
            <EquipmentGrid onEquipmentClick={handleEquipmentClick} />
            <BottomActions onChop={handleChop} onToggleAutoEquip={handleToggleAutoEquip} />
            <BottomNav />

            {comparisonModal && (
                <EquipmentComparisonModal
                    oldEquipment={comparisonModal.old}
                    newEquipment={comparisonModal.new}
                    onEquipNew={handleEquipNew}
                    onKeepOld={handleKeepOld}
                />
            )}

            {detailModal && (
                <EquipmentDetailModal
                    equipment={detailModal}
                    onClose={() => setDetailModal(null)}
                    onDisassemble={handleDisassemble}
                />
            )}

            {showRecords && (
                <RecordsModal
                    records={gameState.records}
                    onClose={() => setShowRecords(false)}
                />
            )}
        </div>
    );
}

function App() {
    return (
        <GameProvider>
            <GameContent />
        </GameProvider>
    );
}

export default App;
