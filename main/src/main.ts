import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { registerMicroApps, start, initGlobalState, type MicroAppStateActions } from 'qiankun'
import 'bulma/css/bulma.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const state = {
  token: localStorage.getItem('token')
}
const actions: MicroAppStateActions = initGlobalState(state)

const apps: any[] = [
  {
    name: 'gserver', // 应用的名字
    entry: 'http://localhost:9001/', // 默认加载这个html，解析里面的js动态的执行（子应用必须支持跨域，内部使用的是 fetch）
    container: '#container', // 要渲染到的节点id，对应上一步中src/App.vue中的渲染节点
    activeRule: '/server/3dtile'
  },
  {
    name: 'media',
    entry: 'http://localhost:9002/',
    container: '#container',
    activeRule: '/tools/media'
  },
  {
    name: 'proj',
    entry: 'http://localhost:9003/',
    container: '#container',
    activeRule: '/server/proj'
  },
  {
    name: 'flow',
    entry: 'http://localhost:9004/',
    container: '#container',
    activeRule: '/server/flow'
  }
]
registerMicroApps(apps) // 注册应用
start({
  prefetch: 'all', // 预加载
  sandbox: {
    //experimentalStyleIsolation: true, //   开启沙箱模式,实验性方案
  }
}) // 开启应用

// 传递全局变量
actions.setGlobalState(state)

app.use(createPinia())
app.use(router)

app.mount('#app')
