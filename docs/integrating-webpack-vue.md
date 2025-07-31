## webpack 接入说明
>通用架构参考[ qiankun 接入指南](https://qiankun.umijs.org/zh/guide/getting-started)
>vue参考[ vue2 项目接入](https://qiankun.umijs.org/zh/guide/tutorial#vue-%E5%BE%AE%E5%BA%94%E7%94%A8)

### vue 接入说明
#### 1. 微应用的入口文件更改
在 src 目录新增 public-path.js， 主要处理本地 dev 和生产环境的publicPath
```javascript
// /src/public-path.js
// REF: https://webpack.docschina.org/guides/public-path/
;(function () {
  if (window.__POWERED_BY_QIANKUN__) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line
      __webpack_public_path__ = `//localhost:${process.env.VUE_APP_PORT}${process.env.BASE_URL}`
      return
    }
    // eslint-disable-next-line
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
    // __webpack_public_path__ = `${process.env.BASE_URL}/`
  }
})()
```
添加.env配置，可优化拆分到 env.development 及 env.production
```
# 指定端口号
VUE_APP_PORT=5175
# 需替换 ${name} 为当前应用的名称, 该配置主要为了微应用在生产环境下添加父目录层级
BASE_URL=/microapps/${name}/ 
```

#### 2. 配置微应用打包方式和 publicPath
```javascript
// vue.config.js
const { name } = require('./package.json');

module.exports = {
  publicPath: process.env.BASE_URL,
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}`, // webpack 5 需要把 jsonpFunction 替换成 chunkLoadingGlobal
    },
  },
};
```

#### 2. 导出生命周期钩子
微应用需要在自己的入口 js (通常就是你配置的 webpack 的 entry js) 导出 bootstrap、mount、unmount 三个生命周期钩子，以供主应用在适当的时机调用。

```javascript
// 当前为默认的 main.js 入口文件
import './public-path.js';
...

let router = null;
let instance = null;
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log('[vue] vue app bootstraped');
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  console.log('[vue] props from main framework', props);
  render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  console.log('[vue] vue app unmounted');
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
  router = null;
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props) {
  console.log('update props', props);
}

function render(props = {}) {
  // 在微应用环境下 props 会提供挂载的 element container, 注册的应用名称
  const { container, name } = props;
  // 路由配置： 在微前端框架下，路由的base需要设置为 /{name}，也可以由主应用动态配置，目前按照该规则静态配置
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? `/${name}` : '/',
    mode: 'history',
    routes,
  });

  // 执行实际的 mount，将内容部分挂载
  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app');
}

/**
 * 独立运行时走默认逻辑
 */
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
```