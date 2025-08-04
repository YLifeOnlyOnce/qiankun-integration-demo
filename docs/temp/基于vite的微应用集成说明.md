# vite 接入说明 [qiankun 官方未提供](https://qiankun.umijs.org/zh/guide)

qiankun 官方尚未提供 vite 的接入说明，直接使用通用的接入方式会有一系列问题，因此需要借助社区提供的插件 [vite-plugin-qiankun](https://github.com/tengmaoqing/vite-plugin-qiankun) 来实现。

## 项目部署

采用集中部署模式，将构建后的微应用整包部署于microapps下。

```json
├── container/                 
│   └── container/
└── microapps/                 
    ├── app1/
    └── app2/
```

## 接入方式

### 1. 安装 vite-plugin-qiankun

```bash
# npm 安装
npm install vite-plugin-qiankun 
# yarn 安装
# yarn add vite-plugin-qiankun 
```

### 2. 在 vite-config.js 注册插件，同时设置生产环境部署的父级访问目录

```javascript
// vite.config.ts

import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'
import { defineConfig, loadEnv } from 'vite'

// 微应用名称以 package.json 中的 name 字段为准
import { name as appName } from './package.json';

export default defineConfig(({ mode }) => {
  return {
    // 需指定父级访问目录
    base: `/microapps/${appName}`

    plugins: [
      vue(),
      qiankun(appName, {
        useDevMode: true
      })
    ],
  }
})

```

### 3. 在入口文件注册 qiankun 的生命周期函数配置，设置路由的 basepath 保证微应用架构下页面跳转层级正确

```javascript
import { createApp } from "vue";
import { createWebHistory, createRouter } from 'vue-router'
import { renderWithQiankun, qiankunWindow } from "vite-plugin-qiankun/dist/helper";
import { routes } from "./router/index.js";
import App from "./App.vue";


// 生命周期注册
// @see https://qiankun.umijs.org/zh/guide/getting-started
const initQianKun = () => {
  renderWithQiankun({

    /**
     * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
     * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
     */
    bootstrap() {
      // 初始化后自定义操作
    },

    /**
     * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
     */
    mount(props) {
      // 可以通过props读取主应用的参数
      render(props.container);
    },

    /**
     * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
     */
    unmount() {
      // 卸载后自定义操作
    },
  });
};

const { name } = require('./package.json');

// 路由配置： 在微前端框架下，路由的base需要设置为 /{name}，也可以由主应用动态配置，目前按照该规则静态配置
const base = qiankunWindow.__POWERED_BY_QIANKUN__ ? `/${name}` : '/';
const router = createRouter({
  history: createWebHistory(base), // 由于qiankun基于路由，不能使用 createMemoryHistory();
  routes,
})

/**
 * 渲染函数, 区分微前端和独立应用
 */
const render = (container) => {
  // 如果是在主应用的环境下就挂载主应用的节点，否则挂载到本地
  const appDom = container ? container.querySelector("#app") : "#app";
  createApp(App).use(router).mount(appDom);
};

// 判断当前应用是否在微应用架构中
qiankunWindow.__POWERED_BY_QIANKUN__ ? initQianKun() : render();

```
