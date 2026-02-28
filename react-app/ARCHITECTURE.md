# React App - Architecture Documentation

## 项目结构

```
react-app/
├── src/
│   ├── components/          # UI 组件
│   │   ├── TopBar.jsx       # 顶部栏（角色信息、战力）
│   │   ├── Notification.jsx # 通知提示
│   │   ├── GameArea.jsx     # 游戏主区域（砍树）
│   │   ├── LevelDisplay.jsx # 等级显示
│   │   ├── StaminaBar.jsx   # 修为条
│   │   ├── StatsDisplay.jsx # 属性显示
│   │   ├── EquipmentGrid.jsx# 装备网格
│   │   ├── BottomActions.jsx# 底部操作栏
│   │   ├── BottomNav.jsx    # 底部导航
│   │   ├── EquipmentComparisonModal.jsx # 装备对比弹窗
│   │   ├── EquipmentDetailModal.jsx     # 装备详情弹窗
│   │   └── RecordsModal.jsx             # 记录查询弹窗
│   ├── contexts/            # 状态管理
│   │   └── GameContext.jsx  # 游戏全局状态
│   ├── constants/           # 游戏配置
│   │   └── gameConfig.js    # 所有游戏常量和配置
│   ├── utils/               # 工具函数
│   │   ├── equipmentUtils.js # 装备系统（掉落、词条、对比）
│   │   ├── levelUtils.js     # 等级系统
│   │   ├── combatUtils.js    # 战力计算
│   │   └── recordUtils.js    # 记录系统
│   ├── App.jsx              # 主应用组件
│   ├── App.css              # 全局样式
│   ├── index.css            # 基础样式
│   └── main.jsx             # 应用入口
├── public/                  # 静态资源
├── index.html               # HTML 模板
├── vite.config.js           # Vite 配置
└── package.json             # 依赖配置
```

## 组件说明

### 1. 布局组件

#### TopBar (顶部栏)
- **职责**: 显示角色信息和战力
- **状态**: 从 GameContext 获取 spiritStone, crystal, combatPower
- **特点**: 响应式设计，自动更新

#### BottomNav (底部导航)
- **职责**: 游戏主导航栏
- **功能**: 切换不同游戏模块（妖盟、洞府、砍树、挑战、冒险）

### 2. 游戏核心组件

#### GameArea (游戏区域)
- **职责**: 主要游戏交互区域
- **功能**: 点击树木进行砍树操作
- **事件**: onChop 回调处理砍树逻辑

#### LevelDisplay (等级显示)
- **职责**: 显示当前等级和修仙境界
- **功能**: 显示升级进度 (当前/所需)
- **依赖**: levelUtils.js

#### StaminaBar (修为条)
- **职责**: 显示和管理修为值
- **功能**: 自动恢复、实时更新
- **特点**: 平滑动画过渡

#### StatsDisplay (属性显示)
- **职责**: 显示四维属性
- **属性**: 攻击、生命、防御、敏捷
- **更新**: 装备变化时自动更新

### 3. 装备系统组件

#### EquipmentGrid (装备网格)
- **职责**: 显示所有装备槽位
- **功能**: 
  - 显示已装备的装备信息
  - 点击装备查看详情
  - 显示装备品质、等级、词条
- **交互**: 点击触发 onEquipmentClick

#### EquipmentComparisonModal (装备对比弹窗)
- **职责**: 对比新旧装备属性
- **功能**:
  - 显示两件装备的详细对比
  - 高亮属性变化（绿色上升、红色下降）
  - 选择装备新的或保留旧的
- **依赖**: equipmentUtils.js

#### EquipmentDetailModal (装备详情弹窗)
- **职责**: 显示装备完整信息
- **功能**:
  - 显示装备所有属性
  - 显示词条信息
  - 分解装备功能

#### RecordsModal (记录弹窗)
- **职责**: 查询游戏记录
- **功能**:
  - 筛选记录类型（全部、掉落、装备、分解）
  - 显示装备详细信息
  - 分页显示（最多 200 条）

### 4. 辅助组件

#### Notification (通知)
- **职责**: 显示游戏提示信息
- **特点**: 自动消失、动画效果

#### BottomActions (底部操作)
- **职责**: 主要操作按钮
- **功能**:
  - 砍树按钮（显示消耗）
  - 自动装备开关
  - 等级信息查询
  - 分解统计显示

## 状态管理

### GameContext

使用 React Context API 管理全局游戏状态：

```javascript
const gameState = {
  // 玩家数据
  combatPower: 0,
  spiritStone: 0,
  crystal: 1142,
  
  // 修为系统
  stamina: 50,
  maxStamina: 50,
  staminaRecoveryRate: 1,
  
  // 等级系统
  level: 1,
  chopCount: 0,
  cultivation: { stage, rank },
  
  // 属性
  attack: 0,
  life: 100,
  defense: 0,
  agility: 0,
  
  // 装备
  equipment: {},
  
  // 设置
  autoEquip: false,
  
  // 记录
  records: []
};
```

### 状态持久化

- 使用 LocalStorage 自动保存
- 每 5 秒保存一次
- 页面加载时自动恢复

### 状态更新

提供两个主要方法：
- `updateGameState(updates)`: 部分更新状态
- `setGameState(newState)`: 完全替换状态

## 工具模块

### equipmentUtils.js
- `generateAffixes()`: 生成装备词条
- `applyAffixesToEquipment()`: 应用词条到装备
- `dropEquipment()`: 掉落装备
- `calculateEquipmentPower()`: 计算装备战力
- `isEquipmentBetter()`: 比较装备优劣
- `calculateDisassembleReward()`: 计算分解奖励

### levelUtils.js
- `calculateMaxStamina()`: 计算最大修为
- `getCultivationInfo()`: 获取修仙境界信息
- `checkLevelUp()`: 检查是否升级
- `getLevelUpInfo()`: 获取升级所需经验

### combatUtils.js
- `calculateCombatPower()`: 计算总战力
- `updateCombatPowerFromEquipment()`: 从装备更新战力

### recordUtils.js
- `addRecord()`: 添加记录
- `getRecordsByType()`: 按类型筛选记录

## 游戏常量

所有游戏配置集中在 `constants/gameConfig.js`：

- `QUALITY_NAMES`: 品质名称
- `AFFIX_POOL`: 词条池
- `AFFIX_LEVEL_CONFIG`: 词条等级配置
- `LEVEL_CONFIG`: 等级系统配置
- `COMBAT_POWER_DROP_CONFIG`: 战力掉落配置
- `EQUIPMENT_TYPES`: 装备类型
- `QUALITY_COLORS`: 品质颜色

## 开发指南

### 添加新组件

1. 在 `src/components/` 创建组件文件
2. 创建对应的 CSS 文件
3. 从 GameContext 获取所需状态
4. 在 App.jsx 中引入并使用

### 添加新功能

1. 在 `constants/gameConfig.js` 添加配置
2. 在 `utils/` 创建相关工具函数
3. 更新 GameContext 状态（如需要）
4. 创建或更新相关组件

### 调试技巧

1. 使用 React DevTools 查看组件树
2. 在 GameContext 中添加 console.log
3. 使用 Vite 的 HMR 快速调试
4. 检查 localStorage 中保存的状态

## 性能优化

1. **使用 useCallback**: 避免不必要的函数重新创建
2. **组件拆分**: 每个组件职责单一
3. **状态局部化**: 只在需要的组件中获取状态
4. **懒加载**: Modal 组件按需渲染

## 构建和部署

### 开发模式
```bash
cd react-app
npm install
npm run dev
```

### 生产构建
```bash
npm run build
```

构建产物在 `dist/` 目录，自动部署到 GitHub Pages。

## 未来扩展

可能的扩展方向：

1. **添加新模块**: 妖盟、洞府、挑战、冒险
2. **增强状态管理**: 考虑使用 Redux 或 Zustand
3. **添加动画**: 使用 Framer Motion
4. **PWA 支持**: 离线游戏体验
5. **多语言支持**: i18n 国际化
6. **云存档**: 后端 API 集成
