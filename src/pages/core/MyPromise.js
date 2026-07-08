/* eslint-disable @typescript-eslint/no-unused-vars */
class MyPromise {
  constructor(executor) {
    this.init();
    try {
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (e) {
      this._reject.bind(this)(e);
    }
  }

  init() {
    this.PromiseResult = undefined; // 终值
    this.PromiseState = "pending"; // 状态
    this.onFulfilledCallbacks = []; // 保存成功回调
    this.onRejectedCallbacks = []; // 保存失败回调
  }

  _resolve(result) {
    if (this.PromiseState !== "pending") {
      return;
    }
    this.PromiseResult = result;
    this.PromiseState = "fulfilled";
    while (this.onFulfilledCallbacks.length > 0) {
      const r = this.onFulfilledCallbacks.shift();
      r(this.PromiseResult);
    }
  }
  _reject(reason) {
    if (this.PromiseState !== "pending") {
      return;
    }
    this.PromiseResult = reason;
    this.PromiseState = "rejected";
    while (this.onRejectedCallbacks.length > 0) {
      const r = this.onRejectedCallbacks.shift();
      r(this.PromiseResult);
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled !== "function" ? (val) => val : onFulfilled;
    onRejected =
      typeof onRejected !== "function"
        ? (reason) => {
            throw reason;
          }
        : onRejected;

    const thenPromise = new MyPromise((resolve, reject) => {
      const _handler = () => {
        const resolvePromise = (cb) => {
          setTimeout(() => {
            const rst = cb(this.PromiseResult);
            if (rst instanceof MyPromise) {
              rst.then(resolve, reject);
            } else {
              // 非Promise就直接成功
              resolve(rst);
            }
          });
        };

        if (this.PromiseState === "fulfilled") {
          resolvePromise(onFulfilled);
          //   return onFulfilled(this.PromiseResult);
        } else if (this.PromiseState === "rejected") {
          resolvePromise(onRejected);
          //   return onRejected(this.PromiseResult);
        } else if (this.PromiseState === "pending") {
          this.onFulfilledCallbacks.push(
            resolvePromise.bind(null, onFulfilled)
          );
          this.onRejectedCallbacks.push(resolvePromise.bind(null, onRejected));
        }
      };

      _handler();
    });

    return thenPromise;
  }
  static all(promises) {
    const result = [];
    let count = 0;
    return new MyPromise((resolve, reject) => {
      const addData = (index, value) => {
        result[index] = value;
        count++;
        if (count === promises.length) resolve(result);
      };
      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then(
            (res) => {
              addData(index, res);
            },
            (err) => reject(err)
          );
        } else {
          addData(index, promise);
        }
      });
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then(
            (res) => {
              resolve(res);
            },
            (err) => reject(err)
          );
        } else {
          resolve(promise);
        }
      });
    });
  }

  static allSettled(promises) {
    const result = [];
    let count = 0;
    return new MyPromise((resolve, reject) => {
      const addData = (index, value, status) => {
        result[index] =
          status === "rejected" ? { status, reason: value } : { status, value };
        count++;
        if (count === promises.length) resolve(result);
      };
      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then(
            (res) => {
              addData(index, res, "fulfilled");
            },
            (err) => addData(index, err, "rejected")
          );
        } else {
          addData(index, promise, "fulfilled");
        }
      });
    });
  }

  static any(promises) {
    const result = [];
    let count = 0;
    return new MyPromise((resolve, reject) => {
      const addData = (index, value, status) => {
        result[index] = value;
        count++;
        if (count === promises.length) {
          reject(new AggregateError(result, "All promises were rejected"));
        }
      };
      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then(
            (res) => {
              resolve(res);
            },
            (err) => addData(index, err)
          );
        } else {
          resolve(promise);
        }
      });
    });
  }
}

/* 以下为测试代码 */
function MakePromise(pendingTime, promiseValue, isRejected = false) {
  return new MyPromise((resolve, reject) => {
    setTimeout(isRejected ? reject : resolve, pendingTime, promiseValue);
  });
}

function test() {
  const list = [
    {
      pendingTime: 4000,
      promiseValue: "p1 4000",
      //   isRejected: true,
    },
    {
      pendingTime: 2000,
      promiseValue: "p2 2000",
      //   isRejected: true,
    },
    {
      pendingTime: 1000,
      promiseValue: "p3 1000",
      isRejected: true,
    },
  ];
  console.info("time start:", performance.now().toFixed(2));
  const promises = list.map((item) => {
    const { pendingTime, promiseValue, isRejected = false } = item;
    return MakePromise(pendingTime, promiseValue, isRejected);
  });
  console.info(" promises:", promises);
  window.fall1 = MyPromise.any(promises);
  window.fall2 = window.fall1.then(
    (r) => {
      console.info(r, "promise resolved time:", performance.now().toFixed(2));
    },
    (reason) => {
      console.info(
        reason,
        "promise rejected time:",
        performance.now().toFixed(2)
      );
    }
  );
}

test();

const test1 = new Promise((resolve, reject) => {
  resolve("success");
})
  .then(
    (res) => console.log("res"),
    (err) => console.log("err:", err)
  )
  .then(
    (res) => console.log("res"),
    (err) => console.log("err:", err)
  );
