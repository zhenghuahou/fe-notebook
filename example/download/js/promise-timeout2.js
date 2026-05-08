/*
 * @Author: zhenghuahou 2430370966@qq.com
 * @Date: 2026-04-02 11:44:06
 * @LastEditors: zhenghuahou 2430370966@qq.com
 * @LastEditTime: 2026-04-02 13:54:44
 * @FilePath: /fe-notebook/example/download/js/promise-timeout2.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function timeoutPromise(executor, timeout = 1000, defaultValue = 'huazi default') {
  return new Promise((resolve, reject) => {
    let isSettled = false;
    let timer = null;
    const abortController = new AbortController();
    const signal = abortController.signal;

    // 监听取消信号
    if (signal.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'));
    }

    const cleanup = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    const settle = (fn, value) => {
      if (!isSettled) {
        isSettled = true;
        cleanup();
        fn(value);
      }
    };

    timer = setTimeout(() => {
      console.info(`超时 (${timeout}ms)，返回默认值:`, defaultValue);
      abortController.abort(); // 发送取消信号
      settle(resolve, defaultValue);
    }, timeout);

    // 传递 signal 给 executor
    try {
      const originalPromise = new Promise((res, rej) => {
        // 将 signal 传递给 executor
        executor(
          (value) => {
            if (!signal.aborted) res(value);
          },
          (error) => {
            if (!signal.aborted) rej(error);
          },
          signal
        );
      });

      originalPromise.then(
        (result) => settle(resolve, result)
      ).catch(
        (error) => {
          if (error.name === 'AbortError') {
            console.log('Promise 已取消');
            return;
          }
          settle(reject, error);
        }
      );
    } catch (error) {
      settle(reject, error);
    }
  });
}


// const result = await timeoutPromise(
//   (resolve, reject, signal) => {
//     const timeoutId = setTimeout(() => {
//       resolve('操作完成');
//     }, 2000);
    
//     // 监听取消信号
//     signal.addEventListener('abort', () => {
//       clearTimeout(timeoutId);
//       console.log('  取消处理程序被调用');
//       reject(new DOMException('操作被取消', 'AbortError'));
//     });
//   },
//   1000,
//   '超时默认值'
// );