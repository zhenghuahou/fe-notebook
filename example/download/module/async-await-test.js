// async function aa() {
//   console.info("aa");
//   return await new Promise((resolve, reject) => {
//     resolve("11");
//   });
// }

// async function test() {
//   console.info(111);
//   const r = aa();
//   console.info("rr:", r);
// }

// test(); // rr: promise 对象

// async function aa() {
//   console.info("aa");
//   return await new Promise((resolve, reject) => {
//     resolve("11");
//   });
// }

// async function test() {
//   console.info(111);
//   const r = await aa();
//   console.info("rr2:", r);
// }

// test(); // rr2: 11

async function aa() {
  console.info("aa");
  return new Promise((resolve, reject) => {
    resolve("11");
  });
}

async function test() {
  console.info(111);
  const r = await aa();
  console.info("rr3:", r);
}

test(); // rr3: 11

// function ptest() {
//   return new Promise((resolve) =>
//     setTimeout(() => {
//       console.info(" time  promise1:", performance.now().toFixed(2));
//       resolve("promise1");
//     }, 2000)
//   );
// }

// async function run() {
//   return new Promise(() => {
//     const rst = await ptest();
//     console.info(' rst:',rst)
//   });
// }

// const runRst = run()

// console.info(' runRst:',runRst)

const myArray = [1, 2, 3];

const sleep = (ms) =>
  new Promise((res) => {
    setTimeout(res, ms);
  });

const myPromise = (num) =>
  sleep(500).then((sleeprst) => {
    console.log(
      "done: " + num,
      " sleeprst:",
      sleeprst,
      performance.now().toFixed(2)
    );
  });

const forEachSeries = async (iterable, action) => {
  for (const x of iterable) {
    console.info(
      " 001 iterable:",
      iterable,
      performance.now().toFixed(2),
      " action:",
      action
    );
    await action(x);
    console.info(" 002 iterable:", iterable, performance.now().toFixed(2));
  }
};

forEachSeries(myArray, myPromise).then(() => {
  console.log("all done!", performance.now().toFixed(2));
});
