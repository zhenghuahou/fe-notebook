  /**
   * 带超时的Promise执行器
   * @param {Function} executor - Promise执行函数
   * @param {number} timeout - 超时时间（毫秒）
   * @returns {Promise} - 新的Promise
   */
  function timeoutPromise(executor, timeout = 60) {
    return new Promise((resolve, reject) => {
      let isResolved = false;

      // 创建原始Promise
      const originalPromise = new Promise(executor);

      // 设置超时定时器
      const timer = setTimeout(() => {
        if (!isResolved) {
          console.log(`Promise超时${timeout}ms，自动resolve`);
          resolve();
        }
      }, timeout);

      // 处理原始Promise的结果
      originalPromise.then((result) => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timer);
          resolve(result);
        }
      }).catch((error) => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timer);
          reject(error);
        }
      });
    });
  }

  // 使用示例
  const neverResolvingPromise = timeoutPromise((resolve, reject) => {
    // 这个Promise永远不会resolve
    console.log('创建永远不会resolve的Promise');
  });

  neverResolvingPromise.then(() => {
    console.log('Promise已解决');
  }).catch((error) => {
    console.log('Promise被拒绝:', error);
  });