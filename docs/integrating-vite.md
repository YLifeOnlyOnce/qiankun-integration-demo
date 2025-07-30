### vite 接入说明 [qiankun 官方未提供](https://qiankun.umijs.org/zh/guide)
qiankun 官方尚未提供 vite 的接入说明，直接使用通用的接入方式会有一系列问题，因此需要借助社区提供的插件 [vite-plugin-qiankun](https://github.com/tengmaoqing/vite-plugin-qiankun) 来实现。

#### 接入方式
1. 安装 vite-plugin-qiankun
```bash
# npm 安装
npm install vite-plugin-qiankun 
# yarn 安装
# yarn add vite-plugin-qiankun 
```
2. 在 vite-config.js 注册插件，同时设置生产环境部署的父级访问目录
```javascript
// vite.config.ts

import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'
import { defineConfig, loadEnv } from 'vite'

// 微应用名称以 package.json 中的 name 字段为准
import { name as appName } from './package.json';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    // 生产环境需要指定父级访问目录
    base: env.VITE_BASE_URL || '/',
    plugins: [
      vue(),
      qiankun(appName, {
        useDevMode: true
      })
    ],
    server: {
      host: 'localhost',
      port: env.VITE_APP_PORT
    },
  }
})

```

3. 环境变量设置 env.production
```
# 规定部署父目录为microapps 子应用部署目录为 /microapps/${appName} 
VITE_BASE_URL=/microapps/qiankun-vite-vue/
```
如需指定开发环境 dev port 可单独加 env.development，可忽略
```
# 指定本地运行端口
VITE_APP_PORT=5175
```

4. 在入口文件注册 qiankun 的生命周期函数配置
```javascript
import { createApp } from "vue";
import { routes } from "./router/index.js";
import { createWebHistory, createRouter } from 'vue-router'
import App from "./App.vue";

import { renderWithQiankun, qiankunWindow } from "vite-plugin-qiankun/dist/helper";

// 生命周期注册
const initQianKun = () => {
  renderWithQiankun({
    // 当前应用在主应用中的生命周期
    // 文档 https://qiankun.umijs.org/zh/guide/getting-started#
    mount(props) {
      // 可以通过props读取主应用的参数
      console.log("mount", props);
      render(props.container, props.name);
    },
    bootstrap() {
      console.log("🚀 ~ bootstrap ~ bootstrap:");
    },
    unmount() {
      console.log("unmount");
    },
  });
};

/**
 * 渲染函数, 区分微前端和独立应用
 * @param {HTMLElement} container 容器
 * @param {string} name 应用名称
 */
const render = (container, name) => {
  // 路由配置： 在微前端框架下，路由的base需要设置为 /{name}，也可以由主应用动态配置，目前按照该规则静态配置
  const base = qiankunWindow.__POWERED_BY_QIANKUN__ ? `/${name}` : '/';
  const router = createRouter({
    history: createWebHistory(base), // 由于qiankun基于路由，不能使用 createMemoryHistory();
    routes,
  })

  // 如果是在主应用的环境下就挂载主应用的节点，否则挂载到本地
  const appDom = container ? container.querySelector("#app") : "#app";
  createApp(App).use(router).mount(appDom);
};

// 判断当前应用是否在微应用架构中
qiankunWindow.__POWERED_BY_QIANKUN__ ? initQianKun() : render();

```

### 部分问题解析

 `在开发环境下，会存在无法加载微应用资源的问题，html文件正常加载，但在处理html中引入的js模块文件时报错`

> 原因分析：

>vite 开发模式特性：
vite 不会像 webpack 从入口文件将整个项目打包为一个或多个bundle文件，这个bundle 文件已经处理了模块间依赖问题。而 vite 直接提供基于现代浏览器支持的ESM的模块文件，输出的 JS 代码是原生 ESModule，充满了未被处理的 import export，在现代浏览器中可以直接运行访问。

> qiankun 父应用加载子应用是使用 `import-html-entry` 库来处理这个流程，具体如下：
>1. 获取html：请求并获取html入口文件；
>2. 解析资源：解析html文件，找出所有需要加载的 javascript 和 css 资源路径;
>3. 通过fetch的方式加载 js 和 css 文件内容;
>4. 执行J：对于 javascript 文件，并不是让浏览器直接通过标签加载执行，而是会拿到内部的内容，通过 eval 或类似的动态执行机制，在父应用的上下文中执行。通过这种方式达到了 JS 沙箱隔离。

问题：ESModule VS eval 冲突
qiankun 使用 eval 的方式来执行 js 代码，Vite 开发模式生成的 JS 代码保留了原生的 ES 模块语法 (import/export)，这些语法在非模块环境下执行是无效且会导致语法错误的。因此，直接将 Vite 开发模式的子应用接入 Q/qiankun 父应用会失败。

