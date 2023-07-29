/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-14 20:45:59
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-24 20:44:10
 * @FilePath: \vue3_houtai\src\api\goods.js
 * @Description:
 */

import axios from '@/axios'
import queryParams from '@/utils/queryParams.js'
/**
 * @description: 获取商品列表
 * @return {*}
 */
export function getGoodsList(page, query = {}) {
  const url = queryParams(query)
  return axios.get(`/admin/goods/${page}${url}`)
}

// 批量上架/下架商品
export function updateGoodsStatus(ids, status) {
  return axios.post(`/admin/goods/changestatus`, {
    ids,
    status,
  })
}

// 添加商品
export function createGoods(data) {
  return axios.post(`/admin/goods`, data)
}

// 修改商品
export function updateGoods(id, data) {
  return axios.post(`/admin/goods/${id}`, data)
}
// 删除商品
export function deleteGoods(ids) {
  return axios.post(`/admin/goods/delete_all`, {
    ids,
  })
}

// 彻底删除商品
export function destroyGoods(ids) {
  return axios.post(`/admin/goods/destroy`, {
    ids,
  })
}

// 批量恢复回收站商品
export function restoreGoods(ids) {
  return axios.post(`/admin/goods/restore`, {
    ids,
  })
}

// 查看商品资料
export function readGoods(id) {
  return axios.get(`/admin/goods/read/${id}`)
}

// 设置good轮播图
export function setGoodsBanner(id, data) {
  return axios.post(`/admin/goods/banners/${id}`, data)
}

// 更换商品的sku规格
export function updateGoodsSkus(id, data) {
  return axios.post(`/admin/goods/updateskus/${id}`, data)
}

// 添加商品规格选项
export function createGoodsSkusCard(data) {
  return axios.post(`/admin/goods_skus_card`, data)
}

// 修改商品规格选项
export function updateGoodsSkusCard(id, data) {
  return axios.post(`/admin/goods_skus_card/${id}`, data)
}

// 删除商品规格选项
export function deleteGoodsSkusCard(id) {
  return axios.post(`/admin/goods_skus_card/${id}/delete`)
}

//排序商品规格选项
export function sortGoodsSkusCard(data) {
  return axios.post(`/admin/goods_skus_card/sort`, data)
}

//添加商品规格选项的值
export function createGoodsSkusCardValue(data) {
  return axios.post(`/admin/goods_skus_card_value`, data)
}

//修改商品规格选项的值
export function updateGoodsSkusCardValue(id, data) {
  return axios.post(`/admin/goods_skus_card_value/${id}`, data)
}

//删除商品规格选项的值
export function deleteGoodsSkusCardValue(id) {
  return axios.post(`/admin/goods_skus_card_value/${id}/delete`)
}

//选择设置商品规格选项和值
export function chooseAndSetGoodsSkusCard(id, data) {
  return axios.post(`/admin/goods_skus_card/${id}/set`, data)
}
