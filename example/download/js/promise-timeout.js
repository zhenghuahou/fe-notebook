/**
 * 高性能版本，避免内存泄漏
 * @param {Function} executor - Promise执行函数
 * @param {number} timeout
 * @param {*} defaultValue
 * @returns {Promise}
 */
function timeoutPromise(executor, timeout = 60, defaultValue = undefined) {
  return new Promise((resolve, reject) => {
    let isSettled = false;
    let timer = null;

    // 创建原始Promise
    const originalPromise = new Promise(executor);
    console.info("originalPromise:", originalPromise);

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      timer = null;
    };

    const settle = (fn, value) => {
      if (!isSettled) {
        isSettled = true;
        cleanup();
        fn(value);
      }
    };

    timer = setTimeout(() => {
      settle(resolve, defaultValue);
      console.info(" timer======>", defaultValue);
    }, timeout);

    originalPromise
      .then((result) => settle(resolve, result))
      .catch((error) => settle(reject, error));
  });
}

// 测试用例
async function runTests() {
  console.log("=== 开始测试 timeout Promise ===");

  // 测试用例1: 正常resolve的Promise
  console.log("\n--- 测试用例1: 正常resolve的Promise ---");
  const normalPromise = timeoutPromise((resolve) => {
    setTimeout(() => {
      resolve("正常结果");
    }, 30); // 30ms后resolve，小于超时时间60ms
  });

  try {
    const result = await normalPromise;
    console.log("测试1结果:", result); // 应该输出: 正常结果
  } catch (error) {
    console.log("测试1错误:", error);
  }

  // 测试用例2: 超时自动resolve
  // console.log('\n--- 测试用例2: 超时自动resolve ---');
  // const timeoutPromiseTest = timeoutPromise((resolve) => {
  //   // 这个Promise永远不会resolve
  //   console.log('创建永远不会resolve的Promise');
  // });

  // try {
  //   const result = await timeoutPromiseTest;
  //   console.log('测试2结果:', result); // 应该输出: undefined（因为超时后resolve()没有参数）
  // } catch (error) {
  //   console.log('测试2错误:', error);
  // }

  // 测试用例3: 正常reject
  // console.log('\n--- 测试用例3: 正常reject ---');
  // const rejectPromise = timeoutPromise((resolve, reject) => {
  //   setTimeout(() => {
  //     reject('发生错误');
  //   }, 30); // 30ms后reject，小于超时时间60ms
  // });

  // try {
  //   const result = await rejectPromise;
  //   console.log('测试3结果:', result);
  // } catch (error) {
  //   console.log('测试3错误:', error); // 应该输出: 发生错误
  // }

  // 测试用例4: 超时后reject
  // console.log('\n--- 测试用例4: 超时后reject ---');
  // const timeoutRejectPromise = timeoutPromise((resolve, reject) => {
  //   setTimeout(() => {
  //     reject('超时后发生错误');
  //   }, 100); // 100ms后reject，大于超时时间60ms
  // });

  // try {
  //   const result = await timeoutRejectPromise;
  //   console.log('测试4结果:', result);
  // } catch (error) {
  //   console.log('测试4错误:', error); // 应该输出: 超时后发生错误
  // }

  // 测试用例5: 自定义超时时间
  // console.log('\n--- 测试用例5: 自定义超时时间 ---');
  // const customTimeoutPromise = timeoutPromise((resolve) => {
  //   setTimeout(() => {
  //     resolve('自定义超时结果');
  //   }, 80); // 80ms后resolve，大于自定义超时时间50ms
  // }, 50); // 自定义超时时间50ms

  // try {
  //   const result = await customTimeoutPromise;
  //   console.log('测试5结果:', result); // 应该输出: undefined（因为超时后resolve()没有参数）
  // } catch (error) {
  //   console.log('测试5错误:', error);
  // }

  console.log("\n=== 测试完成 ===");
}

runTests;
