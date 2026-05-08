<template>
  <div class="config-dynamic-components">
    <h1>Vue3 根据配置动态加载组件</h1>
    
    <!-- 示例1: 基础配置驱动组件 -->
    <section class="demo-section">
      <h2>1. 基础配置驱动组件</h2>
      <div class="controls">
        <button @click="addBasicComponent">添加组件</button>
        <button @click="clearComponents">清空组件</button>
      </div>
      <div class="component-grid">
        <div 
          v-for="(config, index) in basicConfigs" 
          :key="config.id"
          class="component-item"
        >
          <div class="item-header">
            <span>{{ config.name }}</span>
            <button @click="removeComponent(index)" class="remove-btn">×</button>
          </div>
          <component 
            :is="config.component" 
            v-bind="config.props"
            @update="(data) => handleComponentUpdate(config.id, data)"
          />
        </div>
      </div>
    </section>

    <!-- 示例2: JSON配置驱动的页面布局 -->
    <section class="demo-section">
      <h2>2. JSON配置驱动的页面布局</h2>
      <div class="controls">
        <select v-model="selectedLayout" @change="loadLayout">
          <option value="">选择布局</option>
          <option value="dashboard">仪表板布局</option>
          <option value="profile">用户资料布局</option>
          <option value="ecommerce">电商布局</option>
        </select>
        <button @click="saveCurrentLayout">保存当前布局</button>
      </div>
      <div class="layout-container">
        <div 
          v-for="section in layoutConfig.sections" 
          :key="section.id"
          :class="['layout-section', section.className]"
          :style="section.style"
        >
          <h3 v-if="section.title">{{ section.title }}</h3>
          <component 
            v-for="comp in section.components"
            :key="comp.id"
            :is="comp.type"
            v-bind="comp.props"
            :class="comp.className"
            :style="comp.style"
          />
        </div>
      </div>
    </section>

    <!-- 示例3: 表单配置驱动 -->
    <section class="demo-section">
      <h2>3. 表单配置驱动</h2>
      <div class="controls">
        <select v-model="selectedFormConfig" @change="loadFormConfig">
          <option value="">选择表单配置</option>
          <option value="user">用户注册表单</option>
          <option value="product">产品信息表单</option>
          <option value="survey">调查问卷表单</option>
        </select>
      </div>
      <form @submit.prevent="submitForm" class="dynamic-form">
        <div 
          v-for="field in formConfig.fields" 
          :key="field.name"
          class="form-field"
        >
          <label :for="field.name">{{ field.label }}</label>
          <component 
            :is="field.component"
            :id="field.name"
            v-model="formData[field.name]"
            v-bind="field.props"
            :placeholder="field.placeholder"
            :required="field.required"
          />
          <span v-if="field.help" class="help-text">{{ field.help }}</span>
        </div>
        <button type="submit" :disabled="!isFormValid">提交</button>
      </form>
    </section>

    <!-- 示例4: 可视化配置编辑器 -->
    <section class="demo-section">
      <h2>4. 可视化配置编辑器</h2>
      <div class="editor-container">
        <div class="config-editor">
          <h3>配置编辑器</h3>
          <textarea 
            v-model="configJson" 
            @input="updateConfigFromJson"
            placeholder="输入JSON配置"
            rows="15"
          ></textarea>
          <div class="editor-actions">
            <button @click="validateConfig">验证配置</button>
            <button @click="resetConfig">重置配置</button>
            <button @click="exportConfig">导出配置</button>
          </div>
        </div>
        <div class="preview-area">
          <h3>预览区域</h3>
          <div class="preview-container">
            <component 
              v-for="item in previewConfig" 
              :key="item.id"
              :is="item.component"
              v-bind="item.props"
              :style="item.style"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 示例5: 条件渲染配置 -->
    <section class="demo-section">
      <h2>5. 条件渲染配置</h2>
      <div class="controls">
        <label>
          <input type="checkbox" v-model="userPermissions.admin"> 管理员权限
        </label>
        <label>
          <input type="checkbox" v-model="userPermissions.editor"> 编辑权限
        </label>
        <label>
          <input type="checkbox" v-model="userPermissions.viewer"> 查看权限
        </label>
      </div>
      <div class="conditional-components">
        <component 
          v-for="comp in conditionalConfig"
          :key="comp.id"
          :is="comp.component"
          v-show="evaluateCondition(comp.condition)"
          v-bind="comp.props"
        />
      </div>
    </section>

    <!-- 示例6: 异步配置加载 -->
    <section class="demo-section">
      <h2>6. 异步配置加载</h2>
      <div class="controls">
        <button @click="loadRemoteConfig" :disabled="loading">
          {{ loading ? '加载中...' : '加载远程配置' }}
        </button>
        <button @click="loadLocalConfig">加载本地配置</button>
      </div>
      <div v-if="loading" class="loading">正在加载配置...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="async-components">
        <Suspense>
          <template #default>
            <component 
              v-for="comp in asyncConfig"
              :key="comp.id"
              :is="comp.component"
              v-bind="comp.props"
            />
          </template>
          <template #fallback>
            <div class="loading">组件加载中...</div>
          </template>
        </Suspense>
      </div>
    </section>

    <!-- 示例7: 主题配置驱动 -->
    <section class="demo-section">
      <h2>7. 主题配置驱动</h2>
      <div class="controls">
        <select v-model="selectedTheme" @change="applyTheme">
          <option value="light">浅色主题</option>
          <option value="dark">深色主题</option>
          <option value="blue">蓝色主题</option>
          <option value="custom">自定义主题</option>
        </select>
      </div>
      <div :class="['themed-container', currentTheme.className]" :style="currentTheme.style">
        <component 
          v-for="comp in themeConfig.components"
          :key="comp.id"
          :is="comp.type"
          v-bind="{ ...comp.props, theme: currentTheme }"
        />
      </div>
    </section>

    <!-- 示例8: 插件配置系统 -->
    <section class="demo-section">
      <h2>8. 插件配置系统</h2>
      <div class="controls">
        <div class="plugin-list">
          <div 
            v-for="plugin in availablePlugins" 
            :key="plugin.name"
            class="plugin-item"
          >
            <label>
              <input 
                type="checkbox" 
                :checked="enabledPlugins.includes(plugin.name)"
                @change="togglePlugin(plugin.name)"
              >
              {{ plugin.label }}
            </label>
            <button 
              v-if="enabledPlugins.includes(plugin.name)"
              @click="configurePlugin(plugin.name)"
              class="config-btn"
            >
              配置
            </button>
          </div>
        </div>
      </div>
      <div class="plugin-container">
        <component 
          v-for="pluginName in enabledPlugins"
          :key="pluginName"
          :is="getPluginComponent(pluginName)"
          v-bind="getPluginConfig(pluginName)"
          @config-change="updatePluginConfig"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { 
  ref, 
  reactive, 
  computed, 
  watch, 
  defineAsyncComponent,
  markRaw,
  nextTick
} from 'vue'

// 组件注册映射
const componentMap = {
  // 基础组件
  'UserCard': () => import('./components/UserCard.vue'),
  'ProductCard': () => import('./components/ProductCard.vue'),
  'ChartWidget': () => import('./components/ChartWidget.vue'),
  'DataTable': () => import('./components/DataTable.vue'),
  'StatCard': () => import('./components/StatCard.vue'),
  
  // 表单组件
  'TextInput': { template: '<input type="text" v-bind="$attrs" v-model="$attrs.modelValue" />' },
  'TextArea': { template: '<textarea v-bind="$attrs" v-model="$attrs.modelValue"></textarea>' },
  'SelectInput': { 
    template: `
      <select v-bind="$attrs" v-model="$attrs.modelValue">
        <option v-for="option in $attrs.options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    `
  },
  'CheckboxInput': { template: '<input type="checkbox" v-bind="$attrs" v-model="$attrs.modelValue" />' },
  'RadioGroup': {
    template: `
      <div>
        <label v-for="option in $attrs.options" :key="option.value">
          <input type="radio" :value="option.value" v-model="$attrs.modelValue" />
          {{ option.label }}
        </label>
      </div>
    `
  }
}

// 基础配置驱动组件
const basicConfigs = ref([])
let componentIdCounter = 0

// JSON配置驱动的页面布局
const selectedLayout = ref('')
const layoutConfig = reactive({
  sections: []
})

// 表单配置驱动
const selectedFormConfig = ref('')
const formConfig = reactive({
  fields: []
})
const formData = reactive({})

// 可视化配置编辑器
const configJson = ref('')
const previewConfig = ref([])

// 条件渲染配置
const userPermissions = reactive({
  admin: false,
  editor: false,
  viewer: true
})

const conditionalConfig = ref([
  {
    id: 1,
    component: 'UserCard',
    condition: 'admin',
    props: { title: '管理员面板', type: 'admin' }
  },
  {
    id: 2,
    component: 'DataTable',
    condition: 'editor',
    props: { title: '编辑器工具', editable: true }
  },
  {
    id: 3,
    component: 'StatCard',
    condition: 'viewer',
    props: { title: '统计信息', readonly: true }
  }
])

// 异步配置加载
const loading = ref(false)
const error = ref('')
const asyncConfig = ref([])

// 主题配置驱动
const selectedTheme = ref('light')
const currentTheme = reactive({
  className: 'theme-light',
  style: {}
})

const themeConfig = reactive({
  components: [
    { id: 1, type: 'UserCard', props: { title: '主题化用户卡片' } },
    { id: 2, type: 'StatCard', props: { title: '主题化统计卡片' } }
  ]
})

// 插件配置系统
const enabledPlugins = ref([])
const availablePlugins = ref([
  { name: 'weather', label: '天气插件' },
  { name: 'calendar', label: '日历插件' },
  { name: 'todo', label: '待办插件' },
  { name: 'chat', label: '聊天插件' }
])

const pluginConfigs = reactive({})

// 预定义的布局配置
const layoutConfigs = {
  dashboard: {
    sections: [
      {
        id: 'header',
        title: '仪表板头部',
        className: 'dashboard-header',
        style: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
        components: [
          { id: 'stat1', type: 'StatCard', props: { title: '总用户', value: '1,234' } },
          { id: 'stat2', type: 'StatCard', props: { title: '总订单', value: '5,678' } }
        ]
      },
      {
        id: 'content',
        title: '主要内容',
        className: 'dashboard-content',
        style: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' },
        components: [
          { id: 'chart', type: 'ChartWidget', props: { title: '销售趋势' } },
          { id: 'table', type: 'DataTable', props: { title: '最新订单' } }
        ]
      }
    ]
  },
  profile: {
    sections: [
      {
        id: 'profile-main',
        title: '用户资料',
        className: 'profile-section',
        style: { maxWidth: '600px', margin: '0 auto' },
        components: [
          { id: 'user', type: 'UserCard', props: { title: '个人信息', detailed: true } }
        ]
      }
    ]
  },
  ecommerce: {
    sections: [
      {
        id: 'products',
        title: '产品展示',
        className: 'product-grid',
        style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' },
        components: [
          { id: 'prod1', type: 'ProductCard', props: { title: '产品 A', price: '$99' } },
          { id: 'prod2', type: 'ProductCard', props: { title: '产品 B', price: '$149' } },
          { id: 'prod3', type: 'ProductCard', props: { title: '产品 C', price: '$199' } }
        ]
      }
    ]
  }
}

// 表单配置
const formConfigs = {
  user: {
    fields: [
      { name: 'username', label: '用户名', component: 'TextInput', required: true, placeholder: '请输入用户名' },
      { name: 'email', label: '邮箱', component: 'TextInput', required: true, placeholder: '请输入邮箱' },
      { name: 'gender', label: '性别', component: 'RadioGroup', props: { options: [
        { value: 'male', label: '男' },
        { value: 'female', label: '女' }
      ]}},
      { name: 'bio', label: '个人简介', component: 'TextArea', placeholder: '请输入个人简介' }
    ]
  },
  product: {
    fields: [
      { name: 'name', label: '产品名称', component: 'TextInput', required: true },
      { name: 'category', label: '分类', component: 'SelectInput', props: { options: [
        { value: 'electronics', label: '电子产品' },
        { value: 'clothing', label: '服装' },
        { value: 'books', label: '图书' }
      ]}},
      { name: 'price', label: '价格', component: 'TextInput', required: true },
      { name: 'featured', label: '推荐产品', component: 'CheckboxInput' }
    ]
  },
  survey: {
    fields: [
      { name: 'satisfaction', label: '满意度', component: 'RadioGroup', props: { options: [
        { value: '5', label: '非常满意' },
        { value: '4', label: '满意' },
        { value: '3', label: '一般' },
        { value: '2', label: '不满意' },
        { value: '1', label: '非常不满意' }
      ]}},
      { name: 'feedback', label: '反馈建议', component: 'TextArea', placeholder: '请输入您的建议' }
    ]
  }
}

// 主题配置
const themes = {
  light: {
    className: 'theme-light',
    style: {
      backgroundColor: '#ffffff',
      color: '#333333'
    }
  },
  dark: {
    className: 'theme-dark',
    style: {
      backgroundColor: '#2c3e50',
      color: '#ecf0f1'
    }
  },
  blue: {
    className: 'theme-blue',
    style: {
      backgroundColor: '#3498db',
      color: '#ffffff'
    }
  },
  custom: {
    className: 'theme-custom',
    style: {
      backgroundColor: '#e74c3c',
      color: '#ffffff'
    }
  }
}

// 计算属性
const isFormValid = computed(() => {
  return formConfig.fields
    .filter(field => field.required)
    .every(field => formData[field.name])
})

// 方法定义
const addBasicComponent = () => {
  const components = ['UserCard', 'ProductCard', 'ChartWidget', 'DataTable', 'StatCard']
  const randomComponent = components[Math.floor(Math.random() * components.length)]
  
  basicConfigs.value.push({
    id: ++componentIdCounter,
    name: `${randomComponent} #${componentIdCounter}`,
    component: markRaw(defineAsyncComponent(componentMap[randomComponent])),
    props: {
      title: `动态${randomComponent}`,
      id: componentIdCounter
    }
  })
}

const removeComponent = (index) => {
  basicConfigs.value.splice(index, 1)
}

const clearComponents = () => {
  basicConfigs.value = []
}

const handleComponentUpdate = (id, data) => {
  const config = basicConfigs.value.find(c => c.id === id)
  if (config) {
    config.props = { ...config.props, ...data }
  }
}

const loadLayout = () => {
  if (selectedLayout.value && layoutConfigs[selectedLayout.value]) {
    Object.assign(layoutConfig, layoutConfigs[selectedLayout.value])
    
    // 动态加载组件
    layoutConfig.sections.forEach(section => {
      section.components.forEach(comp => {
        if (componentMap[comp.type]) {
          comp.component = markRaw(defineAsyncComponent(componentMap[comp.type]))
        }
      })
    })
  }
}

const saveCurrentLayout = () => {
  const configToSave = JSON.stringify(layoutConfig, null, 2)
  console.log('保存的布局配置:', configToSave)
  // 这里可以保存到本地存储或发送到服务器
}

const loadFormConfig = () => {
  if (selectedFormConfig.value && formConfigs[selectedFormConfig.value]) {
    Object.assign(formConfig, formConfigs[selectedFormConfig.value])
    
    // 初始化表单数据
    formConfig.fields.forEach(field => {
      if (!(field.name in formData)) {
        formData[field.name] = ''
      }
    })
  }
}

const submitForm = () => {
  console.log('提交的表单数据:', formData)
}

const updateConfigFromJson = () => {
  try {
    const config = JSON.parse(configJson.value)
    previewConfig.value = config.map(item => ({
      ...item,
      component: markRaw(defineAsyncComponent(componentMap[item.component]))
    }))
  } catch (error) {
    console.error('JSON配置解析错误:', error)
  }
}

const validateConfig = () => {
  try {
    JSON.parse(configJson.value)
    alert('配置验证通过！')
  } catch (error) {
    alert('配置格式错误: ' + error.message)
  }
}

const resetConfig = () => {
  configJson.value = ''
  previewConfig.value = []
}

const exportConfig = () => {
  const blob = new Blob([configJson.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'component-config.json'
  a.click()
  URL.revokeObjectURL(url)
}

const evaluateCondition = (condition) => {
  return userPermissions[condition] || false
}

const loadRemoteConfig = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // 模拟远程配置加载
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const remoteConfig = [
      { id: 1, component: 'UserCard', props: { title: '远程用户卡片' } },
      { id: 2, component: 'StatCard', props: { title: '远程统计卡片' } }
    ]
    
    asyncConfig.value = remoteConfig.map(item => ({
      ...item,
      component: markRaw(defineAsyncComponent(componentMap[item.component]))
    }))
  } catch (err) {
    error.value = '加载远程配置失败: ' + err.message
  } finally {
    loading.value = false
  }
}

const loadLocalConfig = () => {
  const localConfig = [
    { id: 1, component: 'ProductCard', props: { title: '本地产品卡片' } },
    { id: 2, component: 'ChartWidget', props: { title: '本地图表组件' } }
  ]
  
  asyncConfig.value = localConfig.map(item => ({
    ...item,
    component: markRaw(defineAsyncComponent(componentMap[item.component]))
  }))
}

const applyTheme = () => {
  if (themes[selectedTheme.value]) {
    Object.assign(currentTheme, themes[selectedTheme.value])
  }
}

const togglePlugin = (pluginName) => {
  const index = enabledPlugins.value.indexOf(pluginName)
  if (index > -1) {
    enabledPlugins.value.splice(index, 1)
  } else {
    enabledPlugins.value.push(pluginName)
  }
}

const configurePlugin = (pluginName) => {
  // 打开插件配置对话框
  const config = prompt(`配置${pluginName}插件 (JSON格式):`, JSON.stringify(pluginConfigs[pluginName] || {}))
  if (config) {
    try {
      pluginConfigs[pluginName] = JSON.parse(config)
    } catch (error) {
      alert('配置格式错误')
    }
  }
}

const getPluginComponent = (pluginName) => {
  const pluginMap = {
    weather: defineAsyncComponent(() => import('./plugins/WeatherPlugin.vue')),
    calendar: defineAsyncComponent(() => import('./plugins/CalendarPlugin.vue')),
    todo: defineAsyncComponent(() => import('./plugins/TodoPlugin.vue')),
    chat: defineAsyncComponent(() => import('./plugins/ChatPlugin.vue'))
  }
  return pluginMap[pluginName]
}

const getPluginConfig = (pluginName) => {
  return pluginConfigs[pluginName] || {}
}

const updatePluginConfig = (pluginName, config) => {
  pluginConfigs[pluginName] = config
}

// 初始化
configJson.value = JSON.stringify([
  { id: 1, component: 'UserCard', props: { title: '示例用户卡片' } },
  { id: 2, component: 'StatCard', props: { title: '示例统计卡片' } }
], null, 2)

updateConfigFromJson()
</script>

<style scoped>
.config-dynamic-components {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
}

.demo-section h2 {
  color: #34495e;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #3498db;
}

.controls {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.controls button,
.controls select {
  padding: 8px 16px;
  border: 1px solid #3498db;
  background: white;
  color: #3498db;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.controls button:hover,
.controls select:hover {
  background: #3498db;
  color: white;
}

.controls button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.component-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: white;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-weight: bold;
  color: #2c3e50;
}

.remove-btn {
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.layout-container {
  min-height: 300px;
  padding: 20px;
  border: 2px dashed #bdc3c7;
  border-radius: 8px;
  background: white;
}

.layout-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ecf0f1;
  border-radius: 6px;
}

.layout-section h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.dynamic-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
}

.form-field {
  margin-bottom: 20px;
}

.form-field label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #2c3e50;
}

.form-field input,
.form-field textarea,
.form-field select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.help-text {
  font-size: 12px;
  color: #7f8c8d;
  margin-top: 5px;
}

.editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  min-height: 400px;
}

.config-editor,
.preview-area {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

.config-editor textarea {
  width: 100%;
  height: 300px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
}

.editor-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.preview-container {
  min-height: 300px;
  padding: 15px;
  border: 2px dashed #bdc3c7;
  border-radius: 6px;
}

.conditional-components {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #7f8c8d;
  font-style: italic;
}

.error {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #e74c3c;
  font-weight: bold;
}

.async-components {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.themed-container {
  padding: 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.theme-light {
  background: #ffffff;
  color: #333333;
}

.theme-dark {
  background: #2c3e50;
  color: #ecf0f1;
}

.theme-blue {
  background: #3498db;
  color: #ffffff;
}

.theme-custom {
  background: #e74c3c;
  color: #ffffff;
}

.plugin-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.plugin-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.config-btn {
  padding: 4px 8px;
  font-size: 12px;
  background: #f39c12;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.plugin-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .editor-container {
    grid-template-columns: 1fr;
  }
  
  .component-grid,
  .conditional-components,
  .async-components,
  .plugin-container {
    grid-template-columns: 1fr;
  }
}

/* 动画效果 */
.component-item,
.layout-section {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>