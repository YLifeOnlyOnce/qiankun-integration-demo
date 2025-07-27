import { registerMicroApps, start } from "qiankun";

registerMicroApps(
  [
    {
      name: 'vite-vue-with-qp',
      entry: 'http://localhost:5174/',
      container: '#micro-container', // 微应用挂载的节点
      activeRule: '/vite-vue-with-qp',
      props:{
        msg: 'container inject'
      }
    },
    {
      name: 'webpack-vue-with-qp',
      // entry : http://xxxx/microapp/name  -> nginx proxy -> 微服务独立部署并启动的地址 http://localhost:5175/
      entry: 'http://localhost:5175/',
      container: '#micro-container', // 微应用挂载的节点
      activeRule: '/webpack-vue-with-qp',
      props:{
        msg: 'container inject'
      }
    }
  ]
)

start();