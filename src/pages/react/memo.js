import {
  useLayoutEffect,
  useState,
  memo,
  useMemo,
  useCallback,
  Children,
} from "react";

const renderCntMap = {};
const renderOnce = (name) => {
  console.info(" name:", name, " val:", renderCntMap[name]);
  return (renderCntMap[name] = (renderCntMap[name] || 0) + 1);
};

window.renderCntMap = renderCntMap;
/**
 * cDM 与 useLayoutEffect 执行时机相同
 */

function ChildFunction({ children, name }) {
  console.info("render child component");
  return (
    <fieldset>
      ChildFunction 组件 Render 次数：{renderOnce(name)}
      <legend>{children}</legend>
    </fieldset>
  );
}

const ChildF = memo(ChildFunction);

let b = 0;
function ParentFunction() {
  let [count, setCount] = useState(0);
  b++;
  const a = useCallback(() => {
    console.info("test");
  }, []);
  window["b" + b] = a;
  return (
    <div>
      <div className="parentClass">count:{count}</div>
      <button
        onClick={() => {
          setCount(++count);
        }}
      >
        increase count
      </button>
      <ChildFunction name="t0">
        ChildFunction组件没有被memo包裹!点击上面的按钮，我会渲染多次
      </ChildFunction>
      <p>ChildF是被memo包裹的组件</p>
      <ChildF
        name="t1"
        onClick={() => {
          console.info("test");
        }}
      >
        (memo)点击上面的按钮，我会渲染多次
      </ChildF>
      <ChildF name='t1' onClick={() => { console.info(1)}}>(memo)点击上面的按钮，我会渲染多次</ChildF>
      <ChildF name='t2' onClick={a}>(memo+useCallback)点击上面的按钮，我不会重新渲染</ChildF>
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <ParentFunction />
    </div>
  );
}
