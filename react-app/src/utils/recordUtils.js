import { MAX_RECORDS } from '../constants/gameConfig';

// Add a record to the records array
export const addRecord = (records, type, equipment, extraInfo = {}) => {
    const record = {
        id: Date.now(),
        type: type,
        timestamp: new Date().toLocaleString('zh-CN'),
        equipment: {
            icon: equipment.icon,
            name: equipment.name,
            quality: equipment.quality,
            qualityName: equipment.qualityName,
            level: equipment.level,
            attack: equipment.attack,
            life: equipment.life,
            defense: equipment.defense,
            agility: equipment.agility,
            affixes: equipment.affixes || []
        },
        ...extraInfo
    };

    const newRecords = [record, ...records];
    
    // Keep only last MAX_RECORDS records
    if (newRecords.length > MAX_RECORDS) {
        newRecords.splice(MAX_RECORDS);
    }

    return newRecords;
};

// Get records filtered by type
export const getRecordsByType = (records, type) => {
    if (type === 'all') return records;
    return records.filter(record => record.type === type);
};
