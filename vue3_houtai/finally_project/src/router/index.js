/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-05 13:50:52
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-06-15 17:38:53
 * @FilePath: \vue3_houtai\finally_project\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import Admin from '@/layouts/admin.vue'

/**
 * @description: 路由组件
 * @date: 2023/06/05
 * @param {*}
 * @return {*}
 */
const routes = [
  {
    path: '/',
    name: 'Admin',
    component: Admin,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login.vue'),
    meta: {
      title: '登录后台',
    },
  },
  // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/404.vue'),
    meta: {
      title: '404',
    },
  },
]
/**
 * @description: 虚拟路由，匹配菜单动态添加路由
 * @return {*}
 */
const asyncRoutes = [
  {
    path: '/',
    name: '/',
    component: () => import('@/pages/index.vue'),
    meta: {
      title: '首页',
    },
  },
  {
    path: '/goods/list',
    name: '/goods/list',
    component: () => import('@/pages/goods/list.vue'),
    meta: {
      title: '商品管理',
    },
  },
  {
    path: '/category/list',
    name: '/category/list',
    component: () => import('@/pages/category/list.vue'),
    meta: {
      title: '分类管理',
    },
  },
  {
    path: '/user/list',
    name: '/user/list',
    component: () => import('@/pages/user/list.vue'),
    meta: {
      title: '用户管理',
    },
  },
  {
    path: '/order/list',
    name: '/order/list',
    component: () => import('@/pages/order/list.vue'),
    meta: {
      title: '订单管理',
    },
  },
  {
    path: '/comment/list',
    name: '/comment/list',
    component: () => import('@/pages/comment/list.vue'),
    meta: {
      title: '评价管理',
    },
  },
  {
    path: '/image/list',
    name: '/image/list',
    component: () => import('@/pages/image/list.vue'),
    meta: {
      title: '图库管理',
    },
  },
  {
    path: '/notice/list',
    name: '/notice/list',
    component: () => import('@/pages/notice/list.vue'),
    meta: {
      title: '公告管理',
    },
  },
  {
    path: '/setting/base',
    name: '/setting/base',
    component: () => import('@/pages/setting/base.vue'),
    meta: {
      title: '配置管理',
    },
  },
  {
    path: '/coupon/list',
    name: '/coupon/list',
    component: () => import('@/pages/coupon/list.vue'),
    meta: {
      title: '优惠券管理',
    },
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

/**
 * @description: 动态路由
 * 1. 发送ajax请求获取路由数据
 * 2. foreach遍历路由数组，对数据递归调用
 * 3. 获取路由和虚拟路由一致，并且本地路由不存在时。注册到本地路由
 * 4. 遍历的路由对象如果存在 child 使用遍历方法再次遍历
 *
 * @param {*} menus
 * @return {*}
 */
export function addRouter(menus) {
  // 是否有新路由
  let hasNewRoutes = false
  // 递归函数
  const findAndAddRoutesByMenus = (arr) => {
    arr.forEach((e) => {
      //获取后端传过来的菜单项的路径 e.frontpath
      //获取当前路由项:o表示 asyncRoutes 数组中的每一个路由项,检查当前元素 o 的 path 属性是否等于 e.frontPath 的值
      const item = asyncRoutes.find((r) => r.path == e.frontpath)
      // 获取路由和虚拟路由一致，并且本地路由不存在该路由时。注册到本地路由
      if (item && !router.hasRoute(item.path)) {
        // 添加路由
        router.addRoute('Admin', item)
        hasNewRoutes = true
      }
      // 子路由数组存在遍历它
      if (e.child && e.child.length > 0) {
        findAndAddRoutesByMenus(e.child)
      }
    })
  }
  findAndAddRoutesByMenus(menus)

  return hasNewRoutes
}
