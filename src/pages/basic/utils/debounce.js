/**
 * 防抖函数
 * @param {Function} func 需要防抖的函数
 * @param {number} wait 等待时间（毫秒）
 * @param {Object} options 选项
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait = 300, options = {}) {
  const {
    leading = false,    // 是否在延迟开始前调用
    trailing = true,    // 是否在延迟结束后调用
    maxWait = null      // 最大等待时间
  } = options

  let timeoutId = null
  let maxTimeoutId = null
  let lastCallTime = 0
  let lastInvokeTime = 0
  let lastArgs = null
  let lastThis = null
  let result = undefined

  function invokeFunc(time) {
    const args = lastArgs
    const thisArg = lastThis

    lastArgs = lastThis = undefined
    lastInvokeTime = time
    result = func.apply(thisArg, args)
    return result
  }

  function leadingEdge(time) {
    // 重置任何 `maxWait` 定时器
    lastInvokeTime = time
    // 启动延迟定时器
    timeoutId = setTimeout(timerExpired, wait)
    // 如果 leading 为 true，调用 func
    return leading ? invokeFunc(time) : result
  }

  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    const result = wait - timeSinceLastCall

    return maxWait !== null
      ? Math.min(result, maxWait - timeSinceLastInvoke)
      : result
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime

    // 如果是第一次调用或者已经等待了指定的时间
    return (lastCallTime === 0 || 
            timeSinceLastCall >= wait || 
            timeSinceLastCall < 0 || 
            (maxWait !== null && timeSinceLastInvoke >= maxWait))
  }

  function timerExpired() {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    // 重新启动定时器
    timeoutId = setTimeout(timerExpired, remainingWait(time))
  }

  function trailingEdge(time) {
    timeoutId = null

    // 只有在我们有 `lastArgs` 时才调用，这意味着 `debounced` 至少被调用过一次
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined
    return result
  }

  function cancel() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
    if (maxTimeoutId !== null) {
      clearTimeout(maxTimeoutId)
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = timeoutId = maxTimeoutId = undefined
  }

  function flush() {
    return timeoutId === null ? result : trailingEdge(Date.now())
  }

  function debounced(...args) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timeoutId === null) {
        return leadingEdge(lastCallTime)
      }
      if (maxWait !== null) {
        // 处理调用间隔短于 `maxWait` 的调用
        timeoutId = setTimeout(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timeoutId === null) {
      timeoutId = setTimeout(timerExpired, wait)
    }
    return result
  }

  debounced.cancel = cancel
  debounced.flush = flush
  debounced.pending = () => timeoutId !== null

  return debounced
}

/**
 * 节流函数
 * @param {Function} func 需要节流的函数
 * @param {number} wait 等待时间（毫秒）
 * @param {Object} options 选项
 * @returns {Function} 节流后的函数
 */
export function throttle(func, wait = 300, options = {}) {
  const {
    leading = true,
    trailing = true
  } = options

  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait
  })
}

/**
 * 创建防抖装饰器
 * @param {number} wait 等待时间
 * @param {Object} options 选项
 * @returns {Function} 装饰器函数
 */
export function debouncedDecorator(wait = 300, options = {}) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value
    descriptor.value = debounce(originalMethod, wait, options)
    return descriptor
  }
}

/**
 * 异步防抖
 * @param {Function} asyncFunc 异步函数
 * @param {number} wait 等待时间
 * @param {Object} options 选项
 * @returns {Function} 防抖后的异步函数
 */
export function debounceAsync(asyncFunc, wait = 300, options = {}) {
  let pendingPromise = null
  const debouncedFunc = debounce(async (...args) => {
    try {
      const result = await asyncFunc(...args)
      pendingPromise = null
      return result
    } catch (error) {
      pendingPromise = null
      throw error
    }
  }, wait, options)

  return function(...args) {
    if (pendingPromise) {
      return pendingPromise
    }
    
    pendingPromise = new Promise((resolve, reject) => {
      const result = debouncedFunc(...args)
      if (result && typeof result.then === 'function') {
        result.then(resolve).catch(reject)
      } else {
        resolve(result)
      }
    })
    
    return pendingPromise
  }
}

export default debounce