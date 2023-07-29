/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-05 17:15:18
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-08 15:40:33
 * @FilePath: \vue3_houtai\src\api\skus.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from '@/axios'
// 角色列表
export function getSkusList(page) {
  return axios.get(`/admin/skus/${page}`)
}

// 添加角色
export function createSkus(data) {
  return axios.post(`/admin/skus`, data)
}
// 更新角色
export function updateSkus(id, data) {
  return axios.post(`/admin/skus/${id}`, data)
}
// 删除角色
export function deleteSkus(ids) {
  ids = Array.isArray(ids) ? ids : [ids]
  return axios.post(`/admin/skus/delete_all`, { ids })
}

// 修改菜单权限状态
export function updateSkusStatus(id, status) {
  return axios.post(`/admin/skus/${id}/update_status`, {
    status,
  })
}

// 配置角色权限
export function setSkusRules(id, rule_ids) {
  return axios.post(`/admin/skus/set_rules`, { id, rule_ids })
}

