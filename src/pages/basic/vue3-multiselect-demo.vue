<template>
  <div class="vue3-multiselect-demo">
    <h1>Vue3 多选组件演示</h1>
    
    <!-- 基础用法 -->
    <section class="demo-section">
      <h2>1. 基础多选功能</h2>
      <div class="demo-content">
        <div class="demo-item">
          <h3>基础多选</h3>
          <MultiSelect
            v-model="basicSelected"
            :options="basicOptions"
            placeholder="请选择水果"
            @change="handleBasicChange"
          />
          <div class="result">
            选中值: {{ JSON.stringify(basicSelected) }}
          </div>
        </div>
        
        <div class="demo-item">
          <h3>禁用状态</h3>
          <MultiSelect
            v-model="disabledSelected"
            :options="basicOptions"
            placeholder="禁用状态"
            disabled
          />
        </div>
      </div>
    </section>

    <!-- 搜索功能 -->
    <section class="demo-section">
      <h2>2. 搜索过滤功能</h2>
      <div class="demo-content">
        <div class="demo-item">
          <h3>可搜索多选</h3>
          <MultiSelect
            v-model="searchSelected"
            :options="searchOptions"
            placeholder="搜索并选择城市"
            searchable
            @search="handleSearch"
          />
          <div class="result">
            选中值: {{ JSON.stringify(searchSelected) }}
          </div>
        </div>
        
        <div class="demo-item">
          <h3>禁用搜索</h3>
          <MultiSelect
            v-model="noSearchSelected"
            :options="basicOptions"
            placeholder="不可搜索"
            :searchable="false"
          />
        </div>
      </div>
    </section>

    <!-- 全选功能 -->
    <section class="demo-section">
      <h2>3. 全选/反选功能</h2>
      <div class="demo-content">
        <div class="demo-item">
          <h3>支持全选</h3>
          <MultiSelect
            v-model="selectAllSelected"
            :options="selectAllOptions"
            placeholder="支持全选的多选框"
            :show-select-all="true"
            @selectAll="handleSelectAll"
          />
          <div class="result">
            选中值: {{ JSON.stringify(selectAllSelected) }}
          </div>
        </div>
        
        <div class="demo-item">
          <h3>隐藏全选</h3>
          <MultiSelect
            v-model="noSelectAllSelected"
            :options="selectAllOptions"
            placeholder="隐藏全选按钮"
            :show-select-all="false"
          />
        </div>
      </div>
    </section>

    <!-- 清空功能 -->
    <section class="demo-section">
      <h2>4. 清空功能</h2>
      <div class="demo-content">
        <div class="demo-item">
          <h3>可清空</h3>
          <MultiSelect
            v-model="clearableSelected"
            :options="basicOptions"
            placeholder="可清空的多选框"
            clearable
            @clear="handleClear"
          />
          <div class="result">
            选中值: {{ JSON.stringify(clearableSelected) }}
          </div>
        </div>
        
        <div class="demo-item">
          <h3>不可清空</h3>
          <MultiSelect
            v-model="noClearSelected"
            :options="basicOptions"
            placeholder="不可清空"
            :clearable="false"
          />
        </div>
      </div>
    </section>

    <!-- 自定义配置 -->
    <section class="demo-section">
      <h2>5. 自定义配置</h2>
      <div class="demo-content">
        <div class="demo-item">
          <h3>自定义字段名</h3>
          <MultiSelect
            v-model="customSelected"
            :options="customOptions"
            placeholder="自定义字段名"
            label-key="name"
            value-key="id"
          />
          <div class="result">
            选中值: {{ JSON.stringify(customSelected) }}
          </div>
        </div>
        
        <div class="demo-item">
          <h3>自定义高度</h3>
          <MultiSelect
            v-model="heightSelected"
            :options="longOptions"
            placeholder="自定义下拉框高度"
            max-height="150px"
          />
        </div>
      </div>
    </section>

    <!-- 禁用选项 -->
    <section class="demo-section">
      <h2>6. 禁用选项</h2>
      <div class="demo-content">
        <div class="demo-item">
          <h3>部分选项禁用</h3>
          <MultiSelect
            v-model="disabledOptionsSelected"
            :options="disabledOptions"
            placeholder="部分选项禁用"
          />
          <div class="result">
            选中值: {{ JSON.stringify(disabledOptionsSelected) }}
          </div>
        </div>
      </div>
    </section>

    <!-- 大数据量测试 -->
    <section class="demo-section">
      <h2>7. 大数据量测试</h2>
      <div class="demo-content">
        <div class="demo-item">
          <h3>1000个选项</h3>
          <MultiSelect
            v-model="bigDataSelected"
            :options="bigDataOptions"
            placeholder="大数据量测试"
            searchable
          />
          <div class="result">
            选中数量: {{ bigDataSelected.length }}
          </div>
        </div>
      </div>
    </section>

    <!-- 事件监听 -->
    <section class="demo-section">
      <h2>8. 事件监听</h2>
      <div class="demo-content">
        <div class="demo-item">
          <h3>事件日志</h3>
          <MultiSelect
            v-model="eventSelected"
            :options="basicOptions"
            placeholder="监听所有事件"
            @change="logEvent('change', $event)"
            @search="logEvent('search', $event)"
            @clear="logEvent('clear')"
            @selectAll="logEvent('selectAll', $event)"
          />
          <div class="event-log">
            <h4>事件日志:</h4>
            <div class="log-content">
              <div v-for="(log, index) in eventLogs" :key="index" class="log-item">
                {{ log }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import MultiSelect from './components/MultiSelect.vue'

// 基础选项数据
const basicOptions = ref([
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
  { label: '葡萄', value: 'grape' },
  { label: '草莓', value: 'strawberry' }
])

// 搜索选项数据
const searchOptions = ref([
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou' },
  { label: '深圳', value: 'shenzhen' },
  { label: '杭州', value: 'hangzhou' },
  { label: '南京', value: 'nanjing' },
  { label: '武汉', value: 'wuhan' },
  { label: '成都', value: 'chengdu' },
  { label: '重庆', value: 'chongqing' },
  { label: '西安', value: 'xian' }
])

// 全选选项数据
const selectAllOptions = ref([
  { label: '前端开发', value: 'frontend' },
  { label: '后端开发', value: 'backend' },
  { label: '移动开发', value: 'mobile' },
  { label: '测试工程师', value: 'test' },
  { label: '产品经理', value: 'product' },
  { label: 'UI设计师', value: 'ui' }
])

// 自定义字段选项
const customOptions = ref([
  { name: '管理员', id: 1 },
  { name: '编辑者', id: 2 },
  { name: '查看者', id: 3 },
  { name: '访客', id: 4 }
])

// 长列表选项
const longOptions = ref([
  { label: '选项1', value: 1 },
  { label: '选项2', value: 2 },
  { label: '选项3', value: 3 },
  { label: '选项4', value: 4 },
  { label: '选项5', value: 5 },
  { label: '选项6', value: 6 },
  { label: '选项7', value: 7 },
  { label: '选项8', value: 8 },
  { label: '选项9', value: 9 },
  { label: '选项10', value: 10 }
])

// 禁用选项数据
const disabledOptions = ref([
  { label: '可选项1', value: 'option1' },
  { label: '禁用项1', value: 'disabled1', disabled: true },
  { label: '可选项2', value: 'option2' },
  { label: '禁用项2', value: 'disabled2', disabled: true },
  { label: '可选项3', value: 'option3' }
])

// 大数据量选项
const bigDataOptions = ref([])

// 响应式选中值
const basicSelected = ref(['apple'])
const disabledSelected = ref(['banana'])
const searchSelected = ref([])
const noSearchSelected = ref([])
const selectAllSelected = ref([])
const noSelectAllSelected = ref([])
const clearableSelected = ref(['apple', 'banana'])
const noClearSelected = ref([])
const customSelected = ref([])
const heightSelected = ref([])
const disabledOptionsSelected = ref([])
const bigDataSelected = ref([])
const eventSelected = ref([])

// 事件日志
const eventLogs = ref([])

// 生成大数据量选项
const generateBigData = () => {
  const options = []
  for (let i = 1; i <= 1000; i++) {
    options.push({
      label: `选项 ${i}`,
      value: `option_${i}`
    })
  }
  bigDataOptions.value = options
}

// 事件处理方法
const handleBasicChange = (values, option) => {
  console.log('基础多选变化:', values, option)
}

const handleSearch = (keyword) => {
  console.log('搜索关键词:', keyword)
}

const handleSelectAll = (isSelectAll) => {
  console.log('全选状态:', isSelectAll)
}

const handleClear = () => {
  console.log('清空选择')
}

const logEvent = (eventName, data) => {
  const timestamp = new Date().toLocaleTimeString()
  const logMessage = `[${timestamp}] ${eventName}: ${data ? JSON.stringify(data) : ''}`
  eventLogs.value.unshift(logMessage)
  
  // 限制日志数量
  if (eventLogs.value.length > 10) {
    eventLogs.value = eventLogs.value.slice(0, 10)
  }
}

// 初始化
onMounted(() => {
  generateBigData()
})
</script>

<style scoped>
.vue3-multiselect-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 32px;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.demo-section h2 {
  color: #409eff;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409eff;
  font-size: 24px;
}

.demo-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.demo-item {
  padding: 15px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  background: #fafafa;
}

.demo-item h3 {
  margin-bottom: 15px;
  color: #606266;
  font-size: 16px;
  font-weight: 500;
}

.result {
  margin-top: 10px;
  padding: 8px 12px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  word-break: break-all;
}

.event-log {
  margin-top: 15px;
}

.event-log h4 {
  margin-bottom: 10px;
  color: #909399;
  font-size: 14px;
}

.log-content {
  max-height: 200px;
  overflow-y: auto;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 10px;
}

.log-item {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
  font-family: 'Courier New', monospace;
}

.log-item:last-child {
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .vue3-multiselect-demo {
    padding: 10px;
  }
  
  .demo-content {
    grid-template-columns: 1fr;
  }
  
  .demo-item {
    padding: 10px;
  }
  
  h1 {
    font-size: 24px;
  }
  
  .demo-section h2 {
    font-size: 20px;
  }
}

/* 滚动条样式 */
.log-content::-webkit-scrollbar {
  width: 6px;
}

.log-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.log-content::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.log-content::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

/* 动画效果 */
.demo-section {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 高亮效果 */
.demo-item:hover {
  background: #f0f9ff;
  border-color: #409eff;
  transition: all 0.3s ease;
}

/* 代码样式 */
.result {
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
}
</style>