import Highlight from "../../components/highlight";
export default function Throttle() {
  const code = `
  // leading：false 表示禁用第一次执行
  // trailing: false 表示禁用停止触发的回调
  function throttle(func, wait,options) {
    var previous = 0;
    var timeout = null;
    if (!options) options = {};

    //this : undefined
    var throttled = function () {
      // this : dom节点
      var now = + new Date;
      if(options.leading===false && (!previous)){
        // 禁用第一次执行
        previous = now;
      }
      var remaining = wait - (now - previous)
      // console.info('previous:',previous,' =====>remaining:',remaining,' timeout:',timeout)
      // 如果没有剩余的时间了或者你改了系统时间
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        func.apply(this, arguments)
      } else if (!timeout && options.trailing!==false) {
        timeout = setTimeout(() => {
          timeout = null;
          previous = options.leading === false ? 0 : +new Date;
          func.apply(this, arguments)
        }, remaining)
      }
    }

    throttled.cancel = function(){
      clearTimeout(timeout);
      timeout = null;
      previous = 0;
    }
    
    return throttled;
  }
  `;

  return (
    <>
      <a href="https://github.com/mqyqingfeng/Blog/issues/26">参考网址</a>
      <br />
      <hr />
      <div className="demo" id="id11">
        移上去
      </div>
      <hr />
      <div className="demo" id="id22">
        移上去
      </div>
      <hr />
      <div className="demo" id="id33">
        移上去(3)
      </div>
      <hr />
      <div className="demo" id="id44">
        移上去
      </div>
      <hr />
      <div className="demo" id="id55">
        移上去
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

// 使用时间戳
function throttleA(func, wait) {
  var previous = 0;
  //this : undefined

  return function () {
    // this : dom节点
    var now = +new Date();
    if (now - previous > wait) {
      func.apply(this, arguments);
      previous = now;
    }
  };
}

// 使用定时器
function throttleB(func, wait) {
  var previous = 0;
  var timeout = null;
  //this : undefined

  return function () {
    // this : dom节点
    var now = +new Date();
    console.info("[throttleB] 00  timeout:", timeout);
    if (!timeout) {
      timeout = setTimeout(() => {
        console.info(
          "[throttleB] 11  this:",
          this,
          "timeout:",
          timeout,
          "arguments:",
          arguments
        );
        timeout = null;
        func.apply(this, arguments);
      }, wait);
    }
  };
}

function throttleC(func, wait) {
  var previous = 0;
  var timeout = null;
  //this : undefined

  return function () {
    // this : dom节点
    var now = +new Date();
    var remaining = wait - (now - previous);
    // 如果没有剩余的时间了或者你改了系统时间
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, arguments);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        previous = +new Date();
        func.apply(this, arguments);
      }, remaining);
    }
  };
}

// leading：false 表示禁用第一次执行
// trailing: false 表示禁用停止触发的回调
function throttle(func, wait, options) {
  var previous = 0;
  var timeout = null;
  if (!options) options = {};

  //this : undefined
  var throttled = function () {
    // this : dom节点
    var now = +new Date();
    if (options.leading === false && !previous) {
      // 禁用第一次执行
      previous = now;
    }
    var remaining = wait - (now - previous);
    // console.info('previous:',previous,' =====>remaining:',remaining,' timeout:',timeout)
    // 如果没有剩余的时间了或者你改了系统时间
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, arguments);
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(() => {
        timeout = null;
        previous = options.leading === false ? 0 : +new Date();
        func.apply(this, arguments);
      }, remaining);
    }
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
    previous = 0;
  };

  return throttled;
}

window.addEventListener("load", function () {
  var count = 1;
  var container1 = document.getElementById("id11");
  var container2 = document.getElementById("id22");
  var container3 = document.getElementById("id33");
  var container4 = document.getElementById("id44");
  var container5 = document.getElementById("id55");

  function getUserAction() {
    // console.info(' getUserAction:',this,' arg:',arguments )
    this.innerHTML = count++;
  }

  container1 && (container1.onmousemove = getUserAction);

  //当鼠标移入的时候，事件立刻执行,每过 1s 会执行一次，如果在 4.2s 停止触发，以后不会再执行事件
  container2 && (container2.onmousemove = throttleA(getUserAction, 1000));

  //当鼠标移入的时候，事件不会立刻执行，晃了 3s 后终于执行了一次，此后每 3s 执行一次，当数字显示为 3 的时候，立刻移出鼠标，相当于大约 9.2s 的时候停止触发，
  //但是依然会在第 12s 的时候执行一次事件。
  container3 && (container3.onmousemove = throttleB(getUserAction, 3000));

  //鼠标移入，事件立刻执行，晃了 3s，事件再一次执行，当数字变成 3 的时候，也就是 6s 后，我们立刻移出鼠标，停止触发事件，9s 的时候，依然会再执行一次事件。
  container4 && (container4.onmousemove = throttleC(getUserAction, 3000));

  container5 && (container5.onmousemove = throttle(getUserAction, 3000, { leading: false }));
  // container5.onmousemove = throttle(getUserAction, 3000, { trailing: false });
});
