import React from 'react';
import { GameProvider } from './contexts/GameContext';
import TopBar from './components/TopBar';
import Notification from './components/Notification';
import GameArea from './components/GameArea';
import LevelDisplay from './components/LevelDisplay';
import StaminaBar from './components/StaminaBar';
import StatsDisplay from './components/StatsDisplay';
import EquipmentGrid from './components/EquipmentGrid';
import BottomActions from './components/BottomActions';
import BottomNav from './components/BottomNav';
import './App.css';

function App() {
  return (
    <GameProvider>
      <div className="app-container">
        <div className="game-container">
          <TopBar />
          <Notification />
          <GameArea />
          <LevelDisplay />
          <StaminaBar />
          <StatsDisplay />
          <EquipmentGrid />
          <BottomActions />
          <BottomNav />
        </div>
      </div>
    </GameProvider>
  );
}

export default App;
