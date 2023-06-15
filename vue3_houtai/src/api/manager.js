import axios from '@/axios'

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
