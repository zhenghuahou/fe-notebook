import { ref, reactive } from 'vue'

/**
 * API请求Hook
 * 提供统一的请求管理、加载状态、错误处理等功能
 */
export function useApiRequest() {
  // 全局加载状态
  const loading = ref(false)
  
  // 请求队列
  const requestQueue = reactive(new Map())
  
  // 错误状态
  const error = ref(null)
  
  /**
   * 生成请求唯一标识
   * @param {string} url 请求URL
   * @param {Object} params 请求参数
   * @returns {string} 请求标识
   */
  const generateRequestId = (url, params = {}) => {
    const paramsStr = JSON.stringify(params, Object.keys(params).sort())
    return `${url}:${btoa(encodeURIComponent(paramsStr))}`
  }
  
  /**
   * 执行请求
   * @param {Function} requestFn 请求函数
   * @param {Object} options 选项
   * @returns {Promise} 请求结果
   */
  const request = async (requestFn, options = {}) => {
    const {
      loadingKey = 'default',
      preventDuplicate = true,
      timeout = 30000,
      retry = 0,
      retryDelay = 1000
    } = options
    
    // 生成请求ID
    const requestId = generateRequestId(requestFn.toString(), options)
    
    // 防重复请求
    if (preventDuplicate && requestQueue.has(requestId)) {
      console.log('🔄 Duplicate request prevented:', requestId)
      return requestQueue.get(requestId)
    }
    
    // 设置加载状态
    loading.value = true
    error.value = null
    
    // 创建请求Promise
    const requestPromise = executeWithRetry(requestFn, retry, retryDelay, timeout)
    
    // 添加到请求队列
    if (preventDuplicate) {
      requestQueue.set(requestId, requestPromise)
    }
    
    try {
      const result = await requestPromise
      return result
    } catch (err) {
      error.value = err
      throw err
    } finally {
      // 清理
      loading.value = false
      if (preventDuplicate) {
        requestQueue.delete(requestId)
      }
    }
  }
  
  /**
   * 带重试的请求执行
   * @param {Function} requestFn 请求函数
   * @param {number} maxRetries 最大重试次数
   * @param {number} retryDelay 重试延迟
   * @param {number} timeout 超时时间
   * @returns {Promise} 请求结果
   */
  const executeWithRetry = async (requestFn, maxRetries, retryDelay, timeout) => {
    let lastError = null
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // 添加超时控制
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), timeout)
        })
        
        const result = await Promise.race([requestFn(), timeoutPromise])
        return result
      } catch (err) {
        lastError = err
        
        // 如果是最后一次尝试，直接抛出错误
        if (attempt === maxRetries) {
          break
        }
        
        // 等待重试延迟
        if (retryDelay > 0) {
          await new Promise(resolve => setTimeout(resolve, retryDelay))
        }
        
        console.log(`🔄 Request retry ${attempt + 1}/${maxRetries}:`, err.message)
      }
    }
    
    throw lastError
  }
  
  /**
   * 并行请求
   * @param {Array} requests 请求数组
   * @param {Object} options 选项
   * @returns {Promise} 所有请求结果
   */
  const parallel = async (requests, options = {}) => {
    const { 
      concurrency = 5,
      failFast = false 
    } = options
    
    if (concurrency >= requests.length) {
      // 如果并发数大于等于请求数，直接并行执行
      if (failFast) {
        return Promise.all(requests.map(req => request(req.fn, req.options)))
      } else {
        return Promise.allSettled(requests.map(req => request(req.fn, req.options)))
      }
    }
    
    // 控制并发数
    const results = []
    const executing = []
    
    for (let i = 0; i < requests.length; i++) {
      const req = requests[i]
      const promise = request(req.fn, req.options).then(
        result => ({ status: 'fulfilled', value: result, index: i }),
        reason => ({ status: 'rejected', reason, index: i })
      )
      
      results[i] = promise
      executing.push(promise)
      
      if (executing.length >= concurrency) {
        await Promise.race(executing)
        executing.splice(executing.findIndex(p => p === promise), 1)
      }
    }
    
    const finalResults = await Promise.all(results)
    
    if (failFast) {
      const rejected = finalResults.find(r => r.status === 'rejected')
      if (rejected) {
        throw rejected.reason
      }
      return finalResults.map(r => r.value)
    }
    
    return finalResults
  }
  
  /**
   * 串行请求
   * @param {Array} requests 请求数组
   * @param {Object} options 选项
   * @returns {Promise} 所有请求结果
   */
  const series = async (requests, options = {}) => {
    const { 
      stopOnError = false 
    } = options
    
    const results = []
    
    for (let i = 0; i < requests.length; i++) {
      try {
        const result = await request(requests[i].fn, requests[i].options)
        results.push({ status: 'fulfilled', value: result, index: i })
      } catch (error) {
        results.push({ status: 'rejected', reason: error, index: i })
        
        if (stopOnError) {
          throw error
        }
      }
    }
    
    return results
  }
  
  /**
   * 取消所有进行中的请求
   */
  const cancelAll = () => {
    const cancelledCount = requestQueue.size
    requestQueue.clear()
    console.log(`❌ Cancelled ${cancelledCount} requests`)
    return cancelledCount
  }
  
  /**
   * 获取请求统计
   */
  const getStats = () => {
    return {
      activeRequests: requestQueue.size,
      isLoading: loading.value,
      hasError: !!error.value
    }
  }
  
  return {
    // 状态
    loading,
    error,
    requestQueue,
    
    // 方法
    request,
    parallel,
    series,
    cancelAll,
    getStats,
    
    // 工具方法
    generateRequestId
  }
}

/**
 * 单例模式的全局请求管理器
 */
let globalApiRequest = null

export function useGlobalApiRequest() {
  if (!globalApiRequest) {
    globalApiRequest = useApiRequest()
  }
  return globalApiRequest
}