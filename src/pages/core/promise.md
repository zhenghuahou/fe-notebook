###### Promise 的特点：

- . 执行了 resolve，Promise 状态会变成 fulfilled；
- . 执行了 reject，Promise 状态会变成 rejected；
- . Promise 状态不可逆，第一次成功就永久为 fulfilled，第一次失败就永远状态为 rejected；
- . Promise 中有 throw 的话，就相当于执行了 reject；

###### Promise.prototype.then 的特点:

- . then 接收两个回调，一个是成功回调，一个是失败回调；
- . 当 Promise 状态为 fulfilled 执行成功回调，为 rejected 执行失败回调；
- . 如 resolve 或 reject 在定时器里，则定时器结束后再执行 then；
- . then 支持链式调用，下一次 then 执行受上一次 then 返回值的影响；

###### Promise.all 的特点:

- . 接收一个 Promise 数组，数组中如有非 Promise 项，则此项当做成功；
- . 如果所有 Promise 都成功，则返回成功结果数组；
- . 如果有一个 Promise 失败，则返回这个失败结果；

###### Promise.race 的特点:

- .接收一个 Promise 数组，数组中如有非 Promise 项，则此项当做成功；
- .哪个 Promise 最快得到结果，就返回那个结果，无论成功失败；

###### Promise.allSettled 的特点:

- 接收一个 Promise 数组，数组中如有非 Promise 项，则此项当做成功；
- 把每一个 Promise 的结果，集合成数组后返回；

###### Promise.any 的特点:

- . 接收一个 Promise 数组，数组中如有非 Promise 项，则此项当做成功；
- . 如果有一个 Promise 成功，则返回这个成功结果；
- . 如果所有 Promise 都失败，则报错；

[Promise 对象详解](https://es6.ruanyifeng.com/#docs/promise#Promise-race)
