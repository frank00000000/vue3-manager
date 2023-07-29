/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-05 17:15:18
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-25 20:17:23
 * @FilePath: \vue3_houtai\src\api\level.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from '@/axios'
// 会员列表
export function getLevelList(page) {
  return axios.get(`/admin/user_level/${page}`)
}

// 添加会员
export function createLevel(data) {
  return axios.post(`/admin/user_level`, data)
}
// 更新会员
export function updateLevel(id, data) {
  return axios.post(`/admin/user_level/${id}`, data)
}
// 删除会员
export function deleteLevel(id) {
  return axios.post(`/admin/user_level/${id}/delete`)
}

//修改会员等级状态
export function updateLevelStatus(id, status) {
  return axios.post(`/admin/user_level/${id}/update_status`, {
    status,
  })
}
