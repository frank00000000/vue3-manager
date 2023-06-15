/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-05 23:41:58
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-06-14 22:05:43
 * @FilePath: \vue3_houtai\finally_project\src\utils\permission.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @Author xiaohang.Lu
 * @Date 2023-06-05 11:42:44
 * */
import { router, addRouter } from '@/router'
import { getToken } from './token'
import { toast, showLoading, closeLoading } from '@/utils/message'
import store from '@/store'

let hasGetInfo = false
/**
 * @description: 全局前置路由守卫
 * @return {*}
 */
router.beforeEach(async (to, from, next) => {
  showLoading()
  const token = getToken()
  //   没有登录强制跳转登录
  if (!token && to.path != '/login') {
    toast('请先登录', 'warning')
    return next({ path: '/login' })
  }
  // 防止重复登录
  if (token && to.path == '/login') {
    return next({ path: from.path ? from.path : '/' })
  }

  //判断是否为新路由
  let hasNewRoutes = false
  // 如果用户登录，自动获取用户信息，存储到vuex
  if (token && !hasGetInfo) {
    hasGetInfo = true
    // 获取用户信息
    let { menus } = await store.dispatch('getinfo')
    // 动态添加路由，并且判断是否为新路由
    hasNewRoutes = addRouter(menus)
  }

  // 设置页面标题
  let title = (to.meta.title ? to.meta.title : '') + '陆小杭-后台管理系统'
  document.title = title

  // 跳转到指定路由
  hasNewRoutes ? next(to.fullPath) : next()
})

router.afterEach((to, from) => {
  closeLoading()
})
