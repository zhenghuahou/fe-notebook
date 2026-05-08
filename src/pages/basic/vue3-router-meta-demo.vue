<template>
  <div class="router-meta-demo">
    <h1>Vue3 获取Router Meta属性演示</h1>
    
    <!-- 当前路由信息 -->
    <section class="demo-section">
      <h2>1. 当前路由Meta信息</h2>
      <div class="info-card">
        <h3>当前路由: {{ currentRoute.name }}</h3>
        <div class="meta-info">
          <h4>Meta属性:</h4>
          <pre>{{ JSON.stringify(currentRoute.meta, null, 2) }}</pre>
        </div>
      </div>
    </section>

    <!-- 不同获取方式演示 -->
    <section class="demo-section">
      <h2>2. 不同获取方式对比</h2>
      
      <div class="method-grid">
        <!-- 方式1: useRoute -->
        <div class="method-card">
          <h3>方式1: useRoute()</h3>
          <div class="code-block">
            <pre>const route = useRoute()
const meta = route.meta</pre>
          </div>
          <div class="result">
            <strong>结果:</strong>
            <div>标题: {{ routeMeta.title || '未设置' }}</div>
            <div>需要认证: {{ routeMeta.requiresAuth ? '是' : '否' }}</div>
            <div>权限: {{ routeMeta.roles || '无限制' }}</div>
          </div>
        </div>

        <!-- 方式2: this.$route (选项式API) -->
        <div class="method-card">
          <h3>方式2: this.$route (选项式API)</h3>
          <div class="code-block">
            <pre>// 在选项式API中
mounted() {
  const meta = this.$route.meta
}</pre>
          </div>
          <div class="result">
            <strong>适用场景:</strong>
            <div>• 选项式API组件</div>
            <div>• 兼容Vue2项目</div>
          </div>
        </div>

        <!-- 方式3: 路由守卫中获取 -->
        <div class="method-card">
          <h3>方式3: 路由守卫中获取</h3>
          <div class="code-block">
            <pre>router.beforeEach((to, from) => {
  const meta = to.meta
  console.log(meta)
})</pre>
          </div>
          <div class="result">
            <strong>适用场景:</strong>
            <div>• 路由拦截</div>
            <div>• 权限验证</div>
            <div>• 页面标题设置</div>
          </div>
        </div>

        <!-- 方式4: 通过router实例 -->
        <div class="method-card">
          <h3>方式4: 通过router实例</h3>
          <div class="code-block">
            <pre>const router = useRouter()
const currentMeta = router.currentRoute.value.meta</pre>
          </div>
          <div class="result">
            <strong>当前路由Meta:</strong>
            <div>{{ JSON.stringify(routerInstanceMeta) }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 实际应用场景 -->
    <section class="demo-section">
      <h2>3. 实际应用场景</h2>
      
      <div class="use-case-grid">
        <!-- 动态标题 -->
        <div class="use-case-card">
          <h3>动态页面标题</h3>
          <div class="code-example">
            <pre>// 路由配置
{
  path: '/user',
  meta: { title: '用户管理' }
}

// 组件中
watch(route, (to) => {
  document.title = to.meta.title || '默认标题'
}, { immediate: true })</pre>
          </div>
          <div class="demo-result">
            <strong>当前页面标题:</strong> {{ pageTitle }}
          </div>
        </div>

        <!-- 权限控制 -->
        <div class="use-case-card">
          <h3>权限控制</h3>
          <div class="code-example">
            <pre>// 路由配置
{
  path: '/admin',
  meta: { 
    requiresAuth: true,
    roles: ['admin', 'super-admin']
  }
}

// 权限检查
const hasPermission = computed(() => {
  const { requiresAuth, roles } = route.meta
  if (!requiresAuth) return true
  return roles.includes(userRole.value)
})</pre>
          </div>
          <div class="demo-result">
            <strong>权限状态:</strong> 
            <span :class="permissionClass">{{ permissionText }}</span>
          </div>
        </div>

        <!-- 面包屑导航 -->
        <div class="use-case-card">
          <h3>面包屑导航</h3>
          <div class="code-example">
            <pre>// 路由配置
{
  path: '/user/profile',
  meta: { 
    breadcrumb: [
      { name: '首页', path: '/' },
      { name: '用户管理', path: '/user' },
      { name: '用户详情', path: '/user/profile' }
    ]
  }
}</pre>
          </div>
          <div class="demo-result">
            <strong>面包屑:</strong>
            <nav class="breadcrumb">
              <span v-for="(item, index) in breadcrumbItems" :key="index">
                <router-link :to="item.path">{{ item.name }}</router-link>
                <span v-if="index < breadcrumbItems.length - 1"> / </span>
              </span>
            </nav>
          </div>
        </div>
      </div>
    </section>

    <!-- 路由切换演示 -->
    <section class="demo-section">
      <h2>4. 路由切换Meta变化演示</h2>
      <div class="route-buttons">
        <button @click="navigateTo('/home')" class="nav-btn">首页</button>
        <button @click="navigateTo('/user')" class="nav-btn">用户管理</button>
        <button @click="navigateTo('/admin')" class="nav-btn">管理后台</button>
        <button @click="navigateTo('/profile')" class="nav-btn">个人中心</button>
      </div>
      
      <div class="route-history">
        <h4>路由切换历史:</h4>
        <div class="history-list">
          <div v-for="(history, index) in routeHistory" :key="index" class="history-item">
            <span class="time">{{ history.time }}</span>
            <span class="path">{{ history.path }}</span>
            <span class="meta">{{ JSON.stringify(history.meta) }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Meta属性监听 -->
    <section class="demo-section">
      <h2>5. Meta属性监听</h2>
      <div class="watch-demo">
        <h4>监听到的Meta变化:</h4>
        <div class="watch-log">
          <div v-for="(log, index) in metaWatchLog" :key="index" class="log-item">
            {{ log }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 获取路由实例
const route = useRoute()
const router = useRouter()

// 响应式数据
const routeHistory = ref([])
const metaWatchLog = ref([])
const userRole = ref('admin') // 模拟用户角色

// 计算属性
const currentRoute = computed(() => ({
  name: route.name,
  path: route.path,
  meta: route.meta
}))

const routeMeta = computed(() => route.meta)

const routerInstanceMeta = computed(() => router.currentRoute.value.meta)

const pageTitle = computed(() => route.meta.title || 'Vue3 Router Meta演示')

const permissionClass = computed(() => {
  const { requiresAuth, roles } = route.meta
  if (!requiresAuth) return 'permission-granted'
  return roles && roles.includes(userRole.value) ? 'permission-granted' : 'permission-denied'
})

const permissionText = computed(() => {
  const { requiresAuth, roles } = route.meta
  if (!requiresAuth) return '无需权限'
  return roles && roles.includes(userRole.value) ? '权限通过' : '权限不足'
})

const breadcrumbItems = computed(() => {
  return route.meta.breadcrumb || [
    { name: '首页', path: '/' },
    { name: '当前页面', path: route.path }
  ]
})

// 方法
const navigateTo = (path) => {
  // 模拟路由配置
  const routeConfigs = {
    '/home': {
      title: '首页',
      requiresAuth: false,
      breadcrumb: [{ name: '首页', path: '/home' }]
    },
    '/user': {
      title: '用户管理',
      requiresAuth: true,
      roles: ['admin', 'user'],
      breadcrumb: [
        { name: '首页', path: '/home' },
        { name: '用户管理', path: '/user' }
      ]
    },
    '/admin': {
      title: '管理后台',
      requiresAuth: true,
      roles: ['admin', 'super-admin'],
      breadcrumb: [
        { name: '首页', path: '/home' },
        { name: '管理后台', path: '/admin' }
      ]
    },
    '/profile': {
      title: '个人中心',
      requiresAuth: true,
      roles: ['admin', 'user', 'guest'],
      breadcrumb: [
        { name: '首页', path: '/home' },
        { name: '个人中心', path: '/profile' }
      ]
    }
  }

  // 模拟路由跳转和meta变化
  const newMeta = routeConfigs[path] || {}
  
  // 记录路由历史
  routeHistory.value.unshift({
    time: new Date().toLocaleTimeString(),
    path: path,
    meta: newMeta
  })
  
  // 限制历史记录数量
  if (routeHistory.value.length > 5) {
    routeHistory.value = routeHistory.value.slice(0, 5)
  }
  
  console.log(`导航到: ${path}`, newMeta)
}

// 监听路由变化
watch(
  () => route.meta,
  (newMeta, oldMeta) => {
    const logMessage = `Meta变化: ${JSON.stringify(oldMeta)} -> ${JSON.stringify(newMeta)}`
    metaWatchLog.value.unshift(logMessage)
    
    // 限制日志数量
    if (metaWatchLog.value.length > 10) {
      metaWatchLog.value = metaWatchLog.value.slice(0, 10)
    }
    
    // 动态设置页面标题
    document.title = newMeta.title || '默认标题'
  },
  { deep: true, immediate: true }
)

// 监听整个路由对象
watch(
  route,
  (to, from) => {
    console.log('路由变化:', {
      from: from?.path,
      to: to.path,
      meta: to.meta
    })
  }
)

// 生命周期
onMounted(() => {
  console.log('组件挂载时的路由Meta:', route.meta)
  
  // 初始化路由历史
  routeHistory.value.push({
    time: new Date().toLocaleTimeString(),
    path: route.path,
    meta: route.meta
  })
})
</script>

<style scoped>
.router-meta-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h1 {
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

.demo-section h2 {
  color: #409eff;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409eff;
}

.info-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 6px;
  border-left: 4px solid #409eff;
}

.meta-info h4 {
  color: #606266;
  margin-bottom: 10px;
}

.meta-info pre {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 14px;
  color: #2c3e50;
}

.method-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.method-card {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 15px;
  background: #fafafa;
}

.method-card h3 {
  color: #409eff;
  margin-bottom: 15px;
  font-size: 16px;
}

.code-block {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.code-block pre {
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
}

.result {
  background: #e8f4fd;
  padding: 10px;
  border-radius: 4px;
  border-left: 3px solid #409eff;
}

.result div {
  margin-bottom: 5px;
}

.use-case-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.use-case-card {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 20px;
  background: #fff;
}

.use-case-card h3 {
  color: #e6a23c;
  margin-bottom: 15px;
}

.code-example {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.code-example pre {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
}

.demo-result {
  background: #f0f9ff;
  padding: 12px;
  border-radius: 4px;
  border-left: 3px solid #409eff;
}

.permission-granted {
  color: #67c23a;
  font-weight: bold;
}

.permission-denied {
  color: #f56c6c;
  font-weight: bold;
}

.breadcrumb {
  background: #f5f7fa;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.breadcrumb a {
  color: #409eff;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.route-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.nav-btn {
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.nav-btn:hover {
  background: #66b1ff;
}

.route-history {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
}

.history-list {
  max-height: 200px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  gap: 15px;
  padding: 8px 0;
  border-bottom: 1px solid #e4e7ed;
  font-size: 14px;
}

.history-item:last-child {
  border-bottom: none;
}

.time {
  color: #909399;
  min-width: 80px;
}

.path {
  color: #409eff;
  font-weight: bold;
  min-width: 100px;
}

.meta {
  color: #606266;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.watch-demo {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
}

.watch-log {
  max-height: 150px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 10px;
}

.log-item {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #606266;
  margin-bottom: 5px;
  padding: 5px;
  background: #f5f7fa;
  border-radius: 3px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .router-meta-demo {
    padding: 10px;
  }
  
  .method-grid,
  .use-case-grid {
    grid-template-columns: 1fr;
  }
  
  .route-buttons {
    flex-direction: column;
  }
  
  .nav-btn {
    width: 100%;
  }
  
  .history-item {
    flex-direction: column;
    gap: 5px;
  }
}

/* 滚动条样式 */
.history-list::-webkit-scrollbar,
.watch-log::-webkit-scrollbar {
  width: 6px;
}

.history-list::-webkit-scrollbar-track,
.watch-log::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.history-list::-webkit-scrollbar-thumb,
.watch-log::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.history-list::-webkit-scrollbar-thumb:hover,
.watch-log::-webkit-scrollbar-thumb:hover {
  background: #909399;
}
</style>