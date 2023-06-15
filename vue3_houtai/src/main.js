/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-05 13:05:59
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-06-15 17:28:19
 * @FilePath: \vue3_houtai\finally_project\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import 'virtual:windi.css'
import { router } from './router'
import store from '@/store'
import './utils/permission'
import 'nprogress/nprogress.css'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus)
app.use(router)
app.use(store)
app.mount('#app')
