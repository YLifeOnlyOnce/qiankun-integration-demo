### 基于 qiankun 的 “组装式微应用” 方案验证

#### container 基座
- 提供认证、权限、事件、全局异常捕获、路由导航、APP structure、公共页面、公共服务

#### microapps 微应用目录
- microapp1 微应用1 提供接入函数，根据环境变量确定单独运行/作为微应用运行，由容器提供公共服务及权限校验能力

#### 集成方案
##### vite vue 
- 集成方案：/docs/integrating-vite.md
- 集成示例代码：/microapps/vite-vue-with-qp

##### webpack vue 
- 集成方案见：/docs/integrating-webpack-vue.md
- 集成示例代码：/microapps/webpack-vue-with-qp

#### 部署方案
见 /config/nginx-config.md
