
import  React from "react";
import  ReactDOM from "react-dom";
// 在Hooks中获取上一次指定的props
const usePrevProps = value => {
    const ref = React.useRef();
    React.useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
  
  function App() {
    const [count, setCount] = React.useState(0);
    const [total, setTotal] = React.useState(0);
    const handleCountA = () => setCount(count => count + 1);
    const handleCountB = React.useCallback(() => setCount(count => count + 1), []);
    // 效果等同于handleCountB,AnotherComponent都不会重新多次渲染
    const handleCountC = React.useMemo(()=>() => setCount(count => count + 1), []);
    const handleTotal = () => setTotal(total + 1);
    const prevHandleCountA = usePrevProps(handleCountA);
    const prevHandleCountB = usePrevProps(handleCountB);
    const prevHandleTotal = usePrevProps(handleTotal);
     const prevcount = usePrevProps(count);
    console.log('[state] prevcount:',prevcount,' count: ',count);
    console.log('[handleCountA === prevHandleCountA]两次处理函数是否相等：', prevHandleCountA === handleCountA);
    console.log('[handleCountB(被useCallback包裹) === prevHandleCountB]两次处理函数是否相等：', prevHandleCountB,prevHandleCountB === handleCountB);
    console.log('[handleTotal === prevHandleTotal]两次处理函数是否相等：', prevHandleTotal === handleTotal);
    /*某次的输出结果如下:
    [state] prevcount: 1  count:  2
     [handleCountA === prevHandleCountA]两次处理函数是否相等： false
     [handleCountB(被useCallback包裹) === prevHandleCountB]两次处理函数是否相等： () => setCount(count => count + 1) true
     [handleTotal === prevHandleTotal]两次处理函数是否相等： false
    */
   //线上预览地址: https://codepen.io/houzhenghua/pen/ExdPWxm?editors=0010
    return (
      <div>
        <div>Count is {count}</div>
         <div>Total is {total}</div>
        <br/>
        <div>
          <button onClick={handleCountA}>Increment Count</button><br/>
          <button onClick={handleTotal}>Increment Total</button>
        </div>
        <AnotherComponent onClick={handleCountB} />
        {/* <AnotherComponent onClick={handleCountC} /> */}
        {/* <AnotherComponent onClick={handleCountA} /> */}
      </div>
    )
  }
  
  //memo lets you skip re-rendering a component when its props are unchanged.
  //  React.memo加了之后，多次点击3个按钮都不会重新渲染
  const AnotherComponent = React.memo(function AotherComponent({ onClick }) {
    console.log('AotherComponent 组件渲染');
    return (
      <button onClick={onClick}>AotherComponent - handleCountB - Inrement Count(handleCount被useCallback包裹了)</button>
    )
  });
  
  ReactDOM.render(<App />, document.body)
  