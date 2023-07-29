/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-05 16:50:32
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-06-29 14:22:07
 * @FilePath: \manager_vue\vue3_houtai\src\api\manager.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from '@/axios'
import queryParams from '@/utils/queryParams'
/**
 * @description: 登录
 * @params { param }
 * @return {*} Promise
 */
export function login(param) {
  return axios.post('/admin/login', { ...param })
}

/**
 * @description: 请求用户信息
 * @return {Promise} Promise
 */
export function getInfo() {
  return axios.post('/admin/getinfo')
}

/**
 * @description:退出登录
 * @return {Promise} Promise
 */
export function logOut() {
  return axios.post('/admin/logout')
}

/**
 * @description:修改密码
 * @param {data} data
 * @return {Promise} Promise
 */
export function updatePassword(data) {
  return axios.post('/admin/updatepassword', data)
}

/**
 * @description: 获取管理员列表
 * @return {*}
 */
export function getManagerList(
  page,
  query = {
    limit: 10,
    keyword: 'ceshi',
  }
) {
  const url = queryParams(query)

  return axios.get(`/admin/manager/${page}${url}`)
}

// 修改管理员状态  0禁用 1启用
export function updateManagerStatus(id, status) {
  return axios.post(`/admin/manager/${id}/update_status`, { status })
}

// 添加管理员
export function createManager(data) {
  return axios.post(`/admin/manager`, data)
}

// 修改管理员
export function updateManager(id, data) {
  return axios.post(`/admin/manager/${id}`, data)
}
// 删除管理员
export function deleteManager(id) {
  return axios.post(`/admin/manager/${id}/delete`)
}
