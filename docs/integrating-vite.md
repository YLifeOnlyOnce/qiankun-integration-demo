### vite 接入说明 [qiankun 官方未提供](https://qiankun.umijs.org/zh/guide)
qiankun 官方尚未提供 vite 的接入说明，直接使用通用的接入方式会有一系列问题，因此需要借助社区提供的插件 [vite-plugin-qiankun](https://github.com/tengmaoqing/vite-plugin-qiankun) 来实现。

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
qiankun 使用 eval 的方式来执行 js 代码，Vite 开发模式生成的 JS 代码保留了原生的 ES 模块语法 (import/export)，这些语法在非模块环境下执行是无效且会导致语法错误的。因此，直接将 Vite 开发模式的子应用接入 Qiankun 父应用会失败。

