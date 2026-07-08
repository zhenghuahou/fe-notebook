/*
 * @Author: zhenghuahou 2430370966@qq.com
 * @Date: 2023-03-16 10:43:34
 * @LastEditors: zhenghuahou 2430370966@qq.com
 * @LastEditTime: 2023-05-14 16:00:58
 * @FilePath: /fe-notebook/src/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.less';
import './demo.less';
import App from './App';
import reportWebVitals from './reportWebVitals';

import  './pages/crypto/gm-crypto-demo.js'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
