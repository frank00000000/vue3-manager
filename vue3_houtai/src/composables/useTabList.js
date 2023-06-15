/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-13 15:46:55
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-06-13 18:56:18
 * @FilePath: \vue3_houtai\finally_project\src\composables\useTabList.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { ref, reactive } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'
import { router } from '@/router/index.js'

export function useTabList() {
  const cookie = useCookies()
  const route = useRoute()
  // 选中的标签
  const activeTab = ref(route.path)

  /**
   * @description: tag 标签列表
   * @return {*}
   */
  const tabList = ref([
    {
      title: '后台首页',
      path: '/',
    },
    {
      title: '商城管理',
      path: '/goods/list',
    },
  ])

  // 路由跳转时执行
  onBeforeRouteUpdate((to, form) => {
    activeTab.value = to.path
    addTab({
      title: to.meta.title,
      path: to.path,
    })
  })

  /**
   * @description: 添加标签导航
   * @return {*}
   */
  function addTab(tab) {
    let isTab = tabList.value.findIndex((t) => t.path == tab.path)
    if (isTab == -1) {
      tabList.value.push(tab)
      cookie.set('tabList', tabList.value)
    }
  }

  /**
   * @description: 标签导航的点击事件
   * @param {*} tabName
   * @return {*}
   */
  function changeTab(tabName) {
    router.push(tabName)
  }

  /**
   * @description: 初始化标签导航栏
   * @return {*}
   */
  function initTabList() {
    const tabs = cookie.get('tabList')
    if (tabs) {
      tabList.value = tabs
    }
  }

  initTabList()

  /**
   * @description: 点击关闭导航
   * @param {*} targetName
   * @return {*}
   */
  const removeTab = (targetName) => {
    let active = activeTab.value
    // 点进去的导航相同,需要切换active的显示
    if (active == targetName) {
      // 遍历tablist
      tabList.value.forEach((current, index) => {
        if (current.path == targetName) {
          // 获取 active 的索引
          const nextTab = tabList.value[index + 1] || tabList.value[index - 1]
          if (nextTab) {
            activeTab.value = nextTab.path
          }
        }
      })
    }

    // 删除导航
    tabList.value = tabList.value.filter((item) => {
      return item.path != targetName
    })
    // 重新添加 cookie
    cookie.set('tabList', tabList.value)
  }

  const handleClose = (cb) => {
    if (cb == 'clearOther') {
      // 过滤首页和当前激活
      tabList.value = tabList.value.filter((item) => {
        return item.path == '/' || item.path == activeTab.value
      })
      cookie.set('tabList', tabList.value)
    } else if (cb == 'clearAll') {
      // 切换回首页
      activeTab.value = '/'

      const tab = tabList.value.filter((item) => {
        return item.path == '/'
      })
      tabList.value = tab
      cookie.set('tabList', tabList.value)
    }
  }

  return {
    activeTab,
    tabList,
    changeTab,
    removeTab,
    handleClose,
  }
}
