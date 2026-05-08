<template>
  <div class="radio-list">
    <h2>Vue3 单选列表组件 - 高亮选中项</h2>
    
    <!-- 基础单选列表 -->
    <section class="demo-section">
      <h3>1. 基础单选列表</h3>
      <div class="radio-list-container">
        <div
          v-for="option in basicOptions"
          :key="option.value"
          class="radio-item"
          :class="{ 'radio-item--selected': selectedBasic === option.value }"
          @click="selectBasic(option.value)"
        >
          <div class="radio-circle">
            <div v-if="selectedBasic === option.value" class="radio-dot"></div>
          </div>
          <span class="radio-label">{{ option.label }}</span>
        </div>
      </div>
      <div class="result">
        选中值: {{ selectedBasic || '未选择' }}
      </div>
    </section>

    <!-- 带图标的单选列表 -->
    <section class="demo-section">
      <h3>2. 带图标的单选列表</h3>
      <div class="radio-list-container">
        <div
          v-for="option in iconOptions"
          :key="option.value"
          class="radio-item radio-item--with-icon"
          :class="{ 'radio-item--selected': selectedIcon === option.value }"
          @click="selectIcon(option.value)"
        >
          <div class="radio-icon">{{ option.icon }}</div>
          <div class="radio-content">
            <div class="radio-title">{{ option.label }}</div>
            <div class="radio-description">{{ option.description }}</div>
          </div>
          <div class="radio-circle">
            <div v-if="selectedIcon === option.value" class="radio-dot"></div>
          </div>
        </div>
      </div>
      <div class="result">
        选中值: {{ selectedIcon || '未选择' }}
      </div>
    </section>

    <!-- 卡片式单选列表 -->
    <section class="demo-section">
      <h3>3. 卡片式单选列表</h3>
      <div class="radio-cards">
        <div
          v-for="option in cardOptions"
          :key="option.value"
          class="radio-card"
          :class="{ 'radio-card--selected': selectedCard === option.value }"
          @click="selectCard(option.value)"
        >
          <div class="card-header">
            <h4>{{ option.title }}</h4>
            <div class="radio-circle">
              <div v-if="selectedCard === option.value" class="radio-dot"></div>
            </div>
          </div>
          <div class="card-content">
            <p>{{ option.description }}</p>
            <div class="card-price">{{ option.price }}</div>
          </div>
        </div>
      </div>
      <div class="result">
        选中值: {{ selectedCard || '未选择' }}
      </div>
    </section>

    <!-- 可禁用的单选列表 -->
    <section class="demo-section">
      <h3>4. 可禁用的单选列表</h3>
      <div class="radio-list-container">
        <div
          v-for="option in disabledOptions"
          :key="option.value"
          class="radio-item"
          :class="{ 
            'radio-item--selected': selectedDisabled === option.value,
            'radio-item--disabled': option.disabled
          }"
          @click="!option.disabled && selectDisabled(option.value)"
        >
          <div class="radio-circle">
            <div v-if="selectedDisabled === option.value" class="radio-dot"></div>
          </div>
          <span class="radio-label">{{ option.label }}</span>
          <span v-if="option.disabled" class="disabled-tag">禁用</span>
        </div>
      </div>
      <div class="result">
        选中值: {{ selectedDisabled || '未选择' }}
      </div>
    </section>

    <!-- 自定义高亮样式 -->
    <section class="demo-section">
      <h3>5. 自定义高亮样式</h3>
      <div class="style-selector">
        <label>选择高亮样式:</label>
        <select v-model="highlightStyle">
          <option value="default">默认蓝色</option>
          <option value="green">绿色主题</option>
          <option value="purple">紫色主题</option>
          <option value="gradient">渐变主题</option>
        </select>
      </div>
      <div class="radio-list-container" :class="`theme-${highlightStyle}`">
        <div
          v-for="option in basicOptions"
          :key="option.value"
          class="radio-item"
          :class="{ 'radio-item--selected': selectedCustom === option.value }"
          @click="selectCustom(option.value)"
        >
          <div class="radio-circle">
            <div v-if="selectedCustom === option.value" class="radio-dot"></div>
          </div>
          <span class="radio-label">{{ option.label }}</span>
        </div>
      </div>
      <div class="result">
        选中值: {{ selectedCustom || '未选择' }}
      </div>
    </section>

    <!-- 动画效果演示 -->
    <section class="demo-section">
      <h3>6. 动画效果演示</h3>
      <div class="radio-list-container animated">
        <div
          v-for="option in basicOptions"
          :key="option.value"
          class="radio-item"
          :class="{ 'radio-item--selected': selectedAnimated === option.value }"
          @click="selectAnimated(option.value)"
        >
          <div class="radio-circle">
            <div v-if="selectedAnimated === option.value" class="radio-dot"></div>
          </div>
          <span class="radio-label">{{ option.label }}</span>
          <div class="selection-indicator"></div>
        </div>
      </div>
      <div class="result">
        选中值: {{ selectedAnimated || '未选择' }}
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 响应式数据
const selectedBasic = ref('')
const selectedIcon = ref('')
const selectedCard = ref('')
const selectedDisabled = ref('')
const selectedCustom = ref('')
const selectedAnimated = ref('')
const highlightStyle = ref('default')

// 选项数据
const basicOptions = ref([
  { label: '选项一', value: 'option1' },
  { label: '选项二', value: 'option2' },
  { label: '选项三', value: 'option3' },
  { label: '选项四', value: 'option4' }
])

const iconOptions = ref([
  { 
    label: '移动支付', 
    value: 'mobile', 
    icon: '📱',
    description: '使用手机扫码支付'
  },
  { 
    label: '银行卡', 
    value: 'card', 
    icon: '💳',
    description: '使用银行卡支付'
  },
  { 
    label: '现金支付', 
    value: 'cash', 
    icon: '💰',
    description: '使用现金支付'
  }
])

const cardOptions = ref([
  {
    title: '基础版',
    value: 'basic',
    description: '适合个人用户使用，包含基础功能',
    price: '免费'
  },
  {
    title: '专业版',
    value: 'pro',
    description: '适合小团队使用，包含高级功能',
    price: '¥99/月'
  },
  {
    title: '企业版',
    value: 'enterprise',
    description: '适合大型企业使用，包含全部功能',
    price: '¥299/月'
  }
])

const disabledOptions = ref([
  { label: '可选项一', value: 'enabled1', disabled: false },
  { label: '禁用项一', value: 'disabled1', disabled: true },
  { label: '可选项二', value: 'enabled2', disabled: false },
  { label: '禁用项二', value: 'disabled2', disabled: true }
])

// 选择方法
const selectBasic = (value) => {
  selectedBasic.value = value
  console.log('基础选择:', value)
}

const selectIcon = (value) => {
  selectedIcon.value = value
  console.log('图标选择:', value)
}

const selectCard = (value) => {
  selectedCard.value = value
  console.log('卡片选择:', value)
}

const selectDisabled = (value) => {
  selectedDisabled.value = value
  console.log('禁用选择:', value)
}

const selectCustom = (value) => {
  selectedCustom.value = value
  console.log('自定义选择:', value)
}

const selectAnimated = (value) => {
  selectedAnimated.value = value
  console.log('动画选择:', value)
}
</script>

<style scoped>
.radio-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.demo-section h3 {
  color: #409eff;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409eff;
}

/* 基础单选列表样式 */
.radio-list-container {
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
}

.radio-item:hover:not(.radio-item--disabled) {
  border-color: #c0c4cc;
  background: #f8f9fa;
}

.radio-item--selected {
  border-color: #409eff !important;
  background: #ecf5ff !important;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
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
}

.radio-item--selected .radio-circle {
  border-color: #409eff;
}

.radio-dot {
  width: 8px;
  height: 8px;
  background: #409eff;
  border-radius: 50%;
  animation: radioSelect 0.3s ease;
}

.radio-label {
  font-size: 14px;
  color: #606266;
  flex: 1;
}

.radio-item--selected .radio-label {
  color: #409eff;
  font-weight: 500;
}

.disabled-tag {
  font-size: 12px;
  color: #c0c4cc;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
}

/* 带图标的单选列表 */
.radio-item--with-icon {
  padding: 16px;
}

.radio-icon {
  font-size: 24px;
  margin-right: 12px;
}

.radio-content {
  flex: 1;
  margin-right: 12px;
}

.radio-title {
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 4px;
}

.radio-description {
  font-size: 12px;
  color: #909399;
}

.radio-item--selected .radio-title {
  color: #409eff;
}

/* 卡片式单选列表 */
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
  background: #fff;
}

.radio-card:hover {
  border-color: #c0c4cc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.radio-card--selected {
  border-color: #409eff !important;
  background: #ecf5ff !important;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
}

.radio-card--selected .card-header h4 {
  color: #409eff;
}

.card-content p {
  margin: 0 0 12px 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.card-price {
  font-size: 20px;
  font-weight: bold;
  color: #e6a23c;
}

.radio-card--selected .card-price {
  color: #409eff;
}

/* 自定义主题样式 */
.style-selector {
  margin-bottom: 20px;
}

.style-selector label {
  margin-right: 10px;
  font-weight: 500;
}

.style-selector select {
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
}

/* 绿色主题 */
.theme-green .radio-item--selected {
  border-color: #67c23a !important;
  background: #f0f9ff !important;
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
}

/* 紫色主题 */
.theme-purple .radio-item--selected {
  border-color: #9c27b0 !important;
  background: #f3e5f5 !important;
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
}

/* 渐变主题 */
.theme-gradient .radio-item--selected {
  border: 2px solid transparent;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.theme-gradient .radio-item--selected .radio-circle {
  border-color: white;
}

.theme-gradient .radio-dot {
  background: white;
}

.theme-gradient .radio-item--selected .radio-label {
  color: white;
}

/* 动画效果 */
.animated .radio-item {
  position: relative;
  overflow: hidden;
}

.selection-indicator {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(64, 158, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.animated .radio-item--selected .selection-indicator {
  left: 100%;
}

.animated .radio-item--selected {
  animation: selectPulse 0.6s ease;
}

/* 结果显示 */
.result {
  margin-top: 15px;
  padding: 10px 15px;
  background: #f0f9ff;
  border: 1px solid #b3d8ff;
  border-radius: 6px;
  font-size: 14px;
  color: #409eff;
}

/* 动画定义 */
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

@keyframes selectPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .radio-list {
    padding: 10px;
  }
  
  .radio-cards {
    grid-template-columns: 1fr;
  }
  
  .radio-item {
    padding: 10px 12px;
  }
  
  .radio-card {
    padding: 16px;
  }
}
</style>