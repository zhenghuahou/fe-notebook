/*
 * @Author: zhenghuahou 2430370966@qq.com
 * @Date: 2023-03-15 12:06:12
 * @LastEditors: zhenghuahou 2430370966@qq.com
 * @LastEditTime: 2023-05-14 15:40:08
 * @FilePath: /fe-notebook/src/pages/react/batchUpdateWithReact18.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useState, useLayoutEffect } from "react";
import * as ReactDOM from "react-dom";
import { flushSync } from "react-dom";

// https://juejin.cn/post/7153814771937067044
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    console.log("=== click ===");
    //react18 createRoot情况下，更新1次
    //react18 ReactDOM.render情况下，更新2次
    // fetchSomething().then(() => {
    //   // React 18 with createRoot batches these:
    //   setCount((c) => c + 1); // Does not re-render yet
    //   setFlag((f) => !f); // Does not re-render yet
    //   // React will only re-render once at the end (that's batching!)
    // });

    //react18  createRoot情况下，更新1次
    //react18  ReactDOM.render情况下，更新2次
    // setTimeout(() => {
    //   setCount((c) => c + 1);
    //   setFlag((f) => !f);
    // });


    setTimeout(() => {
      setCount(c => c + 1);
      setCount(c => c + 1);
      setCount(c => c + 1);
      // setFlag((f) => !f);
       // V18前 { count: 1, flag: false }
      // V18中 { count: 0, flag: false }，除非使用flushSync
      //react18  createRoot情况下，flag,count都是改变前的值  第一次点击的时候值为:count:0,flag:false
      console.log('flag:',flag,' count:',count);
  
    });

    //react18  createRoot情况下，更新2次
    //react18  ReactDOM.render情况下，更新2次
    // flushSync(() => {
    //   setCount((c) => c + 1);
    // });
    // flushSync(() => {
    //   setFlag((f) => !f);
    // });
  }

  return (
    <div>
      <button onClick={handleClick}>@Next</button>
      <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
      <LogEvents />
    </div>
  );
}

function LogEvents(props) {
  useLayoutEffect(() => {
    console.log("Commit！");
  });
  console.log("Render！");
  return null;
}

function fetchSomething() {
  return new Promise((resolve) => setTimeout(resolve, 100));
}

const rootElement = document.getElementById("root");
// This opts into the new behavior!
// ReactDOM.createRoot(rootElement).render(<App />);
// ReactDOM.render(<App />, rootElement);
ReactDOM.createRoot(rootElement).render(<App />);
