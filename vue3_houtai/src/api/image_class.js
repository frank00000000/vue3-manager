/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-19 21:37:36
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-06-23 22:12:44
 * @FilePath: \manager_vue\vue3_houtai\src\api\image_class.js
 * @Description: 分页器设置
 */
import axios from '@/axios'

export function getImageClassList(page = 1, limit = 10) {
  return axios.get(`/admin/image_class/${page}`, {
    params: {
      limit,
    },
  })
}

export function createImageClass(data) {
  return axios.post(`/admin/image_class`, data)
}
export function updateImageClass(id, data) {
  return axios.post(`/admin/image_class/${id}`, data)
}
export function deleteImageClass(id) {
  return axios.delete(`/admin/image_class/${id}/delete`)
}


