<template>
  <div class="multiselect" :class="{ 'multiselect--disabled': disabled }">
    <!-- 触发器 -->
    <div 
      class="multiselect__trigger"
      :class="{ 'multiselect__trigger--active': isOpen }"
      @click="toggleDropdown"
      :tabindex="disabled ? -1 : 0"
      @keydown.enter.prevent="toggleDropdown"
      @keydown.space.prevent="toggleDropdown"
      @keydown.escape="closeDropdown"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      :aria-label="placeholder"
    >
      <div class="multiselect__content">
        <span v-if="selectedText" class="multiselect__selected">
          {{ selectedText }}
        </span>
        <span v-else class="multiselect__placeholder">
          {{ placeholder }}
        </span>
      </div>
      
      <div class="multiselect__actions">
        <button
          v-if="clearable && selectedValues.length > 0 && !disabled"
          class="multiselect__clear"
          @click.stop="clearSelection"
          :aria-label="'清空选择'"
        >
          ×
        </button>
        <div class="multiselect__arrow" :class="{ 'multiselect__arrow--up': isOpen }">
          ▼
        </div>
      </div>
    </div>

    <!-- 下拉选项 -->
    <transition name="multiselect-dropdown">
      <div
        v-if="isOpen"
        class="multiselect__dropdown"
        :style="{ maxHeight: maxHeight }"
        @click.stop
      >
        <!-- 搜索框 -->
        <div v-if="searchable" class="multiselect__search">
          <input
            ref="searchInput"
            v-model="searchText"
            type="text"
            class="multiselect__search-input"
            :placeholder="'搜索选项...'"
            @input="handleSearch"
            @keydown.escape="closeDropdown"
          />
        </div>

        <!-- 全选选项 -->
        <div v-if="showSelectAll && filteredOptions.length > 0" class="multiselect__select-all">
          <label class="multiselect__option multiselect__option--select-all">
            <input
              type="checkbox"
              :checked="isAllSelected"
              :indeterminate="isIndeterminate"
              @change="toggleSelectAll"
              class="multiselect__checkbox"
            />
            <span class="multiselect__option-label">全选</span>
          </label>
        </div>

        <!-- 选项列表 -->
        <div class="multiselect__options" v-if="filteredOptions.length > 0">
          <div
            v-for="(option, index) in filteredOptions"
            :key="getOptionKey(option)"
            class="multiselect__option"
            :class="{ 
              'multiselect__option--disabled': option.disabled,
              'multiselect__option--selected': isOptionSelected(option)
            }"
            @click="!option.disabled && toggleOption(option)"
            :tabindex="option.disabled ? -1 : 0"
            @keydown.enter.prevent="!option.disabled && toggleOption(option)"
            @keydown.space.prevent="!option.disabled && toggleOption(option)"
            role="option"
            :aria-selected="isOptionSelected(option)"
          >
            <label class="multiselect__option-content">
              <input
                type="checkbox"
                :checked="isOptionSelected(option)"
                :disabled="option.disabled"
                class="multiselect__checkbox"
                @change.stop="toggleOption(option)"
              />
              <span class="multiselect__option-label">
                {{ getOptionLabel(option) }}
              </span>
            </label>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="multiselect__empty">
          <span v-if="searchText">没有找到匹配的选项</span>
          <span v-else>暂无选项</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

// Props定义
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: true
  },
  clearable: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: true
  },
  maxHeight: {
    type: String,
    default: '200px'
  },
  showSelectAll: {
    type: Boolean,
    default: true
  },
  labelKey: {
    type: String,
    default: 'label'
  },
  valueKey: {
    type: String,
    default: 'value'
  }
})

// Events定义
const emit = defineEmits([
  'update:modelValue',
  'change',
  'search',
  'clear',
  'selectAll'
])

// 响应式数据
const isOpen = ref(false)
const searchText = ref('')
const searchInput = ref(null)
const selectedValues = ref([...props.modelValue])

// 计算属性
const filteredOptions = computed(() => {
  if (!searchText.value) {
    return props.options
  }
  
  return props.options.filter(option => {
    const label = getOptionLabel(option)
    return label.toLowerCase().includes(searchText.value.toLowerCase())
  })
})

const selectedText = computed(() => {
  if (selectedValues.value.length === 0) return ''
  
  if (selectedValues.value.length === 1) {
    const option = props.options.find(opt => getOptionValue(opt) === selectedValues.value[0])
    return option ? getOptionLabel(option) : ''
  }
  
  return `已选择 ${selectedValues.value.length} 项`
})

const isAllSelected = computed(() => {
  if (filteredOptions.value.length === 0) return false
  const availableOptions = filteredOptions.value.filter(opt => !opt.disabled)
  return bavailableOptions.every(option => selectedValues.value.includes(getOptionValue(option)))
})

const isIndeterminate = computed(() => {
  if (filteredOptions.value.length === 0) return false
  const availableOptions = filteredOptions.value.filter(opt => !opt.disabled)
  const selectedCount = availableOptions.filter(option => 
    selectedValues.value.includes(getOptionValue(option))
  ).length
  return selectedCount > 0 && selectedCount < availableOptions.length
})

// 工具方法
const getOptionLabel = (option) => {
  return option[props.labelKey] || option.label || String(option)
}

const getOptionValue = (option) => {
  return option[props.valueKey] !== undefined ? option[props.valueKey] : option.value !== undefined ? option.value : option
}

const getOptionKey = (option) => {
  return getOptionValue(option)
}

const isOptionSelected = (option) => {
  return selectedValues.value.includes(getOptionValue(option))
}

// 核心方法
const toggleDropdown = () => {
  if (props.disabled) return
  
  isOpen.value = !isOpen.value
  
  if (isOpen.value && props.searchable) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
}

const closeDropdown = () => {
  isOpen.value = false
  searchText.value = ''
}

const toggleOption = (option) => {
  if (option.disabled) return
  
  const value = getOptionValue(option)
  const index = selectedValues.value.indexOf(value)
  
  if (index > -1) {
    selectedValues.value.splice(index, 1)
  } else {
    selectedValues.value.push(value)
  }
  
  emit('update:modelValue', [...selectedValues.value])
  emit('change', [...selectedValues.value], option)
}

const toggleSelectAll = () => {
  const availableOptions = filteredOptions.value.filter(opt => !opt.disabled)
  
  if (isAllSelected.value) {
    // 取消全选
    availableOptions.forEach(option => {
      const value = getOptionValue(option)
      const index = selectedValues.value.indexOf(value)
      if (index > -1) {
        selectedValues.value.splice(index, 1)
      }
    })
  } else {
    // 全选
    availableOptions.forEach(option => {
      const value = getOptionValue(option)
      if (!selectedValues.value.includes(value)) {
        selectedValues.value.push(value)
      }
    })
  }
  
  emit('update:modelValue', [...selectedValues.value])
  emit('selectAll', !isAllSelected.value)
}

const clearSelection = () => {
  selectedValues.value = []
  emit('update:modelValue', [])
  emit('clear')
}

const handleSearch = () => {
  emit('search', searchText.value)
}

// 外部点击关闭
const handleClickOutside = (event) => {
  if (!event.target.closest('.multiselect')) {
    closeDropdown()
  }
}

// 监听器
watch(() => props.modelValue, (newValue) => {
  selectedValues.value = [...newValue]
}, { deep: true })

// 生命周期
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.multiselect {
  position: relative;
  display: inline-block;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.multiselect--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.multiselect__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.multiselect__trigger:hover:not(.multiselect--disabled .multiselect__trigger) {
  border-color: #c0c4cc;
}

.multiselect__trigger--active {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.multiselect__trigger:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.multiselect__content {
  flex: 1;
  overflow: hidden;
}

.multiselect__selected {
  color: #606266;
  font-size: 14px;
}

.multiselect__placeholder {
  color: #c0c4cc;
  font-size: 14px;
}

.multiselect__actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
}

.multiselect__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  color: #c0c4cc;
  cursor: pointer;
  border-radius: 50%;
  font-size: 16px;
  line-height: 1;
  transition: color 0.2s ease;
}

.multiselect__clear:hover {
  color: #909399;
  background-color: #f5f7fa;
}

.multiselect__arrow {
  color: #c0c4cc;
  font-size: 12px;
  transition: transform 0.2s ease;
}

.multiselect__arrow--up {
  transform: rotate(180deg);
}

.multiselect__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  margin-top: 4px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.multiselect__search {
  padding: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.multiselect__search-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.multiselect__search-input:focus {
  border-color: #409eff;
}

.multiselect__select-all {
  border-bottom: 1px solid #e4e7ed;
}

.multiselect__options {
  max-height: 200px;
  overflow-y: auto;
}

.multiselect__option {
  display: block;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.multiselect__option:hover:not(.multiselect__option--disabled) {
  background-color: #f5f7fa;
}

.multiselect__option--selected {
  background-color: #ecf5ff;
}

.multiselect__option--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.multiselect__option-content {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: inherit;
  user-select: none;
}

.multiselect__checkbox {
  margin-right: 8px;
  cursor: inherit;
}

.multiselect__option-label {
  flex: 1;
  font-size: 14px;
  color: #606266;
  cursor: inherit;
}

.multiselect__option--select-all .multiselect__option-label {
  font-weight: 500;
  color: #409eff;
}

.multiselect__empty {
  padding: 20px;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

/* 动画效果 */
.multiselect-dropdown-enter-active,
.multiselect-dropdown-leave-active {
  transition: all 0.2s ease;
}

.multiselect-dropdown-enter-from,
.multiselect-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .multiselect__dropdown {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    border-radius: 8px 8px 0 0;
    max-height: 60vh;
  }
  
  .multiselect__options {
    max-height: calc(60vh - 100px);
  }
  
  .multiselect__option-content {
    padding: 12px 16px;
    font-size: 16px;
  }
}

/* 滚动条样式 */
.multiselect__options::-webkit-scrollbar {
  width: 6px;
}

.multiselect__options::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.multiselect__options::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.multiselect__options::-webkit-scrollbar-thumb:hover {
  background: #909399;
}
</style>