# DeepSeek助手模板使用指南

## 创建新形象

1. 复制 `base-template.js` 到 `examples` 目录下，并重命名为你的角色名称，例如 `dolphin.user.js`

2. 在新文件中替换以下占位符：
   - `{CHARACTER_NAME}`: 角色名称
   - `{MAIN_COLOR}`: 主要颜色（CSS颜色值）
   - `{HIGHLIGHT_COLOR}`: 高亮颜色（CSS颜色值）
   - `{CHARACTER_SPECIFIC_STYLES}`: 角色特定的CSS样式
   - `{CHARACTER_SPECIFIC_ANIMATIONS}`: 角色特定的动画

3. 实现以下关键函数：
   - `setMood()`: 设置角色心情
   - `checkNightMode()`: 处理夜间模式
   - `createBubble()`: 创建对话气泡
   - `initPet()`: 角色初始化逻辑

## 示例

可以参考 `examples` 目录下的示例实现：
- `whale.user.js`: 经典小鲸鱼形象
- `dolphin.user.js`: 活泼的海豚形象

## 注意事项

1. 保持文件结构简单，一个角色一个文件
2. 确保样式类名不会与其他角色冲突
3. 测试所有交互功能是否正常工作
4. 为动画添加适当的过渡效果
5. 考虑移动端适配
