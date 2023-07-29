/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-29 01:36:41
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-29 23:52:23
 * @FilePath: \vue3_houtai\src\api\distribution.js
 * @Description: 分销接口
 */
import axios from '@/axios'
import queryParams from '@/utils/queryParams.js'
// 分销数据统计
export function getAgentStatisticsList() {
  return axios.get('/admin/agent/statistics')
}

// 分销推广员列表
export function getAgentList(page, query = {}) {
  let src = queryParams(query)
  return axios.get(`/admin/agent/${page}${src}`)
}

// 推广订单列表
export function getAgentOrderList(page, query = {}) {
  let src = queryParams(query)
  return axios.get(`/admin/user_bill/${page}${src}`)
}

// 获取分销配置
export function getConfig() {
  return axios.post(`/admin/distribution_setting/get`)
}

// 修改分销配置
export function setConfig(data) {
  return axios.post(`/admin/distribution_setting/set`, data)
}
