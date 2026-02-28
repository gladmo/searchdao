import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LEVEL_CONFIG } from '../constants/gameConfig';

const GameContext = createContext(null);

const initialGameState = {
    // Player stats
    combatPower: 0,
    spiritStone: 0,
    crystal: 1142,
    
    // Stamina system
    stamina: 50,
    maxStamina: 50,
    staminaRecoveryRate: 1,
    lastStaminaUpdate: Date.now(),
    
    // Level system
    level: 1,
    chopCount: 0,
    cultivation: {
        stage: '炼气前期',
        rank: '一阶'
    },
    
    // Stats
    attack: 0,
    life: 100,
    defense: 0,
    agility: 0,
    
    // Equipment - slot-based system
    equipment: {},
    maxEquipment: 12,
    equipmentIdCounter: 0,
    
    // Settings
    autoEquip: false,
    
    // Disassemble
    disassembleCount: 0,
    disassembleReward: 0,
    
    // Records system
    records: []
};

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState(initialGameState);
    const [notification, setNotification] = useState('');

    // Save game state to localStorage
    useEffect(() => {
        const saveInterval = setInterval(() => {
            localStorage.setItem('gameState', JSON.stringify(gameState));
        }, 5000);

        return () => clearInterval(saveInterval);
    }, [gameState]);

    // Load game state from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('gameState');
        if (saved) {
            try {
                const loadedState = JSON.parse(saved);
                // Calculate max stamina based on level
                const maxStamina = LEVEL_CONFIG.baseStamina + (loadedState.level - 1) * LEVEL_CONFIG.staminaPerLevel;
                setGameState({
                    ...loadedState,
                    maxStamina,
                    lastStaminaUpdate: Date.now()
                });
            } catch (error) {
                console.error('Failed to load game state:', error);
            }
        }
    }, []);

    // Stamina recovery system
    useEffect(() => {
        const recoveryInterval = setInterval(() => {
            setGameState(prev => {
                const now = Date.now();
                const timeDiff = (now - prev.lastStaminaUpdate) / 1000;
                const recoveredStamina = timeDiff * prev.staminaRecoveryRate;
                const newStamina = Math.min(prev.stamina + recoveredStamina, prev.maxStamina);
                
                return {
                    ...prev,
                    stamina: newStamina,
                    lastStaminaUpdate: now
                };
            });
        }, 1000);

        return () => clearInterval(recoveryInterval);
    }, []);

    const updateGameState = useCallback((updates) => {
        setGameState(prev => ({ ...prev, ...updates }));
    }, []);

    const showNotification = useCallback((message) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000);
    }, []);

    const value = {
        gameState,
        updateGameState,
        setGameState,
        notification,
        showNotification
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
