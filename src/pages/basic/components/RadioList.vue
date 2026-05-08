<template>
  <div class="radio-list-component">
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
      <!-- 单选圆圈 -->
      <div class="radio-circle">
        <div v-if="isSelected(option)" class="radio-dot"></div>
      </div>
      
      <!-- 选项内容 -->
      <div class="radio-content">
        <slot :option="option" :selected="isSelected(option)">
          <span class="radio-label">{{ getOptionLabel(option) }}</span>
        </slot>
      </div>
      
      <!-- 选中指示器 -->
      <div v-if="showIndicator && isSelected(option)" class="selected-indicator">
        ✓
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props定义
const props = defineProps({
  // 选项数据
  options: {
    type: Array,
    default: () => []
  },
  // 当前选中值
  modelValue: {
    type: [String, Number, Object],
    default: null
  },
  // 选项标签字段名
  labelKey: {
    type: String,
    default: 'label'
  },
  // 选项值字段名
  valueKey: {
    type: String,
    default: 'value'
  },
  // 是否显示选中指示器
  showIndicator: {
    type: Boolean,
    default: false
  },
  // 主题色
  theme: {
    type: String,
    default: 'blue', // blue, green, purple, orange
    validator: (value) => ['blue', 'green', 'purple', 'orange'].includes(value)
  }
})

// Events定义
const emit = defineEmits(['update:modelValue', 'change'])

// 计算属性
const themeClass = computed(() => `theme-${props.theme}`)

// 工具方法
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

// 事件处理
const handleSelect = (option) => {
  const value = getOptionValue(option)
  emit('update:modelValue', value)
  emit('change', value, option)
}
</script>

<style scoped>
.radio-list-component {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
  position: relative;
}

.radio-item:hover:not(.radio-item--disabled) {
  border-color: #c0c4cc;
  background: #f8f9fa;
}

.radio-item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f5f7fa;
}

.radio-circle {
  width: 16px;
  height: 16px;
  border: 2px solid #dcdfe6;
  border-radius: 50%;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.3s ease;
  flex-shrink: 0;
}

.radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: radioSelect 0.3s ease;
}

.radio-content {
  flex: 1;
}

.radio-label {
  font-size: 14px;
  color: #606266;
  transition: color 0.3s ease;
}

.selected-indicator {
  font-size: 16px;
  font-weight: bold;
  margin-left: 8px;
}

/* 蓝色主题 (默认) */
.theme-blue .radio-item--selected {
  border-color: #409eff;
  background: #ecf5ff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.theme-blue .radio-item--selected .radio-circle {
  border-color: #409eff;
}

.theme-blue .radio-dot {
  background: #409eff;
}

.theme-blue .radio-item--selected .radio-label {
  color: #409eff;
  font-weight: 500;
}

.theme-blue .selected-indicator {
  color: #409eff;
}

/* 绿色主题 */
.theme-green .radio-item--selected {
  border-color: #67c23a;
  background: #f0f9ff;
  box-shadow: 0 0 0 2px rgba(103, 194, 58, 0.2);
}

.theme-green .radio-item--selected .radio-circle {
  border-color: #67c23a;
}

.theme-green .radio-dot {
  background: #67c23a;
}

.theme-green .radio-item--selected .radio-label {
  color: #67c23a;
  font-weight: 500;
}

.theme-green .selected-indicator {
  color: #67c23a;
}

/* 紫色主题 */
.theme-purple .radio-item--selected {
  border-color: #9c27b0;
  background: #f3e5f5;
  box-shadow: 0 0 0 2px rgba(156, 39, 176, 0.2);
}

.theme-purple .radio-item--selected .radio-circle {
  border-color: #9c27b0;
}

.theme-purple .radio-dot {
  background: #9c27b0;
}

.theme-purple .radio-item--selected .radio-label {
  color: #9c27b0;
  font-weight: 500;
}

.theme-purple .selected-indicator {
  color: #9c27b0;
}

/* 橙色主题 */
.theme-orange .radio-item--selected {
  border-color: #e6a23c;
  background: #fdf6ec;
  box-shadow: 0 0 0 2px rgba(230, 162, 60, 0.2);
}

.theme-orange .radio-item--selected .radio-circle {
  border-color: #e6a23c;
}

.theme-orange .radio-dot {
  background: #e6a23c;
}

.theme-orange .radio-item--selected .radio-label {
  color: #e6a23c;
  font-weight: 500;
}

.theme-orange .selected-indicator {
  color: #e6a23c;
}

/* 动画 */
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
</style>