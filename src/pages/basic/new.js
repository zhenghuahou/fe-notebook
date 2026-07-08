import Highlight from "../../components/highlight";

export default function New() {
  const code = `
  function createObj(fn, ...args) {
    let newInstance = Object.create(fn.prototype);
    let result = fn.apply(newInstance, args)
    // typeof function (){} // 'function'
    // return typeof result !== 'object' ? newInstance : result
    return result instanceof  Object ?  result : newInstance
  }
  
  function test() {
    return function bb() { }
  }

  function test2() {
  }

  function test3() {
    return  []
  }

  function test4() {
    return  /b/
  }
  createObj(test)  // ƒ bb() { }
  createObj(test2) // test2{}
  createObj(test3) // []
  createObj(test4) // /b/
  `;
  return (
    <>
      <h3>new 关键字会进行如下的操作：</h3>
      <p>1. 创建一个空的简单 JavaScript 对象（即 {}）；</p>
      <p>
        2. 为步骤 1 新创建的对象添加属性
        __proto__，将该属性链接至构造函数的原型对象；
      </p>
      <p>3. 将步骤 1 新创建的对象作为 this 的上下文；</p>
      <p>4. 如果该函数没有返回对象，则返回 this。</p>
      <Highlight className="code">{code}</Highlight>
    </>
  );
}
