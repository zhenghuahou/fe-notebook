import { reactive, ref } from 'vue'

/**
 * 接口缓存Hook
 * 用于防止重复调用相同参数的接口
 */
export function useApiCache() {
  // 缓存存储
  const cache = reactive({})
  
  // 统计信息
  const hits = ref(0)
  const total = ref(0)
  
  /**
   * 生成缓存键
   * @param {string} api 接口名称
   * @param {any} params 参数
   * @returns {string} 缓存键
   */
  const generateCacheKey = (api, params) => {
    const sortedParams = JSON.stringify(params, Object.keys(params).sort())
    return `${api}:${btoa(encodeURIComponent(sortedParams))}`
  }
  
  /**
   * 检查缓存是否有效
   * @param {Object} cacheItem 缓存项
   * @returns {boolean} 是否有效
   */
  const isCacheValid = (cacheItem) => {
    if (!cacheItem) return false
    if (!cacheItem.ttl) return true
    return Date.now() < cacheItem.timestamp + cacheItem.ttl
  }
  
  /**
   * 缓存请求
   * @param {string} api 接口名称
   * @param {any} params 请求参数
   * @param {Function} requestFn 请求函数
   * @param {Object} options 选项
   * @returns {Promise} 请求结果
   */
  const cachedRequest = async (api, params, requestFn, options = {}) => {
    const { 
      ttl = 10 * 60 * 1000, // 默认10分钟缓存
      forceRefresh = false,
      enableCache = true
    } = options
    
    total.value++
    
    // 生成缓存键
    const cacheKey = generateCacheKey(api, params)
    
    // 检查是否启用缓存
    if (!enableCache || forceRefresh) {
      const data = await requestFn()
      if (enableCache) {
        cache[cacheKey] = {
          data,
          timestamp: Date.now(),
          ttl,
          api,
          params
        }
      }
      return { data, fromCache: false }
    }
    
    // 检查缓存
    const cachedItem = cache[cacheKey]
    if (isCacheValid(cachedItem)) {
      hits.value++
      console.log(`🎯 Cache hit for ${api}:`, params)
      return { data: cachedItem.data, fromCache: true }
    }
    
    // 缓存未命中，发起请求
    console.log(`🌐 Cache miss for ${api}:`, params)
    
    try {
      const data = await requestFn()
      
      // 存储到缓存
      cache[cacheKey] = {
        data,
        timestamp: Date.now(),
        ttl,
        api,
        params
      }
      
      return { data, fromCache: false }
    } catch (error) {
      console.error(`❌ Request failed for ${api}:`, error)
      throw error
    }
  }
  
  /**
   * 预加载缓存
   * @param {string} api 接口名称
   * @param {any} params 参数
   * @param {Function} requestFn 请求函数
   * @param {Object} options 选项
   */
  const preloadCache = async (api, params, requestFn, options = {}) => {
    const cacheKey = generateCacheKey(api, params)
    if (!cache[cacheKey]) {
      try {
        await cachedRequest(api, params, requestFn, options)
        console.log(`📦 Preloaded cache for ${api}`)
      } catch (error) {
        console.warn(`⚠️ Failed to preload cache for ${api}:`, error)
      }
    }
  }
  
  /**
   * 获取缓存项
   * @param {string} api 接口名称
   * @param {any} params 参数
   * @returns {any} 缓存数据
   */
  const getCacheItem = (api, params) => {
    const cacheKey = generateCacheKey(api, params)
    const cachedItem = cache[cacheKey]
    return isCacheValid(cachedItem) ? cachedItem.data : null
  }
  
  /**
   * 删除缓存项
   * @param {string} api 接口名称
   * @param {any} params 参数
   */
  const deleteCacheItem = (api, params) => {
    const cacheKey = generateCacheKey(api, params)
    delete cache[cacheKey]
  }
  
  /**
   * 清空所有缓存
   */
  const clear = () => {
    Object.keys(cache).forEach(key => {
      delete cache[key]
    })
    hits.value = 0
    total.value = 0
    console.log('🗑️ All cache cleared')
  }
  
  /**
   * 清理过期缓存
   */
  const clearExpired = () => {
    let clearedCount = 0
    Object.keys(cache).forEach(key => {
      if (!isCacheValid(cache[key])) {
        delete cache[key]
        clearedCount++
      }
    })
    console.log(`🧹 Cleared ${clearedCount} expired cache items`)
    return clearedCount
  }
  
  /**
   * 获取缓存统计
   */
  const getStats = () => {
    const activeCount = Object.keys(cache).filter(key => 
      isCacheValid(cache[key])
    ).length
    
    return {
      total: total.value,
      hits: hits.value,
      hitRate: total.value ? (hits.value / total.value * 100).toFixed(2) : 0,
      cacheCount: Object.keys(cache).length,
      activeCount
    }
  }
  
  /**
   * 批量预热缓存
   * @param {Array} requests 请求配置数组
   */
  const batchPreload = async (requests) => {
    const promises = requests.map(({ api, params, requestFn, options }) =>
      preloadCache(api, params, requestFn, options)
    )
    
    await Promise.allSettled(promises)
    console.log(`🚀 Batch preloaded ${requests.length} cache items`)
  }
  
  return {
    // 状态
    cache,
    hits,
    total,
    
    // 方法
    cachedRequest,
    preloadCache,
    getCacheItem,
    deleteCacheItem,
    clear,
    clearExpired,
    getStats,
    batchPreload,
    
    // 工具方法
    generateCacheKey,
    isCacheValid
  }
}

/**
 * 单例模式的全局缓存
 */
let globalApiCache = null

export function useGlobalApiCache() {
  if (!globalApiCache) {
    globalApiCache = useApiCache()
  }
  return globalApiCache
}