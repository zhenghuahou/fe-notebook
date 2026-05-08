# Vue3 单选列表组件 - 高亮选中项实现指南

## 概述

在Vue3中实现单选列表组件并让当前选中项高亮，主要通过动态类名绑定、CSS样式控制和响应式数据管理来实现。

## 核心实现原理

### 1. 基础结构

```vue
<template>
  <div class="radio-list">
    <div
      v-for="option in options"
      :key="option.value"
      class="radio-item"
      :class="{ 'radio-item--selected': selectedValue === option.value }"
      @click="selectOption(option.value)"
    >
      <div class="radio-circle">
        <div v-if="selectedValue === option.value" class="radio-dot"></div>
      </div>
      <span class="radio-label">{{ option.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedValue = ref('')
const options = ref([
  { label: '选项一', value: 'option1' },
  { label: '选项二', value: 'option2' },
  { label: '选项三', value: 'option3' }
])

const selectOption = (value) => {
  selectedValue.value = value
}
</script>
```

### 2. 高亮样式实现

```css
/* 基础样式 */
.radio-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
}

/* 悬停效果 */
.radio-item:hover {
  border-color: #c0c4cc;
  background: #f8f9fa;
}

/* 选中状态高亮 */
.radio-item--selected {
  border-color: #409eff !important;
  background: #ecf5ff !important;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

/* 选中项文字高亮 */
.radio-item--selected .radio-label {
  color: #409eff;
  font-weight: 500;
}
```

## 高亮实现方案

### 方案1: 边框高亮

```css
.radio-item--selected {
  border-color: #409eff;
  border-width: 2px;
}
```

### 方案2: 背景色高亮

```css
.radio-item--selected {
  background: #ecf5ff;
  color: #409eff;
}
```

### 方案3: 阴影高亮

```css
.radio-item--selected {
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}
```

### 方案4: 渐变背景高亮

```css
.radio-item--selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

### 方案5: 左侧指示条高亮

```css
.radio-item {
  position: relative;
}

.radio-item--selected::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #409eff;
  border-radius: 2px;
}
```

## 完整组件实现

### 1. 可复用的RadioList组件

```vue
<template>
  <div class="radio-list-component" :class="themeClass">
    <div
      v-for="option in options"
      :key="getOptionKey(option)"
      class="radio-item"
      :class="{ 
        'radio-item--selected': isSelected(option),
        'radio-item--disabled': option.disabled
      }"
      @click="!option.disabled && handleSelect(option)"
    >
      <div class="radio-circle">
        <div v-if="isSelected(option)" class="radio-dot"></div>
      </div>
      
      <div class="radio-content">
        <slot :option="option" :selected="isSelected(option)">
          <span class="radio-label">{{ getOptionLabel(option) }}</span>
        </slot>
      </div>
      
      <div v-if="showIndicator && isSelected(option)" class="selected-indicator">
        ✓
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  options: { type: Array, default: () => [] },
  modelValue: { type: [String, Number, Object], default: null },
  labelKey: { type: String, default: 'label' },
  valueKey: { type: String, default: 'value' },
  showIndicator: { type: Boolean, default: false },
  theme: { type: String, default: 'blue' }
})

const emit = defineEmits(['update:modelValue', 'change'])

const themeClass = computed(() => `theme-${props.theme}`)

const getOptionLabel = (option) => {
  if (typeof option === 'string') return option
  return option[props.labelKey] || option.label || String(option)
}

const getOptionValue = (option) => {
  if (typeof option === 'string') return option
  return option[props.valueKey] !== undefined ? option[props.valueKey] : option.value !== undefined ? option.value : option
}

const getOptionKey = (option) => {
  return getOptionValue(option)
}

const isSelected = (option) => {
  const optionValue = getOptionValue(option)
  return props.modelValue === optionValue
}

const handleSelect = (option) => {
  const value = getOptionValue(option)
  emit('update:modelValue', value)
  emit('change', value, option)
}
</script>
```

### 2. 使用示例

```vue
<template>
  <div>
    <!-- 基础用法 -->
    <RadioList
      v-model="selected"
      :options="options"
      @change="handleChange"
    />
    
    <!-- 自定义主题 -->
    <RadioList
      v-model="selected"
      :options="options"
      theme="green"
      :show-indicator="true"
    />
    
    <!-- 自定义内容 -->
    <RadioList v-model="selected" :options="richOptions">
      <template #default="{ option, selected }">
        <div class="custom-option">
          <div class="option-title">{{ option.title }}</div>
          <div class="option-desc">{{ option.description }}</div>
        </div>
      </template>
    </RadioList>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RadioList from './components/RadioList.vue'

const selected = ref('')
const options = ref([
  { label: '选项一', value: 'option1' },
  { label: '选项二', value: 'option2' },
  { label: '选项三', value: 'option3' }
])

const handleChange = (value, option) => {
  console.log('选中:', value, option)
}
</script>
```

## 高级功能实现

### 1. 动画效果

```css
/* 选中动画 */
.radio-dot {
  animation: radioSelect 0.3s ease;
}

@keyframes radioSelect {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 选中项脉冲效果 */
.radio-item--selected {
  animation: selectPulse 0.6s ease;
}

@keyframes selectPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}
```

### 2. 多主题支持

```css
/* 蓝色主题 */
.theme-blue .radio-item--selected {
  border-color: #409eff;
  background: #ecf5ff;
}

/* 绿色主题 */
.theme-green .radio-item--selected {
  border-color: #67c23a;
  background: #f0f9ff;
}

/* 紫色主题 */
.theme-purple .radio-item--selected {
  border-color: #9c27b0;
  background: #f3e5f5;
}
```

### 3. 卡片式布局

```css
.radio-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.radio-card {
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.radio-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.radio-card--selected {
  border-color: #409eff;
  background: #ecf5ff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}
```

## 最佳实践

### 1. 响应式设计

```css
@media (max-width: 768px) {
  .radio-item {
    padding: 10px 12px;
  }
  
  .radio-cards {
    grid-template-columns: 1fr;
  }
}
```

### 2. 无障碍访问

```vue
<div
  class="radio-item"
  role="radio"
  :aria-checked="isSelected(option)"
  :tabindex="option.disabled ? -1 : 0"
  @keydown.enter="handleSelect(option)"
  @keydown.space.prevent="handleSelect(option)"
>
```

### 3. 性能优化

```javascript
// 使用计算属性缓存选中状态
const isSelected = computed(() => (option) => {
  return selectedValue.value === getOptionValue(option)
})

// 使用 v-memo 优化大列表渲染
<div v-memo="[option, isSelected(option)]">
```

## 常见问题解决

### 1. 选中状态不更新

确保使用响应式数据：
```javascript
const selectedValue = ref('') // 正确
// const selectedValue = '' // 错误
```

### 2. 样式优先级问题

使用 `!important` 或提高选择器权重：
```css
.radio-item.radio-item--selected {
  border-color: #409eff;
}
```

### 3. 动画不流畅

添加适当的过渡效果：
```css
.radio-item {
  transition: all 0.3s ease;
}
```

## 总结

实现Vue3单选列表组件的高亮效果主要包括：

1. **动态类名绑定** - 使用 `:class` 绑定选中状态
2. **CSS样式控制** - 定义高亮样式和过渡效果
3. **响应式数据** - 使用 `ref` 管理选中状态
4. **事件处理** - 处理点击选择逻辑
5. **动画效果** - 添加选中动画提升用户体验

通过这些技术的组合，可以创建出功能完整、用户体验良好的单选列表组件。