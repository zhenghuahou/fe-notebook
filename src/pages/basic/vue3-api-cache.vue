<template>
  <div class="api-cache-demo">
    <h1>Vue3 接口防重复调用解决方案</h1>
    
    <!-- 用户信息查询 -->
    <div class="demo-section">
      <h2>🔍 用户信息查询 (基础防重)</h2>
      <div class="input-group">
        <input 
          v-model="userId" 
          placeholder="输入用户ID" 
          @keyup.enter="fetchUserInfo"
        />
        <button @click="fetchUserInfo" :disabled="loading.userInfo">
          {{ loading.userInfo ? '查询中...' : '查询用户' }}
        </button>
      </div>
      <div v-if="userInfo" class="result">
        <h3>用户信息:</h3>
        <pre>{{ JSON.stringify(userInfo, null, 2) }}</pre>
      </div>
    </div>

    <!-- 商品搜索 -->
    <div class="demo-section">
      <h2>🛍️ 商品搜索 (高级防重)</h2>
      <div class="input-group">
        <input 
          v-model="searchQuery" 
          placeholder="搜索商品"
          @input="debouncedSearch"
        />
        <select v-model="category">
          <option value="">全部分类</option>
          <option value="electronics">电子产品</option>
          <option value="clothing">服装</option>
          <option value="books">图书</option>
        </select>
        <button @click="searchProducts" :disabled="loading.products">
          {{ loading.products ? '搜索中...' : '搜索' }}
        </button>
      </div>
      <div v-if="products.length" class="result">
        <h3>搜索结果:</h3>
        <div v-for="product in products" :key="product.id" class="product-item">
          {{ product.name }} - ¥{{ product.price }}
        </div>
      </div>
    </div>
    <!-- 数据分析 -->
    <div class="demo-section">
      <h2>📊 数据分析 (智能缓存)</h2>
      <div class="input-group">
        <input 
          v-model="startDate" 
          type="date" 
          placeholder="开始日期"
        />
        <input 
          v-model="endDate" 
          type="date" 
          placeholder="结束日期"
        />
        <select v-model="dataType">
          <option value="sales">销售数据</option>
          <option value="user">用户数据</option>
          <option value="traffic">流量数据</option>
        </select>
        <button @click="getAnalytics" :disabled="loading.analytics">
          {{ loading.analytics ? '分析中...' : '获取分析' }}
        </button>
      </div>
      <div v-if="analytics" class="result">
        <h3>分析结果:</h3>
        <pre>{{ JSON.stringify(analytics, null, 2) }}</pre>
      </div>
    </div>

    <!-- 调用日志 -->
    <div class="demo-section">
      <h2>📝 调用日志</h2>
      <div class="logs">
        <div v-for="(log, index) in logs" :key="index" class="log-item">
          <span class="timestamp">{{ formatTime(log.timestamp) }}</span>
          <span class="action" :class="log.type">{{ log.message }}</span>
        </div>
      </div>
      <button @click="clearLogs" class="clear-btn">清空日志</button>
    </div>

    <!-- 缓存状态 -->
    <div class="demo-section">
      <h2>💾 缓存状态</h2>
      <div class="cache-status">
        <div>缓存条目数: {{ Object.keys(apiCache.cache).length }}</div>
        <div>命中次数: {{ apiCache.hits }}</div>
        <div>总请求数: {{ apiCache.total }}</div>
        <div>命中率: {{ apiCache.total ? (apiCache.hits / apiCache.total * 100).toFixed(2) : 0 }}%</div>
      </div>
      <button @click="clearCache" class="clear-btn">清空缓存</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useApiCache } from './composables/useApiCache'
import { useApiRequest } from './composables/useApiRequest'
import { debounce } from './utils/debounce'

// 响应式数据
const userId = ref('')
const userInfo = ref(null)

const searchQuery = ref('')
const category = ref('')
const products = ref([])

const startDate = ref('')
const endDate = ref('')
const dataType = ref('sales')
const analytics = ref(null)

const loading = reactive({
  userInfo: false,
  products: false,
  analytics: false
})

const logs = ref([])

// 使用API缓存hook
const apiCache = useApiCache()

// 使用API请求hook
const { request: apiRequest } = useApiRequest()

// 添加日志
const addLog = (message, type = 'info') => {
  logs.value.unshift({
    timestamp: Date.now(),
    message,
    type
  })
  
  // 保持最新的20条日志
  if (logs.value.length > 20) {
    logs.value = logs.value.slice(0, 20)
  }
}

// 格式化时间
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString()
}

// 模拟API调用
const mockApi = {
  async getUserInfo(id) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      id,
      name: `用户${id}`,
      email: `user${id}@example.com`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
      createdAt: new Date().toISOString()
    }
  },

  async searchProducts(query, category) {
    await new Promise(resolve => setTimeout(resolve, 800))
    const mockProducts = [
      { id: 1, name: 'iPhone 15', price: 5999, category: 'electronics' },
      { id: 2, name: 'MacBook Pro', price: 12999, category: 'electronics' },
      { id: 3, name: '连衣裙', price: 299, category: 'clothing' },
      { id: 4, name: 'JavaScript高级程序设计', price: 89, category: 'books' }
    ]
    
    return mockProducts.filter(product => {
      const matchQuery = !query || product.name.includes(query)
      const matchCategory = !category || product.category === category
      return matchQuery && matchCategory
    })
  },

  async getAnalytics(startDate, endDate, type) {
    await new Promise(resolve => setTimeout(resolve, 1500))
    return {
      type,
      period: `${startDate} to ${endDate}`,
      data: {
        total: Math.floor(Math.random() * 10000),
        growth: (Math.random() * 50 - 25).toFixed(2) + '%',
        details: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: Math.floor(Math.random() * 1000)
        }))
      }
    }
  }
}

// 1. 基础防重复调用
const fetchUserInfo = async () => {
  if (!userId.value) {
    addLog('请输入用户ID', 'error')
    return
  }

  const params = { id: userId.value }
  
  loading.userInfo = true
  addLog(`开始查询用户信息: ${userId.value}`)
  
  try {
    const result = await apiCache.cachedRequest(
      'getUserInfo',
      params,
      () => mockApi.getUserInfo(userId.value)
    )
    
    userInfo.value = result.data
    addLog(`用户信息查询${result.fromCache ? '(缓存)' : '(网络)'}成功`, 'success')
  } catch (error) {
    addLog(`查询用户信息失败: ${error.message}`, 'error')
  } finally {
    loading.userInfo = false
  }
}

// 2. 高级防重复调用（带防抖）
const searchProducts = async () => {
  const params = { 
    query: searchQuery.value, 
    category: category.value 
  }
  
  loading.products = true
  addLog(`搜索商品: "${searchQuery.value}" 分类: "${category.value || '全部'}"`)
  
  try {
    const result = await apiCache.cachedRequest(
      'searchProducts',
      params,
      () => mockApi.searchProducts(searchQuery.value, category.value),
      { ttl: 5 * 60 * 1000 } // 5分钟缓存
    )
    
    products.value = result.data
    addLog(`商品搜索${result.fromCache ? '(缓存)' : '(网络)'}完成，找到${result.data.length}个结果`, 'success')
  } catch (error) {
    addLog(`搜索商品失败: ${error.message}`, 'error')
  } finally {
    loading.products = false
  }
}

// 防抖搜索
const debouncedSearch = debounce(() => {
  if (searchQuery.value) {
    searchProducts()
  }
}, 500)

// 3. 智能缓存（长时间缓存）
const getAnalytics = async () => {
  if (!startDate.value || !endDate.value) {
    addLog('请选择日期范围', 'error')
    return
  }

  const params = {
    startDate: startDate.value,
    endDate: endDate.value,
    type: dataType.value
  }
  
  loading.analytics = true
  addLog(`获取${dataType.value}分析数据: ${startDate.value} ~ ${endDate.value}`)
  
  try {
    const result = await apiCache.cachedRequest(
      'getAnalytics',
      params,
      () => mockApi.getAnalytics(startDate.value, endDate.value, dataType.value),
      { ttl: 30 * 60 * 1000 } // 30分钟缓存
    )
    
    analytics.value = result.data
    addLog(`分析数据${result.fromCache ? '(缓存)' : '(网络)'}获取成功`, 'success')
  } catch (error) {
    addLog(`获取分析数据失败: ${error.message}`, 'error')
  } finally {
    loading.analytics = false
  }
}

// 清空功能
const clearLogs = () => {
  logs.value = []
  addLog('日志已清空')
}

const clearCache = () => {
  apiCache.clear()
  addLog('缓存已清空', 'warning')
}

// 初始化
onMounted(() => {
  addLog('接口防重复调用演示已启动', 'success')
  
  // 设置默认日期
  const today = new Date()
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  endDate.value = today.toISOString().split('T')[0]
  startDate.value = lastWeek.toISOString().split('T')[0]
})
</script>

<style scoped>
.api-cache-demo {
  max-width: 800px;
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
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.demo-section h2 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #495057;
  font-size: 1.2rem;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.input-group input,
.input-group select {
  flex: 1;
  min-width: 150px;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
}

.input-group button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.input-group button:hover:not(:disabled) {
  background-color: #0056b3;
}

.input-group button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.result {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 15px;
  margin-top: 15px;
}

.result h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #495057;
}

.result pre {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 10px;
  font-size: 12px;
  overflow-x: auto;
  margin: 0;
}

.product-item {
  padding: 8px;
  border-bottom: 1px solid #e9ecef;
}
.product-item:last-child {
  border-bottom: none;
}

.logs {
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
}

.log-item {
  display: flex;
  gap: 10px;
  padding: 4px 0;
  border-bottom: 1px solid #f8f9fa;
  font-size: 12px;
}

.log-item:last-child {
  border-bottom: none;
}

.timestamp {
  color: #6c757d;
  min-width: 80px;
}

.action {
  flex: 1;
}

.action.success {
  color: #28a745;
}

.action.error {
  color: #dc3545;
}

.action.warning {
  color: #ffc107;
}

.cache-status {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 15px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 10px;
  font-size: 14px;
}

.cache-status > div {
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
}

.clear-btn {
  padding: 6px 12px;
  background-color: #ffc107;
  color: #212529;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}
.clear-btn:hover {
  background-color: #e0a800;
}

@media (max-width: 768px) {
  .input-group {
    flex-direction: column;
  }
  
  .cache-status {
    grid-template-columns: 1fr;
  }
}
</style>