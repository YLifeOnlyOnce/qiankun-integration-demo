## 基于 qiankun 的 “组装式微应用” 方案验证

> <b>官方文档</b>：[qiankun](https://qiankun.umijs.org/zh/guide) 官方文档中的推荐文档是精品
> 
> qiankun 运行原理： `juejin` [万字长文-落地微前端 qiankun 理论与实践指北](https://juejin.cn/post/7069566144750813197#heading-9)
> 
> single-spa 类似原理实现： `youtube` [Build a Single Page Application with JavaScript (No Frameworks)](https://youtu.be/6BozpmSjk-Y?si=QYOrMWjtjAqyVTD8)

### container 基座

- 提供认证、权限、事件、全局异常捕获、路由导航、APP structure、公共页面、公共服务

### microapps 微应用目录

- microapp1 微应用x 提供接入函数，根据环境变量确定单独运行/作为微应用运行，由容器提供公共服务及权限校验能力

### 集成方案

#### vite vue 

- 集成方案：/docs/integrating-vite.md
- 集成示例代码：/microapps/qiankun-vite-vue

#### webpack vue 

- 集成方案见：/docs/integrating-webpack-vue.md
- 集成示例代码：/microapps/qiankun-webpack-vue

### 部署方案

见 /config/nginx-config.md
