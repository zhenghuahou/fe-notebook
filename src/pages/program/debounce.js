import Highlight from "../../components/highlight";
export default function Debounce() {
  const code = `
  function debounce(func, wait,immediate) {
    var previous = 0;
    var timeout = null;
    //this : undefined
  
    var later = function (tt) {
      var passed = + new Date - previous;
      console.info('later  passed:',passed,'timeout:',timeout,' time:',+ new Date,' previous:',previous)
      if (wait > passed) {
        timeout = setTimeout(()=>{
          later.apply(this,arguments)
        }, wait - passed);
      }else{
        // 到了可以触发的时间点
  
        // 将timeout重置为null，使之不影响下次连续事件的触发
        timeout = null;
         if (!immediate) func.apply(this, arguments);
      }
  
    }
  
    var debounced =  function () {
      // this : dom节点
      var now = + new Date;
      var callNow = immediate && !timeout;
      previous = now;
      if (!timeout) {
        timeout = setTimeout(() => {
          later.apply(this, arguments);
        }, wait);
  
        // 如果是立即触发
        if (immediate) {
          func.apply(this, arguments);
        }
  
      }
    }
  
    debounced.cancle = function(){
      clearTimeout(timeout)
      timeout= null;
    }
  
    return debounced
  }
  `;

  return (
    <>
      <h3>
        <a href="https://css-tricks.com/the-difference-between-throttling-and-debouncing/">
          The Difference Between Throttling and Debouncing
        </a>
      </h3>
      <a href="https://github.com/mqyqingfeng/Blog/issues/22">参考网址1</a>
      <br />
      <a href="https://github.com/lessfish/underscore-analysis/issues/21">
        参考网址2
      </a>
      <br />
      <hr />
      <div className="demo" id="id1">
        移上去(1)
      </div>
      <hr />
      <div className="demo" id="id2">
        移上去(2)
      </div>
      <hr />
      <div className="demo" id="id3">
        移上去(3)
      </div>
      <hr />
      <div className="demo" id="id4">
        移上去(4)immediate:true
      </div>
      <hr />
      <div className="demo" id="id5">
        移上去(5),不设置immediate
      </div>
      <p>
        throttle 和 debounce 的应用场景区分:
        <br />
        按一个按钮发送 AJAX：给 click 加了 debounce
        后就算用户不停地点这个按钮，也只会最终发送一次；如果是 throttle
        就会间隔发送几次 监听滚动事件判断是否到页面底部自动加载更多：给 scroll
        加了 debounce 后，只有用户停止滚动后，才会判断是否到了页面底部； 如果是
        throttle 的话，只要页面滚动就会间隔一段时间判断一次
        <a href="https://github.com/lessfish/underscore-analysis/issues/21">
          [参考来源]
        </a>
      </p>

      <Highlight className="code">{code}</Highlight>
    </>
  );
}

function debounceA(func, wait) {
  var timeout;

  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, arguments);
    }, wait);
  };
}

function debounceB(func, wait, immediate) {
  var timeout;

  return function () {
    if (timeout) clearTimeout(timeout);

    if (immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timeout;
      // console.info('00 **** timeout:',timeout)
      timeout = setTimeout(() => {
        // console.info('11 **** timeout:',timeout)
        timeout = null;
      }, wait);

      callNow && func.apply(this, arguments);
    } else {
      timeout = setTimeout(() => {
        func.apply(this, arguments);
      }, wait);
    }
  };
}

function debounce(func, wait, immediate) {
  var previous = 0;
  var timeout = null;
  //this : undefined

  var later = function (tt) {
    var passed = +new Date() - previous;
    console.info(
      "later  passed:",
      passed,
      "timeout:",
      timeout,
      " time:",
      +new Date(),
      " previous:",
      previous
    );
    if (wait > passed) {
      timeout = setTimeout(() => {
        later.apply(this, arguments);
      }, wait - passed);
    } else {
      // 到了可以触发的时间点

      // 将timeout重置为null，使之不影响下次连续事件的触发
      timeout = null;
      if (!immediate) func.apply(this, arguments);
    }
  };

  var debounced = function () {
    // this : dom节点
    var now = +new Date();
    var callNow = immediate && !timeout;
    previous = now;
    console.info(" <<<=========previous:", previous);
    if (!timeout) {
      console.info(" ========>>>>previous:", previous);
      timeout = setTimeout(() => {
        later.apply(this, arguments);
      }, wait);

      // 如果是立即触发
      if (immediate) {
        func.apply(this, arguments);
      }
    }
  };

  debounced.cancle = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}

window.addEventListener("load", function () {
  var count = 1;
  var container1 = document.getElementById("id1");
  var container2 = document.getElementById("id2");
  var container3 = document.getElementById("id3");
  var container4 = document.getElementById("id4");
  var container5 = document.getElementById("id5");

  function getUserAction() {
    this.innerHTML = count++;
  }

  container1 &&(container1.onmousemove = getUserAction);

  container2 && (container2.onmousemove = debounceA(getUserAction, 1000));

  container3 &&(container3.onmousemove = debounceB(getUserAction, 3000, true));

  container4 &&(container4.onmousemove = debounce(getUserAction, 3000, true));
  container5 && (container5.onmousemove = debounce(getUserAction, 3000));
});
