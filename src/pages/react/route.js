/*
 * @Author: zhenghuahou 2430370966@qq.com
 * @Date: 2023-05-05 15:25:17
 * @LastEditors: zhenghuahou 2430370966@qq.com
 * @LastEditTime: 2023-05-14 15:29:54
 * @FilePath: /fe-notebook/src/pages/react/route.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import SetState18 from "./setState-18";
import UseLayoutEffect from "./useLayoutEffect";
import SetState from "./setState";
import BeforeYouMemo from "./beforeYouMemo";
import Memo from "./memo";
import Demanhook from "./demanhook";
import Event from "./event";
// import BatchUpdateWithReact18 from './batchUpdateWithReact18'
// import useRefUseCallback from './useRef&useCallback'

const genConfig = function () {
  const config = [
    {
      path: "useLayoutEffect",
      title: "useLayoutEffect",
      element: <UseLayoutEffect />,
    },
    {
      path: "setState-18",
      title: "setState with react v18",
      element: <SetState18 />,
    },
    {
      path: "setState",
      title: "setState是同步还是异步",
      element: <SetState />,
    },
    {
      path: "beforeyoumemo",
      title: "状态下放，缩小状态影响范围状态下放",
      element: <BeforeYouMemo />,
    },
    {
      path: "memo",
      title: "memo+useCallback",
      element: <Memo />,
    },
    {
      path: "demanhook",
      title: "按需加载hook",
      element: <Demanhook />,
    },
    {
      path: "event",
      title: "React合成事件",
      element: <Event />,
    },
    // {
    //   path: "batchUpdateWithReact18",
    //   title: "batchUpdateWithReact18",
    //   element: <BatchUpdateWithReact18 />,
    // },
  ];

  config.map((item) => {
    item.path = item.path.toLowerCase();
    return item;
  });
  return config;
};

export default genConfig();
