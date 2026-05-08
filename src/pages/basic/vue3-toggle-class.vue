<template>
  <div class="vue3-toggle-demo">
    <h1>Vue3 点击切换 Class 示例</h1>
    
    <!-- 示例1: 简单的切换 -->
    <section class="demo-section">
      <h2>1. 简单切换示例</h2>
      <button 
        :class="{ active: isActive }"
        @click="toggleActive"
        class="toggle-btn"
      >
        {{ isActive ? '激活状态' : '普通状态' }}
      </button>
      <p>当前状态: {{ isActive ? 'Active' : 'Inactive' }}</p>
    </section>

    <!-- 示例2: 多个元素切换 -->
    <section class="demo-section">
      <h2>2. 多个按钮切换</h2>
      <div class="button-group">
        <button 
          v-for="(item, index) in buttons" 
          :key="index"
          :class="{ selected: selectedButton === index }"
          @click="selectButton(index)"
          class="multi-btn"
        >
          按钮 {{ index + 1 }}
        </button>
      </div>
      <p>选中的按钮: {{ selectedButton + 1 }}</p>
    </section>

    <!-- 示例3: 条件样式切换 -->
    <section class="demo-section">
      <h2>3. 条件样式切换</h2>
      <div 
        :class="[
          'status-box',
          { 
            'success': status === 'success',
            'warning': status === 'warning', 
            'error': status === 'error'
          }
        ]"
      >
        当前状态: {{ status }}
      </div>
      <div class="status-controls">
        <button @click="setStatus('success')" class="btn-success">成功</button>
        <button @click="setStatus('warning')" class="btn-warning">警告</button>
        <button @click="setStatus('error')" class="btn-error">错误</button>
      </div>
    </section>

    <!-- 示例4: 动态样式对象 -->
    <section class="demo-section">
      <h2>4. 动态样式对象</h2>
      <div 
        :class="dynamicClasses"
        class="dynamic-box"
      >
        动态样式盒子
      </div>
      <div class="controls">
        <label>
          <input type="checkbox" v-model="styles.large"> 大尺寸
        </label>
        <label>
          <input type="checkbox" v-model="styles.rounded"> 圆角
        </label>
        <label>
          <input type="checkbox" v-model="styles.shadow"> 阴影
        </label>
        <label>
          <input type="checkbox" v-model="styles.animated"> 动画
        </label>
      </div>
    </section>

    <!-- 示例5: 列表项切换 -->
    <section class="demo-section">
      <h2>5. 列表项切换</h2>
      <ul class="item-list">
        <li 
          v-for="item in listItems" 
          :key="item.id"
          :class="{ 
            'completed': item.completed,
            'highlighted': item.highlighted 
          }"
          @click="toggleItem(item.id)"
          @mouseenter="highlightItem(item.id)"
          @mouseleave="unhighlightItem(item.id)"
          class="list-item"
        >
          {{ item.text }}
          <span v-if="item.completed" class="check-mark">✓</span>
        </li>
      </ul>
    </section>

    <!-- 示例6: 主题切换 -->
    <section class="demo-section">
      <h2>6. 主题切换</h2>
      <div :class="['theme-container', currentTheme]">
        <p>当前主题: {{ currentTheme }}</p>
        <div class="theme-buttons">
          <button 
            v-for="theme in themes" 
            :key="theme"
            :class="{ active: currentTheme === theme }"
            @click="switchTheme(theme)"
            class="theme-btn"
          >
            {{ theme }}
          </button>
        </div>
      </div>
    </section>

    <!-- 示例7: 计算属性切换 -->
    <section class="demo-section">
      <h2>7. 计算属性切换</h2>
      <div 
        :class="computedClasses"
        class="computed-box"
      >
        <p>分数: {{ score }}</p>
        <p>等级: {{ grade }}</p>
      </div>
      <div class="score-controls">
        <button @click="changeScore(-10)">-10</button>
        <button @click="changeScore(-5)">-5</button>
        <button @click="changeScore(5)">+5</button>
        <button @click="changeScore(10)">+10</button>
      </div>
    </section>

    <!-- 示例8: 过渡动画切换 -->
    <section class="demo-section">
      <h2>8. 过渡动画切换</h2>
      <transition name="fade">
        <div 
          v-if="showBox"
          :class="['animated-box', animationClass]"
          @click="changeAnimation"
        >
          点击切换动画: {{ animationClass }}
        </div>
      </transition>
      <button @click="toggleBox" class="toggle-box-btn">
        {{ showBox ? '隐藏' : '显示' }} 盒子
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

// 示例1: 简单切换
const isActive = ref(false)
const toggleActive = () => {
  isActive.value = !isActive.value
}

// 示例2: 多个按钮切换
const buttons = ref(['按钮1', '按钮2', '按钮3', '按钮4'])
const selectedButton = ref(0)
const selectButton = (index) => {
  selectedButton.value = index
}

// 示例3: 条件样式切换
const status = ref('success')
const setStatus = (newStatus) => {
  status.value = newStatus
}

// 示例4: 动态样式对象
const styles = reactive({
  large: false,
  rounded: false,
  shadow: false,
  animated: false
})

const dynamicClasses = computed(() => ({
  'large': styles.large,
  'rounded': styles.rounded,
  'shadow': styles.shadow,
  'animated': styles.animated
}))

// 示例5: 列表项切换
const listItems = ref([
  { id: 1, text: '学习 Vue3', completed: false, highlighted: false },
  { id: 2, text: '掌握 Composition API', completed: true, highlighted: false },
  { id: 3, text: '实践项目开发', completed: false, highlighted: false },
  { id: 4, text: '优化性能', completed: false, highlighted: false }
])

const toggleItem = (id) => {
  const item = listItems.value.find(item => item.id === id)
  if (item) {
    item.completed = !item.completed
  }
}

const highlightItem = (id) => {
  const item = listItems.value.find(item => item.id === id)
  if (item) {
    item.highlighted = true
  }
}

const unhighlightItem = (id) => {
  const item = listItems.value.find(item => item.id === id)
  if (item) {
    item.highlighted = false
  }
}

// 示例6: 主题切换
const themes = ['light', 'dark', 'blue', 'green']
const currentTheme = ref('light')
const switchTheme = (theme) => {
  currentTheme.value = theme
}

// 示例7: 计算属性切换
const score = ref(75)
const changeScore = (delta) => {
  const newScore = score.value + delta
  score.value = Math.max(0, Math.min(100, newScore))
}

const grade = computed(() => {
  if (score.value >= 90) return 'A'
  if (score.value >= 80) return 'B'
  if (score.value >= 70) return 'C'
  if (score.value >= 60) return 'D'
  return 'F'
})

const computedClasses = computed(() => ({
  'grade-a': grade.value === 'A',
  'grade-b': grade.value === 'B',
  'grade-c': grade.value === 'C',
  'grade-d': grade.value === 'D',
  'grade-f': grade.value === 'F'
}))

// 示例8: 过渡动画切换
const showBox = ref(true)
const animationClass = ref('bounce')
const animations = ['bounce', 'shake', 'pulse', 'rotate']
let animationIndex = 0

const toggleBox = () => {
  showBox.value = !showBox.value
}

const changeAnimation = () => {
  animationIndex = (animationIndex + 1) % animations.length
  animationClass.value = animations[animationIndex]
}
</script>

<style scoped>
.vue3-toggle-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

/* 示例1: 简单切换样式 */
.toggle-btn {
  padding: 12px 24px;
  border: 2px solid #007bff;
  background: white;
  color: #007bff;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.toggle-btn.active {
  background: #007bff;
  color: white;
  transform: scale(1.05);
}

.toggle-btn:hover {
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

/* 示例2: 多个按钮样式 */
.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.multi-btn {
  padding: 10px 20px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.multi-btn.selected {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.multi-btn:hover {
  background: #f8f9fa;
}

.multi-btn.selected:hover {
  background: #218838;
}

/* 示例3: 状态样式 */
.status-box {
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.status-box.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-box.warning {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status-box.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.status-controls {
  display: flex;
  gap: 10px;
}

.btn-success { background: #28a745; color: white; }
.btn-warning { background: #ffc107; color: #212529; }
.btn-error { background: #dc3545; color: white; }

.status-controls button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.status-controls button:hover {
  opacity: 0.8;
}

/* 示例4: 动态样式 */
.dynamic-box {
  width: 200px;
  height: 100px;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.dynamic-box.large {
  width: 300px;
  height: 150px;
  font-size: 18px;
}

.dynamic-box.rounded {
  border-radius: 20px;
}

.dynamic-box.shadow {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.dynamic-box.animated {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.controls label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

/* 示例5: 列表样式 */
.item-list {
  list-style: none;
  padding: 0;
}

.list-item {
  padding: 12px 16px;
  border: 1px solid #ddd;
  margin-bottom: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-item:hover,
.list-item.highlighted {
  background: #f0f8ff;
  border-color: #007bff;
}

.list-item.completed {
  background: #d4edda;
  color: #155724;
  text-decoration: line-through;
}

.check-mark {
  color: #28a745;
  font-weight: bold;
}

/* 示例6: 主题样式 */
.theme-container {
  padding: 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.theme-container.light {
  background: #ffffff;
  color: #333333;
}

.theme-container.dark {
  background: #2c3e50;
  color: #ecf0f1;
}

.theme-container.blue {
  background: #3498db;
  color: white;
}

.theme-container.green {
  background: #27ae60;
  color: white;
}

.theme-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.theme-btn {
  padding: 8px 16px;
  border: 1px solid currentColor;
  background: transparent;
  color: inherit;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-btn.active {
  background: currentColor;
  color: white;
}

.theme-container.light .theme-btn.active {
  color: #333;
}

/* 示例7: 计算属性样式 */
.computed-box {
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.computed-box.grade-a {
  background: #d4edda;
  color: #155724;
  border: 2px solid #28a745;
}

.computed-box.grade-b {
  background: #cce5ff;
  color: #004085;
  border: 2px solid #007bff;
}

.computed-box.grade-c {
  background: #fff3cd;
  color: #856404;
  border: 2px solid #ffc107;
}

.computed-box.grade-d {
  background: #ffeaa7;
  color: #856404;
  border: 2px solid #fd7e14;
}

.computed-box.grade-f {
  background: #f8d7da;
  color: #721c24;
  border: 2px solid #dc3545;
}

.score-controls {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.score-controls button {
  padding: 8px 16px;
  border: 1px solid #007bff;
  background: white;
  color: #007bff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.score-controls button:hover {
  background: #007bff;
  color: white;
}

/* 示例8: 动画样式 */
.animated-box {
  width: 200px;
  height: 100px;
  background: #17a2b8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 15px;
}

.animated-box.bounce {
  animation: bounce 1s infinite;
}

.animated-box.shake {
  animation: shake 0.5s infinite;
}

.animated-box.pulse {
  animation: pulse 1s infinite;
}

.animated-box.rotate {
  animation: rotate 2s infinite linear;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.toggle-box-btn {
  padding: 10px 20px;
  border: 1px solid #17a2b8;
  background: white;
  color: #17a2b8;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-box-btn:hover {
  background: #17a2b8;
  color: white;
}

/* 过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>