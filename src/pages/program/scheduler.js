class Scheduler {
  constructor(n) {
    this.init(n);
  }
  init(n) {
    this.queue = [];
    this.max = n;
    this.count = 0;
  }

  async add(promiseCreator) {
    /*
        此时count已经满了，不能执行本次add需要阻塞在这里，将resolve放入队列中等待唤醒,
        等到count<max时，从队列中取出执行resolve,执行，await执行完毕，本次add继续
        */
    if (this.max <= this.count) {
      await new Promise((resolve, reject) => {
        this.queue.push(resolve);
      });
    }
    this.count++;
    let res = await promiseCreator();
    this.count--;
    if (this.queue.length > 0) {
      // 依次唤醒add
      // 若队列中有值，将其resolve弹出，并执行
      // 以便阻塞的任务，可以正常执行
      const jobs = this.queue.shift();
      jobs();
    }
    return res;
  }
  // ...
}

const timeout = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

const scheduler = new Scheduler(2);
// const addTask = (time, order) => {
//   scheduler.add(() => timeout(time)).then(() => console.log(order));
// };

const addTask = (time, order) => {
  scheduler
    .add(() => {
      // 调试代码
      scheduler.add.order = `${order} ${time}`;
      console.info(" order：", order);
      return timeout(time);
    })
    .then(() => console.log(order));
};

addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");
// 打印顺序是：2 3 1 4

// addTask(1000, "1");
// addTask(500, "2");
// addTask(1300, "3");
// addTask(400, "4");
//打印顺序是：2 1  4 3
