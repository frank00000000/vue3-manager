/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-14 20:45:59
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-28 15:43:11
 * @FilePath: \vue3_houtai\src\api\order.js
 * @Description:
 */

import axios from '@/axios'
import queryParams from '@/utils/queryParams.js'
/**
 * @description: 获取订单列表
 * @return {*}
 */
export function getOrderList(page, query = {}) {
  const url = queryParams(query)
  return axios.get(`/admin/order/${page}${url}`)
}

// 批量删除订单
export function deleteOrder(ids) {
  return axios.post(`/admin/order/delete_all`, {
    ids,
  })
}

// 导出订单
export function exportOrder(query = {}) {
  let url = queryParams(query)
  return axios.post(
    `/admin/order/excelexport${url}`,
    {},
    {
      responseType: 'blob',
    }
  )
}

// 查看订单物流信息
export function getShipInfo(id) {
  return axios.get(`/admin/order/${id}/get_ship_info`)
}

// 拒绝or同意退款
export function refuseOrAgreeOrder(id, data) {
  return axios.post(`/admin/order/${id}/handle_refund`, data)
}
