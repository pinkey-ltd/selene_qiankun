import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'
import App from './App.vue'

import {
  renderWithQiankun,
  qiankunWindow,
  type QiankunProps
} from 'vite-plugin-qiankun/dist/helper'

const initQianKun = () => {
  renderWithQiankun({
    // bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap
    // 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等
    bootstrap() {
      console.log('bootstrap proj-server')
    },
    // 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法，也可以接受主应用传来的参数
    mount(_props: any) {
      _props.onGlobalStateChange((state: any) => {
        console.log(state)
        const { token } = state
        console.log(token)
        if (token) {
          localStorage.setItem('token', token)
        }
      })
      console.log('mount proj-server', _props)
      render(_props.container)
    },
    // 应用每次切出/卸载会调用的unmount方法，通常在这里我们会卸载微应用的应用实例
    unmount(_props: any) {
      console.log('unmount proj-server', _props)
    },
    update: function (_props: QiankunProps): void | Promise<void> {
      console.log('update', _props)
    }
  })
}

const render = (container: null) => {
  // 如果是在主应用的环境下就挂载主应用的节点，否则挂载到本地
  const appDom = container ? container : '#app'
  const app = createApp(App)
  app.use(createPinia())
  app.mount(appDom)
}

// 判断是否为乾坤环境，否则会报错iqiankun]: Target container with #subAppContainerVue3 not existed while subAppVue3 mounting!
qiankunWindow.__POWERED_BY_QIANKUN__ ? initQianKun() : render(null)
