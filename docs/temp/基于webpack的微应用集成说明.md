# webpack 接入说明
>
>通用架构参考[qiankun 接入指南](https://qiankun.umijs.org/zh/guide/getting-started)
>vue参考[vue2 项目接入](https://qiankun.umijs.org/zh/guide/tutorial#vue-%E5%BE%AE%E5%BA%94%E7%94%A8)

## 项目部署

采用集中部署模式，将构建后的微应用整包部署于microapps下。

```
├── container/                   # 项目容器
│   └── container/
└── microapps/                   # 项目微应用
    ├── app1/
    └── app2/
```

## 接入说明

### 1. 微应用的入口文件更改

在 src 目录新增 public-path.js， 主要处理本地 dev 和生产环境的publicPath

```javascript
// /src/public-path.js
// @sse https://webpack.docschina.org/guides/public-path/
;(function () {
  if (window.__POWERED_BY_QIANKUN__) {
    // eslint-disable-next-line
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
    // __webpack_public_path__ = `${process.env.BASE_URL}/`
  }
})()
```

### 2. 配置微应用打包方式和 publicPath

```javascript
// vue.config.js
const { name } = require('./package.json');

module.exports = {
  publicPath: `/microapps/${name}`,
  devServer: {
    // 因为qiankun内部请求都是fetch来请求资源，所以子应用必须允许跨域
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

### 3. 导出生命周期钩子

微应用需要在自己的入口 js (通常就是你配置的 webpack 的 entry js) 导出 bootstrap、mount、unmount 三个生命周期钩子，以供主应用在适当的时机调用。

同时需要处理 vue router 的 basepath 使得在微应用框架下可正常层级跳转

```javascript
// 当前为默认的 main.js 入口文件
import './public-path.js'; // 置于最顶部
// 其他 import...

// 微应用始终以项目名称为标识
const { name } = require('../package.json');
let router = null;
let instance = null;

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  // [vue] vue app bootstraped
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  // [vue] vue app unmounted
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update() {
  // update props
}

// 路由配置： 在微前端框架下，路由的base需要设置为 /{name}，也可以由主应用动态配置，目前按照该规则静态配置
router = new VueRouter({
  base: window.__POWERED_BY_QIANKUN__ ? `/${name}` : '/',
  mode: 'history',
  routes,
});

// qiankun 渲染函数
function qiankunRender(props = {}) {
  // 在微应用环境下 props 会提供挂载的 container 和 微应用名称等信息
  const { container } = props;
  // 执行实际的 mount
  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app');
}

// 独立运行时渲染函数
function render(){
  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount('#app');
}

window.__POWERED_BY_QIANKUN__ ? qiankunRender() : render();
```
