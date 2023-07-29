/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-16 20:03:33
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-25 17:22:09
 * @FilePath: \vue3_houtai\src\api\category.js
 * @Description:
 */
import axios from '@/axios.js'

export function getCategoryList() {
  return axios.get('/admin/category')
}

// 增加商品分类
export function createCategory(data) {
  return axios.post(`/admin/category`, data)
}
// 修改商品分类
export function updateCategory(id, data) {
  return axios.post(`/admin/category/${id}`, data)
}
//删除商品分类
export function deleteCategory(id) {
  return axios.post(`/admin/category/${id}/delete`)
}

//修改商品分类状态
export function updateCategoryStatus(id, status) {
  return axios.post(`/admin/category/${id}/update_status`, {
    status,
  })
}

//分类关联产品列表
export function getCategoryGoods(category_id) {
  return axios.get(`/admin/app_category_item/list?category_id=${category_id}`)
}
//删除关联产品
export function deleteCategoryGoods(id) {
  return axios.post(`/admin/app_category_item/${id}/delete`)
}

// 关联产品
export function connectCategoryGoods(data) {
  return axios.post(`/admin/app_category_item`,data)
}
