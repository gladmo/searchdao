# 寻道修仙 - React架构文档

## 概述

本项目已从原生JavaScript重构为React应用，采用模块化设计，将功能拆分到不同的组件和工具模块中。

## 技术栈

- **React 18**: 使用函数组件和Hooks
- **Vite 7**: 快速的开发服务器和构建工具
- **Context API**: 全局状态管理
- **CSS Modules**: 组件样式隔离

## 架构设计

### 1. 组件层次结构

```
App (GameProvider)
├── TopBar              # 玩家信息和战力
├── Notification        # 消息通知
├── GameArea            # 游戏主区域（砍树）
│   └── EquipmentComparisonModal  # 装备对比弹窗
├── LevelDisplay        # 等级和修仙境界
├── StaminaBar          # 修为进度条
├── StatsDisplay        # 四维属性展示
├── EquipmentGrid       # 装备槽位网格
│   └── EquipmentDetailModal      # 装备详情弹窗
├── BottomActions       # 砍树按钮和分解统计
└── BottomNav           # 底部导航栏
    └── RecordsModal    # 精怪记录弹窗
```

### 2. 状态管理 (GameContext)

使用React Context API管理全局游戏状态：

#### 状态结构
```javascript
{
  combatPower: 0,           // 战力
  spiritStone: 0,           // 灵石
  crystal: 1142,            // 水晶
  stamina: 50,              // 当前修为
  maxStamina: 50,           // 最大修为
  level: 1,                 // 等级
  chopCount: 0,             // 砍树次数
  cultivation: {            // 修仙境界
    stage: '炼气前期',
    rank: '一阶'
  },
  attack: 0,                // 攻击力
  life: 100,                // 生命值
  defense: 0,               // 防御力
  agility: 0,               // 敏捷
  equipment: {},            // 已装备的装备（type -> equipment）
  autoEquip: false,         // 自动装备开关
  disassembleCount: 0,      // 分解次数
  disassembleReward: 0,     // 分解获得的灵石总数
  records: []               // 游戏记录
}
```

#### 主要方法
- `chopTree()`: 砍树并掉落装备
- `equipNewEquipment()`: 装备新装备
- `disassembleEquipment()`: 分解装备
- `toggleAutoEquip()`: 切换自动装备模式
- `updateCombatPower()`: 更新战力
- `showNotification()`: 显示通知消息

### 3. 工具模块

#### constants.js
存储所有游戏常量：
- 品质等级配置 (QUALITY_NAMES, EPIC_QUALITY_THRESHOLD)
- 词条池配置 (AFFIX_POOL, AFFIX_LEVEL_CONFIG)
- 技能池配置 (SKILL_POOL, SKILL_LEVEL_CONFIG)
- 等级系统配置 (LEVEL_CONFIG)
- 战力加成配置 (COMBAT_POWER_DROP_CONFIG)
- 品质掉落配置 (QUALITY_DROP_CONFIG)
- 装备类型配置 (EQUIPMENT_TYPES)

#### equipment.js
装备相关逻辑：
- `generateEquipment()`: 生成装备（考虑等级、战力加成）
- `generateAffixes()`: 生成装备词条
- `generateSkills()`: 生成装备技能（史诗及以上）
- `applyAffixesToEquipment()`: 应用词条到装备
- `isEquipmentBetter()`: 比较装备优劣
- `calculateEquipmentPower()`: 计算装备战力（包含技能加成）

#### calculations.js
各种计算逻辑：
- `calculateMaxStamina()`: 计算最大修为
- `calculateCombatPower()`: 计算总战力
- `calculateCombatPowerFromStats()`: 从属性计算战力

#### storage.js
本地存储管理：
- `saveGameState()`: 保存游戏状态到localStorage
- `loadGameState()`: 从localStorage加载游戏状态
- `clearGameState()`: 清除游戏状态

### 4. 组件说明

#### TopBar
- 显示玩家头像、名字、货币（灵石、水晶）
- 显示战力值
- 纯展示组件，从Context获取数据

#### Notification
- 显示临时通知消息
- 3秒后自动消失
- 使用CSS动画实现淡入淡出效果

#### GameArea
- 主要游戏区域，展示树木和角色
- 点击树木触发砍树动作
- 管理装备对比弹窗的显示

#### LevelDisplay
- 显示当前等级、修仙境界、升级进度
- 格式：X级·境界·阶位 (进度/需求)

#### StaminaBar
- 显示修为条
- 动态更新进度条宽度
- 显示当前/最大修为数值

#### StatsDisplay
- 4x1网格布局展示四维属性
- 攻击、生命、防御、敏捷
- 自动计算角色基础属性+装备加成

#### EquipmentGrid
- 4x3网格布局展示12个装备槽位
- 根据装备品质显示不同的颜色和边框
- 点击装备打开详情弹窗

#### EquipmentComparisonModal
- 对比新旧装备的属性差异
- 显示属性增减（绿色▲增加，红色▼减少）
- 显示装备词条对比
- 显示装备技能对比（史诗及以上）
- 提供"装备新的"和"保留旧的"两个选项

#### EquipmentDetailModal
- 显示装备完整信息
- 提供分解装备按钮
- 显示装备词条（如果有）
- 显示装备技能（如果有）

#### BottomActions
- 显示分解统计（次数、获得灵石）
- 提供砍树按钮

#### BottomNav
- 底部3个按钮：商店、自动、精怪
- 自动按钮切换自动装备模式
- 精怪按钮打开记录查询弹窗

#### RecordsModal
- 显示游戏记录（掉落、装备、分解）
- 最多保存200条记录
- 按时间倒序显示

### 5. 游戏循环

1. **砍树** → 消耗修为 → 获得装备
2. **装备判断** → 如果槽位为空，自动装备 → 否则显示对比弹窗
3. **选择装备** → 装备新的（旧装备自动分解） / 保留旧的（新装备自动分解）
4. **更新战力** → 重新计算四维属性和战力
5. **修为恢复** → 每秒恢复1点修为
6. **等级提升** → 每砍10次树升1级（需求随等级增加）

### 6. 数据持久化

- 使用localStorage存储游戏状态
- 每次状态更新自动保存
- 页面加载时自动恢复上次的游戏进度
- 存储键：`searchdao_game_state`

### 7. 装备技能系统

装备技能系统为史诗（Epic）及以上品质的装备添加了额外的技能属性：

#### 技能类型

1. **触发技能** (Trigger Skills) - 按百分比触发的战斗效果：
   - 击晕 (Stun): 1-15%
   - 暴击 (Critical): 2-20%
   - 连击 (Combo): 2-18%
   - 闪避 (Dodge): 1-16%
   - 反击 (Counter): 1-14%
   - 吸血 (Lifesteal): 2-20%

2. **抗性技能** (Resistance Skills) - 减少被技能影响的概率：
   - 击晕抗性: 3-25%
   - 暴击抗性: 3-25%
   - 连击抗性: 3-25%
   - 闪避抗性: 3-25%
   - 反击抗性: 3-25%
   - 吸血抗性: 3-25%

#### 技能生成规则

- **品质要求**: 只有史诗（4）及以上品质的装备才能获得技能
- **等级要求**: 装备等级需要达到30级以上才能拥有技能
- **技能数量**: 根据装备等级决定
  - 30-49级: 1个技能
  - 50-69级: 2个技能
  - 70-89级: 3个技能
  - 90级以上: 4个技能
- **技能数值**: 随装备等级提升，技能数值也会提升（1.0x到2.0x缩放）

#### 战力计算

技能对战力有显著贡献，计算公式：
```
技能战力 = 技能值 × 战力倍率
```

不同技能的战力倍率：
- 击晕: 3.0x
- 暴击: 2.5x
- 连击: 2.8x
- 闪避: 2.6x
- 反击: 2.7x
- 吸血: 2.4x
- 所有抗性: 2.2x

#### UI显示

- **装备详情弹窗**: 显示装备的所有技能，触发技能和抗性技能有不同的视觉样式
- **装备对比弹窗**: 并排对比新旧装备的技能差异
- **颜色编码**: 触发技能使用紫色系，抗性技能使用蓝色系

### 8. 响应式设计

- 移动端优先设计
- 容器最大宽度480px，在PC端居中显示
- 移动端全屏显示，去除圆角
- 所有按钮和交互元素适配触摸操作

## 开发指南

### 添加新组件

1. 在 `src/components/` 创建新的 `.jsx` 文件
2. 创建对应的 `.css` 文件用于样式
3. 从 `GameContext` 导入需要的状态和方法
4. 在 `App.jsx` 中导入并使用

### 添加新功能

1. 如果需要新的状态，在 `GameContext` 中添加
2. 如果需要新的常量，在 `utils/constants.js` 中添加
3. 如果需要新的计算逻辑，在 `utils/calculations.js` 中添加
4. 如果需要新的工具函数，在对应的 `utils/*.js` 中添加

### 构建和部署

```bash
# 本地开发
npm run dev

# 构建生产版本
npm run build

# 构建产物会输出到 dist/
# GitHub Actions会自动复制到根目录并部署
```

## 性能优化

1. **组件懒加载**: 可考虑使用 React.lazy() 懒加载弹窗组件
2. **memo优化**: 对纯展示组件使用 React.memo() 避免不必要的重渲染
3. **useCallback**: 已在 GameContext 中使用 useCallback 缓存回调函数
4. **状态分割**: 可考虑将不同模块的状态分离到多个Context

## 未来扩展

- [ ] 添加商店功能
- [ ] 添加成就系统
- [ ] 添加排行榜
- [ ] 添加更多装备品质等级
- [ ] 添加装备强化系统
- [ ] 添加宠物/灵兽系统
- [ ] 添加多语言支持
