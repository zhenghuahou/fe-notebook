import * as React from "react";
import {
  Outlet,
  Link,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


import Basic, { routeConfig } from './pages/basic'
import ReactPractice, { routeConfig as ReactPracticeRouteConfig } from './pages/react'
import Performance, { routeConfig as PerformanceRouteConfig } from './pages/react'
import Engineering, { routeConfig as EngineeringRouteConfig } from './pages/engineering'
import Program, { routeConfig as ProgramRouteConfig } from './pages/program'
import Algorithm, { routeConfig as AlgorithmRouteConfig } from './pages/algorithm'
import Network, { routeConfig as NetworkRouteConfig } from './pages/network'
import A from './formilyDemo';



export const FormContext = React.createContext(null)
console.info(' FormContext:',FormContext,'typeof FormContext:',typeof FormContext);


const routerCfg = [
  {
    path: "basic",
    element: <Basic />,
    title: "js基础",
    children: routeConfig,
  },
  {
    path: "programming",
    element: <Program />,
    title: "编程案例",
    children: ProgramRouteConfig,
  },

  {
    path: "algorithm",
    element: <Algorithm />,
    title: "算法",
    children: AlgorithmRouteConfig,
  },
  {
    path: "network",
    element: <Network />,
    title: "网络相关",
    children: NetworkRouteConfig,
  },
  {
    path: "performance",
    element: <Performance />,
    title: "性能",
    children: PerformanceRouteConfig,
  },
  {
    path: "engineering",
    element: <Engineering />,
    title: "工程化",
    children: EngineeringRouteConfig,
  },
  {
    path: "reactPractice",
    element: <ReactPractice />,
    title: "react practice",
    children: ReactPracticeRouteConfig,
  },
];
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NoMatch />,
    children: routerCfg,
  },
]);

export default function App() {
  return (
    <div className="app-demo">
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

function Layout() {
  return (
    <>
      <p className="pd10 fz-12">
        <b>demo演示</b>
        <p className="less-test">less demo</p>
        <p className="calc-test">calc demo</p>
      </p>
      <nav className="nav">
        {routerCfg.map((r) => {
          const { path, title } = r;
          return (
            <li key={path}>
              <Link to={path}>{title}</Link>
            </li>
          );
        })}
      </nav>
      <section className="main">
        <Outlet />
      </section>
    </>
  );
}

function NoMatch() {
  return (
    <div className="nomatch">
      <h2>Nothing to see here!</h2>
      <div>
        <Link to="/">Go to the home page</Link>
      </div>
    </div>
  );
}
