/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-05 17:15:18
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-07 19:56:26
 * @FilePath: \vue3_houtai\src\api\role.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from '@/axios'
// 角色列表
export function getRoleList(page) {
  return axios.get(`/admin/role/${page}`)
}

// 添加角色
export function createRole(data) {
  return axios.post(`/admin/role`, data)
}
// 更新角色
export function updateRole(id, data) {
  return axios.post(`/admin/role/${id}`, data)
}
// 删除角色
export function deleteRole(id) {
  return axios.post(`/admin/role/${id}/delete`)
}

// 修改菜单权限状态
export function updateRoleStatus(id, status) {
  return axios.post(`/admin/rule/${id}/update_status`, {
    status,
  })
}

// 配置校色权限
export function setRoleRules(id, rule_ids) {
  return axios.post(`/admin/role/set_rules`, { id, rule_ids })
}
