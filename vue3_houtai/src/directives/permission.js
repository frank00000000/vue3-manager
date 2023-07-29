/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-17 07:52:46
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-02 22:51:22
 * @FilePath: \manager_vue\vue3_houtai\src\directives\permission.js
 * @Description: 权限指令
 */

import store from '@/store'

/**
 * @description: 判断自定义指令传入的是否为数组
 * @param {*} value
 * @param {*} el
 * @return {*}
 */
function hsaPermission(value, el = false) {
  if (!Array.isArray(value)) {
    throw new Error(`需要配置权限，例如v-permission="['admin','editor']"`)
  }
  // 判断权限数组中是否包含自定义指令中的数据
  const hasAuth =
    value.findIndex((v) => store.state.ruleNames.includes(v)) != -1
  // 如果节点存在，而且没有对应的权限，移除该节点
  if (el && !hasAuth) {
    el.parentNode && el.parentNode.removeChild(el)
  }

  return hasAuth
}

export default {
  install(app) {
    // 自定义权限指令
    app.directive('permission', {
      // 指令的定位
      mounted(el, binding) {
        // 获取自定义指令传入的值
        let { value } = binding

        hsaPermission(value, el)

        if (value == 'getStatistics3,GET') {
          el.addEventListener('click', () => {
            console.log('jack')
          })
        }
        hsaPermission(value, el)
      },
    })
  },
}
