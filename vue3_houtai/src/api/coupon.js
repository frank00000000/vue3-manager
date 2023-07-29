/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-09 13:24:24
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-09 13:52:37
 * @FilePath: \vue3_houtai\src\api\coupon.js
 * @Description:
 */
import axios from '@/axios'
// 优惠券列表
export function getCouponList(page) {
  return axios.get(`/admin/coupon/${page}`)
}

// 添加优惠券
export function createCoupon(data) {
  return axios.post(`/admin/coupon`, data)
}
// 修改优惠券
export function updateCoupon(id, data) {
  return axios.post(`/admin/coupon/${id}`, data)
}
// 删除优惠券
export function deleteCoupon(id) {
  return axios.post(`/admin/coupon/${id}/delete`)
}
// 删除优惠券
export function updateCouponStatus(id) {
  return axios.post(`/admin/coupon/${id}/update_status`, { status:0 })
}
