import Highlight from "../../components/highlight";
export default function AddBigNumber() {
  const code = `
    Function.prototype.call2 = function (context, ...args) {
        context = context || window;
        const sym = Symbol();
        context[sym] = this;
        const rst = context[sym](...args);
        return rst;
    };
    // 与上面call2不同的地方在于,apply2接收的第二个参数是数组
    Function.prototype.apply2 = function (context, args) {
        context = context || window;
        const sym = Symbol();
        context[sym] = this;
        const rst = context[sym](...args);
        return rst;
      };
    `;

  return (
    <>
      <h3>apply&call的模拟实现</h3>
      <Highlight className="code">{code}</Highlight>
    </>
  );
}

Function.prototype.call1 = function (context) {
  context = context || window;
  let args = [...arguments].slice(1);
  context.fn = this;
  const rst = context.fn(...args);
  return rst;
};

//简化版
Function.prototype.call2 = function (context, ...args) {
  context = context || window;
  const sym = Symbol();
  context[sym] = this;
  const rst = context[sym](...args);
  return rst;
};

Function.prototype.apply2 = function (context, args) {
  context = context || window;
  const sym = Symbol();
  context[sym] = this;
  const rst = !args ?  context[sym]() : context[sym](...args);
  return rst;
};

// var value = 1;
// function bar(name, age) {
//   return {
//     value: this.value,
//     name: name,
//     age: age,
//   };
// }

// console.log('call2:',bar.call2(null, 'kevin', 18));
// bar.apply2(null, [45, 78, 90]);
