/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-25 21:26:25
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-26 13:10:04
 * @FilePath: \vue3_houtai\src\api\user.js
 * @Description:
 */
import axios from '@/axios'
import queryParams from '@/utils/queryParams'

// 用户列表
export function getUserList(
  page,
  query = {
    limit: 8,
    keyword: '',
    user_level_id: null,
  }
) {
  let url = queryParams(query)

  return axios.get(`/admin/user/${page}${url}`)
}

// 添加用户
export function createUser(data) {
  return axios.post(`/admin/user`, data)
}
// 更新用户
export function updateUser(id, data) {
  return axios.post(`/admin/user/${id}`, data)
}
// 删除用户
export function deleteUser(id) {
  return axios.post(`/admin/user/${id}/delete`)
}

//修改用户状态
export function updateUserStatus(id, status) {
  return axios.post(`/admin/user/${id}/update_status`, {
    status,
  })
}
