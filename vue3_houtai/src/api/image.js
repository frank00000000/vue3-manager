/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-24 21:05:21
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-06-26 18:15:51
 * @FilePath: \manager_vue\vue3_houtai\src\api\image.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from '@/axios'

// 获取图片列表
export function getImageList(id, page = 1, limit) {
  return axios.get(`/admin/image_class/${id}/image/${page}`, {
    params: {
      limit,
    },
  })
}
// 修改图片名称
export function setImageName(id, name) {
  return axios.post(`/admin/image/${id}`, { name })
}
// 删除图片
export function deleteImage(ids) {
  return axios.post(`/admin/image/delete_all`, { ids })
}

// 图片上传
export function uploadImage(image_class_id, img) {
  return axios.post(`/admin/image/upload`, { image_class_id, img })
}

export const uploadImageAction = '/api/admin/image/upload'
