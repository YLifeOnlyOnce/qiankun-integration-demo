import { registerMicroApps, start } from "qiankun";

registerMicroApps(
  [
    {
      name: 'qiankun-vite-vue',
      entry: 'http://localhost:5174/microapps/qiankun-vite-vue',
      container: '#micro-container', // 微应用挂载的节点
      activeRule: '/qiankun-vite-vue',
      props:{
        msg: 'container inject'
      }
    },
    {
      name: 'qiankun-webpack-vue',
      // entry : http://xxxx/microapp/name  -> nginx proxy -> 微服务独立部署并启动的地址 http://localhost:5175/
      entry: 'http://localhost:5175/microapps/qiankun-webpack-vue',
      container: '#micro-container', // 微应用挂载的节点
      activeRule: '/qiankun-webpack-vue',
      props:{
        msg: 'container inject'
      }
    }
  ]
)

start();