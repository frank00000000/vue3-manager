/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-25 21:26:25
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-26 19:42:01
 * @FilePath: \vue3_houtai\src\api\goods_comment.js
 * @Description:
 */
import axios from '@/axios'
import queryParams from '@/utils/queryParams'

// 用户列表
export function getGoodsCommentsList(
  page,
  query = {
    title: '',
  }
) {
  let url = queryParams(query)
  return axios.get(`/admin/goods_comment/${page}${url}`)
}

//修改商品评价状态
export function updateGoodsCommentsStatus(id, status) {
  return axios.post(`/admin/goods_comment/${id}/update_status`, {
    status,
  })
}

//回复商品评价
export function reviewGoodsComment(id, data) {
  return axios.post(`/admin/goods_comment/review/${id}`,{
    data
  })
}
