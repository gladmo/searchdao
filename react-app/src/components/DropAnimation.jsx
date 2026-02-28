import React, { useEffect, useState } from 'react';
import './DropAnimation.css';

const DropAnimation = ({ equipment, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Animation completes after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  // Get quality-based beam color and brightness
  const getBeamStyle = (quality) => {
    const qualityColors = {
      1: { color: '#9e9e9e', brightness: '0.5', blur: '10px' },      // 普通 - gray
      2: { color: '#4caf50', brightness: '0.7', blur: '15px' },      // 精良 - green
      3: { color: '#2196f3', brightness: '0.8', blur: '20px' },      // 稀有 - blue
      4: { color: '#9c27b0', brightness: '1.0', blur: '25px' },      // 史诗 - purple
      5: { color: '#ff9800', brightness: '1.2', blur: '30px' },      // 传说 - orange
      6: { color: '#f44336', brightness: '1.5', blur: '35px' },      // 神话 - red
      7: { color: '#ffd700', brightness: '2.0', blur: '40px' }       // 不朽 - gold
    };

    return qualityColors[quality] || qualityColors[1];
  };

  const beamStyle = getBeamStyle(equipment.quality);

  return (
    <div className="drop-animation-container">
      {/* Light beam effect */}
      <div 
        className="light-beam"
        style={{
          '--beam-color': beamStyle.color,
          '--beam-brightness': beamStyle.brightness,
          '--beam-blur': beamStyle.blur
        }}
      />
      
      {/* Equipment drop */}
      <div className="equipment-drop">
        <div 
          className={`equipment-icon quality-${equipment.quality}`}
          style={{ filter: `brightness(${beamStyle.brightness})` }}
        >
          {equipment.icon}
        </div>
        <div className="equipment-name" style={{ color: beamStyle.color }}>
          {equipment.qualityName} {equipment.name}
        </div>
      </div>
      
      {/* Sparkle effects */}
      <div className="sparkles">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="sparkle"
            style={{
              '--delay': `${i * 0.1}s`,
              '--angle': `${i * 45}deg`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DropAnimation;
