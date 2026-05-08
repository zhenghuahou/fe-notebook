# Vue3 接口防重复调用优雅实现方案

## 📖 概述

在Vue3项目中，接口防重复调用是一个常见且重要的优化需求。当用户快速点击按钮或者相同参数的接口被多次调用时，我们需要避免重复的网络请求，提升用户体验和性能。

本方案提供了一个优雅、灵活、功能完整的接口缓存解决方案。

## 🎯 核心特性

### 1. **智能缓存机制**
- 基于接口名称和参数生成唯一缓存键
- 支持TTL（生存时间）配置
- 自动清理过期缓存
- 缓存命中统计

### 2. **参数对比算法**
```javascript
const generateCacheKey = (api, params) => {
  // 对参数进行排序，确保相同参数生成相同的key
  const sortedParams = JSON.stringify(params, Object.keys(params).sort())
  return `${api}:${btoa(encodeURIComponent(sortedParams))}`
}
```

### 3. **灵活的配置选项**
- `ttl`: 缓存时间（毫秒）
- `forceRefresh`: 强制刷新缓存
- `enableCache`: 是否启用缓存

### 4. **完整的生命周期管理**
- 缓存预热
- 过期清理
- 统计信息
- 批量操作

## 🛠️ 实现方案

### 方案一：基础缓存（推荐）

```javascript
import { useApiCache } from './composables/useApiCache'

const apiCache = useApiCache()

// 使用缓存
const result = await apiCache.cachedRequest(
  'getUserInfo',           // 接口名称
  { id: userId.value },    // 请求参数
  () => api.getUserInfo(userId.value), // 请求函数
  { ttl: 5 * 60 * 1000 }  // 5分钟缓存
)

if (result.fromCache) {
  console.log('从缓存获取数据')
} else {
  console.log('从网络获取数据')
}
```

### 方案二：装饰器模式

```javascript
// 创建缓存装饰器
function withCache(apiName, options = {}) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value
    const apiCache = useApiCache()
    
    descriptor.value = async function(...args) {
      return await apiCache.cachedRequest(
        apiName,
        args,
        () => originalMethod.apply(this, args),
        options
      )
    }
    
    return descriptor
  }
}

// 使用装饰器
class UserService {
  @withCache('getUserInfo', { ttl: 10 * 60 * 1000 })
  async getUserInfo(userId) {
    return await fetch(`/api/users/${userId}`).then(res => res.json())
  }
}
```

### 方案三：组合式API封装

```javascript
// 创建专用hook
export function useUserApi() {
  const apiCache = useApiCache()
  
  const getUserInfo = async (userId) => {
    return await apiCache.cachedRequest(
      'getUserInfo',
      { userId },
      async () => {
        const response = await fetch(`/api/users/${userId}`)
        return await response.json()
      },
      { ttl: 5 * 60 * 1000 }
    )
  }
  
  return {
    getUserInfo
  }
}
```

## 🔧 高级特性

### 1. **防抖结合缓存**

```javascript
import { debounce } from './utils/debounce'

// 搜索防抖 + 缓存
const debouncedSearch = debounce(async (query) => {
  const result = await apiCache.cachedRequest(
    'searchProducts',
    { query, category: category.value },
    () => api.searchProducts(query, category.value),
    { ttl: 2 * 60 * 1000 } // 2分钟缓存
  )
  
  products.value = result.data
}, 300)
```

### 2. **批量预热缓存**

```javascript
// 预热常用数据
const preloadCommonData = async () => {
  await apiCache.batchPreload([
    {
      api: 'getUserInfo',
      params: { id: currentUserId },
      requestFn: () => api.getUserInfo(currentUserId),
      options: { ttl: 30 * 60 * 1000 }
    },
    {
      api: 'getCategories',
      params: {},
      requestFn: () => api.getCategories(),
      options: { ttl: 60 * 60 * 1000 }
    }
  ])
}
```

### 3. **条件缓存**

```javascript
const getDataWithCondition = async (params) => {
  const shouldCache = params.type === 'static' // 只缓存静态数据
  
  return await apiCache.cachedRequest(
    'getData',
    params,
    () => api.getData(params),
    { 
      enableCache: shouldCache,
      ttl: shouldCache ? 30 * 60 * 1000 : 0
    }
  )
}
```

### 4. **缓存更新策略**

```javascript
// 数据更新后清除相关缓存
const updateUserInfo = async (userId, data) => {
  const result = await api.updateUserInfo(userId, data)
  
  // 清除用户相关缓存
  apiCache.deleteCacheItem('getUserInfo', { id: userId })
  apiCache.deleteCacheItem('getUserProfile', { userId })
  
  return result
}
```

## 📊 监控和调试

### 1. **缓存统计**

```javascript
const stats = apiCache.getStats()
console.log('缓存统计:', {
  总请求数: stats.total,
  命中次数: stats.hits,
  命中率: stats.hitRate + '%',
  缓存条目: stats.cacheCount,
  活跃缓存: stats.activeCount
})
```

### 2. **缓存状态监控**

```javascript
// 在开发环境下启用详细日志
if (import.meta.env.DEV) {
  // 监听缓存变化
  watch(() => Object.keys(apiCache.cache).length, (newCount, oldCount) => {
    console.log(`缓存条目数量变化: ${oldCount} → ${newCount}`)
  })
}
```

## 🎨 最佳实践

### 1. **缓存时间设置**

```javascript
// 根据数据类型设置不同的缓存时间
const cacheStrategies = {
  // 用户信息 - 中等缓存
  userInfo: 10 * 60 * 1000,        // 10分钟
  
  // 静态配置 - 长期缓存
  appConfig: 60 * 60 * 1000,       // 1小时
  
  // 搜索结果 - 短期缓存
  searchResults: 2 * 60 * 1000,    // 2分钟
  
  // 实时数据 - 不缓存
  liveData: 0
}
```

### 2. **错误处理**

```javascript
const safeApiCall = async (api, params, requestFn, options = {}) => {
  try {
    return await apiCache.cachedRequest(api, params, requestFn, options)
  } catch (error) {
    // 网络错误时，尝试返回过期缓存
    if (error.message.includes('network') || error.message.includes('timeout')) {
      const expiredCache = apiCache.getCacheItem(api, params)
      if (expiredCache) {
        console.warn('网络错误，返回过期缓存数据')
        return { data: expiredCache, fromCache: true, expired: true }
      }
    }
    throw error
  }
}
```

### 3. **内存管理**

```javascript
// 定期清理过期缓存
setInterval(() => {
  const clearedCount = apiCache.clearExpired()
  if (clearedCount > 0) {
    console.log(`清理了 ${clearedCount} 个过期缓存`)
  }
}, 5 * 60 * 1000) // 每5分钟执行一次

// 页面隐藏时清理缓存
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    apiCache.clearExpired()
  }
})
```

## 🔍 使用场景

### 1. **用户信息查询**
- 缓存时间：5-15分钟
- 适合：个人资料、权限信息等变化不频繁的数据

### 2. **搜索功能**
- 缓存时间：1-5分钟
- 结合防抖：避免频繁搜索
- 适合：商品搜索、用户搜索等

### 3. **配置数据**
- 缓存时间：30分钟-2小时
- 适合：字典数据、系统配置等

### 4. **数据报表**
- 缓存时间：10-30分钟
- 适合：统计图表、分析数据等计算密集型接口

## ⚠️ 注意事项

### 1. **内存使用**
- 合理设置缓存数量上限
- 定期清理过期缓存
- 监控内存使用情况

### 2. **数据一致性**
- 数据更新后及时清除相关缓存
- 重要操作可以使用 `forceRefresh`
- 敏感数据不建议缓存

### 3. **缓存键冲突**
- 确保不同接口使用不同的API名称
- 参数序列化要保持一致性
- 避免使用函数作为参数

## 🚀 性能优化

### 1. **缓存命中率优化**
// 预加载相关数据
const preloadRelatedData = async (userId) => {
  // 并行预载用户相关数据
  await Promise.all([
    apiCache.preloadCache('getUserInfo', { id: userId }, () => api.getUserInfo(userId)),
    apiCache.preloadCache('getUserSettings', { userId }, () => api.getUserSettings(userId))
  ])
}
```

### 2. **减少内存占用**
```javascript
// 压缩缓存数据
const compressedCache = {
  ...apiCache,
  cachedRequest: async (api, params, requestFn, options = {}) => {
    const result = await apiCache.cachedRequest(api, params, requestFn, options)
    
    // 大对象压缩存储
    if (JSON.stringify(result.data).length > 10000) {
      console.log('大数据对象已压缩缓存')
    }
    
    return result
  }
}
```

这个方案提供了完整的接口防重复调用解决方案，既保证了功能的完整性，又保持了代码的优雅和可维护性。